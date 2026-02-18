import './app.css'
import { Messages } from '../../components/messages'
import { Sidebar } from '../../components/sidebar'
import { Header } from '../../components/header'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../util/authContext'
import { useNavigate } from "react-router-dom";
import { sendMessage, fetchUser } from '../../util/services'
import { socket } from '../../util/socket'
import { Toaster, toast } from 'sonner';



function App() {
  const { token, logout, user } = useAuth()
  const navigate = useNavigate()
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [otherUserId, setOtherId] = useState("")
  const [text, setText] = useState("")
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  
  
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

    async function onMessageNotification({ msg }) {
      const senderUser = await fetchUser(token, String(msg.sender));
      
      if (senderUser && msg.sender !== otherUserIdRef.current) {
        toast.message(`New message from ${senderUser.username}`, {
          description: msg.content,
          // Add this unique class
          className: 'chat-notification-toast', 
          action: {
            label: 'View',
            onClick: () => {
              setOtherId(msg.sender);
              setSidebarOpen(false);
            },
          },
        });
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
    socket.off('new-message-notification', onMessageNotification);
    socket.disconnect()
  }
}, [user?._id,otherUserId])

useEffect(() => {
  if (!token) {
    navigate("/login")
  }
}, [token, navigate])




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
      <Toaster position="top-right" richColors theme="dark" />
      <Header isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} otherUserId={otherUserId}/>
      <div className={`AppContainer ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        {isSidebarOpen && <div className="SidebarOverlay" onClick={() => setSidebarOpen(false)} />}
        <Sidebar otherUserId={otherUserId} setOtherId={setOtherId} setSidebarOpen={setSidebarOpen} />

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