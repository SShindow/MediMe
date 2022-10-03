import ImportTable from './ImportTable';
// import ExportTable from './ExportTable';
import Dropdown_Details from './Dropdown_Details';

function Details() {
    return (
        <>
            <div className="container">
                <div className='tableName'>
                    <Dropdown_Details></Dropdown_Details>
                </div>
                <button>Print PDF</button>
                <ImportTable/>
            </div>
        </>
    )
}

export default Details