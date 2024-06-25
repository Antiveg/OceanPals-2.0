import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white rounded-lg shadow dark:bg-gray-900 m-4">
            <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <Link to="/home" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                        <img src="/assets/oceanpals-logo.png" className="h-12" alt="OceanPals Logo" />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">OceanPals</span>
                    </Link>
                    <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
                        <li>
                            <Link to="/home" className="hover:underline me-4 md:me-6">Home</Link>
                        </li>
                        <li>
                            <Link to="/events" className="hover:underline me-4 md:me-6">Events</Link>
                        </li>
                        <li>
                            <Link to="/recruitment" className="hover:underline me-4 md:me-6">Recruitment</Link>
                        </li>
                        <li>
                            <Link to="/training" className="hover:underline me-4 md:me-6">Training</Link>
                        </li>
                        <li>
                            <Link to="/store" className="hover:underline">Store</Link>
                        </li>
                    </ul>
                </div>
                <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 <a href="https://flowbite.com/" className="hover:underline">OceanPals™</a>. All Rights Reserved.</span>
            </div>
        </footer>
    );
}

export default Footer;
