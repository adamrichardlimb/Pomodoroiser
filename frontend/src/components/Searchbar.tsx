import { ChangeEvent, SetStateAction, useState } from 'react';
import NumberField from './NumberField';
import CheckList from './CheckList';


interface Props {
    onSearch: (item: string, sessionLength: number, shufflePlaylists: boolean, shuffleItems: boolean, breakLength: number) => void;
}

function Searchbar({onSearch}: Props) {

    //The state of our input field
    const [playlist, setPlaylist] = useState('');
    const [shufflePlaylists, setShufflePlaylists] = useState(false);
    const [shuffleItems, setShuffleItems] = useState(false);
    const [sessionLength, setSessionLength] = useState(25);
    const [breakLength, setBreakLength] = useState(5);

    //Whether we want to shuffle playlists
    
    function handleTextareaChange(e: { target: { value: SetStateAction<string>; }; }) {
        setPlaylist(e.target.value);
    }

    function handleBreakLengthChange(e: ChangeEvent<HTMLInputElement>) {
        // In general, use Number.isNaN over global isNaN as isNaN will coerce the value to a number first
        // which likely isn't desired
        !Number.isNaN(e.target.valueAsNumber) ? setBreakLength(e.target.valueAsNumber) : null;
    }

    const checkboxes = [{
                            label:  "Shuffle playlists?",
                            value:  shufflePlaylists,
                            setter: setShufflePlaylists
                        },
                        {
                            label:  "Shuffle items?",
                            value:  shuffleItems,
                            setter: setShuffleItems
                        }
                        ];

    return (
        <>
            <div style={{padding: '1em', display: 'flex', alignContent: 'center'}}>
                <textarea
                    value={playlist}
                    onChange={handleTextareaChange}
                    style={{resize: "none", width: "60%"}}
                />

                <button style={{float: 'right', marginLeft: 'auto'}} onClick={() => onSearch(playlist, sessionLength, shufflePlaylists, shuffleItems, breakLength)}>Pomodoroise!</button>
            </div>
            <div style={{padding: '1em', display: 'flex', alignContent: 'center'}}>
            <NumberField label={"Set session length (minutes)"} set_number={setSessionLength} lowest_value={10} value={sessionLength} />
            <NumberField label={"Set break length (minutes)"} set_number={setBreakLength} lowest_value={0} value={breakLength} />
            <CheckList checkbox_list={checkboxes} />
            </div>
        </>
    );
}

export default Searchbar;