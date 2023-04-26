import { SetStateAction, Dispatch } from "react"

interface Props {
    label: string
    value: boolean
    setter: Dispatch<SetStateAction<boolean>>
}

function CheckBox({label, value, setter}: Props) {

    return <>
        <label style = {{color: '#AFAFAF'}}>
                <input
                type="checkbox"
                checked={value}
                onChange={() => setter(!value)}>
                </input>
                {label}
            </label>
    </>
}

export default CheckBox;