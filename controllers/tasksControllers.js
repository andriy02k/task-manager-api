import Tasks from "../models/tasks.js";
import { createTaskSchema, updateTaskSchema } from "../schemas/tasksSchema.js";
import HttpError from "../helpers/HttpError.js";

export const getAllTasks = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort = "title", order = "asc" } = req.query;

    const skip = (page - 1) * limit;
    const sortOrder = order === "asc" ? 1 : -1;

    const totalTasks = await Tasks.countDocuments({ owner: req.user.id });

    const tasksList = await Tasks.find({ owner: req.user.id })
      .skip(skip)
      .limit(Number(limit))
      .sort({ [sort]: sortOrder });

    res.json({
      tasks: tasksList,
      totalTasks,
      totalPages: Math.ceil(totalTasks / limit),
      currentPage: page,
      perPage: limit,
    });
  } catch (error) {
    next(error);
  }
};

export const getOneTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tasks = await Tasks.findOne({ _id: id, owner: req.user.id });

    if (tasks === null) {
      next(HttpError(404));
      return;
    }

    if (tasks.owner.toString() !== req.user.id) {
      next(HttpError(404));
      return;
    }

    res.status(200).send(tasks);
  } catch (error) {
    next(error).json({ message: "Server error" });
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Tasks.findOneAndDelete({
      _id: id,
      owner: req.user.id,
    });

    if (task === null) {
      next(HttpError(404));
      return;
    }

    res.status(200).send(task);
  } catch (error) {
    next(error).json({ message: "Server error" });
  }
};

export const createTask = async (req, res, next) => {
  try {
    const newTask = {
      title: req.body.title,
      body: req.body.body,
      owner: req.user.id,
    };
    const { error } = createTaskSchema.validate(newTask);

    if (typeof error !== "undefined") {
      next(HttpError(400, error.message));
    }
    const result = await Tasks.create(newTask);

    res.status(201).send(result);
  } catch (error) {
    next(error).json({ message: "Server error" });
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedTask = {
      title: req.body.title,
      body: req.body.body,
    };

    if (!updatedTask.title && !updatedTask.body) {
      next(HttpError(400, "Body must have at least one field"));
    }

    const { error } = updateTaskSchema.validate(updatedTask);
    if (typeof error !== "undefined") {
      next(HttpError(400, error.message));
    }

    const result = await Tasks.findOneAndUpdate(
      { _id: id, owner: req.user.id },
      updatedTask,
      { new: true }
    );

    if (result === null) {
      next(HttpError(404));
    }

    res.status(200).send(result);
  } catch (error) {
    next(error).json({ message: "Server error" });
  }
};
