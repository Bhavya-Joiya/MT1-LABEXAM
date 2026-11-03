import http from "http";
import fs from "fs";
import path from "path";

// Array to store employee tasks
let tasks = [
  {
    id: 1,
    taskName: "Develop Login Page",
    assignedTo: "Rahul Sharma",
    status: "Pending",
  },
  {
    id: 2,
    taskName: "Design Dashboard",
    assignedTo: "Amit Kumar",
    status: "Completed",
  },
  {
    id: 3,
    taskName: "Test Application",
    assignedTo: "Priya Singh",
    status: "In Progress",
  },
];

// Create HTTP server
const server = http.createServer((req, res) => {
  // A1 and A2: Welcome route
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>Welcome to Employee Task Management System</h1>");
  }

  // A2 and A3: Display all tasks
  else if (req.method === "GET" && req.url === "/tasks") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(tasks));
  }

  // A2: About route
  else if (req.method === "GET" && req.url === "/about") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(
      "<h2>Employee Task Management Application</h2><p>Manage and track employee tasks easily.</p>",
    );
  }

  // A4: Serve HTML file using FS module
  else if (req.method === "GET" && req.url === "/home") {
    const filePath = path.join(process.cwd(), "public", "index.html");

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Error reading HTML file");
        return;
      }

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  }

  // A3: Add a new task using POST
  else if (req.method === "POST" && req.url === "/add-task") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const newTask = JSON.parse(body);

        if (
          newTask.id === undefined ||
          !newTask.taskName ||
          !newTask.assignedTo ||
          !newTask.status
        ) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ message: "All required fields are necessary" }),
          );
          return;
        }

        if (tasks.some((task) => task.id === newTask.id)) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Task ID already exists" }));
          return;
        }

        tasks.push(newTask);

        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Task added successfully",
            task: newTask,
          }),
        );
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Invalid JSON data" }));
      }
    });
  }

  // A5: Invalid route
  else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 - Page Not Found");
  }
});

// Start server on port 3000
server.listen(3000, () => {
  console.log("HTTP Server running at http://localhost:3000");
});
