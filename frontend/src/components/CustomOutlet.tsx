import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
const CustomOutlet = () => {
    return (
        <div className='w-dvw h-[90-dvh] flex justify-end'>
            <Sidebar />
            <div className='w-[90dvw] h-full flex flex-col'>
                <Outlet />
            </div>
        </div>
    )
}

export default CustomOutlet