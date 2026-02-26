import User from "../models/User.js";
import Exam from "../models/Exam.js";
import Result from "../models/Result.js";

export const getDashboardStats = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: "student" });
        const totalExams = await Exam.countDocuments();

        const now = new Date();
        const activeExams = await Exam.countDocuments({
            startTime: { $lte: now },
            endTime: { $gte: now }
        });

        const completedExamsCount = await Result.countDocuments();

        // For now, violations are mocked as 0 or could be tied to a future model
        const violationsCount = 0;

        // Get Active Exams details for the table
        const activeExamslist = await Exam.find({
            startTime: { $lte: now },
            endTime: { $gte: now }
        }).limit(5);

        // Get Recent Activities (Results or User signups)
        const recentResults = await Result.find()
            .populate("studentId", "name")
            .populate("examId", "title")
            .sort({ createdAt: -1 })
            .limit(5);

        const recentActivities = recentResults.map(result => ({
            user: result.studentId?.name || "Unknown Student",
            action: `Submitted '${result.examId?.title || "Unknown Exam"}'`,
            time: result.submittedAt,
            icon: "check_circle",
            color: "green-600"
        }));

        res.status(200).json({
            stats: {
                totalStudents,
                totalExams,
                activeExams,
                completedExams: completedExamsCount,
                violations: violationsCount
            },
            activeExams: activeExamslist.map(exam => ({
                title: exam.title,
                students: "N/A", // This would need more complex logic to get live count
                time: exam.endTime, // We can show time remaining or end time
                usage: "Accessibility Enabled"
            })),
            recentActivities
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching dashboard stats", error: error.message });
    }
};
