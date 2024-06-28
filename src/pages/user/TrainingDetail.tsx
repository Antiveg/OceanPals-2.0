import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { db } from '../../FirebaseConfig'; // Ensure this points to your Firebase configuration
import { doc, getDoc } from 'firebase/firestore';

interface TrainingDetailData {
  category: string;
  name: string;
  fullDescription: string;
  authorName: string;
  authorPosition: string;
  authorImage: string;
  image: string;
}

const TrainingDetail: React.FC = () => {
  const { trainingId } = useParams<{ trainingId: string }>();
  const [training, setTraining] = useState<TrainingDetailData | null>(null);

  useEffect(() => {
    const fetchTrainingDetail = async () => {
      if (trainingId) {
        const trainingDoc = await getDoc(doc(db, 'Training', trainingId));
        if (trainingDoc.exists()) {
          setTraining(trainingDoc.data() as TrainingDetailData);
        }
      }
    };

    fetchTrainingDetail();
  }, [trainingId]);

  if (!training) {
    return <div>Loading...</div>;
  }

  return (
    <section className="bg-white dark:bg-gray-900 text-left">
      <div className="container px-6 py-10 mx-auto">
        <div className="lg:flex lg:-mx-6">
          <div className="lg:w-3/4 lg:px-6">
            <img className="object-cover object-center w-full h-80 xl:h-[28rem] rounded-xl" src={training.image} alt="Training" />

            <div>
              <p className="mt-6 text-sm text-blue-500 uppercase">{training.category}</p>

              <h1 className="max-w-lg mt-4 text-2xl font-semibold leading-tight text-gray-800 dark:text-white">
                {training.name}
              </h1>

              <div className="flex items-center my-6">
                <img className="object-cover object-center w-10 h-10 rounded-full" src={training.authorImage} alt={training.authorName} />
                <div className="mx-4">
                  <h1 className="text-sm text-gray-700 dark:text-gray-200">{training.authorName}</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{training.authorPosition}</p>
                </div>
              </div>

              <p className="mb-3 text-gray-500 dark:text-gray-400">
                {training.fullDescription}
              </p>
            </div>
          </div>

          <div className="mt-8 lg:w-1/4 lg:mt-0 lg:px-6">
            <h2 className="mb-6 text-4xl font-bold dark:text-white">More Training</h2>

            {/* Example of more training links */}
            <div>
              <h3 className="text-blue-500 capitalize">Environment</h3>
              <Link to="#" className="block mt-2 font-medium text-gray-700 hover:underline hover:text-gray-500 dark:text-gray-400">
                Systems of Garbage Sorting
              </Link>
            </div>

            <hr className="my-6 border-gray-200 dark:border-gray-700" />

            <div>
              <h3 className="text-blue-500 capitalize">Technology</h3>
              <Link to="#" className="block mt-2 font-medium text-gray-700 hover:underline hover:text-gray-500 dark:text-gray-400">
                Getting Started with OceanPals
              </Link>
            </div>

            <hr className="my-6 border-gray-200 dark:border-gray-700" />

            <div>
              <h3 className="text-blue-500 capitalize">Environment</h3>
              <Link to="#" className="block mt-2 font-medium text-gray-700 hover:underline hover:text-gray-500 dark:text-gray-400">
                10 Ways to Recreate Art from Waste
              </Link>
            </div>

            <hr className="my-6 border-gray-200 dark:border-gray-700" />

            <div>
              <h3 className="text-blue-500 capitalize">Technology</h3>
              <Link to="#" className="block mt-2 font-medium text-gray-700 hover:underline hover:text-gray-500 dark:text-gray-400">
                Integrating AI for Photo Judgement
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrainingDetail;
