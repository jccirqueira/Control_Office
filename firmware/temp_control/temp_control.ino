#include <ArduinoJson.h>
#include <DallasTemperature.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <OneWire.h>
#include <WiFiClientSecure.h>


// --- CONFIGURAÇÕES DE REDE ---
const char *ssid = "SALA_TV";
const char *password = "72262728";

// --- CONFIGURAÇÕES DO SUPABASE ---
// Insira APENAS o domínio (ex: xxxxx.supabase.co)
const char *supabase_url = "tnoqfkqbyqnhmgedlvrn.supabase.co";
const char *supabase_key =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
    "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRub3Fma3FieXFuaG1nZWRsdnJuIiwicm9sZSI6Im"
    "Fub24iLCJpYXQiOjE3NzEwMDM3NjgsImV4cCI6MjA4NjU3OTc2OH0."
    "bE58HkCugT9vMCuGWv7RwwhWMuxsfGtKyFpQIUYXYDo";

// --- PINOS DE HARDWARE (NodeMCU ESP8266) ---
const int PIN_RELAY = D1;   // GPIO 5
const int PIN_DS18B20 = D2; // GPIO 4

// --- OBJETOS GLOBAIS ---
OneWire oneWire(PIN_DS18B20);
DallasTemperature sensors(&oneWire);
WiFiClientSecure client;
HTTPClient http;

// --- VARIÁVEIS DE CONTROLE ---
float tempC = 0.0;
bool relayState = false;
float configTempOn = 28.0;  // Valor padrão caso falhe a leitura
float configTempOff = 30.0; // Valor padrão
unsigned long lastTime = 0;
const unsigned long timerDelay = 30000; // 30 segundos entre leituras

void setup() {
  Serial.begin(115200);

  // Inicializa Hardware
  pinMode(PIN_RELAY, OUTPUT);
  digitalWrite(PIN_RELAY, LOW); // Começa desligado
  sensors.begin();

  // Conexão WiFi
  WiFi.begin(ssid, password);
  Serial.print("Conectando ao WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConectado!");

  // Configuração SSL (Supabase exige HTTPS)
  client.setInsecure(); // Não verifica certificado (ideal para ESP8266 simples)
}

void loop() {
  // Executa a cada X segundos
  if ((millis() - lastTime) > timerDelay) {

    // 1. Ler Temperatura
    sensors.requestTemperatures();
    tempC = sensors.getTempCByIndex(0);

    if (tempC == -127.00) {
      Serial.println("Erro ao ler sensor de temperatura!");
      return;
    }
    Serial.print("Temperatura atual: ");
    Serial.println(tempC);

    // 2. Buscar Configuração do Supabase
    fetchConfig();

    // 3. Lógica de Automação
    // Ex: Ligar se Temp < On (Aquecimento) ou Ligar se Temp > On
    // (Resfriamento)? O usuário pediu "ajustar a temperatura para ligar e
    // desligar". Vou assumir lógica de AQUECIMENTO solar (Piscina): Se (Temp <
    // TempOn) -> Liga Bomba (para circular/aquecer) ?? Ou talvez lógica de
    // FILTRAGEM/TIMER? GERALMENTE: "Ligar em X" e "Desligar em Y". Se TempOn <
    // TempOff (Histerese simples):
    //   Se Temp <= TempOn -> Ligar
    //   Se Temp >= TempOff -> Desligar
    // Vamos usar essa lógica simples.

    // NOTA: Ajuste a lógica abaixo conforme sua necessidade real (Aquecimento
    // vs Resfriamento)
    if (tempC <= configTempOn && !relayState) {
      relayState = true;
      digitalWrite(PIN_RELAY, HIGH);
      Serial.println("Bomba LIGADA (Temp <= ConfigOn)");
    } else if (tempC >= configTempOff && relayState) {
      relayState = false;
      digitalWrite(PIN_RELAY, LOW);
      Serial.println("Bomba DESLIGADA (Temp >= ConfigOff)");
    }

    // 4. Enviar Dados para Supabase
    postData();

    lastTime = millis();
  }
}

// --- CONFIGURAÇÕES DO CONTROLADOR ---
const int DEVICE_ID = 1; // ID do dispositivo no Supabase (1 a 9)

void fetchConfig() {
  if (WiFi.status() == WL_CONNECTED) {
    // Busca configuração específica para este device_id
    String url = "https://" + String(supabase_url) +
                 "/rest/v1/device_settings?select=*&device_id=eq." + String(DEVICE_ID) + "&limit=1";

    http.begin(client, url);
    http.addHeader("apikey", supabase_key);
    http.addHeader("Authorization", "Bearer " + String(supabase_key));

    int httpResponseCode = http.GET();

    if (httpResponseCode > 0) {
      String payload = http.getString();
      // Serial.println(payload); // Debug

      DynamicJsonDocument doc(1024);
      deserializeJson(doc, payload); // Pode ser um array ou objeto único dependendo da resposta

      // Se retornar array (padrão do select), pega o primeiro item
      JsonObject config = doc.as<JsonArray>()[0]; 
      
      if (!config.isNull()) {
        configTempOn = config["temp_on"];
        configTempOff = config["temp_off"];
        Serial.print("Config (ID ");
        Serial.print(DEVICE_ID);
        Serial.print(") -> On: ");
        Serial.print(configTempOn);
        Serial.print(" | Off: ");
        Serial.println(configTempOff);
      }
    } else {
      Serial.print("Erro no GET Config: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  }
}

void postData() {
  if (WiFi.status() == WL_CONNECTED) {
    String url = "https://" + String(supabase_url) + "/rest/v1/device_readings";

    http.begin(client, url);
    http.addHeader("apikey", supabase_key);
    http.addHeader("Authorization", "Bearer " + String(supabase_key));
    http.addHeader("Content-Type", "application/json");
    http.addHeader("Prefer", "return=minimal");

    String json;
    DynamicJsonDocument doc(256);
    doc["device_id"] = DEVICE_ID;
    doc["temp_value"] = tempC;
    doc["actuator_status"] = relayState; // Status do relé (Compressor/Resistor)
    serializeJson(doc, json);

    int httpResponseCode = http.POST(json);

    if (httpResponseCode >= 200 && httpResponseCode < 300) {
      Serial.println("Dados enviados com sucesso!");
    } else {
      Serial.print("Erro no POST Dados: ");
      Serial.println(httpResponseCode);
      Serial.println(http.getString());
    }
    http.end();
  }
}
