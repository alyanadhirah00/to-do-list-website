# To-do-list Website

A simple task management application built with Hono and JSON Server.

## Demo

[Video Demo](https://www.loom.com/share/f42eabbc25874f6baf6caf989021f3cb?sid=667dc496-01eb-40b3-b507-0933ef06cc0c)

## Features

- Create new tasks with title, deadline, and status
- View all tasks in a sorted list
- Update task status (Not Started → In Progress → Completed)
- Delete tasks
- Persistent data storage using JSON Server
- Responsive design

## Technologies Used

- Hono (TypeScript framework)
- JSON Server (Mock REST API)
- HTML/CSS
- JavaScript

## Installation
1. Clone this repository:
git clone https://github.com/alyanadhirah00/to-do-list.git
cd to-do-list
2. Install dependencies:
npm install
3. Start JSON Server:
npm install -g json-server
json-server --watch db.json
4. Start the development server:
npm run dev
5. Open http://localhost:8787 in your browser
