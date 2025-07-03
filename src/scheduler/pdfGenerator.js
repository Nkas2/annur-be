import cron from "node-cron";
import prisma from "../prismaClient.js";
import { generateFinancialReport } from "../utils/pdfGenerator.js";

cron.schedule("0 1 1 * *", async () => {
  console.log("⏰ Scheduler jalan: Generate laporan keuangan bulanan");

  const now = new Date();
  const month = now.getMonth() + 1; // +1 karena getMonth() 0-based
  const year = now.getFullYear();

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  try {
    const transactions = await prisma.transactions.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    if (transactions.length === 0) {
      console.log("📭 Tidak ada transaksi untuk bulan ini");
      return;
    }

    const pdfPath = await generateFinancialReport(transactions, month, year);
    console.log(`✅ Laporan keuangan disimpan di: ${pdfPath}`);
  } catch (err) {
    console.error("❌ Error generate laporan:", err);
  }
});
