import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
// import { userAuthorContextObj } from '../contexts/UserAuthorContext'

function UserProfile({currentUser}) {
  // console.log(currentUser.role)
  // const { currentUser } = useContext(userAuthorContextObj);
  return (
    <div className='author-profile'>
      <ul className='d-flex justify-content-around list-unstyled fs-3'>
        <li className='nav-item'>
          <NavLink to='articles' className="nav-link">Articles</NavLink>
        </li>
        {currentUser?.role === 'admin' && (
          <li className='nav-item'>
            <NavLink to='all-users' className="nav-link">Users</NavLink>
          </li>
        )}
      </ul>
      <div className='mt-5'>
        <Outlet />
      </div>
    </div>
  );
}

export default UserProfile;
