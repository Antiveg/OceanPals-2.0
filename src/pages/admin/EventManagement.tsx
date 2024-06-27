import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../FirebaseConfig';

const EventManagement: React.FC = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState<any[]>([]);

    const fetchEvents = async () => {
        const querySnapshot = await getDocs(collection(db, 'Events'));
        const fetchedEvents = querySnapshot.docs.map((doc, index) => ({
            ...doc.data(),
            id: doc.id,
            index: index + 1,
        }));
        setEvents(fetchedEvents);
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleForumRedirect = (eventId: string) => {
        navigate(`/admin/forum/${eventId}`);
    };

    const handleApprovalRedirect = (eventId: string) => {
        navigate(`/admin/events/${eventId}`);
    };

    return (
        <section className="container px-4 mx-auto">
            <div className="flex items-center gap-x-3">
                <h2 className="text-lg font-medium text-gray-800 dark:text-white">Event Management</h2>
                <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">
                    {events.length} events
                </span>
            </div>

            <div className="flex flex-col mt-6">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">No.</th>
                                        <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Name</th>
                                        <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Date</th>
                                        <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Time</th>
                                        <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Participants</th>
                                        <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                                    {events.map(event => (
                                        <tr key={event.id}>
                                            <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">{event.index}</td>
                                            <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">{event.name}</td>
                                            <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">{new Date(event.date).toLocaleDateString()}</td>
                                            <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">{new Date(event.date + ' ' + event.time).toLocaleTimeString()}</td>
                                            <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                                                {event.participants ? event.participants.length : 0}
                                            </td>
                                            <td className="px-4 py-4 text-sm whitespace-nowrap">
                                                <div className="flex items-center gap-x-2">
                                                    <button
                                                        onClick={() => handleForumRedirect(event.id)}
                                                        className="text-blue-500 hover:text-blue-700"
                                                    >
                                                        Forum
                                                    </button>
                                                    <button
                                                        onClick={() => handleApprovalRedirect(event.id)}
                                                        className="text-green-500 hover:text-green-700"
                                                    >
                                                        Approval
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EventManagement;
