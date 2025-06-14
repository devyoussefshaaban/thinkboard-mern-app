import Note from "../models/noteModel.js";
import * as yup from "yup";

const noteSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  content: yup.string().required("Content is required"),
});

export const createNote = async (req, res) => {
  try {
    await noteSchema.validate(req.body, { abortEarly: false });

    const {
      user,
      body: { title, content },
    } = req;

    const existingNote = await Note.findOne({
      user: user._id,
      title,
    });

    if (existingNote) {
      throw new Error("Note with this title already exists");
    }

    const note = await Note.create({
      user: user._id,
      title,
      content,
    });

    res.status(201).json(note);
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getNotes = async (req, res) => {
  try {
    const { user } = req;
    const notes = await Note.find({ user: user._id }).sort({
      createdAt: -1,
    });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNoteById = async (req, res) => {
  try {
    const { user } = req;
    const note = await Note.findOne({ _id: req.params.id, user: user._id });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateNote = async (req, res) => {
  try {
    await noteSchema.validate(req.body, { abortEarly: false });

    const { user } = req;
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: user._id },
      { title: req.body.title, content: req.body.content },
      { new: true }
    );
    if (!note) {
      return res
        .status(404)
        .json({ message: "Note not found or not authorized" });
    }
    res.json(note);
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { user } = req;
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: user._id,
    });
    if (!note) {
      return res
        .status(404)
        .json({ message: "Note not found or not authorized" });
    }
    res.json({ message: "Note deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
