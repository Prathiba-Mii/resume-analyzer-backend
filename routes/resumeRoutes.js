const express = require('express')
const router = express.Router()
const multer = require('multer')
const verifyToken = require('../middleware/auth')
const { analyzeResume, getResumes } = require('../controllers/resumeController');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
})


const upload = multer({ storage }) 

router.post('/analyze', verifyToken, upload.single('resume'), analyzeResume)
router.get('/all', verifyToken, getResumes)

module.exports = router
