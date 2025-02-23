import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>TO DO LIST</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: 'Arial', sans-serif;
            }

            body {
                background-color: #f5f5f5;
                padding: 20px;
            }

            .container {
                max-width: 1000px;
                margin: 0 auto;
                background-color: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }

            h1 {
                color: #333;
                text-align: center;
                margin-bottom: 30px;
            }

            .task-form {
                display: grid;
                grid-template-columns: 2fr 1fr 1fr auto;
                gap: 10px;
                margin-bottom: 30px;
            }

            input, select, button {
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 5px;
                font-size: 16px;
            }

            button {
                background-color: #4CAF50;
                color: white;
                border: none;
                cursor: pointer;
                transition: background-color 0.3s;
            }

            button:hover {
                background-color: #45a049;
            }

            .task-list {
                display: grid;
                gap: 15px;
            }

            .task-item {
                padding: 15px;
                border-radius: 5px;
                display: grid;
                grid-template-columns: 2fr 1fr 1fr auto auto;
                gap: 10px;
                align-items: center;
            }

            .not_started {
                background-color: #ffebee;
                border-left: 5px solid #f44336;
            }

            .in_progress {
                background-color: #fff3e0;
                border-left: 5px solid #ff9800;
            }

            .completed {
                background-color: #e8f5e9;
                border-left: 5px solid #4CAF50;
            }

            .delete-btn {
                background-color: #f44336;
            }

            .delete-btn:hover {
                background-color: #da190b;
            }

            .status-btn {
                background-color: #2196F3;
            }

            .status-btn:hover {
                background-color: #1976D2;
            }

            @media (max-width: 768px) {
                .task-form, .task-item {
                    grid-template-columns: 1fr;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Task Manager</h1>
            
            <form id="taskForm" class="task-form">
                <input type="text" id="taskTitle" placeholder="Enter task title" required>
                <input type="datetime-local" id="taskDeadline" required>
                <select id="taskStatus">
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
                <button type="submit">Add Task</button>
            </form>

            <div id="taskList" class="task-list"></div>
        </div>

        <script>
            async function loadTasks() {
                try {
                    const response = await fetch('http://localhost:3000/tasks');
                    const tasks = await response.json();
                    
                    const taskList = document.getElementById('taskList');
                    taskList.innerHTML = '';
                    
                    tasks.forEach(task => {
                        const taskElement = document.createElement('div');
                        taskElement.className = \`task-item \${task.status}\`;
                        
                        taskElement.innerHTML = \`
                            <div>\${task.title}</div>
                            <div>\${new Date(task.deadline).toLocaleString()}</div>
                            <div>\${task.status.replace('_', ' ')}</div>
                            <button class="status-btn" data-id="\${task.id}">Change Status</button>
                            <button class="delete-btn" data-id="\${task.id}">Delete</button>
                        \`;

                        // Add event listeners to buttons
                        const statusBtn = taskElement.querySelector('.status-btn');
                        const deleteBtn = taskElement.querySelector('.delete-btn');

                        statusBtn.addEventListener('click', () => updateStatus(task.id));
                        deleteBtn.addEventListener('click', () => deleteTask(task.id));
                        
                        taskList.appendChild(taskElement);
                    });
                } catch (error) {
                    console.error('Error:', error);
                }
            }

            async function deleteTask(id) {
                try {
                    const response = await fetch(\`http://localhost:3000/tasks/\${id}\`, {
                        method: 'DELETE'
                    });
                    if (response.ok) {
                        loadTasks();
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }

            async function updateStatus(id) {
                try {
                    const response = await fetch(\`http://localhost:3000/tasks/\${id}\`);
                    const task = await response.json();
                    
                    const statuses = ['not_started', 'in_progress', 'completed'];
                    const currentIndex = statuses.indexOf(task.status);
                    task.status = statuses[(currentIndex + 1) % 3];

                    await fetch(\`http://localhost:3000/tasks/\${id}\`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(task)
                    });
                    
                    loadTasks();
                } catch (error) {
                    console.error('Error:', error);
                }
            }

            // Form submission
            document.getElementById('taskForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const task = {
                    id: Date.now().toString(),
                    title: document.getElementById('taskTitle').value,
                    deadline: document.getElementById('taskDeadline').value,
                    status: document.getElementById('taskStatus').value,
                    createdAt: new Date().toISOString()
                };

                try {
                    await fetch('http://localhost:3000/tasks', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(task)
                    });
                    
                    loadTasks();
                    e.target.reset();
                } catch (error) {
                    console.error('Error:', error);
                }
            });

            // Initial load
            loadTasks();
        </script>
    </body>
    </html>
  `)
})

export default app