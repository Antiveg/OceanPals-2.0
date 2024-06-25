import React from 'react';

interface EventCardProps {
  event: {
    EventName: string;
    EventLocation: string;
    IsSpecial: boolean;
    IsFinished: boolean;
    EventDate: string;
    EventTime: string;
    EventPoint: number;
    imageUrl: string;
  };
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <a href="#">
        <img className="p-8 rounded-t-lg" src={event.imageUrl} alt="product image" />
      </a>
      <div className="px-5 pb-5">
        <a href="#">
          <h5 className="lg:text-3xl md:text-xl sm:text-lg font-semibold tracking-tight text-gray-900 dark:text-white">{event.EventName}</h5>
        </a>
        <div className="flex items-center mt-2.5 mb-5">
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">{event.EventLocation}</span>
          {event.IsSpecial && <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-800 ml-1">Special</span>}
          {!event.IsSpecial && <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-800 ml-1">Custom</span>}
          {event.IsFinished && <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-purple-200 dark:text-purple-800 ml-1">Finished</span>}
          {!event.IsFinished && <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-yellow-200 dark:text-yellow-800 ml-1">Unfinished</span>}
        </div>
        <div className="flex items-center justify-between">
          <p className="lg:text-xl md:text-lg sm:text-sm font-semibold tracking-tight text-gray-900 dark:text-white">{new Date(event.EventDate).toLocaleDateString()}</p>
          <p className="lg:text-xl md:text-lg sm:text-sm font-semibold tracking-tight text-gray-900 dark:text-white">{event.EventTime}</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="lg:text-3xl md:text-xl sm:text-lg font-bold text-gray-900 dark:text-white">{event.EventPoint} Points</span>
          <a href="/events/detail" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Join Event</a>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
