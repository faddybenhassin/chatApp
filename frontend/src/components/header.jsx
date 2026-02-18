import { useState, useEffect } from "react";
import { fetchUser } from "../util/services";
import { useAuth } from "../util/authContext";

export function Header({ setSidebarOpen, isSidebarOpen, otherUserId}){
    const {token}= useAuth()
    const [otherUser, setOtherUser] = useState(null);

    useEffect(() => {
        // useEffect callbacks cannot be async, so we define a function inside
        const getUserData = async () => {
            if (otherUserId) {
                try {
                    const data = await fetchUser(token, otherUserId);
                    setOtherUser(data);
                } catch (err) {
                    console.error("Failed to fetch user:", err);
                    setOtherUser(null);
                }
            } else{
                setOtherUser(null);
            }
        };

        getUserData();
    }, [otherUserId, token]);

    return(
<div className="AppHeader">
            <div 
                className="otherUserData" 
                onClick={() => setSidebarOpen(!isSidebarOpen)}
            >
                {otherUser ? (
                    <>
                        <span className="userAvatar">
                            {otherUser.username[0]?.toUpperCase()}
                        </span>
                        <span className="userName">
                            {otherUser.username}
                        </span>
                    </>
                ) : (
                    <>
                        <span className="userAvatar">?</span>
                        <span className="userName">Select a User</span>
                    </>
                )}
            </div>
        </div>
    )
}