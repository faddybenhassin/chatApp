import express from 'express'
import { verifyToken } from '../middleware/verify.js'
import { getUsers, getUser } from '../controllers/usersController.js'
const router = express.Router()

router.use(verifyToken)

router.get('/', getUsers)

router.get('/:userId', getUser)

export default router