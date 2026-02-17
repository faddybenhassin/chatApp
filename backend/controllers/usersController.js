import User from '../models/user.model.js'
import mongoose from 'mongoose'



export async function getUsers(req, res){
    try {
        const users = await User.find({})
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message })
    }
}

export async function getUser(req, res){
    try {
        const { userId } = req.params
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error: error.message })
    }
}