import React from 'react';
import { Link } from 'react-router-dom';

const Ranking: React.FC = () => {
  const users = [
    {
      name: 'Neil Sims',
      email: 'sims.neil@gmail.com',
      points: 7890,
      image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=4&w=880&h=880&q=100',
    },
    {
      name: 'Bonnie Green',
      email: 'bonnie.green@gmail.com',
      points: 4750,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=4&w=687&h=687&q=80',
    },
    {
      name: 'Mia Howard',
      email: 'mia.howard@gmail.com',
      points: 2300,
      image: 'https://images.unsplash.com/photo-1464863979621-258859e62245?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=4&w=686&h=686&q=80',
    },
    {
      name: 'Lana Byrd',
      email: 'lana.byrd@gmail.com',
      points: 2000,
      image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&h=764&q=100',
    },
    {
      name: 'Thomas Lean',
      email: 'thomes.lean@gmail.com',
      points: 1500,
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=4&w=880&h=880&q=80',
    },
  ];

  return (
    <section className="bg-gradient-to-tr from-teal-50 to-blue-200 flex flex-col items-center justify-center py-5 px-3">
      <div className="w-full max-w-screen-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">OceanPals Ranking</h5>
          <Link to="/home" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
            Go back to Home
          </Link>
        </div>
        <div className="flow-root">
          <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user, index) => (
              <li key={index} className="py-3 sm:py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img className="w-8 h-8 rounded-full" src={user.image} alt={`${user.name} image`} />
                  </div>
                  <div className="flex-1 min-w-0 ms-4">
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">{user.name}</p>
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">{user.email}</p>
                  </div>
                  <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                    {user.points} pt
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Ranking;
