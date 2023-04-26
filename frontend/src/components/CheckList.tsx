import { SetStateAction, Dispatch } from "react"
import CheckBox from "./CheckBox"

interface Props {
    checkbox_list: {label: string, value: boolean, setter: Dispatch<SetStateAction<boolean>>}[]
}

function CheckList({checkbox_list}: Props) {
    return <>
        <div style = {{display: 'flex', flexDirection: 'column', float: 'right', marginLeft: 'auto'}}>
            {checkbox_list.map(cb => (
                <CheckBox label={cb.label} setter={cb.setter} value={cb.value} key={cb.label}/>
            ))}
        </div>
    </>
}

export default CheckList;