import { useEffect, useState, useRef } from 'react'
import './App.css'
import image from './assets/bg.png'
import Searchbar from './components/Searchbar'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactPlayerPomodoro from './components/ReactPlayerPomodoro';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import pomodoro from './assets/pomodoro.glb';

type playlistInfo = {id: string, duration: number}[][];

function App() {
  const [backendData, setBackendData] = useState(null);
  const [complete, setComplete] = useState(false);

  function getRandomArbitrary(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  useEffect(() => {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('#bg')!,
    });

    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.position.setZ(30);

    //Create space background
    const space_texture = new THREE.TextureLoader().load(image);
    scene.background = space_texture;

    const point_light = new THREE.PointLight(0xffffff);
    point_light.position.set(0,0,25);
    scene.add(point_light);
    
    var tomato = new THREE.Group;
    var tomatoes = [tomato];

    var loader = new GLTFLoader();
    loader.load(
       pomodoro,
       function ( gltf ) {
          tomato = gltf.scene;

          for(var i=0; i<10; i++) {
            var next_pomodoro = tomato.clone();
            next_pomodoro.scale.set(3,3,3);

            next_pomodoro.position.set(
              getRandomArbitrary(-40, 40),
              getRandomArbitrary(-30, 30),
              0);
            scene.add(next_pomodoro);
            tomatoes.push(next_pomodoro);
          }
       },
    );

    function animate() {
      for(var i = 0; i<tomatoes.length; i++) {
        //If even - spin one way, else spin the other
        var evens = i % 2 == 0;

        tomatoes[i].rotateX(evens ? -0.05 : 0.05);
        tomatoes[i].rotateY(evens ? 0.05 : 0.05);
        tomatoes[i].rotateY(evens ? -0.05 : 0.05);
      }
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
  const getData = async (enteredPlaylist: string, shufflePlaylists: boolean, shuffleItems: boolean) => {

    var valid = validateUrlOrNotify(enteredPlaylist);

    if(valid) {
      setBackendData(await fetch(`api/?playlist=${enteredPlaylist}?shufflePlaylists=${shufflePlaylists}?shuffleItems=${shuffleItems}`).then(resp => {
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
                    borderRadius: '1em',
                    minWidth: '40%',
                    padding: '1em',
                    backgroundColor: 'rgba(0,0,0,0.5)'
                }}>
        <Searchbar onSearch={getData} />
        {backendData ? complete ? <h1>Session complete!</h1> : <ReactPlayerPomodoro pomodoros={backendData} breakLength={25}/> : null}
      </div>
      <ToastContainer />
    </>
  )
}

export default App
