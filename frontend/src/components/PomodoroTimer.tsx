import { useEffect } from 'react';
import { useTimer } from 'react-timer-hook'

interface Props {
    timestamp: Date
    expiryFunction: () => void
}

function PomodoroTimer( {timestamp, expiryFunction}: Props) {

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
    } = useTimer({expiryTimestamp: timestamp, onExpire: expiryFunction });

    useEffect(() => {

        restart(timestamp);

    }, [timestamp]);

    return  <>
                <div>
                    <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
                </div>
            </>
}

export default PomodoroTimer;