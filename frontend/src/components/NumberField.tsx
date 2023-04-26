import { ChangeEvent, Dispatch, SetStateAction, useRef } from 'react'

interface Props {
    label: string
    set_number: Dispatch<SetStateAction<number>>
    lowest_value: number
    value: number
}

function NumberField({label, set_number, lowest_value, value}: Props) {

    function handleValueChange(e: ChangeEvent<HTMLInputElement>) {
        // In general, use Number.isNaN over global isNaN as isNaN will coerce the value to a number first
        // which likely isn't desired
        var as_number = e.target.valueAsNumber;
        !Number.isNaN(as_number) && as_number > lowest_value ? set_number(e.target.valueAsNumber) : set_number(lowest_value);
    }

    return <>
    <div style = {{display: 'flex', flexDirection: 'column'}}>
        <label style = {{color: '#AFAFAF'}}>
        {label}
        </label>
        <input
            type="number"
            value={value ?? ''}
            onChange={handleValueChange}
        />
    </div>
    </>
}

export default NumberField;