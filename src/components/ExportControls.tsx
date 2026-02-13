import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { fetchReportData } from '../lib/supabase';

export const ExportControls: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [isLoading, setIsLoading] = useState<'pdf' | 'excel' | null>(null);

    const handleExport = async (type: 'pdf' | 'excel') => {
        setIsLoading(type);
        try {
            // Adjust simply to avoid timezone issues on loose date string parsing, 
            // though YYYY-MM-DD usually parses to UTC. 
            // User input is local, so we treat it as local day.
            // fetchReportData handles 00:00 to 23:59 of that specific date object.
            // But passing '2023-01-01' to new Date() might be UTC. 
            // Let's ensure we pass a date object that represents the start of the day in local time or consistent.
            // Actually fetchReportData takes a Date object and sets hours.
            // So constructing new Date(selectedDate + 'T12:00:00') usually works to target that specific day.
            const queryDate = new Date(selectedDate + 'T12:00:00');

            const data = await fetchReportData(queryDate);

            if (!data || data.length === 0) {
                alert('Nenhum dado encontrado para esta data.');
                setIsLoading(null);
                return;
            }

            if (type === 'pdf') {
                const doc = new jsPDF();
                doc.text(`Relatório de Temperatura - ${format(queryDate, 'dd/MM/yyyy', { locale: ptBR })}`, 14, 15);
                doc.text('Piscina Control Drudi', 14, 22);

                autoTable(doc, {
                    startY: 30,
                    head: [['ID', 'Hora', 'Temperatura (°C)', 'Relé']],
                    body: data.map(item => [
                        item.id,
                        format(new Date(item.created_at), 'HH:mm:ss', { locale: ptBR }),
                        item.temp_value.toFixed(1),
                        item.relay_status ? 'Ligado' : 'Desligado'
                    ]),
                });

                doc.save(`relatorio_piscina_${selectedDate}.pdf`);
            } else {
                const ws = XLSX.utils.json_to_sheet(data.map(item => ({
                    ID: item.id,
                    Data: format(new Date(item.created_at), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR }),
                    Temperatura: item.temp_value,
                    Bomba: item.relay_status ? 'Ligada' : 'Desligada'
                })));

                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Dados");
                XLSX.writeFile(wb, `relatorio_piscina_${selectedDate}.xlsx`);
            }

        } catch (error) {
            console.error('Error exporting:', error);
            alert('Erro ao gerar relatório. Verifique o console ou a conexão.');
        } finally {
            setIsLoading(null);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto mt-6 p-6 glass rounded-2xl">
            <h3 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider flex items-center gap-2">
                <Download size={16} /> Exportar Relatórios
            </h3>

            <div className="flex flex-col gap-4">
                <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Selecione a Data</label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-pool-blue/50 text-slate-700"
                    />
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => handleExport('pdf')}
                        disabled={!!isLoading}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors text-sm font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading === 'pdf' ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
                        PDF
                    </button>

                    <button
                        onClick={() => handleExport('excel')}
                        disabled={!!isLoading}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors text-sm font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading === 'excel' ? <Loader2 size={16} className="animate-spin" /> : <FileSpreadsheet size={16} />}
                        Excel
                    </button>
                </div>
            </div>
        </div>
    );
};
