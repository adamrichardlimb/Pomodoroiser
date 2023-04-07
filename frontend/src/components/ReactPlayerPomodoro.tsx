import YouTube, {YouTubeProps} from 'react-youtube';
import { useState, useEffect } from 'react'
import playlistInfo from '../shared/playlistInfo';
import { useTimer } from 'react-timer-hook';

interface Props {
    pomodoros: playlistInfo;
    breakLength: number;
    shufflePlaylists?: boolean;
    shufflePlaylistItems?: boolean;
}

//This component will contain a React player - as well as the associated elements
function ReactPlayerPomodoro({pomodoros, breakLength}: Props) {

    const [autoplay, setAutoplay] = useState(1);
    const [currentPlaylist, setCurrentPlaylist] = useState(0);
    const [currentVideo, setCurrentVideo] = useState(0);
    const [onBreak, setOnBreak] = useState(false);
    
    const getPlaylistLength = () => {
        return pomodoros[currentPlaylist].map(song => song.duration).reduce((a, b) => {return a + b;});
    }

    //On break we just to the break length - on 
    const [timerLength, setTimerLength] = useState(getPlaylistLength());
    
    const getTimerLength = (length: number) => {
        const time = new Date();
        time.setSeconds(time.getSeconds() + length);
        return time;
    }

    //This function will handle all the logic when a timer ends
    const nextPeriod = () => {
        //If on break - next period is the next playlist
        if(onBreak) {
            setOnBreak(false);
            setAutoplay(1);
            setCurrentPlaylist(currentPlaylist + 1);
            setCurrentVideo(0);
            restart(getTimerLength(getPlaylistLength()));
        } else {
            //Otherwise set on break
            setOnBreak(true);
            setAutoplay(0);
            restart(getTimerLength(breakLength));
        }
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
    } = useTimer({expiryTimestamp: getTimerLength(getPlaylistLength()), onExpire: nextPeriod });
    

    const setNextVideo: YouTubeProps['onEnd'] = (event) => {
        if (currentPlaylist + 1 == pomodoros.length) {
            //FINISHED!
        } else if (currentVideo + 1 == pomodoros[currentPlaylist].length) {
            //If next video is at the end - set next period
            nextPeriod();
        } else {
            //Otherwise just get the next video
            setCurrentVideo(currentVideo + 1);
        };
    }

    const onPause: YouTubeProps['onPause'] = (event) => {
        pause();
    }

    const onPlay: YouTubeProps['onPlay'] = (event) => {
        resume();
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
                opts = {{playerVars: {autoplay: autoplay}}}
                />
                {<div style={{textAlign: 'center'}}>
                    <div>
                    <span>{minutes}</span>:<span>{seconds}</span>
                    </div>
                    <button onClick={() => nextPeriod()}>{getRestartLabel()}</button>
                </div>}
            </>;
}


export default ReactPlayerPomodoro;