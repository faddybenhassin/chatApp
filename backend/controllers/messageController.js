import Message from '../models/message.model.js'
import mongoose from 'mongoose'

export const sendMessage = async (req, res) => {
  try {
    const { receiver, content } = req.body
    const sender = req.user.id

    if (!receiver || !content) {
      return res.status(400).json({ message: 'Receiver and content are required' })
    }

    if (!mongoose.Types.ObjectId.isValid(receiver)) {
      return res.status(400).json({ message: 'Invalid receiver ID' })
    }

    const newMessage = await Message.create({
      sender,
      receiver,
      content,
    })

    res.status(201).json(newMessage)
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message })
  }
}

export const getConversation = async (req, res) => {
  try {
    const myId = req.user.id
    const { otherUserId } = req.params

    if (!mongoose.Types.ObjectId.isValid(otherUserId)) {
      return res.status(400).json({ message: 'Invalid user ID' })
    }

    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: otherUserId },
        { sender: otherUserId, receiver: myId },
      ],
    }).sort({ createdAt: 1 })

    res.status(200).json(messages)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history', error: error.message })
  }
}
