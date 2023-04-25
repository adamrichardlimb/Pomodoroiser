import { SetStateAction, useState } from 'react';

interface Props {
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
            <div style={{padding: '1em', display: 'flex', alignContent: 'center'}}>
                <textarea
                    value={playlist}
                    onChange={handleTextareaChange}
                    style={{resize: "none", width: "60%"}}
                />

                <button style={{float: 'right', marginLeft: 'auto'}} onClick={() => onSearch(playlist)}>Pomodoroise!</button>
            </div>
        </>
    );
}

export default Searchbar;