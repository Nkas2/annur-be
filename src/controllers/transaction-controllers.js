import transactionService from "../service/transaction-service.js";

import { generateFinancialReport } from "../utils/generateReport.js";
import { prismaClient } from "../application/database.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const get = async (req, res, next) => {
  try {
    const result = await transactionService.get(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const create = async (req, res, next) => {
  try {
    req.body.user_id = req.user.id;
    const result = await transactionService.create(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const edit = async (req, res, next) => {
  try {
    req.body.id = req.params.id;
    const result = await transactionService.edit(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await transactionService.remove({
      id: req.params.id,
    });
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getListTransactions = async (req, res, next) => {
  try {
    const { year: rawYear, month: rawMonth, type: typeAction } = req.query;

    console.log(req.query);

    // Default fallback
    const now = new Date();
    const year =
      typeof rawYear === "string" && rawYear !== "" ? rawYear : "all";
    const month =
      typeof rawMonth === "string" && rawMonth !== "" ? Number(rawMonth) : 0;

    // Optional: validasi basic
    if (Number.isNaN(month) || month < 0 || month > 12) {
      return res.status(400).json({ message: "Invalid month value" });
    }

    const result = await transactionService.getListTransactions(
      year,
      month,
      typeAction,
    );
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getIncomeAndExpense = async (req, res, next) => {
  try {
    const result = await transactionService.getIncomeAndExpense();
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getTransactionDetail = async (req, res, next) => {
  try {
    const result = await transactionService.getTransactionDetails(
      req.params.id,
    );
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

async function generateReportManual(req, res) {
  const { month, year } = req.body;

  if (!month || !year) {
    return res.status(400).json({ message: "month dan year wajib diisi" });
  }

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  try {
    const transactions = await prismaClient.transactions.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    if (transactions.length === 0) {
      return res
        .status(404)
        .json({ message: "Tidak ada transaksi untuk bulan ini" });
    }

    const pdfPath = await generateFinancialReport(transactions, month, year);

    res.status(200).json({
      message: "Laporan berhasil dibuat",
      file: pdfPath,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal membuat laporan" });
  }
}

async function downloadReport(req, res) {
  try {
    const { year, month } = req.params;

    if (!year || !month) {
      return res.status(400).json({ message: "Year dan month wajib diisi" });
    }

    const fileName = `financial_report_${year}_${month}.pdf`;
    const filePath = path.join(__dirname, "../reports", fileName);

    // Cek apakah file ada
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Laporan tidak ditemukan" });
    }

    // Kirim file untuk didownload
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error("❌ Error saat download file:", err);
        res.status(500).json({ message: "Gagal download file" });
      } else {
        console.log(`📥 Laporan ${fileName} berhasil di-download`);
      }
    });
  } catch (err) {
    console.error("❌ Error di downloadReport:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export default {
  get,
  create,
  edit,
  remove,
  getListTransactions,
  getIncomeAndExpense,
  getTransactionDetail,
  generateReportManual,
  downloadReport,
};
