import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../FirebaseConfig';

interface Volunteer {
  id: string;
  name: string;
  shortDescription: string;
}

const Recruitment: React.FC = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);

  useEffect(() => {
    const fetchVolunteers = async () => {
      const querySnapshot = await getDocs(collection(db, 'Volunteers'));
      const volunteersList: Volunteer[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        volunteersList.push({
          id: doc.id,
          name: data.name,
          shortDescription: data.shortDescription,
        });
      });
      setVolunteers(volunteersList);
    };

    fetchVolunteers();
  }, []);

  return (
    <section className="bg-gradient-to-tr from-teal-50 to-blue-200 py-10">
      <div className="py-16 bg-white">
        <div className="container m-auto px-6 space-y-8 text-gray-500 md:px-12 lg:px-20">
          <div className="justify-center text-center gap-6 md:text-left md:flex lg:items-center lg:gap-16">
            <div className="order-last mb-6 space-y-6 md:mb-0 md:w-6/12 lg:w-6/12">
              <div className="flex flex-col gap-5">
                <h1 className="text-4xl text-gray-700 font-bold lg:text-5xl xl:text-6xl">
                  Join <span className="bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent">OceanPals</span>
                </h1>
                <h1 className="text-4xl text-gray-700 font-bold lg:text-5xl xl:text-6xl">
                  Become <span className="bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent">Volunteer</span>
                </h1>
              </div>
              <p className="text-xl text-black">
                Are you ready to join and become our next volunteer on OceanPals? If you have interest in nature, then OceanPals are the perfect choice for you!
              </p>
            </div>
            <div className="grid grid-cols-5 grid-rows-4 gap-4 md:w-5/12 lg:w-6/12">
              <div className="col-span-2 row-span-4">
                <img src="/assets/volunteer/volunteer-1.png" className="rounded-full" width="640" height="960" alt="volunteer" loading="lazy" />
              </div>
              <div className="col-span-2 row-span-2">
                <img src="/assets/volunteer/volunteer-2.png" className="w-full h-full object-cover object-top rounded-xl" width="640" height="640" alt="volunteer" loading="lazy" />
              </div>
              <div className="col-span-3 row-span-3">
                <img src="/assets/volunteer/volunteer-3.png" className="w-full h-full object-cover object-top rounded-xl" width="640" height="427" alt="volunteer" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 overflow-hidden">
        <div className="container m-auto px-6 space-y-8 text-gray-500 md:px-12">
          <div>
            <span className="text-gray-600 text-lg font-semibold">Volunteer Division</span>
            <h2 className="mt-4 text-2xl text-gray-900 font-bold md:text-4xl">Choose 1 of 4 OceanPals Volunteer Divisions</h2>
          </div>
          <div className="mt-16 grid border divide-x divide-y rounded-xl overflow-hidden sm:grid-cols-2 lg:divide-y-0 lg:grid-cols-3 xl:grid-cols-4 text-left">
            {volunteers.map((volunteer) => (
              <div key={volunteer.id} className="relative group bg-white transition hover:z-[1] hover:shadow-2xl">
                <div className="relative p-8 space-y-8">
                  <div className="space-y-6">
                    <h5 className="text-2xl text-gray-800 font-medium transition group-hover:text-blue-700">{volunteer.name}</h5>
                    <p className="text-lg text-gray-600">{volunteer.shortDescription}</p>
                  </div>
                  <Link to={`/recruitment/${volunteer.id}`} className="flex justify-between items-center group-hover:text-blue-700">
                    <span className="text-sm">Read more</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Recruitment;
