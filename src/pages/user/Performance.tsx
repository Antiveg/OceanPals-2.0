import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../FirebaseConfig';

interface PerformanceProps {
    eventId: string;
}

const Performance: React.FC<PerformanceProps> = ({ eventId }) => {
    const [totalWeight, setTotalWeight] = useState<number>(0);
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [userImages, setUserImages] = useState<string[]>([]);

    useEffect(() => {
        const fetchPerformanceData = () => {
            if (eventId) {
                const userTaskProgressQuery = query(
                    collection(db, 'Users'),
                    where('UserTaskProgress.eventId', '==', eventId)
                );

                const unsubscribe = onSnapshot(userTaskProgressQuery, (snapshot) => {
                    let weightSum = 0;
                    const userSet = new Set<string>();
                    const images: string[] = [];

                    snapshot.forEach((doc) => {
                        const data = doc.data();
                        const userTaskProgress = data.UserTaskProgress || [];
                        userTaskProgress.forEach((taskProgress: any) => {
                            if (taskProgress.eventId === eventId) {
                                weightSum += taskProgress.weight || 0;
                                userSet.add(doc.id);
                                if (data.photoURL) {
                                    images.push(data.photoURL);
                                }
                            }
                        });
                    });

                    setTotalWeight(weightSum);
                    setTotalUsers(userSet.size);
                    setUserImages(images);
                });

                return unsubscribe;
            }
        };

        const unsubscribe = fetchPerformanceData();

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [eventId]);

    return (
        <section className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 md:p-12 mb-8">
            <h2 className="font-extrabold text-gray-800 text-6xl dark:text-white">Event Performance</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">Please refresh this site to see live updates</p>

            <div className="flex flex-col mt-6">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th scope="col" className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                            <button className="flex items-center gap-x-3 focus:outline-none">
                                                <span>Assignment</span>
                                            </button>
                                        </th>
                                        <th scope="col" className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Status</th>
                                        <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Description</th>
                                        <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Users</th>
                                        <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Progress</th>
                                        <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                                    <tr>
                                        <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                                            <div>
                                                <h2 className="font-medium text-gray-800 dark:text-white">Total Weight</h2>
                                            </div>
                                        </td>
                                        <td className="px-12 py-4 text-sm font-medium whitespace-nowrap">
                                            <div className="inline px-3 py-1 text-sm font-normal rounded-full text-emerald-500 gap-x-2 bg-emerald-100/60 dark:bg-gray-800">
                                                Active
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400">Calculating total amount of waste collected</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                                            <div className="flex items-center">
                                                {userImages.slice(0, 3).map((src, idx) => (
                                                    <img key={idx} className="object-cover w-6 h-6 -mx-1 border-2 border-white rounded-full dark:border-gray-700 shrink-0" src={src} alt="user" />
                                                ))}
                                                {userImages.length > 3 && (
                                                    <p className="flex items-center justify-center w-6 h-6 -mx-1 text-xs text-blue-600 bg-blue-100 border-2 border-white rounded-full">
                                                        +{userImages.length - 3}
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                                            <div className="w-48 h-1.5 bg-blue-200 overflow-hidden rounded-full">
                                                <div className="bg-blue-500 h-1.5" style={{ width: `${(totalWeight / 1000) * 100}%` }}></div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                                            <h2 className="font-medium text-gray-800 dark:text-white">{totalWeight}/1000 kg</h2>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                                            <div>
                                                <h2 className="font-medium text-gray-800 dark:text-white">Total Users</h2>
                                            </div>
                                        </td>
                                        <td className="px-12 py-4 text-sm font-medium whitespace-nowrap">
                                            <div className="inline px-3 py-1 text-sm font-normal rounded-full text-emerald-500 gap-x-2 bg-emerald-100/60 dark:bg-gray-800">
                                                Active
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400">Counting all users who participate</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                                            <div className="flex items-center">
                                                {userImages.slice(0, 3).map((src, idx) => (
                                                    <img key={idx} className="object-cover w-6 h-6 -mx-1 border-2 border-white rounded-full dark:border-gray-700 shrink-0" src={src} alt="user" />
                                                ))}
                                                {userImages.length > 3 && (
                                                    <p className="flex items-center justify-center w-6 h-6 -mx-1 text-xs text-blue-600 bg-blue-100 border-2 border-white rounded-full">
                                                        +{userImages.length - 3}
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                                            <div className="w-48 h-1.5 bg-blue-200 overflow-hidden rounded-full">
                                                <div className="bg-blue-500 h-1.5" style={{ width: `${(totalUsers / 100) * 100}%` }}></div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                                            <h2 className="font-medium text-gray-800 dark:text-white">{totalUsers}/100 users</h2>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Performance;
