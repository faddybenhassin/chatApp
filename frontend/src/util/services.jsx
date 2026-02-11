export async function fetchMessages(token, conversationId, setMessages) {
  if (!token || !conversationId) {
    if (typeof setMessages === 'function') setMessages([])
    return []
  }

  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/message/${conversationId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!res.ok) throw new Error('fetch request failed')

    const messages = await res.json()
    if (typeof setMessages === 'function') setMessages(messages)
    return messages
  } catch (error) {
    console.error(error)
    if (typeof setMessages === 'function') setMessages([])
    return []
  }
}


export async function fetchUsers(token, setUsers){
  if (!token) {
    if (typeof setUsers === 'function') setUsers([])
    return []
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) throw new Error('fetch request failed')

    const users = await res.json()
    // console.log(users)
    if (typeof setUsers === 'function') setUsers(users)
    return users
  } catch (error) {
    console.error(error)
    if (typeof setUsers === 'function') setUsers([])
    return []
  }
}


export async function sendMessage(token, receiver, content){
  if (!token || !receiver || !content.trim()) {
    throw new Error('Missing required fields: token, receiver, and content are all required.');
  }


  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/message/send/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body:JSON.stringify({
        receiver ,
        content,
      })
    })

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }

    return data;
  } catch (error) {
    console.error('sendMessage Error:', error.message);
    throw error;
  }
}