import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

export function exportCSV(rows, filename) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(','),
    ...rows.map(r => headers.map(h => JSON.stringify(r[h] ?? '')).join(',')),
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
  download(blob, `${filename}.csv`);
}

export function exportExcel(rows, filename, sheetName = 'Records') {
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

export function exportPDF(columns, rows, title, filename) {
  const doc = new jsPDF({ orientation: 'landscape' });
  doc.setFontSize(14);
  doc.setTextColor(26, 92, 42);
  doc.text(title, 14, 16);
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(`Exported: ${new Date().toLocaleString()}`, 14, 22);
  autoTable(doc, {
    startY: 28,
    head: [columns],
    body: rows,
    headStyles: { fillColor: [26, 92, 42], fontSize: 9 },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: [240, 248, 241] },
  });
  doc.save(`${filename}.pdf`);
}

export async function exportImage(elementRef, filename) {
  if (!elementRef) return;
  const canvas = await html2canvas(elementRef, { useCORS: true, scale: 2 });
  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

function download(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
