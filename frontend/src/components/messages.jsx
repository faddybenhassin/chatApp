import { fetchMessages } from '../util/services'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../util/authContext'
import { socket } from '../util/socket'


function Message({ name, text, isOwn }) {
  return (
    <div className={`messageRow ${isOwn ? 'own' : 'other'}`}>
      <div className="messageBubble">
        {/* <div className="messageMeta">{name}</div> */}
        <div className="messageText">{text}</div>
      </div>
    </div>
  )
}

export function Messages({ otherUserId }) {
  const { token, user } = useAuth()
  const [messages, setMessages] = useState([])
  const scrollRef = useRef(null)

  const scrollToNewest = () => {
    scrollRef.current?.scrollTo({ 
      top: 0,
      behavior: "smooth"
    })
  }

  // 3. Scroll whenever the messages array changes
  useEffect(() => {
    scrollToNewest()
  }, [messages])

  useEffect(() => {
    function onNewMessage({ msg }) {
      if (!msg || !user?._id || !otherUserId) return
      const forThisConversation =
        (msg.sender === user._id && msg.receiver === otherUserId) ||
        (msg.receiver === user._id && msg.sender === otherUserId)
      if (forThisConversation) {
        setMessages((prev) => [...prev, msg])
      }
    }
    socket.on('new-message', onNewMessage)
    return () => {
      socket.off('new-message', onNewMessage)
    }
  }, [otherUserId, user?._id])




  useEffect(() => {
    if (!token) return
    fetchMessages(token, otherUserId, setMessages)
  }, [token, otherUserId])

  if (!otherUserId) {
    return (
      <div className="messagesContainer messagesEmpty">
        <p>Select a user on the left to start a conversation.</p>
      </div>
    )
  }

  return (
    <div 
      className="messagesContainer"
      ref={scrollRef}
      >
      {messages.length === 0 ? (
        <div className="messagesEmpty">
          <p>No messages yet. Say hi!</p>
        </div>
      ) : (
        [...messages].reverse().map((msg) => (
          <Message
            key={msg._id}
            name={msg.sender === user._id ? 'You' : 'Stranger'}
            text={msg.content}
            isOwn={msg.sender === user._id}
          />
        ))
      )}
    </div>
  )
}