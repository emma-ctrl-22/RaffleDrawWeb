import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { FaTicketAlt, FaUsers, FaTrophy, FaGift, FaFileAlt, FaCog,FaHome } from 'react-icons/fa'

const SideNav = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const location = useLocation()
  const userRole = "user";

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div
      className={`flex flex-col p-1 text-black border-r-2 bg-white ${isCollapsed ? 'w-20' : 'w-60'} transition-width duration-300`}
      style={{ position: 'sticky', top: 0 }}
    >
      <div className="flex-1  mt-14">
        <ul className="pt-2 pb-4 space-y-1 text-sm">
          <li className="rounded-sm">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? 'flex items-center p-2 space-x-3 rounded-md bg-yellow-400 text-black mx-2'
                  : 'flex items-center p-2 space-x-3 rounded-md hover:bg-gray-200 mx-2'
              }
            >
              <FaHome className='ml-4' />
              <h2>Dashboard</h2>
            </NavLink>
          </li>
          <li className="rounded-sm">
            <NavLink
              to="/raffles"
              className={({ isActive }) =>
                isActive
                  ? 'flex items-center p-2 space-x-3 rounded-md bg-yellow-400 text-black mx-2'
                  : 'flex items-center p-2 space-x-3 rounded-md hover:bg-gray-200 mx-2'
              }
            >
              <FaTicketAlt className='ml-4' />
              <h2>Draws</h2>
            </NavLink>
          </li>
          {/* <li className="rounded-sm">
            <NavLink
              to="/participants"
              className={({ isActive }) =>
                isActive
                  ? 'flex items-center p-2 space-x-3 rounded-md bg-yellow-400 text-black mx-2'
                  : 'flex items-center p-2 space-x-3 rounded-md hover:bg-gray-200 mx-2'
              }
            >
              <FaUsers className='ml-4' />
              <h2>Participants</h2>
            </NavLink>
          </li> */}
          <li className="rounded-sm">
            <NavLink
              to="/raffles"
              className={({ isActive }) =>
                isActive
                  ? 'flex items-center p-2 space-x-3 rounded-md  text-black mx-2'
                  : 'flex items-center p-2 space-x-3 rounded-md hover:bg-gray-200 mx-2'
              }
            >
              <FaTrophy className='ml-4'/>
              <h2>Winners</h2>
            </NavLink>
          </li>
          <li className="rounded-sm">
            <NavLink
              to="/prizes"
              className={({ isActive }) =>
                isActive
                  ? 'flex items-center p-2 space-x-3 rounded-md bg-yellow-400 text-black mx-2'
                  : 'flex items-center p-2 space-x-3 rounded-md hover:bg-gray-200 mx-2'
              }
            >
              <FaGift className='ml-4'/>
              <h2>Prizes</h2>
            </NavLink>
          </li>
          <li className="rounded-sm">
            <NavLink
              to="/report"
              className={({ isActive }) =>
                isActive
                  ? 'flex items-center p-2 space-x-3 rounded-md bg-yellow-400 text-black mx-2'
                  : 'flex items-center p-2 space-x-3 rounded-md hover:bg-gray-200 mx-2'
              }
            >
              <FaFileAlt className='ml-4'/>
              <h2>Report</h2>
            </NavLink>
          </li>
          <li className="rounded-sm">
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                isActive
                  ? 'flex items-center p-2 space-x-3 rounded-md bg-yellow-400 text-black mx-2'
                  : 'flex items-center p-2 space-x-3 rounded-md hover:bg-gray-200 mx-2'
              }
            >
              <FaCog className='ml-4'/>
              <h2>Settings</h2>
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default SideNav
