import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
import { jwtSecret } from '../config/keys.js'

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' })
    }

    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    })

    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '7d' })

    res.status(201).json({
      user,
      token,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error during registration' })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '7d' })

    res.json({
      user,
      token,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error during login' })
  }
}

export const me = (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json(req.user)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' })
  }
}
