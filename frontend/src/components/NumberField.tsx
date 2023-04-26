import { ChangeEvent, Dispatch, SetStateAction, useRef } from 'react'

interface Props {
    label: string
    set_number: Dispatch<SetStateAction<number>>
    value: number
}

function NumberField({label, set_number, value}: Props) {

    function handleValueChange(e: ChangeEvent<HTMLInputElement>) {
        // In general, use Number.isNaN over global isNaN as isNaN will coerce the value to a number first
        // which likely isn't desired
        !Number.isNaN(e.target.valueAsNumber) ? set_number(e.target.valueAsNumber) : null;
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