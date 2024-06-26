import React, { useState, useEffect } from 'react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../FirebaseConfig';
import { useAuth } from '../../provider/AuthProvider';
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";

interface TaskProps {
    tasks: Array<{ id: string; name: string; points: number }>;
    userTasks: Array<{ taskId: string; name: string; status: string; eventId: string }>;
    eventPoints: number;
}

const Task: React.FC<TaskProps> = ({ userTasks, eventPoints }) => {
    const { user } = useAuth();
    const [taskList, setTaskList] = useState(userTasks);
    const [currentTask, setCurrentTask] = useState<number | null>(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [countdown, setCountdown] = useState<number | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | ArrayBuffer | null>(null);
    const [weight, setWeight] = useState<number>(0);
    const [completedTasks, setCompletedTasks] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        setTaskList(userTasks);
    }, [userTasks]);

    const handleTaskCompletion = async (taskId: string, imageUrl?: string, weightValue?: number) => {
        if (user) {
            const userTask = taskList.find(task => task.taskId === taskId);
            if (userTask) {
                const userTaskProgressRef = doc(db, 'Users', user.uid, 'UserTaskProgress', userTask.eventId);
                const updatedTasks = taskList.map(task =>
                    task.taskId === taskId ? { ...task, status: 'Done' } : task
                );

                const taskType = userTask.name.toLowerCase().replace(/ /g, '');
                const imageField = taskType.includes('before') ? 'beforePhoto' : taskType.includes('after') ? 'afterPhoto' : 'weightPhoto';
                const updateData: any = { tasks: updatedTasks };

                if (imageUrl) {
                    updateData[imageField] = imageUrl;
                }

                if (taskType.includes('weight') && weightValue !== undefined) {
                    updateData['weight'] = weightValue;
                }

                await updateDoc(userTaskProgressRef, updateData);

                setCompletedTasks(prevState => ({
                    ...prevState,
                    [taskId]: imageUrl || ''
                }));
                setTaskList(updatedTasks);
                setCurrentTask(null);
                setIsModalOpen(false);

                if (updatedTasks.every(task => task.status === 'Done')) {
                    alert("All tasks are done!"); // Debug alert
                    await handleFinishAllTasks();
                }
            }
        }
    };

    const handleModalOpen = (taskIndex: number) => {
        setCurrentTask(taskIndex);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleStartCountdown = () => {
        setCountdown(10); // 10 seconds for testing
        setIsModalOpen(false);
    };

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (countdown !== null && countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prevCountdown => prevCountdown !== null ? prevCountdown - 1 : null);
            }, 1000);
        } else if (countdown === 0) {
            if (currentTask !== null) {
                handleTaskCompletion(taskList[currentTask].taskId);
            }
            setCountdown(null);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [countdown]);

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs}:${mins}:${secs}`;
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleWeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setWeight(Number(event.target.value));
    };

    const handleImageUpload = async (taskId: string, weightValue?: number) => {
        if (selectedImage && user) {
            const storage = getStorage();
            const storageRef = ref(storage, `taskImages/${user.uid}/${taskId}`);
            await uploadString(storageRef, selectedImage as string, 'data_url');
            const imageUrl = await getDownloadURL(storageRef);
            handleTaskCompletion(taskId, imageUrl, weightValue);
        }
    };

    const renderModalContent = () => {
        if (currentTask === null) return null;
        const task = taskList[currentTask];

        if (completedTasks[task.taskId]) {
            return <img src={completedTasks[task.taskId]} alt="Task Image" className="mt-4 max-w-full h-auto" />;
        }

        switch (task.name) {
            case 'Take a before photo':
                return (
                    <div>
                        <h2 className="text-white">Take a Before Photo</h2>
                        <input type="file" accept="image/*" onChange={handleImageChange} />
                        {selectedImage && <img src={selectedImage as string} alt="Selected" className="mt-4 max-w-full h-auto" />}
                        <button onClick={() => handleImageUpload(task.taskId)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
                    </div>
                );
            case 'Start the countdown':
                return (
                    <div>
                        <h2 className="text-white">Start the Countdown</h2>
                        <p className="text-white">Are you ready to start the countdown?</p>
                        <button onClick={handleStartCountdown} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Start Countdown</button>
                    </div>
                );
            case 'Take an after photo':
                return (
                    <div>
                        <h2 className="text-white">Take an After Photo</h2>
                        <input type="file" accept="image/*" onChange={handleImageChange} />
                        {selectedImage && <img src={selectedImage as string} alt="Selected" className="mt-4 max-w-full h-auto" />}
                        <button onClick={() => handleImageUpload(task.taskId)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
                    </div>
                );
            case 'Calculate waste weight':
                return (
                    <div>
                        <h2 className="text-white">Calculate Waste Weight</h2>
                        <input type="file" accept="image/*" onChange={handleImageChange} />
                        {selectedImage && <img src={selectedImage as string} alt="Selected" className="mt-4 max-w-full h-auto" />}
                        <input type="number" placeholder="Weight in kg" className="mt-4 p-2 bg-gray-800 text-white rounded" onChange={handleWeightChange} />
                        <button onClick={() => handleImageUpload(task.taskId, weight)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
                    </div>
                );
            default:
                return null;
        }
    };

    const handleFinishAllTasks = async () => {
        if(user){
            const halfPoints = eventPoints / 2;
            const userRef = doc(db, 'Users', user.uid);

            const userSnapshot = await getDoc(userRef);
            const userData = userSnapshot.data();
            const currentPoints = userData?.point || 0;

            await updateDoc(userRef, {
                point: currentPoints + halfPoints
            });

            alert(`Thank you for finishing the task, your task will be reviewed by admin. You have received ${halfPoints} points.`);
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 md:p-12 mb-8">
            <h1 className="text-gray-900 dark:text-white text-3xl md:text-5xl font-extrabold mb-2">My Task</h1>
            <p className="text-lg font-normal text-gray-500 dark:text-gray-400 mb-6">Finish the following tasks to get points</p>
            {countdown !== null && countdown > 0 && (
                <div className="mb-6 text-2xl font-semibold text-red-500">
                    Countdown: {formatTime(countdown)}
                </div>
            )}
            <section className="container px-4 mx-auto">
                <div className="flex flex-col">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-800">
                                        <tr>
                                            <th className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                                <div className="flex items-center gap-x-3">
                                                    <span>No</span>
                                                </div>
                                            </th>
                                            <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Task</th>
                                            <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Status</th>
                                            <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                                        {taskList.map((task, index) => (
                                            <tr key={task.taskId}>
                                                <td className="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                                                    <div className="inline-flex items-center gap-x-3">
                                                        <span>{index + 1}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">{task.name}</td>
                                                <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                                    <div className={`inline-flex items-center px-3 py-1 rounded-full gap-x-2 ${task.status === 'Done' ? 'text-emerald-500 bg-emerald-100/60 dark:bg-gray-800' : 'text-red-500 bg-red-100/60 dark:bg-gray-800'}`}>
                                                        {task.status === 'Done' ? (
                                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        ) : (
                                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        )}
                                                        <h2 className="text-sm font-normal">{task.status}</h2>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-sm whitespace-nowrap">
                                                    <div className="flex items-center gap-x-6">
                                                        <button
                                                            className="text-blue-500 transition-colors duration-200 hover:text-indigo-500 focus:outline-none"
                                                            onClick={() => handleModalOpen(index)}
                                                            disabled={index > 0 && taskList[index - 1].status !== 'Done'}
                                                        >
                                                            {task.status === 'Done' ? 'View' : 'Start'}
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

            {isModalOpen && (
                <div id="overlay" className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-40">
                    <div className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-[calc(100%-1rem)] max-h-full">
                        <div className="relative p-4 w-full max-w-2xl max-h-full">
                            <div className="relative bg-gray-800 text-white rounded-lg shadow">
                                <div className="flex items-center justify-between p-4 border-b rounded-t border-gray-600">
                                    <h3 className="text-xl font-semibold">{taskList[currentTask!].name}</h3>
                                    <button
                                        type="button"
                                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                        onClick={handleModalClose}
                                    >
                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                            />
                                        </svg>
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                </div>
                                <div className="p-4">
                                    {renderModalContent()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Task;
