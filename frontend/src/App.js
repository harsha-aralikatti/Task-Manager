import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaPlus } from "react-icons/fa";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(""); // <-- Changed initial state from "Low" to ""
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const addTask = async (e) => {
    e.preventDefault(); // Prevent form submit reload
    if (!title.trim() || !description.trim()) {
      alert("Please enter title and description");
      return;
    }

    try {
      await axios.post("http://localhost:5000/tasks", {
        title,
        description,
        completed: false,
        priority: priority || "Low", // fallback to Low if nothing selected
        dueDate,
      });
      setTitle("");
      setDescription("");
      setPriority(""); // Reset priority to empty for placeholder
      setDueDate("");
      fetchTasks();
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const toggleComplete = async (task) => {
    try {
      await axios.put(`http://localhost:5000/tasks/${task.id}`, {
        ...task,
        completed: !task.completed,
      });
      fetchTasks();
    } catch (err) {
      console.error("Error toggling task:", err);
    }
  };

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "completed") return task.completed;
      if (filter === "pending") return !task.completed;
      return true;
    })
    .filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div
      className="container py-4"
      style={{
        maxWidth: "700px",
        background: "#f9f9f9",
        borderRadius: "10px",
        padding: "20px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2 className="mb-4 text-center" style={{ color: "#4a90e2" }}>
        Task Manager
      </h2>

      {/* Add Task Form */}
      <form onSubmit={addTask} className="mb-3">
        <input
          className="form-control mb-2"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="form-control mb-2"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="d-flex gap-2 mb-2">
          <select
            className="form-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="" disabled>
              Priority
            </option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <input
            type="date"
            className="form-control"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <button className="btn btn-primary w-100" type="submit">
          <FaPlus /> Add Task
        </button>
      </form>

      {/* Filter & Search */}
      <div className="d-flex justify-content-between mb-3">
        <div>
          <button
            className={`btn btn-sm ${
              filter === "all" ? "btn-primary" : "btn-outline-primary"
            } me-1`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`btn btn-sm ${
              filter === "pending" ? "btn-primary" : "btn-outline-primary"
            } me-1`}
            onClick={() => setFilter("pending")}
          >
            Pending
          </button>
          <button
            className={`btn btn-sm ${
              filter === "completed" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
        </div>

        <input
          type="text"
          placeholder="Search tasks..."
          className="form-control form-control-sm"
          style={{ maxWidth: "200px" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Task List */}
      <ul className="list-group">
        {filteredTasks.length === 0 && (
          <li className="list-group-item text-center text-muted">
            No tasks found
          </li>
        )}
        {filteredTasks.map((task) => (
          <li
            key={task.id}
            className="list-group-item d-flex justify-content-between align-items-center"
            style={{
              textDecoration: task.completed ? "line-through" : "none",
              backgroundColor:
                task.priority === "High"
                  ? "#ffcccc"
                  : task.priority === "Medium"
                  ? "#fff4cc"
                  : "white",
              transition: "background-color 0.3s ease",
            }}
          >
            <div>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task)}
                className="form-check-input me-2"
              />
              <strong>{task.title}</strong>{" "}
              <small className="text-muted">({task.priority} Priority)</small>
              <br />
              <small>{task.description}</small>
              <br />
              <small>
                Due:{" "}
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : "No date set"}
              </small>
            </div>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => deleteTask(task.id)}
              title="Delete task"
            >
              <FaTrash />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
