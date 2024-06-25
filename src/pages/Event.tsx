import React, { useEffect } from 'react';
import EventCard from './EventCard';

const events = [
  // Sample events data
  {
    EventName: 'Ancol Beach Cleanup',
    EventLocation: 'Ancol',
    IsSpecial: true,
    IsFinished: false,
    EventDate: '2024-06-25',
    EventTime: '10:00 AM',
    EventPoint: 100,
    imageUrl: '/assets/volunteer/volunteer-1.png',
  },
  {
    EventName: 'Gili Trawangan Conservation',
    EventLocation: 'Gili Trawangan',
    IsSpecial: true,
    IsFinished: false,
    EventDate: '2024-07-01',
    EventTime: '8:00 AM',
    EventPoint: 200,
    imageUrl: '/assets/volunteer/volunteer-2.png',
  },
  {
    EventName: 'Kuta Beach Cleanup',
    EventLocation: 'Kuta Beach',
    IsSpecial: false,
    IsFinished: false,
    EventDate: '2024-07-05',
    EventTime: '9:00 AM',
    EventPoint: 150,
    imageUrl: '/assets/volunteer/volunteer-3.png',
  },
];

const Event: React.FC = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCC4uvj9fFdWhDTi9qo-0zMQuj_odeEUFE&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    (window as any).initMap = function () {
      const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        zoom: 5,
        center: { lat: -4.022574206598659, lng: 122.58989586223134 }
      });

      const locations = [
        {
          position: { lat: -6.125630631967499, lng: 106.84167679442943 },
          title: 'Ancol Beach Cleanup',
          content: `
            <div class="max-w-xs overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800">
              <div class="px-4 py-2">
                <h1 class="text-xl font-bold text-gray-800 uppercase dark:text-white">Ancol Beach Cleanup</h1>
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Ancol is known busy for its tourist around Jakarta people, but the waste here is very large! Help us to clean it by joining!</p>
              </div>
              <img class="object-cover w-full h-48 mt-2" src="/assets/volunteer/volunteer-1.png" alt="event name">
              <div class="flex items-center justify-between px-4 py-2 bg-blue-700">
                <h1 class="text-lg font-bold text-white">100 pt</h1>
                <button class="px-2 py-1 text-xs font-semibold text-gray-900 transition-colors duration-300 transform bg-white rounded hover:bg-gray-200 focus:bg-gray-400 focus:outline-none"><a href="/events/detail">Go to event</a></button>
              </div>
            </div>
          `
        },
        {
          position: { lat: -8.219752852256939, lng: 116.03872390268808 },
          title: 'Gili Trawangan Conservation',
          content: `
            <div class="max-w-xs overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800">
              <div class="px-4 py-2">
                <h1 class="text-xl font-bold text-gray-800 uppercase dark:text-white">Gili Trawangan Conservation</h1>
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Embark a journey to Nusa Tenggara, where beautiful paradise needs your help</p>
              </div>
              <img class="object-cover w-full h-48 mt-2" src="/assets/volunteer/volunteer-2.png" alt="event name">
              <div class="flex items-center justify-between px-4 py-2 bg-blue-700">
                <h1 class="text-lg font-bold text-white">200 pt</h1>
                <button class="px-2 py-1 text-xs font-semibold text-gray-900 transition-colors duration-300 transform bg-white rounded hover:bg-gray-200 focus:bg-gray-400 focus:outline-none"><a href="/events/detail">Go to event</a></button>
              </div>
            </div>
          `
        },
        {
          position: { lat: -8.717165201139528, lng: 115.16804366011044 },
          title: 'Kuta Beach Cleanup',
          content: `
            <div class="max-w-xs overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800">
              <div class="px-4 py-2">
                <h1 class="text-xl font-bold text-gray-800 uppercase dark:text-white">Kuta Beach Cleanup</h1>
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Help us keep Bali's beaches clean and beautiful. Join our beach cleanup event!</p>
              </div>
              <img class="object-cover w-full h-48 mt-2" src="/assets/volunteer/volunteer-3.png" alt="event name">
              <div class="flex items-center justify-between px-4 py-2 bg-blue-700">
                <h1 class="text-lg font-bold text-white">100 pt</h1>
                <button class="px-2 py-1 text-xs font-semibold text-gray-900 transition-colors duration-300 transform bg-white rounded hover:bg-gray-200 focus:bg-gray-400 focus:outline-none"><a href="/events/detail">Go to event</a></button>
              </div>
            </div>
          `
        }
      ];

      locations.forEach(location => {
        const marker = new google.maps.Marker({
          position: location.position,
          map: map,
          title: location.title
        });

        const infowindow = new google.maps.InfoWindow({
          content: location.content
        });

        marker.addListener('click', function () {
          infowindow.open(map, marker);
        });
      });
    };

    return () => {
      delete (window as any).initMap;
    };
  }, []);

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
        <a href="/events/new-event">
          <button type="button" className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 me-3">Create New Event</button>
        </a>
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
