import express from 'express';
import protectRoute from '../middleware/protectRoute.js';
import { getMessages, getUsersForSideBar } from '../controllers/message.controller.js';
const router = express.Router();


router.get("/users", protectRoute, getUsersForSideBar);

router.get("/messages/:id", protectRoute, getMessages);

router.post("/send/:id", protectRoute, getMessages);

export default router;