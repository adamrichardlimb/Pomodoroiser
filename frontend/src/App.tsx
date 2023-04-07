import { useState } from 'react'
import './App.css'
import Searchbar from './components/Searchbar'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactPlayerPomodoro from './components/ReactPlayerPomodoro';

type playlistInfo = {id: string, duration: number}[][];

function App() {
  const [backendData, setBackendData] = useState(null);
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
  const getData = async (enteredPlaylist: string) => {

    var valid = validateUrlOrNotify(enteredPlaylist);

    if(valid) {
      setBackendData(await fetch(`api/?playlist=${enteredPlaylist}`).then(resp => {
        if (resp.ok) {
          return resp.json();
        } else {
          toast(resp.statusText)
          return;
        }
      }));
    }
  }

  return (

    <>

    <Searchbar onSearch={getData} />

    {backendData ? <ReactPlayerPomodoro pomodoros={backendData} breakLength={25}/> : null}

    <ToastContainer />
    </>
  )
}

export default App
