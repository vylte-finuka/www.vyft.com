import type { NextApiRequest, NextApiResponse } from "next";
import { Checkout } from "checkout-sdk-node";
import clientPromise from "./lib/mongodb";
// import fetch from "node-fetch"; // Retiré car non utilisé

const checkout = new Checkout(process.env.CKO_SECRET_KEY as string, {
  client: process.env.CKO_CLIENT_ID as string, // Ajoutez votre client ID ici
  timeout: 10000, // Timeout de 10 secondes pour les appels API
});

type ResponseData = {
  success: boolean;
  message: string;
  data?: {
    enseigne?: string;
    yearlySteps: number;
    totalDistance: number;
    estimatedRevenue: number;
    dailySteps: number;
    dailyDistance: number;
    dailyRevenue: number;
    avgRevenue?: string;
    growth?: string;
    monthlyInvestment?: number;
    metricsHistory?: any;
    upcomingInvoiceAmount?: number;
    influence?: {
      day: number;
      week: number;
      month: number;
      year: number;
      all: number;
      history7Days?: Array<{ date: string; count: number; users: string[] }>;
      historyMonth?: Array<{ date: string; count: number; users: string[] }>;
      historyYear?: Array<{ month: string; count: number }>;
      topUsers?: Array<{ name: string; count: number }>;
    };
  };
};

/**
 * API handler Next.js.
 * - GET : Récupère les métriques cumulées et les envoie à Checkout.com.
 */
