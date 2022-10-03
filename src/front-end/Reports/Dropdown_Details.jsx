import React,{ useState } from 'react';

function Dropdown_Details() {
    const [selected, setSelected] = useState();
    return (
        <div className="dropdown">
            <select>
                <option>IMPORT GOODS</option>
                <option>EXPORT GOODS</option>
            </select>
        </div>
    )
}

export default Dropdown_Details;