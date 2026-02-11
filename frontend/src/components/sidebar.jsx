import { useEffect, useState } from "react"
import { fetchUsers } from "../util/services"
import { useAuth } from '../util/authContext'

const Users = ({ token, currentUser, selectedUserId, setOtherId }) => {
  const [users, setUsers] = useState([])

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
            className={`user ${u._id === selectedUserId ? 'user--active' : ''}`}
            key={u._id}
            onClick={() => {
              setOtherId(u._id)
            }}
          >
            <span className="userAvatar">{u.username[0]?.toUpperCase()}</span>
            <span className="userName">{u.username}</span>
          </button>
        ))}
    </div>
  )
}

export function Sidebar({ setOtherId, selectedUserId }) {
  const { token, user: currentUser } = useAuth()

  return (
    <aside className="Sidebar">
      <div className="Sidebar-header">
        <h2>Chats</h2>
        <p>Pick someone to talk to.</p>
      </div>

      <Users
        setOtherId={setOtherId}
        selectedUserId={selectedUserId}
        token={token}
        currentUser={currentUser}
      />

      <div className="profile">
        <div className="profileAvatar">
          {currentUser?.username?.[0]?.toUpperCase()}
        </div>
        <div className="profileInfo">
          <div className="profileName">{currentUser?.username || 'You'}</div>
          <div className="profileStatus">Online</div>
        </div>
      </div>
    </aside>
  )
}