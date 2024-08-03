import { useState, useEffect } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { FaTicketAlt, FaUsers, FaTrophy, FaGift, FaFileAlt, FaCog, FaHome, FaSignOutAlt } from 'react-icons/fa'

const SideNav = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const location = useLocation()
  const [userRole, setUserRole] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user && user.role) {
      setUserRole(user.role)
    }
  }, [])

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    navigate('/')
  }

  const NavItem = ({ to, icon, label, isDisabled = false, onClick }) => (
    <li className="rounded-sm">
      <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) =>
          `flex items-center p-2 space-x-3 rounded-md mx-2 ${
            isActive && !isDisabled
              ? 'bg-yellow-400 text-black'
              : isDisabled
              ? 'text-gray-400 pointer-events-none'
              : 'hover:bg-gray-200'
          }`
        }
      >
        {icon}
        <h2>{label}</h2>
      </NavLink>
    </li>
  )

  return (
    <div
      className={`flex flex-col p-1 text-black border-r-2 bg-white ${isCollapsed ? 'w-20' : 'w-60'} transition-width duration-300 h-screen`}
      style={{ position: 'sticky', top: 0 }}
    >
      <div className="flex-1 mt-14">
        <ul className="pt-2 pb-4 space-y-1 text-sm">
          <NavItem to="/dashboard" icon={<FaHome className='ml-4' />} label="Dashboard" />
          <NavItem to="/raffles" icon={<FaTicketAlt className='ml-4' />} label="Draws" />
          <NavItem to="/winners" icon={<FaTrophy className='ml-4' />} label="Winners" isDisabled={userRole === 'user'} />
          
          {userRole === 'admin' && (
            <>
              <NavItem to="/prizes" icon={<FaGift className='ml-4' />} label="Prizes" />
              <NavItem to="/report" icon={<FaFileAlt className='ml-4' />} label="Report" />
              <NavItem to="/settings" icon={<FaCog className='ml-4' />} label="Settings" />
            </>
          )}
        </ul>
      </div>
      <div className="mt-auto mb-4">
        <NavItem
          to="/"
          icon={<FaSignOutAlt className='ml-4' />}
          label="Logout"
          onClick={handleLogout}
        />
      </div>
    </div>
  )
}

export default SideNav