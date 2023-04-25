import YouTube, {YouTubeProps, YouTubePlayer} from 'react-youtube';
import { useState, useEffect } from 'react'
import playlistInfo from '../shared/playlistInfo';
import PomodoroTimer from './PomodoroTimer';

interface Props {
    pomodoros: playlistInfo;
    breakLength: number;
    onComplete: () => void;
    shufflePlaylists?: boolean;
    shufflePlaylistItems?: boolean;
}

//Steal Fisher-Yates shuffle from Mike Bostock
//Not nice to use type of any - but we won't be shuffling anything else in this project so it's a safe assumption
function shuffle(array: any[]) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

//We will store our YouTube element here
let videoElement: YouTubePlayer = null;

//This component will contain a React player - as well as the associated elements
function ReactPlayerPomodoro({pomodoros, breakLength, onComplete, shufflePlaylists, shufflePlaylistItems}: Props) {

    /*
    //If shuffling videos and playlists - do it now
    if (shufflePlaylists) {
        pomodoros = shuffle(pomodoros);
    }

    if (shufflePlaylistItems) {
        for (var i = 0; i < pomodoros.length; i++) {
            pomodoros[i] = shuffle(pomodoros[i]);
        }
    }
    */
    const [autoplay, setAutoplay] = useState(1);
    const [currentPlaylist, setCurrentPlaylist] = useState(0);
    const [currentVideo, setCurrentVideo] = useState(0);
    const [skipDisabled, setSkipDisabled] = useState(false);
    const [onBreak, setOnBreak] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [complete, setComplete] = useState(false);
    
    const getPlaylistLength = () => {
        return pomodoros[currentPlaylist].map(song => song.duration).reduce((a, b) => {return a + b;});
    }

    //The following effect handles changes to the player
    //If paused - it pauses the player
    useEffect(() => {
        if (videoElement != null) {
            // Pause and Play video
            if (isPaused) {
                videoElement.target.pauseVideo();
            } else {
                videoElement.target.playVideo();
            }
        }
    }, [isPaused, videoElement]);

    //The following effect handles when the playlist updates
    //If the playlist updates - it alters the duration
    useEffect(() => {
        setTimerLength(getTimerLength(getPlaylistLength()))
    }, [currentPlaylist]);

    //On mount add the player
    const onReady = (event: YouTubePlayer) => {
        videoElement = event;
    }
    
    const getTimerLength = (length: number) => {
        const time = new Date();
        time.setSeconds(time.getSeconds() + length);
        return time;
    }
    
    const [timerLength, setTimerLength] = useState(getTimerLength(getPlaylistLength()));

    //This function will handle all the logic when a timer ends
    const nextPeriod = (force_session_end: boolean = false) => {

        //If on break - next period is the next playlist
        if (force_session_end || (currentVideo + 1 == pomodoros[currentPlaylist].length)) {
            if(onBreak) {
                if (currentPlaylist + 1 == pomodoros.length) {
                    setIsPaused(true);
                    setComplete(true);
                    setOnBreak(false);
                }
                else {
                    setOnBreak(false);
                    setAutoplay(1);
                    setCurrentPlaylist((currentPlaylist) => {return currentPlaylist + 1});
                    setCurrentVideo(0);
                    setIsPaused(false);
                }
            } else {
                //If not on break - end the session early
                //Pause the video 
                setOnBreak(true);
                setIsPaused(true);
                setTimerLength(getTimerLength(breakLength));
            }
        }
        else {
            //Otherwise just get the next video
            setCurrentVideo((currentVideo) => currentVideo + 1);
        };
    }

    const setNextVideo: YouTubeProps['onEnd'] = (event) => {nextPeriod()}

    const onPause: YouTubeProps['onPause'] = (event) => {
        //Update our pause state
        setIsPaused(true);

        //Pause timer only if not on break
        if (!onBreak) setIsPaused(true);
    }

    const onPlay: YouTubeProps['onPlay'] = (event) => {
        /*
            Annoying design decision - do I let people play music while on break, if they've ended their session early and still have songs to play?
            If so - what do you do when break ends? Now the timer is asynchronous with the videos.
            Which is the whole point of this application - to make pomodoros out of your playlists.
            We could force the video to end and jump to the next playlist - but this is annoying when listening to music.

            My compromise is to just force all breaks to be silent - and any attempt to run the player notifies the user
        */

        //Resume timer only if not on break
        if (!onBreak) {
            setIsPaused(false);
        }
    }

    const getVideo = () => {
        return pomodoros[currentPlaylist][currentVideo].id;}

    const getRestartLabel = () => {
        if(complete) {
            return "Restart?";
        }
        else return onBreak ? "End break early" : "End session early";
    }

    //Need to set timeout on the button to prevent spamming
    //If you try to change the video element as the element is already changing - it will return null and cause a TypeError
    const endPeriodEarly = () => {
        if(complete) {
            setCurrentPlaylist(0);
            setCurrentVideo(0);
            setComplete(false);
        }
        else {
            setSkipDisabled(true);
            nextPeriod(true);

            setTimeout(() => {
                setSkipDisabled(false);
            }, 500);
        }
    }

    return <>
            <div style = {{display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',}}>
            <YouTube
                videoId={getVideo()}
                onPlay={onPlay}
                onPause={onPause}
                onEnd={setNextVideo}
                onReady={onReady}
                opts = {{playerVars: {
                                        autoplay: autoplay,
                                        controls: 0
                                    }
                        }}

                style={{ pointerEvents: 'none', marginLeft: 'auto', marginRight: 'auto'}}
                />
                </div>
                {<div style={{textAlign: 'center', color: '#AFAFAF'}}>
                    <PomodoroTimer timestamp={timerLength} expiryFunction={nextPeriod}/>
                    <button onClick={endPeriodEarly} disabled = {skipDisabled}>{pomodoros[currentPlaylist] == null ? "Loading..." : getRestartLabel()}</button>
                </div>}
            </>;
}


export default ReactPlayerPomodoro;