import './app.css'
import { Messages } from '../../components/messages'
import { Sidebar } from '../../components/sidebar'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../util/authContext'
import { useNavigate } from "react-router-dom";
import { sendMessage, fetchUser } from '../../util/services'
import { socket } from '../../util/socket'




function App() {
  const { token, logout, user } = useAuth()
  const navigate = useNavigate()
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [otherUserId, setOtherId] = useState("")
  const [text, setText] = useState("")


  const otherUserIdRef = useRef(otherUserId);

  useEffect(() => {
    otherUserIdRef.current = otherUserId;
  }, [otherUserId]);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true)
      if (user?._id) socket.emit('join_room', user._id)
    }

    function onDisconnect() {
      setIsConnected(false)
    }

    async function onMessageNotification({ msg }){
      const user = await fetchUser(token, String(msg.sender))
      console.log(otherUserIdRef.current)
      if(user && msg.sender !== otherUserIdRef.current){
        alert(`new message from ${user.username}: ${msg.content}`)
      }
    }

    socket.connect()
    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('new-message-notification', onMessageNotification)
    if (socket.connected && user?._id) socket.emit('join_room', user._id)


    return () => {
      if (user?._id) socket.emit('leave_room', user._id)
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.disconnect()
    }
  }, [user?._id,otherUserId])

  useEffect(() => {
    if (!token) {
      navigate("/login")
    }
  }, [token, navigate])

  const handleLogout = ()=>{
    logout()
    navigate("/login")
  }


  const handleSend = async () => {
    const trimmed = text.trim()
    if (!trimmed || !otherUserId) return

    try {
      await sendMessage(token, otherUserId, trimmed)
      setText("")
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  if (!token) {
    return null 
  }


  return (
    <div className="AppWrapper">
      <header className="AppHeader">
        <div className="AppTitle">
          <span className="AppTitle-main">ChatApp</span>
          <span className="AppTitle-sub">Simple real‑time messaging</span>
        </div>
        <div className="AppHeader-right">
          {user?.username && (
            <span className="AppHeader-user">Signed in as <strong>{user.username}</strong></span>
          )}
          <button className="logout" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="AppContainer">
        <Sidebar otherUserId={otherUserId} setOtherId={setOtherId} />

        <div className="ChatArea">
          <Messages otherUserId={otherUserId} />

          <div className="userInput">
            <input
              type="text"
              value={text}
              placeholder={otherUserId ? "Type a message…" : "Select a user to start chatting"}
              disabled={!otherUserId}
              onChange={(e) => {
                setText(e.target.value)
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault()
                  handleSend()
                }
              }}
            />
            <button
              className="sendBtn"
              onClick={handleSend}
              disabled={!otherUserId || !text.trim()}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App