import React, { useEffect, useState } from 'react';
import EventCard from './EventCard';
import { Loader } from '@googlemaps/js-api-loader';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../FirebaseConfig';

const Event: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, 'Events'));
      const fetchedEvents = querySnapshot.docs.map(doc => doc.data());
      setEvents(fetchedEvents);
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const loader = new Loader({
      apiKey: 'AIzaSyCC4uvj9fFdWhDTi9qo-0zMQuj_odeEUFE',
      version: 'weekly',
    });

    loader.load().then(() => {
      const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        zoom: 5,
        center: { lat: -4.022574206598659, lng: 122.58989586223134 }
      });

      events.forEach(event => {
        const marker = new google.maps.Marker({
          position: { lat: event.latitude, lng: event.longitude },
          map: map,
          title: event.name,
        });

        const infowindow = new google.maps.InfoWindow({
          content: `
            <div class="max-w-xs overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800">
              <div class="px-4 py-2">
                <h1 class="text-xl font-bold text-gray-800 uppercase dark:text-white">${event.name}</h1>
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">${event.shortDescription}</p>
              </div>
              <img class="object-cover w-full h-48 mt-2" src="${event.image}" alt="${event.name}">
              <div class="flex items-center justify-between px-4 py-2 bg-blue-700">
                <h1 class="text-lg font-bold text-white">${event.point} pt</h1>
                <button class="px-2 py-1 text-xs font-semibold text-gray-900 transition-colors duration-300 transform bg-white rounded hover:bg-gray-200 focus:bg-gray-400 focus:outline-none"><a href="/events/${event.id}">Go to event</a></button>
              </div>
            </div>
          `
        });

        marker.addListener('click', function () {
          infowindow.open(map, marker);
        });
      });
    });

    return () => {
      delete (window as any).initMap;
    };
  }, [events]);

  return (
    <section className="bg-gradient-to-tr from-teal-50 to-blue-200 py-10">
      <h1 className="text-center mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-7xl">
        <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">OceanPals Map Events</span>
      </h1>

      {/* Google Maps Section */}
      <div id="map" style={{ height: '450px', width: '100%' }} className="my-8"></div>

      {/* Card list */}
      <div className="flex items-center justify-center py-4 md:py-8 flex-wrap">
        <button type="button" className="text-blue-700 hover:text-white border border-blue-600 bg-white hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-full text-base font-medium px-5 py-2.5 text-center me-3 mb-3 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:bg-gray-900 dark:focus:ring-blue-800">All categories</button>
        <button type="button" className="text-gray-900 border border-white hover:border-gray-200 dark:border-gray-900 dark:bg-gray-900 dark:hover:border-gray-700 bg-white focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-full text-base font-medium px-5 py-2.5 text-center me-3 mb-3 dark:text-white dark:focus:ring-gray-800">Special</button>
        <button type="button" className="text-gray-900 border border-white hover:border-gray-200 dark:border-gray-900 dark:bg-gray-900 dark:hover:border-gray-700 bg-white focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-full text-base font-medium px-5 py-2.5 text-center me-3 mb-3 dark:text-white dark:focus:ring-gray-800">Custom</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-5">
        {events.length === 0 ? (
          <h1 className="text-9xl">No Events</h1>
        ) : (
          events.map((event, index) => <EventCard key={index} event={event} />)
        )}
      </div>
    </section>
  );
};

export default Event;
