import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../FirebaseConfig'; // Ensure this points to your Firebase configuration
import { useAuth } from '../provider/AuthProvider'; // Adjust the path according to your project structure
import { getDoc, doc } from 'firebase/firestore';

interface Event {
  title: string;
  description: string;
  image: string;
  points: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [points, setPoints] = useState<number | null>(null);
  const [ranking, setRanking] = useState<string | null>(null);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'Users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setPoints(userData?.points ?? 0);

            // Fetching ranking (this is a placeholder logic)
            const rankingsDoc = await getDoc(doc(db, 'Rankings', user.uid));
            if (rankingsDoc.exists()) {
              const rankingData = rankingsDoc.data();
              const totalUsers = (await getDoc(doc(db, 'Meta', 'totalUsers'))).data()?.count ?? 0;
              setRanking(`${rankingData?.position}/${totalUsers}`);
            } else {
              setRanking('N/A');
            }

            // Fetch current event (this is a placeholder logic)
            const eventDoc = await getDoc(doc(db, 'Events', user.uid));
            if (eventDoc.exists()) {
              const eventData = eventDoc.data();
              setCurrentEvent({
                title: eventData.title,
                description: eventData.description,
                image: eventData.image,
                points: eventData.points,
              });
            } else {
              setCurrentEvent(null);
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  return (
    <section className="bg-gradient-to-tr from-teal-50 to-blue-200">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16">
        {/* Card Above */}
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 md:p-12 mb-8">
          <a href="#" className="bg-blue-100 text-blue-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-md dark:bg-gray-700 dark:text-blue-400 mb-2">
            <svg className="w-2.5 h-2.5 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 14">
              <path d="M11 0H2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm8.585 1.189a.994.994 0 0 0-.9-.138l-2.965.983a1 1 0 0 0-.685.949v8a1 1 0 0 0 .675.946l2.965 1.02a1.013 1.013 0 0 0 1.032-.242A1 1 0 0 0 20 12V2a1 1 0 0 0-.415-.811Z" />
            </svg>
            Event
          </a>
          <h1 className="text-gray-900 dark:text-white text-3xl md:text-5xl font-extrabold mb-2">My Current Events</h1>
          {currentEvent ? (
            <div className="max-w-xs overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 mb-6">
              <div className="px-4 py-2">
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">{currentEvent.title}</h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{currentEvent.description}</p>
              </div>
              <img className="object-cover w-full h-48 mt-2" src={currentEvent.image} alt={currentEvent.title} />
              <div className="flex items-center justify-between px-4 py-2 bg-blue-700">
                <h1 className="text-lg font-bold text-white">{currentEvent.points} Points</h1>
              </div>
            </div>
          ) : (
            <p className="text-lg font-normal text-gray-500 dark:text-gray-400 mb-6">Currently you don't have any active events right now</p>
          )}
          <Link
            to={currentEvent ? "/events/dashboard" : "/events"}
            className="inline-flex justify-center items-center py-2.5 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-900"
          >
            Go to Event
            <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
            </svg>
          </Link>
        </div>

        {/* Cards Below */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 md:p-12">
            <a href="#" className="bg-green-100 text-green-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-md dark:bg-gray-700 dark:text-green-400 mb-2">
              <svg className="w-2.5 h-2.5 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                <path d="M17 11h-2.722L8 17.278a5.512 5.512 0 0 1-.9.722H17a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1ZM6 0H1a1 1 0 0 0-1 1v13.5a3.5 3.5 0 1 0 7 0V1a1 1 0 0 0-1-1ZM3.5 15.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM16.132 4.9 12.6 1.368a1 1 0 0 0-1.414 0L9 3.55v9.9l7.132-7.132a1 1 0 0 0 0-1.418Z" />
              </svg>
              Points
            </a>
            <h2 className="text-gray-900 dark:text-white text-3xl font-extrabold mb-2">My Points</h2>
            <p className="text-lg font-normal text-gray-500 dark:text-gray-400 mb-4">See your cumulative points count</p>
            <p className="text-7xl font-normal text-gray-500 dark:text-gray-400 mb-4">{points !== null ? points : 'Loading...'}</p>
            <Link to="/store" className="text-blue-600 dark:text-blue-500 hover:underline font-medium text-lg inline-flex items-center">Redeem your points
              <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
              </svg>
            </Link>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 md:p-12">
            <a href="#" className="bg-purple-100 text-purple-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-md dark:bg-gray-700 dark:text-purple-400 mb-2">
              <svg className="w-2.5 h-2.5 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 4 1 8l4 4m10-8 4 4-4 4M11 1 9 15" />
              </svg>
              Ranking
            </a>
            <h2 className="text-gray-900 dark:text-white text-3xl font-extrabold mb-2">My Ranking</h2>
            <p className="text-lg font-normal text-gray-500 dark:text-gray-400 mb-4">See your current ranking compare to other volunteers!</p>
            <p className="text-7xl font-normal text-gray-500 dark:text-gray-400 mb-4">{ranking !== null ? ranking : 'Loading...'}</p>
            <Link to="/ranking" className="text-blue-600 dark:text-blue-500 hover:underline font-medium text-lg inline-flex items-center">View Ranking
              <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
