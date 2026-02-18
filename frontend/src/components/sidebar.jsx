import { useEffect, useState } from "react"
import { fetchUsers } from "../util/services"
import { useAuth } from '../util/authContext'
import { socket } from "../util/socket"
import { useNavigate } from "react-router-dom"

const Users = ({ token, currentUser, otherUserId, setOtherId, setSidebarOpen }) => {
  const [users, setUsers] = useState([])
  


  useEffect(() => {
    if (!otherUserId || !currentUser?._id) return;

    const roomId = [otherUserId, currentUser._id].sort().join("_");

    console.log("Joining room:", roomId);
    socket.emit("join_room", roomId);

    return () => {
      console.log("Leaving room:", roomId);
      socket.emit("leave_room", roomId);
    };
  }, [otherUserId, currentUser?._id]);


  useEffect(() => {
    if (!token) return
    fetchUsers(token, setUsers)
  }, [token])

  return (
    <div className="usersContainer">
      {users
        .filter((u) => u._id !== currentUser?._id)
        .map((u) => (
          <button
            type="button"
            className={`user ${u._id === otherUserId ? 'user--active' : ''}`}
            key={u._id}
            onClick={() => {
              setOtherId(u._id)
              setSidebarOpen(false); // Add this function to close the sidebar when a user is selected on mobile
            }}
          >
            <span className="userAvatar">{u.username[0]?.toUpperCase()}</span>
            <span className="userName">{u.username}</span>
          </button>
        ))}
    </div>
  )
}

export function Sidebar({ setOtherId, otherUserId, setSidebarOpen }) {
  const { token, user: currentUser, logout } = useAuth()
  const navigate = useNavigate()



  const handleLogout = ()=>{
    logout()
    navigate("/login")
  }

  return (
    <aside className="Sidebar">
      <div className="Sidebar-header">
        <h2>Chats</h2>
        <p>Pick someone to talk to.</p>
      </div>

      <Users
        setOtherId={setOtherId}
        otherUserId={otherUserId}
        token={token}
        currentUser={currentUser}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="profile">
        <div className="profileAvatar">
          {currentUser?.username?.[0]?.toUpperCase()}
        </div>
        <div className="profileInfo">
          <div className="profileName">{currentUser?.username || 'You'}</div>
          <div className="profileStatus">Online</div>
        </div>
        <button className="logout" onClick={handleLogout}>Logout</button>

      </div>
    </aside>
  )
}