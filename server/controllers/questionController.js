import Question from "../models/Question.js";
import { generateImageDescription } from "../utils/aiUtils.js";

// @desc    Get all questions for question bank
// @route   GET /api/questions
// @access  Private/Admin
export const getQuestions = async (req, res) => {
    try {
        const questions = await Question.find({});
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Create a new question
// @route   POST /api/questions
// @access  Private/Admin
export const createQuestion = async (req, res) => {
    try {
        let { text, subject, difficulty, options, correctOption, image, accessibilityText } = req.body;

        // Auto-generate accessibilityText if image exists but description is missing
        if (image && !accessibilityText) {
            accessibilityText = await generateImageDescription(image);
        }

        const question = new Question({
            text,
            subject,
            difficulty,
            options,
            correctOption,
            image,
            accessibilityText,
            createdBy: req.user._id
        });

        const createdQuestion = await question.save();
        res.status(201).json(createdQuestion);
    } catch (error) {
        res.status(400).json({ message: "Invalid question data", error: error.message });
    }
};

// @desc    Delete a question
// @route   DELETE /api/questions/:id
// @access  Private/Admin
export const deleteQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);

        if (question) {
            await Question.findByIdAndDelete(req.params.id);
            res.json({ message: "Question removed" });
        } else {
            res.status(404).json({ message: "Question not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Update a question
// @route   PUT /api/questions/:id
// @access  Private/Admin
export const updateQuestion = async (req, res) => {
    try {
        let { text, subject, difficulty, options, correctOption, image, accessibilityText } = req.body;

        const question = await Question.findById(req.params.id);

        if (question) {
            // Auto-generate if image is updated/present and description is missing
            if (image && !accessibilityText) {
                accessibilityText = await generateImageDescription(image);
            }

            question.text = text || question.text;
            question.subject = subject || question.subject;
            question.difficulty = difficulty || question.difficulty;
            question.options = options || question.options;
            question.correctOption = correctOption !== undefined ? correctOption : question.correctOption;
            question.image = image || question.image;
            question.accessibilityText = accessibilityText || question.accessibilityText;

            const updatedQuestion = await question.save();
            res.json(updatedQuestion);
        } else {
            res.status(404).json({ message: "Question not found" });
        }
    } catch (error) {
        res.status(400).json({ message: "Invalid question data", error: error.message });
    }
};
