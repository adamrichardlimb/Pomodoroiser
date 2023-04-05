import { useState } from 'react'
import './App.css'
import Searchbar from './components/Searchbar'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [backendData, setBackendData] = useState({users: []});
  const [playing, setPlaying] = useState(false);

  const validateUrlOrNotify = (url: string) => {
    var valid_youtube_url_re = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com)/;
    var valid_youtube = url.match(valid_youtube_url_re);

    const urlParams = new URLSearchParams(url);
    //URLSearchParams seems to ignore list when url is yt.com/playlist?list=
    //Maybe there's a workaround but this suits - just makes playlist ID extraction a bit harder later
    var url_has_playlist_param = urlParams.get("list") || url.includes("?list=");

    if(!valid_youtube) {
      //Create alert if not a YT link
      toast("Not a valid YouTube URL!");
      return false;
    }

    if(!url_has_playlist_param) {
      //Create alert if not a YT link
      toast("Not a valid YouTube playlist!");
      return false;
    }

    return true;
  }

  //Pass in entered playlist - do basic validation and send to API
  const getData = (enteredPlaylist: string) => {

    var valid = validateUrlOrNotify(enteredPlaylist);

    if(valid) {
      fetch(`api/?playlist=${enteredPlaylist}`).then(
        response => response.json()
      ).then(
        data => setBackendData(data)
      )
    }
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
