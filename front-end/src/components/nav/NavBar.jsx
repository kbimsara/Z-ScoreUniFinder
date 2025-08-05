'use client'

   import { useState } from 'react';

   export default function NavBar() {
     const [isOpen, setIsOpen] = useState(false);

     const toggleMenu = () => {
       setIsOpen(!isOpen);
     };

     return (
       <nav className="fixed top-0 w-full bg-gray-900 border-b border-gray-800 z-50">
         <div className="max-w-7xl mx-auto px-6 py-4">
           <div className="flex justify-between items-center">
             <div className="flex items-center">
               <h1 className="text-2xl font-bold text-white">zFinder</h1>
             </div>
             <div className="hidden md:flex space-x-6">
               <a href="#home" className="text-gray-300 hover:text-white transition-colors">
                 Home
               </a>
               <a href="#ol-results" className="text-gray-300 hover:text-white transition-colors">
                 O/L Results
               </a>
               <a href="#al-results" className="text-gray-300 hover:text-white transition-colors">
                 A/L Results
               </a>
               <a href="#universities" className="text-gray-300 hover:text-white transition-colors">
                 Universities
               </a>
             </div>
             <div className="md:hidden">
               <button onClick={toggleMenu} className="text-gray-300 hover:text-white focus:outline-none">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
                 </svg>
               </button>
             </div>
           </div>
           {isOpen && (
             <div className="md:hidden mt-4">
               <a href="#home" className="block text-gray-300 hover:text-white transition-colors py-2">
                 Home
               </a>
               <a href="#ol-results" className="block text-gray-300 hover:text-white transition-colors py-2">
                 O/L Results
               </a>
               <a href="#al-results" className="block text-gray-300 hover:text-white transition-colors py-2">
                 A/L Results
               </a>
               <a href="#universities" className="block text-gray-300 hover:text-white transition-colors py-2">
                 Universities
               </a>
             </div>
           )}
         </div>
       </nav>
     );
   }