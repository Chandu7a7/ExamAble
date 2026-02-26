import Result from "../models/Result.js";
import Exam from "../models/Exam.js";

export const submitResult = async (req, res, next) => {
  try {
    const { examId, answers } = req.body;
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    let score = 0;
    answers.forEach((ans) => {
      const q = exam.questions[ans.questionIndex];
      if (q && typeof q.correctOption === "number" && q.correctOption === ans.selectedOption) {
        score += q.marks || 1;
      }
    });

    const result = await Result.create({
      studentId: req.user._id,
      examId,
      answers,
      score
    });

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const getMyResults = async (req, res, next) => {
  try {
    const results = await Result.find({ studentId: req.user._id }).populate("examId", "title");
    res.json(results);
  } catch (err) {
    next(err);
  }
};

export const getResultById = async (req, res, next) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate("examId", "title duration questions");
    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }
    // Check if result belongs to student or is admin
    if (result.studentId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized access to result" });
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
};

