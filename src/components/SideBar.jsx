import React from 'react'
import Contacts from './Contacts'
import { userService } from '../services/UserService';

function SideBar() {
    const [search, setSearch] = React.useState('');
    const [results, setResults] = React.useState([]);

   

    return (
        <div className='w-full   p-2 border-r border-gray-500 h-[90vh]'>

            
            <div className='w-full flex items-center justify-between gap-2 mb-4'>
                <input type="text" className='outline-none border-b-2 p-1 bg-neutral/20 w-full px-4 border-neutral/40 rounded focus:bg-neutral/30' placeholder='Search contacts...' value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>

            <div className='w-full  px-2  overflow-hidden h-[80vh] overflow-y-auto'>
                <div className='flex-1'>
                    <Contacts search={search} results={results} /> 
                </div>
            </div>
            

        </div>
    )
}

export default SideBar