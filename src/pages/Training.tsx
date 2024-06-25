import React from 'react';
import { Link } from 'react-router-dom';

const Training: React.FC = () => {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="container px-6 py-10 mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800 capitalize lg:text-3xl dark:text-white">OceanPals Training Center</h1>
          <button className="focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600 transition-colors duration-300 transform dark:text-gray-400 hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        <hr className="my-8 border-gray-200 dark:border-gray-700" />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          <div>
            <img className="object-cover object-center w-full h-64 rounded-lg lg:h-80" src="/assets/training/training-1.png" alt="" />
            <div className="mt-8">
              <span className="text-blue-500 uppercase">Environment</span>
              <h1 className="mt-4 text-xl font-semibold text-gray-800 dark:text-white">
                Proper Ways to Clean Beaches
              </h1>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                How to clean the beach correctly and effectively. Starting from waste sorting, relevant tools, and team coordination.
              </p>
              <div className="flex items-center justify-between mt-4">
                <div>
                  <a href="#" className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:underline hover:text-gray-500">
                    Aurelia Puspita, Marketing Lead
                  </a>
                  <p className="text-sm text-gray-500 dark:text-gray-400">May 22, 2024</p>
                </div>
                <Link to="/training/detail" className="inline-block text-blue-500 underline hover:text-blue-400">Read more</Link>
              </div>
            </div>
          </div>

          <div>
            <img className="object-cover object-center w-full h-64 rounded-lg lg:h-80" src="/assets/training/training-2.png" alt="" />
            <div className="mt-8">
              <span className="text-blue-500 uppercase">Technology</span>
              <h1 className="mt-4 text-xl font-semibold text-gray-800 dark:text-white">
                Getting Started with OceanPals
              </h1>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                How to use this application “OceanPals” to find volunteer activities that are suitable for you and maximize community contribution
              </p>
              <div className="flex items-center justify-between mt-4">
                <div>
                  <a href="#" className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:underline hover:text-gray-500">
                    Christopher H.G, IT Team
                  </a>
                  <p className="text-sm text-gray-500 dark:text-gray-400">April 30, 2024</p>
                </div>
                <Link to="/training/detail" className="inline-block text-blue-500 underline hover:text-blue-400">Read more</Link>
              </div>
            </div>
          </div>

          <div>
            <img className="object-cover object-center w-full h-64 rounded-lg lg:h-80" src="/assets/training/training-3.png" alt="" />
            <div className="mt-8">
              <span className="text-blue-500 uppercase">Environment</span>
              <h1 className="mt-4 text-xl font-semibold text-gray-800 dark:text-white">
                Systems of Garbage Sorting
              </h1>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                In-depth understanding of waste sorting systems, starting from organic, inorganic and many other waste categories.
              </p>
              <div className="flex items-center justify-between mt-4">
                <div>
                  <a href="#" className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:underline hover:text-gray-500">
                    Stanic Dylan, EO
                  </a>
                  <p className="text-sm text-gray-500 dark:text-gray-400">April 19, 2024</p>
                </div>
                <Link to="/training/detail" className="inline-block text-blue-500 underline hover:text-blue-400">Read more</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Training;
