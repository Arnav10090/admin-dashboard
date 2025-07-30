"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FiMenu, FiBell, FiSearch, FiSettings, FiLogOut, FiUser, FiHelpCircle, FiGrid } from "react-icons/fi";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navLinks = [
    { name: "Dashboard", href: "#" },
    { name: "Analytics", href: "#" },
    { name: "Production", href: "#" },
    { name: "Inventory", href: "#" },
    { name: "Reports", href: "#" },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left section - Logo and navigation */}
            <div className="flex items-center">
              <button 
                className="md:hidden text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <FiMenu className="h-6 w-6" />
              </button>
              
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                  <FiGrid className="h-6 w-6 text-white" />
                </div>
                <div className="ml-3 flex flex-col">
                  <span className="text-lg font-bold">SteelPlant</span>
                  <span className="text-xs text-blue-100">Admin Dashboard</span>
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:ml-10 md:flex md:space-x-4">
                {navLinks.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      item.name === 'Dashboard' 
                        ? 'bg-blue-700 text-white' 
                        : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                    } transition-colors duration-200`}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Right section - Search and user menu */}
            <div className="flex items-center space-x-4">
              {/* Search bar */}
              <div className={`relative ${isSearchFocused ? 'w-64' : 'w-48'} transition-all duration-300`}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-blue-300" />
                </div>
                <input
                  type="text"
                  className={`block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-blue-500/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 transition-colors duration-200`}
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
              </div>

              {/* Notifications */}
              <button className="p-2 rounded-full text-blue-100 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white relative">
                <FiBell className="h-5 w-5" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-blue-600"></span>
              </button>

              {/* Settings */}
              <button className="p-2 rounded-full text-blue-100 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white">
                <FiSettings className="h-5 w-5" />
              </button>

              {/* User dropdown */}
              <div className="relative ml-3">
                <div>
                  <button 
                    className="flex items-center max-w-xs rounded-full bg-blue-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-800"
                    id="user-menu"
                    aria-expanded="false"
                    aria-haspopup="true"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-white text-blue-800 flex items-center justify-center font-bold">
                      A
                    </div>
                  </button>
                </div>

                {/* Dropdown menu */}
                {isMenuOpen && (
                  <div 
                    className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu"
                    tabIndex={-1}
                  >
                    <div className="py-1" role="none">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        <div className="font-medium">Admin User</div>
                        <div className="text-xs text-gray-500">admin@steelplant.com</div>
                      </div>
                      <a
                        href="#"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        <FiUser className="mr-3 h-5 w-5 text-gray-400" />
                        Your Profile
                      </a>
                      <a
                        href="#"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        <FiSettings className="mr-3 h-5 w-5 text-gray-400" />
                        Settings
                      </a>
                      <a
                        href="#"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        <FiHelpCircle className="mr-3 h-5 w-5 text-gray-400" />
                        Help
                      </a>
                      <div className="border-t border-gray-100"></div>
                      <button
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        role="menuitem"
                      >
                        <FiLogOut className="mr-3 h-5 w-5 text-red-400" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-blue-700">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-600"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Overlay when mobile menu is open */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </>
  );
}