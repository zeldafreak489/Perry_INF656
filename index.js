// Author: Iris Perry
// Date: 2025-09-15
// Assignment 2 - Task Manager
// Description: A simple task manager application that allows users to add, list, and complete tasks. Uses node.js and the fs module to read/write tasks to a JSON file. Uese readline for command-line interaction.

const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

// Gets all tasks from tasks.json
async function getAllTasks() {
    const dataPath = path.join(__dirname, 'tasks.json');
    try {
        const data = await fs.readFile(dataPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading tasks:', error.message);
        return [];
    }
}

// Lists all tasks with their title and completion status
async function listTasks() {
    const tasks = await getAllTasks();
    if (tasks.length === 0) {
        console.log('No tasks found.');
        return;
    }
    console.log('Tasks:');
    tasks.forEach((task, index) => {
        console.log(`${index + 1}. [${task.completed ? 'Completed' : 'Not Completed'}] ${task.title}`);
    });
}

// Adds tasks to the list
async function addTask(title, description) {
    const tasks = await getAllTasks();
    const newTask = { title, description, completed: false };
    tasks.push(newTask);
    await saveTasks(tasks);
    console.log(`Task "${title}" added.`);
}

// Saves tasks to tasks.json
async function saveTasks(tasks) {
    const dataPath = path.join(__dirname, 'tasks.json');
    try {
        await fs.writeFile(dataPath, JSON.stringify(tasks, null, 2));
    } catch (error) {
        console.error('Error saving tasks:', error.message);
    }
}

// Marks task as completed by title
async function completeTask(title) {
    const tasks = await getAllTasks();
    const task = tasks.find(t => t.title === title);
    if (task) {
        task.completed = true;
        await saveTasks(tasks);
        console.log(`Task "${title}" marked as completed.`);
    } else {
        console.log(`Task "${title}" not found.`);
    }
}

// Command-line interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function showMenu() {
    console.log('\nTask Manager');
    console.log('1. List all tasks');
    console.log('2. Add a new task');
    console.log('3. Mark a task as completed');
    console.log('4. Exit');
    rl.question('Choose an option: ', async (answer) => {
        switch (answer.trim()) {
            case '1':
                await listTasks();
                showMenu();
                break;
            case '2':
                rl.question('Enter task title: ', (title) => {
                    rl.question('Enter task description: ', async (description) => {
                        await addTask(title, description);
                        showMenu();
                    });
                });
                break;
            case '3':
                rl.question('Enter task title to mark as completed: ', async (title) => {
                    await completeTask(title);
                    showMenu();
                });
                break;
            case '4':
                rl.close();
                break;
            default:
                console.log('Invalid option. Please try again.');
                showMenu();
                break;
        }
    });
}

showMenu();