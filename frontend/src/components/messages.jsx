import { fetchMessages } from '../util/services'
import { useState, useEffect } from 'react'
import { useAuth } from '../util/authContext'

function Message({ name, text, isOwn }) {
  return (
    <div className="messageContainer">
      <span className={isOwn ? 'you' : 'other'}>{name}</span>: <span className="messageText">{text}</span>
    </div>
  )
}

export function Messages({ otherUserId }) {
  const { token, user } = useAuth()
  const [messages, setMessages] = useState([])

  useEffect(() => {
    if (!token) return
    fetchMessages(token, otherUserId, setMessages)
  }, [token, otherUserId])

  return (
    <div className="messagesContainer">
      {messages.map((msg) => (
        <Message
          key={msg._id}
          name={msg.sender === user._id ? 'You' : 'Stranger'}
          text={msg.content}
          isOwn={msg.sender === user._id}
        />
      ))}
    </div>
  )
}