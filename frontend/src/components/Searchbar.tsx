import { SetStateAction, useState } from 'react';

interface Props {
    //Search playlist - return true if successfully built playlist - else return false
    onSearch: (item: string) => void;
}

function Searchbar({onSearch}: Props) {

    //The state of our input field
    const [playlist, setPlaylist] = useState('');
    
    function handleTextareaChange(e: { target: { value: SetStateAction<string>; }; }) {
        setPlaylist(e.target.value);
    }

    return (
        <>
            <textarea
                value={playlist}
                onChange={handleTextareaChange}
            />

            <button onClick={() => onSearch(playlist)}>Pomodoroise!</button>
        </>
    );
}

export default Searchbar;