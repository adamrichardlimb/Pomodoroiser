import { useEffect, useState } from 'react'
import './App.css'
import Searchbar from './components/Searchbar'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactPlayerPomodoro from './components/ReactPlayerPomodoro';
import * as THREE from 'three';

type playlistInfo = {id: string, duration: number}[][];

function App() {
  const [backendData, setBackendData] = useState(null);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('#bg')!,
    });

    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.position.setZ(30);

    const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
    const material = new THREE.MeshBasicMaterial({color: 0xFF6347, wireframe: true});
    const torus = new THREE.Mesh(geometry, material);

    scene.add(torus);

    //renderer.render(scene, camera);

    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }

    animate();
  })

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
      }))
      setComplete(false);
    }
  }

  return (<>
      <canvas id="bg"></canvas>
      <div id="pomodoro" style={{
                    position: 'absolute', left: '50%', top: '50%',
                    transform: 'translate(-50%, -50%)',
                    borderRadius: '5%',
                    padding: '1em',
                    backgroundColor: 'darkgrey'
                }}>
        <Searchbar onSearch={getData} />

        {backendData ? complete ? <h1>Session complete!</h1> : <ReactPlayerPomodoro pomodoros={backendData} breakLength={25} onComplete={() => setComplete(true)}/> : null}
      </div>
      <ToastContainer />
    </>
  )
}

export default App
