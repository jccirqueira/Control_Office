# Firmware ESP8266 - Control Office

Este diretório contém o código fonte para o microcontrolador ESP8266 (NodeMCU) que controla a automação da piscina.

## Arquivo Principal
- `piscina_control/piscina_control.ino`

## Configuração Necessária

Antes de carregar o código, abra o arquivo `piscina_control.ino` e edite as seguintes linhas com os dados da sua rede WiFi:

```cpp
const char* ssid = "NOME_DA_SUA_REDE_WIFI";
const char* password = "SENHA_DA_SUA_REDE_WIFI";
```

**Nota:** As credenciais do Supabase (URL e Key) JÁ FORAM PREENCHIDAS automaticamente para você.

## Bibliotecas Necessárias (Arduino IDE)

Instale as seguintes bibliotecas via *Gerenciador de Bibliotecas* (Sketch > Incluir Biblioteca > Gerenciar Bibliotecas):

1. **ArduinoJson** (por Benoit Blanchon) - Versão 6.x ou 7.x
2. **OneWire** (por Paul Stoffregen)
3. **DallasTemperature** (por Miles Burton)
4. `ESP8266WiFi` e `ESP8266HTTPClient` (já inclusas no pacote da placa ESP8266)

## Hardware (Pinagem)

| Componente | Pino NodeMCU | GPIO |
|------------|--------------|------|
| Relé (Bomba)| D1           | 5    |
| Sensor DS18B20 | D2        | 4    |

## Como Carregar

1. Instale o suporte a placas ESP8266 na Arduino IDE (`http://arduino.esp8266.com/stable/package_esp8266com_index.json` nas Preferências).
2. Selecione a placa: **NodeMCU 1.0 (ESP-12E Module)**.
3. Conecte o cabo USB.
4. Clique em **Carregar** (Seta para direita).
