import React, { useContext, useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("menu");
  const [dropdown, setDropdown] = useState(false);

  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);

  // Logout handler
  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    setDropdown(false);
  };

  return (
    <div className="navbar">

      {/* Logo */}
      <Link to='/'>
        <img src={assets.logo} alt="" className="navbar-logo" />
      </Link>

      {/* Menu Links */}
      <ul className="navbar-menu">
        <Link to='/' onClick={() => setMenu("Home")} className={menu === "Home" ? "active" : ""}>Home</Link>
        <a href='#explore-menu' onClick={() => setMenu("Menu")} className={menu === "Menu" ? "active" : ""}>Menu</a>
        <a href='#app-download' onClick={() => setMenu("Mobile-App")} className={menu === "Mobile-App" ? "active" : ""}>Mobile App</a>
        <a href='#footer' onClick={() => setMenu("Contact Us")} className={menu === "Contact Us" ? "active" : ""}>Contact Us</a>
      </ul>

      {/* Right Side Icons */}
      <div className="navbar-right">
        
        {/* Search */}
        <img src={assets.search_icon} alt="" className="icon" />

        {/* Cart */}
        <div className="navbar-search-icon">
          <Link to='/cart'>
            <img src={assets.basket_icon} alt="" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>

        {/* Login / Profile */}
        {!token ? (
          <button onClick={() => setShowLogin(true)}>Sign In</button>
        ) : (
          <div 
            className="navbar-profile"
            onClick={() => setDropdown(prev => !prev)}
          >
            <img src={assets.profile_icon} alt="profile" />

            {dropdown && (
              <ul className="nav-profile-dropdown">
                <li>
                  <Link to="/orders">
                    <img src={assets.bag_icon} alt="" />
                    <p>Orders</p>
                  </Link>
                </li>

                <hr />

                <li onClick={handleLogout}>
                  <img src={assets.logout_icon} alt="" />
                  <p>Logout</p>
                </li>
              </ul>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default Navbar;
