'use client'

import { useState } from 'react';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false); // Close mobile menu after clicking
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <button 
              onClick={() => scrollToSection('home')}
              className="text-2xl font-bold hover:text-blue-400 transition cursor-pointer"
            >
              zFinder
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <button 
              onClick={() => scrollToSection('home')}
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition cursor-pointer"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('ol-results')}
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition cursor-pointer"
            >
              O/L Results
            </button>
            <button 
              onClick={() => scrollToSection('al-results')}
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition cursor-pointer"
            >
              A/L Results
            </button>
            <button 
              onClick={() => scrollToSection('universities')}
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition cursor-pointer"
            >
              Universities
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            <button
              onClick={() => scrollToSection('home')}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 transition cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('ol-results')}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 transition cursor-pointer"
            >
              O/L Results
            </button>
            <button
              onClick={() => scrollToSection('al-results')}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 transition cursor-pointer"
            >
              A/L Results
            </button>
            <button
              onClick={() => scrollToSection('universities')}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 transition cursor-pointer"
            >
              Universities
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}