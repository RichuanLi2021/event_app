import React, { useState } from "react";
import { FaSearch, FaMapMarkerAlt, FaBars } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { logoutUser } from "~/redux/actions/auth/Auth-actionCreators";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";
import { Dropdown, Image } from "react-bootstrap";

const GlobalNavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("Location");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isUserLoggedIn = useAppSelector(state => state.auth.isAuthenticated);
  const currentUser = useAppSelector(state => state.auth.currentUser);
  const [showDropdown, setShowDropdown] = useState(false);

  // Reset user state to null
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  }

  const handleSearch = () => {
    // Allow search if there's a search term, even with "Location" selected
    if (!searchTerm.trim() && selectedLocation === "Location") {
      // Show all events when no search term and "Location" is selected
      navigate('/search');
      return;
    }
    
    const searchParams = new URLSearchParams();
    if (searchTerm.trim()) {
      searchParams.append('query', searchTerm.trim());
    }
    if (selectedLocation !== "Location") {
      searchParams.append('location', selectedLocation);
    }
    
    navigate(`/search?${searchParams.toString()}`);
  }

  const mockLocations = ["Location", "Nova Scotia", "Toronto", "New York", "Vancouver"];

  return (
    <>
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="grid grid-cols-3 items-center px-4 py-2">
        {/* Left: Logo */}
        <Link
          to="/"
          className="flex items-center flex-shrink-0 no-underline focus:outline-none"
          style={{ textDecoration: 'none' }}
        >
          <span className="text-[#f05537] font-bold text-2xl">eventflow</span>
        </Link>

        {/* Center: Search Box */}
        <div className="flex justify-center">
          <div className="flex items-center bg-gray-200 rounded-full px-3 py-1 shadow-sm gap-2 w-full max-w-5xl">
            {/* Search Icon & Input */}
            <div className="flex items-center flex-grow">
              <input
                type="text"
                className="bg-transparent outline-none text-gray-700 placeholder-gray-500 w-full text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search events"
              />
            </div>
            
            {/* Divider */}
            <div className="hidden sm:block w-px h-5 bg-gray-300" />
            
            {/* Interactive Location */}
            <div className="relative hidden sm:block">
              <button
                className="flex items-center text-sm text-gray-700 hover:text-pink-600 transition whitespace-nowrap"
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                <FaMapMarkerAlt className="text-pink-500 mr-1" />
                <span>{selectedLocation}</span>
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="absolute top-full mt-2 w-40 bg-white border border-gray-200 rounded shadow-md z-50">
                  {mockLocations.map((loc) => (
                    <button
                      key={loc}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={() => {
                        setSelectedLocation(loc);
                        setDropdownOpen(false);
                      }}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Button */}
            <button
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center hover:bg-gray-200 transition shrink-0"
              onClick={handleSearch}
            >
              <FaSearch className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Right: Navigation */}
        <div className="flex justify-end items-center gap-4">
          {/* Hamburger Menu for Mobile */}
          <div className="sm:hidden">
            <button onClick={() => setMenuOpen((prev) => !prev)}>
              <FaBars className="text-gray-800 text-xl" />
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex items-center gap-6 text-sm text-black">
            <button className="hover:bg-gray-100 px-3 py-1 rounded transition">
              Events
            </button>
            <Link
              to="/help-center"
              className="hover:bg-gray-100 px-3 py-1 rounded transition text-black focus:outline-none"
              style={{ textDecoration: 'none' }}
            >
              Help Center
            </Link>
            {isUserLoggedIn ? (
              <Dropdown align="end" show={showDropdown} onToggle={setShowDropdown}>
                <Dropdown.Toggle
                  as="span"
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    border: "none",
                    background: "none",
                    boxShadow: "none",
                  }}
                >
                  <Image
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      currentUser?.name || "U"
                    )}&background=random&rounded=true&size=32`}
                    roundedCircle
                    width={32}
                    height={32}
                    alt="profile"
                  />
                  <span className="ml-2">{currentUser?.name}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => navigate('/account')}>Account Setting</Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="hover:bg-gray-100 px-3 py-1 rounded transition">
                Login
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>

    {/* Mobile overlay */}
    {menuOpen && (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
        onClick={() => setMenuOpen(false)}
      />
    )}

    {/* Mobile Drawer */}
    <div
      className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
        menuOpen ? "translate-x-0" : "translate-x-full"
      } sm:hidden`}
    >
      <div className="flex flex-col h-full p-6">
        <div className="flex justify-start mb-6">
          <button
            onClick={() => setMenuOpen(false)}
            className="text-2xl text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-col gap-4 text-base">
          <button className="text-left px-3 py-2 rounded hover:bg-gray-100 transition">
            Events
          </button>
          <Link
            to="/help-center"
            className="hover:bg-gray-100 px-3 py-2 rounded transition text-black focus:outline-none"
            style={{ textDecoration: "none" }}
            onClick={() => setMenuOpen(false)}
          >
            Help Center
          </Link>

          {!isUserLoggedIn && (
            <button
              onClick={() => {
                navigate("/login");
                setMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded hover:bg-gray-100 transition"
            >
              Login
            </button>
          )}

          {isUserLoggedIn && currentUser && (
            <div className="flex flex-col gap-3 px-3 py-4 border-t">
              <Image
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  currentUser.name || "U"
                )}&background=random&rounded=true&size=32`}
                roundedCircle
                width={32}
                height={32}
                alt="profile"
              />
              <span className="font-medium text-sm text-gray-800">{currentUser.name}</span>
              <button
                onClick={() => {
                  navigate("/account");
                  setMenuOpen(false);
                }}
                className="text-left py-2 rounded hover:bg-gray-100 transition"
              >
                Account Settings
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="text-left py-2 rounded hover:bg-gray-100 transition"
              >
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>
    </div>
    </>
  );
};

export default GlobalNavBar;
