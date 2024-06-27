import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
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
    const [overallStatus, setOverallStatus] = useState<string | null>(null);

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
                const userTaskProgressDocRef = doc(db, 'Users', user.uid, 'UserTaskProgress', eventId);
                const unsubscribe = onSnapshot(userTaskProgressDocRef, async (docSnapshot) => {
                    if (docSnapshot.exists()) {
                        const data = docSnapshot.data();
                        console.log("UserTaskProgress Document Data:", data);
                        const tasksData: UserTaskProgress[] = data.tasks.map((task: any) => ({
                            taskId: task.taskId,
                            name: task.name,
                            status: task.status,
                            eventId: data.eventId
                        }));
                        setUserTasks(tasksData);

                        // Set the overall status from the main document
                        const status = data.status || 'Waiting for Approval';
                        setOverallStatus(status);

                        // If the status is 'Approved', clear activeEventId and award full points
                        if (status === 'Approved') {
                            const userDocRef = doc(db, 'Users', user.uid);
                            const userDoc = await getDoc(userDocRef);
                            if (userDoc.exists()) {
                                const userData = userDoc.data();
                                const points = event!.point;
                                console.log(`Full points awarded: ${points}`);
                                await updateDoc(userDocRef, { points: userData.points + points, activeEventId: '' });
                                alert('Your request has been approved. Thank you!');
                            }
                        }
                    }
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

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'Approved':
                return 'bg-green-100 text-green-800 rounded px-2 py-1';
            case 'Not Approved':
                return 'bg-red-100 text-red-800 rounded px-2 py-1';
            case 'Waiting for Approval':
            default:
                return 'bg-yellow-100 text-yellow-800 rounded px-2 py-1';
        }
    };

    const getStatusMessage = (status: string) => {
        switch (status) {
            case 'Approved':
                return 'Your request has been approved. Thank You!';
            case 'Not Approved':
                return 'Your request has been denied by admin due to several reasons, your points will be deducted.';
            case 'Waiting for Approval':
            default:
                return 'Right now you received all of the points, if admin does not approve, then your points will be deducted.';
        }
    };

    if (!event) {
        return <div>Loading...</div>;
    }

    return (
        <section className="bg-gradient-to-tr from-teal-50 to-blue-200 text-left">
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
                        
                        {overallStatus && (
                            <div className="mt-4">
                                <p className={`font-semibold ${getStatusClass(overallStatus)}`}>Status: {overallStatus}</p>
                                <p className="mt-2 text-gray-700 dark:text-gray-300">Message: {getStatusMessage(overallStatus)}</p>
                            </div>
                        )}
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
