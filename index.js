const fs = require('fs').promises;
const path = require('path');

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