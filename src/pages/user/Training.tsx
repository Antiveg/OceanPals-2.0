import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../FirebaseConfig'; // Ensure this points to your Firebase configuration
import { collection, getDocs } from 'firebase/firestore';

interface TrainingData {
  id: string;
  category: string;
  name: string;
  shortDescription: string;
  authorName: string;
  authorPosition: string;
  image: string;
  date: string;
}

const Training: React.FC = () => {
  const [trainings, setTrainings] = useState<TrainingData[]>([]);

  useEffect(() => {
    const fetchTrainings = async () => {
      const querySnapshot = await getDocs(collection(db, 'Training'));
      const trainingList: TrainingData[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TrainingData[];
      setTrainings(trainingList);
    };

    fetchTrainings();
  }, []);

  return (
    <section className="bg-white dark:bg-gray-900 text-left">
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
          {trainings.map(training => (
            <div key={training.id}>
              <img className="object-cover object-center w-full h-64 rounded-lg lg:h-80" src={training.image} alt="" />
              <div className="mt-8">
                <span className="text-blue-500 uppercase">{training.category}</span>
                <h1 className="mt-4 text-xl font-semibold text-gray-800 dark:text-white">
                  {training.name}
                </h1>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  {training.shortDescription}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <a href="#" className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:underline hover:text-gray-500">
                      {training.authorName}, {training.authorPosition}
                    </a>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{training.date}</p>
                  </div>
                  <Link to={`/training/${training.id}`} className="inline-block text-blue-500 underline hover:text-blue-400">Read more</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Training;
