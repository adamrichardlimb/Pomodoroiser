import { useState } from 'react'
import './App.css'
import Searchbar from './components/Searchbar'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [backendData, setBackendData] = useState({users: []});
  const [playing, setPlaying] = useState(false);

  //Pass in entered playlist - do basic validation and send to API
  const getData = (enteredPlaylist: string) => {
    var valid_youtube_url_re = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com)/;
    var valid_youtube = enteredPlaylist.match(valid_youtube_url_re);

    if(!valid_youtube) {
      //Create alert if not a YT link
      toast("Not a valid YouTube URL!");
      return;
    }

    fetch(`api/?playlist=${enteredPlaylist}`).then(
      response => response.json()
    ).then(
      data => setBackendData(data)
    )
  }

  return (

    <>

    <Searchbar onSearch={getData} />

    <div>

      {(backendData.users.length == 0) ? <p>Loading</p> : backendData.users.map((user, i) => (<p key={i}>{user}</p>))}

    </div>


    <ToastContainer />
    </>
  )
}

export default App
