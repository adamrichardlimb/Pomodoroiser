import { useEffect } from 'react';
import { useTimer } from 'react-timer-hook'

interface Props {
    timestamp: Date
    expiryFunction: (force_session_end: boolean) => void
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
    } = useTimer({expiryTimestamp: timestamp, onExpire: () => expiryFunction(true) });

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