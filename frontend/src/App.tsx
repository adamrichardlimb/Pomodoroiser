import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [backendData, setBackendData] = useState({users: []})

  useEffect(() => {
    fetch('/api').then(
      response => response.json()
    ).then(
      data => setBackendData(data)
    )
  }, [])

  return (
    <div>

      {(backendData.users.length == 0) ? <p>Loading</p> : backendData.users.map((user, i) => (<p key={i}>{user}</p>))}

    </div>
  )
}

export default App
