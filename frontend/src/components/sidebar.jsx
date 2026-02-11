import { useEffect, useState } from "react"
import { fetchUsers } from "../util/services"
import { useAuth } from '../util/authContext'

const Users = ({token, currentUser, setOtherId})=>{
    const [users, setUsers] = useState([])
    
    useEffect(()=>{
        if (!token) return
        fetchUsers(token, setUsers)
    }, [token])
    
    return(
        <div className="usersContainer">

            {users
            .filter((u)=> u._id !== currentUser?._id)
            .map((u, i)=>(
                <div className="user" 
                key={u._id}
                onClick={()=>{
                    setOtherId(u._id)
                }}
                >
                    {u.username}
                </div>
            ))}
        </div>
    )
    
    
}


export function Sidebar({setOtherId}){
    const { token, user: currentUser} = useAuth()


    return(
        <div className="Sidebar">
            <Users setOtherId={setOtherId} token={token} currentUser={currentUser}/>
            <div className="profile">
                {currentUser?.username}
            </div>
        </div>
    )
}