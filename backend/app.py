from flask import Flask, request, jsonify
from flask_cors import CORS
import uuid

app = Flask(__name__)
CORS(app)

tasks = []

@app.route('/tasks', methods=['GET'])
def get_tasks():
    return jsonify(tasks)

@app.route('/tasks', methods=['POST'])
def add_task():
    data = request.json
    task = {
        "id": str(uuid.uuid4()),
        "title": data.get("title"),
        "status": data.get("status", "todo")
    }
    tasks.append(task)
    return jsonify(task)

@app.route('/tasks/<task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.json
    for task in tasks:
        if task["id"] == task_id:
            task["status"] = data.get("status")
            return jsonify(task)
    return jsonify({"error": "Task not found"}), 404

@app.route('/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    global tasks
    tasks = [task for task in tasks if task["id"] != task_id]
    return jsonify({"message": "Deleted"})

if __name__ == '__main__':
    app.run(debug=True)