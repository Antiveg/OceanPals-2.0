import React, { useState, useEffect } from 'react';
import { getDocs, collection, query, getDoc, doc } from 'firebase/firestore';
import { db } from '../../FirebaseConfig';
import { useAuth } from '../../provider/AuthProvider';

interface Event {
    title: string;
    description: string;
    image: string;
    point: number;
    place: string;
    date: string;
}

const History: React.FC = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        const fetchEvents = async () => {
            if (user) {
                const userEventsQuery = query(collection(db, 'Users', user.uid, 'UserTaskProgress'));
                const userEventsSnapshot = await getDocs(userEventsQuery);
                const eventIds = userEventsSnapshot.docs.map(doc => doc.data().eventId);

                const eventsData: Event[] = [];
                for (const eventId of eventIds) {
                    const eventDoc = await getDoc(doc(db, 'Events', eventId));
                    if (eventDoc.exists()) {
                        eventsData.push(eventDoc.data() as Event);
                    }
                }
                setEvents(eventsData);
            }
        };

        fetchEvents();
    }, [user]);

    return (
        <section className="bg-gradient-to-tr from-teal-50 to-blue-200 text-left h-screen">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16">
                <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">Event History</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    {events.map((event, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 md:p-12">
                            <h3 className="text-gray-900 dark:text-white text-2xl font-bold mb-2">{event.title}</h3>
                            <img src={event.image} alt={event.title} className="rounded-xl mb-4" />
                            <p className="text-gray-500 dark:text-gray-400 mb-2">{event.description}</p>
                            <p className="text-gray-500 dark:text-gray-400 mb-2"><strong>Location:</strong> {event.place}</p>
                            <p className="text-gray-500 dark:text-gray-400 mb-2"><strong>Date:</strong> {new Date(event.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                            <p className="text-gray-500 dark:text-gray-400"><strong>Points:</strong> {event.point}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default History;
