import { NavLink } from "react-router-dom";
import { DesktopSearch } from './Searchbar';
import { useAuth } from '../context/authContext';

const Navbar = () => {
  const { user, handleLogout } = useAuth();

  return (
    <nav className="py-2 px-2 sm:px-4 border-b-2 flex sm:justify-between items-center gap-3">
      <NavLink className="navbar-brand font-mono" to="/"><img src="./logo.png" className='w-36 sm:w-48' alt={process.env.REACT_APP_NAME} /></NavLink>
      <DesktopSearch />
      <ul className="list-none flex gap-3 items-center">
        {user &&
          <li className="group nav-items">
            <button className='w-10 h-10 rounded-full bg-slate-400 flex justify-center items-center text-white group-focus-within:pointer-events-none'>{user.name?.[0]}</button>
            <div className="user-dropdown absolute top-[58px] right-4 rounded-xl shadow-md w-36 overflow-clip">
              <button className="btn hidden group-focus-within:block bg-white hover:bg-blue-500 hover:text-white p-3 w-full text-left" onClick={handleLogout}>Logout</button>
            </div>

          </li>}
      </ul>
    </nav>
  )
}

export default Navbar;
