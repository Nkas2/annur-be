import fs from "fs";
import PDFDocument from "pdfkit";

export function generateIncomeStatementPDF(transactions, outputPath = "laporan_keuangan.pdf") {
    const doc = new PDFDocument();

    doc.pipe(fs.createWriteStream(outputPath));

    doc.fontSize(18).text("Laporan Laba Rugi", { align: "center" });
    doc.moveDown();

    let income = 0;
    let expense = 0;

    transactions.forEach((t) => {
        doc.fontSize(12).text(`${t.date} - ${t.category} (${t.type}): Rp${t.amount.toLocaleString()}`);
        if (t.type === "income") income += t.amount;
        else if (t.type === "expense") expense += t.amount;
    });

    const profit = income - expense;

    doc.moveDown();
    doc.fontSize(14).text(`Total Pendapatan: Rp${income.toLocaleString()}`);
    doc.text(`Total Biaya: Rp${expense.toLocaleString()}`);
    doc.text(`Laba / Rugi: Rp${profit.toLocaleString()}`, { underline: true });

    doc.end();
}
