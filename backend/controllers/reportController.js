import BookingModel from "../models/bookingModel.js";
import DonationModel from "../models/donationModel.js";
import Annaprasad from "../models/annaprasadModel.js";
import TempleModel from "../models/templeModel.js";
import mongoose from "mongoose";

// Helper for date calculations
const getStartOfToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
};

const getStartOfThisMonth = () => {
    const today = new Date();
    today.setDate(1);
    today.setHours(0, 0, 0, 0);
    return today;
};

// 1. Dashboard Summary Stats
export const getDashboardSummary = async (req, res) => {
    try {
        const startOfToday = getStartOfToday();
        const startOfThisMonth = getStartOfThisMonth();

        // 💰 Pooja Revenue (Completed Only)
        const poojaSummary = await BookingModel.aggregate([
            { $match: { status: "completed" } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalAmount" },
                    todayRevenue: {
                        $sum: {
                            $cond: [{ $gte: ["$createdAt", startOfToday] }, "$totalAmount", 0]
                        }
                    },
                    thisMonthRevenue: {
                        $sum: {
                            $cond: [{ $gte: ["$createdAt", startOfThisMonth] }, "$totalAmount", 0]
                        }
                    },
                    totalBookings: { $count: {} }
                }
            }
        ]);

        // 💰 Donation Revenue
        const donationSummary = await DonationModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$amount" },
                    todayRevenue: {
                        $sum: {
                            $cond: [{ $gte: ["$createdAt", startOfToday] }, "$amount", 0]
                        }
                    },
                    thisMonthRevenue: {
                        $sum: {
                            $cond: [{ $gte: ["$createdAt", startOfThisMonth] }, "$amount", 0]
                        }
                    },
                    totalDonations: { $count: {} }
                }
            }
        ]);

        // 💰 Annaprasad Revenue
        const annaSummary = await Annaprasad.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$amount" },
                    todayRevenue: {
                        $sum: {
                            $cond: [{ $gte: ["$createdAt", startOfToday] }, "$amount", 0]
                        }
                    },
                    thisMonthRevenue: {
                        $sum: {
                            $cond: [{ $gte: ["$createdAt", startOfThisMonth] }, "$amount", 0]
                        }
                    },
                    totalAnnaprasad: { $count: {} }
                }
            }
        ]);

        const pooja = poojaSummary[0] || { totalRevenue: 0, todayRevenue: 0, thisMonthRevenue: 0, totalBookings: 0 };
        const donation = donationSummary[0] || { totalRevenue: 0, todayRevenue: 0, thisMonthRevenue: 0, totalDonations: 0 };
        const anna = annaSummary[0] || { totalRevenue: 0, todayRevenue: 0, thisMonthRevenue: 0, totalAnnaprasad: 0 };

        res.json({
            success: true,
            summary: {
                totalRevenue: pooja.totalRevenue + donation.totalRevenue + anna.totalRevenue,
                poojaRevenue: pooja.totalRevenue,
                donationRevenue: donation.totalRevenue + anna.totalRevenue, // Combined Donations
                todayRevenue: pooja.todayRevenue + donation.todayRevenue + anna.todayRevenue,
                thisMonthRevenue: pooja.thisMonthRevenue + donation.thisMonthRevenue + anna.thisMonthRevenue,
                totalBookings: pooja.totalBookings,
                totalDonors: donation.totalDonations + anna.totalAnnaprasad
            }
        });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// 2. Analytics Breakdown (Temple & Pooja)
export const getAnalyticsDetails = async (req, res) => {
    try {
        // Temple-wise Revenue (Pooja + Donation)
        const templePoojaAgg = await BookingModel.aggregate([
            { $match: { status: "completed" } },
            { $group: { _id: "$temple", revenue: { $sum: "$totalAmount" } } },
            { $lookup: { from: "temples", localField: "_id", foreignField: "_id", as: "templeInfo" } },
            { $unwind: "$templeInfo" },
            { $project: { name: "$templeInfo.name", revenue: 1 } }
        ]);

        const templeDonationAgg = await DonationModel.aggregate([
            { $group: { _id: "$temple", revenue: { $sum: "$amount" } } },
            { $lookup: { from: "temples", localField: "_id", foreignField: "_id", as: "templeInfo" } },
            { $unwind: "$templeInfo" },
            { $project: { name: "$templeInfo.name", revenue: 1 } }
        ]);

        // Merge Temple results
        const templeResultsMap = {};
        templePoojaAgg.forEach(t => templeResultsMap[t.name] = (templeResultsMap[t.name] || 0) + t.revenue);
        templeDonationAgg.forEach(t => templeResultsMap[t.name] = (templeResultsMap[t.name] || 0) + t.revenue);

        const templeAnalytics = Object.entries(templeResultsMap).map(([name, revenue]) => ({ name, value: revenue }));

        // Pooja-wise Revenue Breakdown
        const poojaAnalytics = await BookingModel.aggregate([
            { $match: { status: "completed" } },
            { $unwind: "$poojas" },
            { $lookup: { from: "poojas", localField: "poojas", foreignField: "_id", as: "poojaInfo" } },
            { $unwind: "$poojaInfo" },
            { $group: { _id: "$poojaInfo.name", revenue: { $sum: "$totalAmount" }, count: { $sum: 1 } } },
            { $project: { name: "$_id", revenue: 1, count: 1, _id: 0 } },
            { $sort: { revenue: -1 } }
        ]);

        res.json({
            success: true,
            templeAnalytics,
            poojaAnalytics
        });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// 3. Monthly Monthly Trend
export const getMonthlyTrend = async (req, res) => {
    try {
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
        twelveMonthsAgo.setDate(1);
        twelveMonthsAgo.setHours(0, 0, 0, 0);

        const trend = await BookingModel.aggregate([
            { $match: { status: "completed", createdAt: { $gte: twelveMonthsAgo } } },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    },
                    revenue: { $sum: "$totalAmount" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Format for recharts
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const formattedTrend = trend.map(t => ({
            name: `${months[t._id.month - 1]} ${t._id.year}`,
            revenue: t.revenue
        }));

        res.json({ success: true, trend: formattedTrend });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// 4. Filtered Transactions for Dashboard Table
export const getDashboardTransactions = async (req, res) => {
    try {
        const { templeId, poojaType, startDate, endDate } = req.query;

        let query = { status: "completed" };

        if (templeId) query.temple = new mongoose.Types.ObjectId(templeId);
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const transactions = await BookingModel.find(query)
            .populate("temple", "name")
            .populate("poojas", "name")
            .populate("user", "name email")
            .sort({ createdAt: -1 })
            .limit(100); // Limit for performance in initial dashboard view

        res.json({
            success: true,
            transactions: transactions.map(t => ({
                id: t._id,
                date: t.createdAt,
                temple: t.temple?.name || "Multiple",
                pooja: t.poojas.map(p => p.name).join(", "),
                devotee: t.poojaInNameOf || t.user?.name || "Devotee",
                amount: t.totalAmount,
                paymentId: t.paymentId || "N/A"
            }))
        });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};