export default async function Vyfthealth_proc(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");

  const apiKey = req.headers["x-vyftprogram-api-key"];
  if (apiKey !== process.env.NEXT_PUBLIC_VYFTPROGRAM_API_KEY) {
    return res.status(401).json({ success: false, message: "Clé API invalide ou manquante." });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Méthode non autorisée. Utilisez GET." });
  }

  try {
    const enseigneFilter = typeof req.query.enseigne === "string" ? req.query.enseigne.trim() : "";
    const ckoCustomerId = typeof req.query.ckoCustomerId === "string" ? req.query.ckoCustomerId.trim() : "";

    if (!enseigneFilter || !ckoCustomerId) {
      return res.status(400).json({
        success: false,
        message: "Les paramètres 'enseigne' et 'ckoCustomerId' sont requis dans l'URL (ex: /api/vyfthealth_proc?enseigne=Vylte-finuka%20SARL&ckoCustomerId=xxx).",
      });
    }

    // Vérification de l'existence du client dans Checkout.com
    try {
      await checkout.customers.get(ckoCustomerId);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: `Client Checkout.com invalide: ${ckoCustomerId}`,
      });
    }

    const client = await clientPromise;
    const db = client.db("vyfbase");
    const collection = db.collection("vyfthealth");

    // Récupérer les données des capteurs
    const sensorData = await collection
      .find({ enseigne: { $regex: `^${enseigneFilter.trim()}$`, $options: "i" } })
      .toArray();

    if (sensorData.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Aucune donnée trouvée pour l'enseigne "${enseigneFilter}".`,
      });
    }

    let dailySteps = 0;
    let dailyDistance = 0;
    let yearlySteps = 0;
    let totalDistance = 0;
    let enseigne = "";

    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

    sensorData.forEach((item) => {
      const steps = item.steps || 0;
      const distance = parseFloat(item.distance) || 0;
      const date = new Date(item.date);

      if (date >= oneYearAgo) {
        yearlySteps += steps;
        totalDistance += distance;
      }

      if (date >= twentyFourHoursAgo) {
        dailySteps += steps;
        dailyDistance += distance;
      }

      if (item.enseigne) {
        enseigne = item.enseigne;
      }
    });

    // MOCK : valeurs fictives pour revenue et investissement
    const totalRevenue = 0;
    const monthlyInvestment = 0;

    // Gestion des nouvelles entrées
    let lastProcessedId: string | null = null;
    const lastEntries = await collection
      .find({ enseigne: { $regex: `^${enseigneFilter.trim()}$`, $options: "i" } })
      .sort({ date: -1 })
      .limit(1)
      .toArray();

    const lastEntry = lastEntries[0];

    if (lastEntry) {
      const currentEntryId = lastEntry._id.toString();

      if (!lastProcessedId || (currentEntryId !== lastProcessedId && !lastEntry.processed)) {
        const lastSteps: number = lastEntry.steps || 0;
        const lastDistance: number = parseFloat(lastEntry.distance) || 0;

        const incrementalSteps = lastSteps * 0.3;
        const incrementalDistance = lastDistance * 0.3;
        const incrementalValue = Math.round(incrementalSteps + incrementalDistance);

        await collection.updateOne({ _id: lastEntry._id }, { $set: { processed: true } });
        lastProcessedId = currentEntryId;
      }
    } else {
    }

    // Calcul du prix dynamique
    const count = sensorData.length;
    const totalDistanceForAvg = sensorData.reduce((sum, item) => sum + (parseFloat(item.distance) || 0), 0);
    const avgDistance = count > 0 ? totalDistanceForAvg / count : 0;

    const BASE_METER_PRICE = 0.10;
    const REFERENCE_AVG_DISTANCE = 1000;
    const GLOBAL_METER_PRICE = avgDistance > 0
      ? BASE_METER_PRICE * (avgDistance / REFERENCE_AVG_DISTANCE)
      : BASE_METER_PRICE;

    const GLOBAL_STEP_PRICE = 0.10;

    // Récupérer l'historique des métriques
    const metricsHistory = await collection.aggregate([
      {
        $match: { enseigne: { $regex: `^${enseigneFilter.trim()}$`, $options: "i" } },
      },
      {
        $addFields: {
          dateObj: { $toDate: "$date" },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$dateObj" },
            month: { $month: "$dateObj" },
            day: { $dayOfMonth: "$dateObj" },
          },
          date: { $first: "$dateObj" },
          dailySteps: { $sum: "$steps" },
          dailyDistance: { $sum: { $toDouble: "$distance" } },
        },
      },
      { $sort: { date: -1 } },
      { $limit: 7 },
    ]).toArray();

    const metricsHistoryWithRevenue = metricsHistory.map((h) => {
      const steps = h.dailySteps || 0;
      const distance = h.dailyDistance || 0;
      const dailyRevenue = (steps * GLOBAL_STEP_PRICE) + (distance * GLOBAL_METER_PRICE);
      return {
        date: h.date,
        dailySteps: h.dailySteps,
        dailyDistance: h.dailyDistance,
        dailyRevenue: Number(dailyRevenue.toFixed(2)),
      };
    });

    // Calcul de la croissance
    const metrics14Days = await collection
      .find({ enseigne: { $regex: `^${enseigneFilter.trim()}$`, $options: "i" } })
      .sort({ date: -1 })
      .limit(14)
      .toArray();

    const dailyRevenues14 = metrics14Days.map((h) => {
      const steps = h.steps || 0;
      const distance = parseFloat(h.distance) || 0;
      return (steps * GLOBAL_STEP_PRICE) + (distance * GLOBAL_METER_PRICE);
    });

    const sumLast7 = dailyRevenues14.slice(0, 7).reduce((sum, v) => sum + v, 0);
    const sumPrev7 = dailyRevenues14.slice(7, 14).reduce((sum, v) => sum + v, 0);

    let growth = "0 %";
    if (sumPrev7 > 0) {
      const percent = ((sumLast7 - sumPrev7) / sumPrev7) * 100;
      growth = (percent > 0 ? "+" : "") + percent.toFixed(2) + " %";
    } else if (sumLast7 > 0) {
      growth = "+∞ %";
    }

    const avgRevenue =
      dailyRevenues14.slice(0, 7).length > 0
        ? (dailyRevenues14.slice(0, 7).reduce((sum, v) => sum + v, 0) / dailyRevenues14.slice(0, 7).length).toFixed(2)
        : "0";

    const dailyRevenue = dailyRevenues14.length > 0 ? dailyRevenues14[0].toFixed(2) : "0";

    // MOCK : prochaine facture (Checkout.com invoices non disponible dans SDK)
    const upcomingInvoiceAmount = 0;

    // Calcul de l'influence
    const nowTime = new Date();
    const startOfDay = new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate());
    const startOfWeek = new Date(nowTime);
    startOfWeek.setDate(nowTime.getDate() - 6);
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonthForInfluence = new Date(nowTime.getFullYear(), nowTime.getMonth(), 1);
    const startOfYear = new Date(nowTime.getFullYear(), 0, 1);

    async function countUnique(from: Date | null) {
      const match: any = { enseigne: { $regex: `^${enseigneFilter.trim()}$`, $options: "i" } };
      if (from) match.date = { $gte: from.toISOString() };
      const result = await collection.aggregate([
        { $match: match },
        { $group: { _id: "$name" } },
        { $count: "count" },
      ]).toArray();
      return result[0]?.count || 0;
    }

    const [influenceDay, influenceWeek, influenceMonth, influenceYear, influenceAll] = await Promise.all([
      countUnique(startOfDay),
      countUnique(startOfWeek),
      countUnique(startOfMonthForInfluence),
      countUnique(startOfYear),
      countUnique(null),
    ]);

    const influenceHistory7Days: Array<{ date: string; count: number; users: string[] }> = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate() - i);
      const nextDay = new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate() - i + 1);
      const users = await collection.distinct("name", {
        enseigne: { $regex: `^${enseigneFilter.trim()}$`, $options: "i" },
        date: { $gte: day.toISOString(), $lt: nextDay.toISOString() },
      });
      influenceHistory7Days.push({
        date: day.toISOString(),
        count: users.length,
        users,
      });
    }

    const influenceHistoryMonth: Array<{ date: string; count: number; users: string[] }> = [];
    const daysInMonth = new Date(nowTime.getFullYear(), nowTime.getMonth() + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      const day = new Date(nowTime.getFullYear(), nowTime.getMonth(), i);
      const nextDay = new Date(nowTime.getFullYear(), nowTime.getMonth(), i + 1);
      const users = await collection.distinct("name", {
        enseigne: { $regex: `^${enseigneFilter.trim()}$`, $options: "i" },
        date: { $gte: day.toISOString(), $lt: nextDay.toISOString() },
      });
      influenceHistoryMonth.push({
        date: day.toISOString(),
        count: users.length,
        users,
      });
    }

    const influenceHistoryYear: Array<{ month: string; count: number }> = [];
    for (let m = 0; m < 12; m++) {
      const monthStart = new Date(nowTime.getFullYear(), m, 1);
      const monthEnd = new Date(nowTime.getFullYear(), m + 1, 1);
      const count = await collection.distinct("name", {
        enseigne: { $regex: `^${enseigneFilter.trim()}$`, $options: "i" },
        date: { $gte: monthStart.toISOString(), $lt: monthEnd.toISOString() },
      });
      influenceHistoryYear.push({
        month: monthStart.toLocaleString("fr-FR", { month: "short" }),
        count: count.length,
      });
    }

    const topUsersAgg = await collection.aggregate([
      { $match: { enseigne: { $regex: `^${enseigneFilter.trim()}$`, $options: "i" } } },
      { $group: { _id: "$name", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]).toArray();
    const topUsers = topUsersAgg.map((u) => ({ name: u._id, count: u.count }));

    res.status(200).json({
      success: true,
      message: "Données calculées et envoyées à Checkout.com avec succès.",
      data: {
        enseigne,
        yearlySteps,
        totalDistance,
        estimatedRevenue: totalRevenue,
        dailySteps,
        dailyDistance,
        dailyRevenue: Number(dailyRevenue),
        avgRevenue,
        growth,
        monthlyInvestment,
        metricsHistory: metricsHistoryWithRevenue,
        upcomingInvoiceAmount,
        influence: {
          day: influenceDay,
          week: influenceWeek,
          month: influenceMonth,
          year: influenceYear,
          all: influenceAll,
          history7Days: influenceHistory7Days,
          historyMonth: influenceHistoryMonth,
          historyYear: influenceHistoryYear,
          topUsers,
        },
      },
    });
  } catch (error) {
    console.error("Erreur lors du calcul des données :", error);
    res.status(500).json({
      success: false,
      message: `Erreur serveur: ${error instanceof Error ? error.message : "Erreur inconnue"}`,
    });
  }
}