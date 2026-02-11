import express from 'express'
import { sendMessage, getConversation } from '../controllers/messageController.js'
import { verifyToken } from '../middleware/verify.js'

const router = express.Router()

router.use(verifyToken)

router.post('/send', sendMessage)
router.get('/:otherUserId', getConversation)

export default router