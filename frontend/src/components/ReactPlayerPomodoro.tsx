import YouTube, {YouTubeProps, YouTubePlayer} from 'react-youtube';
import { useState, useEffect, useRef } from 'react'
import playlistInfo from '../shared/playlistInfo';
import { useTimer } from 'react-timer-hook';
import { ToastContainer, toast } from 'react-toastify';

interface Props {
    pomodoros: playlistInfo;
    breakLength: number;
    shufflePlaylists?: boolean;
    shufflePlaylistItems?: boolean;
}

//We will store our YouTube element here
let videoElement: YouTubePlayer = null;

//This component will contain a React player - as well as the associated elements
function ReactPlayerPomodoro({pomodoros, breakLength}: Props) {

    const [autoplay, setAutoplay] = useState(1);
    const [currentPlaylist, setCurrentPlaylist] = useState(0);
    const [currentVideo, setCurrentVideo] = useState(0);
    const [onBreak, setOnBreak] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const togglePause = () => {
        setIsPaused(!isPaused);
    };
    
    const getPlaylistLength = () => {
        return pomodoros[currentPlaylist].map(song => song.duration).reduce((a, b) => {return a + b;});
    }

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


    //On mount add the player
    const onReady = (event: YouTubePlayer) => {
        videoElement = event;
    }
    
    const getTimerLength = (length: number) => {
        const time = new Date();
        time.setSeconds(time.getSeconds() + length);
        return time;
    }

    //This function will handle all the logic when a timer ends
    const nextPeriod = (force_session_end: boolean = false) => {
        //If on break - next period is the next playlist
        if (force_session_end || (currentVideo + 1 == pomodoros[currentPlaylist].length)) {
            if(onBreak) {
                setOnBreak(false);
                setAutoplay(1);
                //If at the end - reset. Else continue
                setCurrentPlaylist(currentPlaylist + 1 == pomodoros.length ? 0 : currentPlaylist + 1);
                setCurrentVideo(0);
                setIsPaused(false);
                restart(getTimerLength(getPlaylistLength()));
            } else {
                //If not on break - end the session early
                //Pause the video 
                setOnBreak(true);
                setIsPaused(true);
                restart(getTimerLength(breakLength));
            }
        }
        else {
            //Otherwise just get the next video
            setCurrentVideo(currentVideo + 1);
        };
    }
    
    const {
        seconds,
        minutes,
        hours,
        days,
        isRunning,
        start,
        pause,
        resume,
        restart,
    } = useTimer({expiryTimestamp: getTimerLength(getPlaylistLength()), onExpire: () => nextPeriod(true) });
    

    const setNextVideo: YouTubeProps['onEnd'] = (event) => {nextPeriod()}

    const onPause: YouTubeProps['onPause'] = (event) => {
        //Update our pause state
        setIsPaused(true);

        //Pause timer only if not on break
        if (!onBreak) pause();
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
            resume();
        }
        else toast("Player interaction disabled while on break!");
    }

    const getVideo = () => {
        return pomodoros[currentPlaylist][currentVideo].id;}

    const getRestartLabel = () => {
        return onBreak ? "End break early" : "End session early";
    }

    return <>
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

                style={{ pointerEvents: 'none' }}
                />
                {<div style={{textAlign: 'center'}}>
                    <div>
                    <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
                    </div>
                    <button onClick={() => nextPeriod(true)}>{pomodoros[currentPlaylist] == null ? "Complete!" : getRestartLabel()}</button>
                </div>}

            <ToastContainer />
            </>;
}


export default ReactPlayerPomodoro;