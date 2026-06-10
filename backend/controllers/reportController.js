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

// 1. Dashboard Summary Stats (including Confirmed/Approved bookings as valid paid revenue)
export const getDashboardSummary = async (req, res) => {
    try {
        const startOfToday = getStartOfToday();
        const startOfThisMonth = getStartOfThisMonth();

        // 💰 Pooja Revenue (Confirmed, Approved, or Completed status matches paid bookings)
        const poojaSummary = await BookingModel.aggregate([
            { $match: { status: { $in: ["confirmed", "approved", "completed"] } } },
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
        res.status(500).json({ success: false, message: "Server error. Failed to retrieve dashboard summary." });
    }
};

// 2. Analytics Breakdown (Temple & Pooja)
export const getAnalyticsDetails = async (req, res) => {
    try {
        // Temple-wise Revenue (Pooja + Donation)
        const templePoojaAgg = await BookingModel.aggregate([
            { $match: { status: { $in: ["confirmed", "approved", "completed"] } } },
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
            { $match: { status: { $in: ["confirmed", "approved", "completed"] } } },
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
        res.status(500).json({ success: false, message: "Server error. Failed to retrieve analytics breakdown." });
    }
};

// 3. Trend Analysis (Daily & Monthly)
export const getTrends = async (req, res) => {
    try {
        // Daily Trend (Last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
        thirtyDaysAgo.setHours(0, 0, 0, 0);

        const dailyTrend = await BookingModel.aggregate([
            { $match: { status: { $in: ["confirmed", "approved", "completed"] }, createdAt: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    revenue: { $sum: "$totalAmount" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Monthly Trend (Last 12 months)
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
        twelveMonthsAgo.setDate(1);
        twelveMonthsAgo.setHours(0, 0, 0, 0);

        const monthlyTrend = await BookingModel.aggregate([
            { $match: { status: { $in: ["confirmed", "approved", "completed"] }, createdAt: { $gte: twelveMonthsAgo } } },
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

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        res.json({ 
            success: true, 
            dailyTrend: dailyTrend.map(d => ({ name: d._id.split('-').slice(1).join('/'), revenue: d.revenue })),
            monthlyTrend: monthlyTrend.map(t => ({
                name: `${months[t._id.month - 1]} ${t._id.year}`,
                revenue: t.revenue
            }))
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error. Failed to retrieve trend analytics." });
    }
};

// 4. Filtered Transactions for Dashboard Table
export const getDashboardTransactions = async (req, res) => {
    try {
        const { templeId, startDate, endDate } = req.query;

        let query = { status: { $in: ["confirmed", "approved", "completed"] } };

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
            .limit(100);

        // Fetch Donations based on filters
        let donationQuery = {};
        if (templeId) donationQuery.temple = new mongoose.Types.ObjectId(templeId);
        if (startDate || endDate) {
            donationQuery.createdAt = {};
            if (startDate) donationQuery.createdAt.$gte = new Date(startDate);
            if (endDate) donationQuery.createdAt.$lte = new Date(endDate);
        }

        const donations = await DonationModel.find(donationQuery)
            .populate("temple", "name")
            .sort({ createdAt: -1 })
            .limit(100);

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
            })),
            donations: donations.map(d => ({
                id: d._id,
                date: d.createdAt,
                donor: `${d.firstName || ''} ${d.lastName || ''}`.trim() || "Anonymous",
                temple: d.temple?.name || "Temple Trust",
                amount: d.amount,
                phone: d.phone || "N/A",
                paymentId: d.paymentId || "N/A"
            }))
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error. Failed to retrieve dashboard transactions." });
    }
};
