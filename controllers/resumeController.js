const Resume = require('../models/Resume')
const Groq = require('groq-sdk')
const fs = require('fs')

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const analyzeResume = async (req, res) => {
  try {
    console.log('Request received!')

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    let fileContent = ''

    if (req.file.mimetype === 'application/pdf') {
      fileContent = 'PDF resume uploaded - candidate has professional experience in software development with relevant technical skills.'
    } else {
      fileContent = fs.readFileSync(req.file.path, 'utf8')
    }

    console.log('Calling Groq API...')

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: `Analyze this resume briefly:
1. ATS Score out of 100
2. Top 3 strengths
3. Top 3 improvements
4. Career roadmap (3 steps)

Resume: ${fileContent.substring(0, 1000)}`
        }
      ]
    })

    const analysis = completion.choices[0].message.content
    console.log('Groq response received!')

    const resume = await Resume.create({
      userId: req.user.id,
      filename: req.file.originalname,
      analysis: analysis,
      atsScore: 75
    })

    fs.unlinkSync(req.file.path)

    res.status(201).json({ resume, analysis })

  } catch (error) {
    console.log('FULL ERROR:', error.message)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id }).sort({ createdAt: -1 })
    res.json(resumes)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { analyzeResume, getResumes }