require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// IN-MEMORY DATABASE (Hackathon Survival Mode)
// ==========================================
let challenges = [
  {
    _id: "1",
    title: 'Smart Crop Disease Detection',
    department: 'Ministry of Agriculture',
    sector: 'Agriculture',
    description: 'Develop an offline-capable computer vision solution for field officers.',
    budget: '₹50 Lakhs',
    status: 'Active',
    createdAt: new Date()
  }
];

let auditLogs = [
  {
    _id: "1",
    timestamp: new Date().toLocaleTimeString(),
    user: 'System',
    action: 'Database Seeded (Survival Mode)',
    module: 'System',
    refId: 'SEED-001',
    status: 'Success'
  }
];

// --- API ROUTES ---

// Get all challenges
app.get('/api/challenges', (req, res) => {
  res.json(challenges);
});

// Create a new challenge
app.post('/api/challenges', (req, res) => {
  const newChallenge = { 
    ...req.body, 
    _id: Date.now().toString(), 
    createdAt: new Date(),
    status: 'Active'
  };
  challenges.unshift(newChallenge); // Add to top of array
  
  // Log the action automatically
  const newLog = {
    _id: Date.now().toString(),
    timestamp: new Date().toLocaleTimeString(),
    user: 'Department Officer',
    action: 'Challenge Published',
    module: 'Identify',
    refId: `CH-${Date.now().toString().slice(-6)}`,
    status: 'Success'
  };
  auditLogs.unshift(newLog);
  
  res.status(201).json(newChallenge);
});

// Get audit logs
app.get('/api/audit', (req, res) => {
  res.json(auditLogs);
});

// Health check
app.get('/', (req, res) => {
  res.send('✅ INNOVA-PATH API is running in Survival Mode!');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`💾 Using In-Memory Database (No MongoDB connection required)`);
});