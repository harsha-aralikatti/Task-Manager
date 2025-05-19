from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)


tasks = [
    {
        "id": 1,
        "title": "Sample Task",
        "description": "This is a sample task",
        "completed": False,
        "priority": "Low",
        "dueDate": ""
    }
]

@app.route("/tasks", methods=["GET"])
def get_tasks():
    return jsonify(tasks)

@app.route("/tasks", methods=["POST"])
def add_task():
    new_task = request.get_json()
    new_task["id"] = len(tasks) + 1

    # Set default priority and dueDate if not provided
    if "priority" not in new_task:
        new_task["priority"] = "Low"
    if "dueDate" not in new_task:
        new_task["dueDate"] = ""

    tasks.append(new_task)
    return jsonify(new_task), 201

@app.route("/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    updated_task = request.get_json()
    for task in tasks:
        if task["id"] == task_id:
            # Update all fields including new ones
            task.update(updated_task)
            return jsonify(task)
    return jsonify({"error": "Task not found"}), 404

@app.route("/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    global tasks
    tasks = [task for task in tasks if task["id"] != task_id]
    return jsonify({"result": True})

@app.after_request
def after_request(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
    return response


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

