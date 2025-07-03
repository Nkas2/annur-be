import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function generateFinancialReport(transactions, month, year) {
  return new Promise((resolve, reject) => {
    if (!transactions || transactions.length === 0) {
      return reject(new Error("Tidak ada transaksi untuk periode ini"));
    }

    const fileName = `financial_report_${year}_${month}.pdf`;
    const reportsDir = path.join(__dirname, "../reports");
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    const filePath = path.join(reportsDir, fileName);

    const margin = 40;
    const doc = new PDFDocument({ margin, size: "A4" });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Judul
    doc
      .fontSize(20)
      .fillColor("#333333")
      .text("LAPORAN KEUANGAN", { align: "center" })
      .moveDown(0.5);

    doc
      .fontSize(14)
      .fillColor("#666666")
      .text(`Periode: ${month}/${year}`, { align: "center" })
      .moveDown(2);

    // Table setup
    const tableTop = doc.y;
    const rowHeight = 25;
    const colWidths = [40, 80, 80, 120, 200];
    const totalTableWidth = colWidths.reduce((a, b) => a + b, 0);

    // Draw Header Row
    let x = margin;
    doc.font("Helvetica-Bold").fontSize(10).fillColor("#FFFFFF");
    ["No", "Tanggal", "Tipe", "Jumlah (Rp)", "Keterangan"].forEach(
      (header, i) => {
        doc
          .rect(x, tableTop, colWidths[i], rowHeight)
          .fill("#4A90E2")
          .stroke()
          .fillColor("#FFFFFF")
          .text(header, x + 5, tableTop + 7, { width: colWidths[i] - 10 });
        x += colWidths[i];
      },
    );

    // Draw Data Rows
    transactions.forEach((t, rowIndex) => {
      const y = tableTop + rowHeight * (rowIndex + 1);
      const isEven = rowIndex % 2 === 0;
      const bgColor = isEven ? "#F5F5F5" : "#FFFFFF";

      // Draw background
      doc.fillColor(bgColor).rect(margin, y, totalTableWidth, rowHeight).fill();

      // Draw borders
      doc
        .lineWidth(0.5)
        .strokeColor("#CCCCCC")
        .rect(margin, y, totalTableWidth, rowHeight)
        .stroke();

      // Draw text
      const row = [
        rowIndex + 1,
        t.date.toISOString().split("T")[0],
        t.transaction_type === "income" ? "Pemasukan" : "Pengeluaran",
        parseFloat(t.amount).toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 2,
        }),
        t.remark,
      ];

      let xPos = margin;
      row.forEach((cell, i) => {
        const align = i === 3 ? "right" : "left";
        const textColor =
          i === 2 ? (cell === "Pemasukan" ? "#008000" : "#B22222") : "#000000";

        doc
          .font("Helvetica")
          .fontSize(10)
          .fillColor(textColor)
          .text(cell, xPos + 5, y + 7, { width: colWidths[i] - 10, align });
        xPos += colWidths[i];
      });
    });

    // Total saldo
    const total = transactions.reduce(
      (sum, t) =>
        t.transaction_type === "income"
          ? sum + parseFloat(t.amount)
          : sum - parseFloat(t.amount),
      0,
    );

    doc
      .moveDown(2)
      .rect(margin, doc.y, totalTableWidth, rowHeight)
      .fill("#EFEFEF")
      .stroke()
      .fontSize(12)
      .fillColor("#000000")
      .text("Total Saldo:", margin + 5, doc.y + 7, {
        width: totalTableWidth - 10,
        align: "left",
      })
      .font("Helvetica-Bold")
      .fillColor(total >= 0 ? "#008000" : "#B22222")
      .text(
        total.toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 2,
        }),
        margin + 5,
        doc.y + 7,
        { width: totalTableWidth - 10, align: "right" },
      );

    doc.end();

    stream.on("finish", () => {
      console.log(`✅ PDF berhasil dibuat: ${filePath}`);
      resolve(filePath);
    });
    stream.on("error", (err) => {
      console.error("❌ Error generate PDF:", err);
      reject(err);
    });
  });
}
