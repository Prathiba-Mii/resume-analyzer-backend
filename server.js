const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config()

const app = express()

app.use(cors({
  origin: ['https://resume-analyzer-frontend-gamma.vercel.app', 'http://localhost:5173'],
  credentials: true
}))
app.use(express.json())

const authRoutes = require('./routes/authRoutes')
app.use('/api/auth', authRoutes)

const resumeRoutes = require('./routes/resumeRoutes')
app.use('/api/resume', resumeRoutes)

mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS:5000,
    family:4
})
    .then(() => console.log('MongoDB Connected!'))
    .catch((err) => console.log("DB Error:", err))

app.get('/', (req,res) => {
    res.send('Resume Analyzer Backend Running!')
})

const PORT = process.env.PORT || 5000

app.listen(PORT , () => {
    console.log(`Server running on port ${PORT}`)
})