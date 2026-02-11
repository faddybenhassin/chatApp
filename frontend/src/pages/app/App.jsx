import './app.css'
import { Messages } from '../../components/messages'
import { Sidebar } from '../../components/sidebar'
import { useState, useEffect } from 'react'
import { useAuth } from '../../util/authContext'
import { useNavigate } from "react-router-dom";
import { sendMessage } from '../../util/services'





function App() {
  const { token, logout } = useAuth()
  const navigate = useNavigate()


  useEffect(() => {
    if (!token) {
      navigate("/login")
    }
  }, [token, navigate])

  const handleLogout = ()=>{
    logout()
    navigate("/login")
  }

  const [ otherUserId, setOtherId] = useState("")
  const [text, setText] = useState("")

  if (!token) {
    return null 
  }


  return (
    <div className="AppContainer">
      <button className='logout' onClick={handleLogout}>logout</button>
      <Sidebar setOtherId={setOtherId}/>
      <Messages otherUserId={otherUserId}/>
      <div className="userInput">
        <input 
          type="text" 
          value={text}
          onChange={(e)=>{
            setText(e.target.value)
          }}
          onKeyDown={async (event) => {
                if (event.key == "Enter") {
                  try {
                    await sendMessage(token, otherUserId, text); 
                    setText("");
                  } catch (error) {
                    console.error("Failed to send message:", error);
                  }
                }
              }}
        />
      </div>
    </div>
  )
}

export default App