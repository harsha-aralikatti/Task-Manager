import React from "react";
import { FaTrash } from "react-icons/fa";

function TaskList({ tasks, deleteTask }) {
  if (tasks.length === 0) {
    return <p>No tasks found. Add one!</p>;
  }

  return (
    <ul className="list-group">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          <div>
            <strong>{task.title}</strong> — {task.description}
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
  );
}

export default TaskList;
