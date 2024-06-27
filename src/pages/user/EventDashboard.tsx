import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDoc, doc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../FirebaseConfig';
import { useAuth } from '../../provider/AuthProvider';
import EventGuide from './EventGuide';
import Task from './Task';
import Performance from './Performance';

interface Event {
    title: string;
    description: string;
    image: string;
    point: number;
    place: string;
    date: string;
    tasks: Array<{ id: string; name: string; points: number }>;
}

interface UserTaskProgress {
    taskId: string;
    name: string;
    status: string;
    eventId: string;
}

const EventDashboard: React.FC = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const { user } = useAuth();
    const [event, setEvent] = useState<Event | null>(null);
    const [userTasks, setUserTasks] = useState<UserTaskProgress[]>([]);

    useEffect(() => {
        const fetchEvent = async () => {
            if (eventId) {
                const eventDoc = await getDoc(doc(db, 'Events', eventId));
                if (eventDoc.exists()) {
                    const eventData = eventDoc.data() as Event;
                    setEvent(eventData);
                }
            }
        };

        const fetchUserTaskProgress = () => {
            if (user && eventId) {
                const userTaskProgressQuery = query(
                    collection(db, 'Users', user.uid, 'UserTaskProgress'),
                    where('eventId', '==', eventId)
                );
                const unsubscribe = onSnapshot(userTaskProgressQuery, (snapshot) => {
                    const tasksData: UserTaskProgress[] = [];
                    snapshot.forEach((doc) => {
                        const data = doc.data();
                        console.log("UserTaskProgress Document Data:", data);
                        data.tasks.forEach((task: any) => {
                            tasksData.push({
                                taskId: task.taskId,
                                name: task.name,
                                status: task.status,
                                eventId: data.eventId
                            });
                        });
                    });
                    setUserTasks(tasksData);
                });

                return unsubscribe;
            }
        };

        fetchEvent();
        const unsubscribe = fetchUserTaskProgress();

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [eventId, user]);

    if (!event) {
        return <div>Loading...</div>;
    }

    return (
        <section className="bg-gradient-to-tr from-teal-50 to-blue-200">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16">
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 md:p-12">
                        <h2 className="text-gray-900 dark:text-white text-3xl font-extrabold mb-2">Event Description</h2>
                        <img src={event.image} alt={event.title} className="rounded-xl" />
                        <p className="mt-4 text-4xl font-normal text-gray-500 dark:text-gray-400 mb-2">
                            {event.title}
                        </p>
                        <p className="mt-2 text-xl font-normal text-black dark:text-gray-400 mb-4">
                            {event.place}
                        </p>
                        <ul className="ps-5 mt-2 space-y-1 list-disc list-inside">
                            <li>Points: {event.point}</li>
                            <li>Date: {new Date(event.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</li>
                            <li>Time: {new Date(event.date).toLocaleTimeString()}</li>
                        </ul>
                    </div>
                    {eventId && <EventGuide eventId={eventId} />}
                </div>

                <Task tasks={event.tasks || []} userTasks={userTasks || []} eventPoints={event.point} />
                {eventId && <Performance eventId={eventId} />}
            </div>
        </section>
    );
};

export default EventDashboard;
