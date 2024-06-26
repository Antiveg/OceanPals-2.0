import React, { useEffect, useState } from 'react';

interface TaskProps {
    tasks: Array<{ id: string; name: string }>;
    userTasks: Array<{ taskId: string; status: string }>;
}

const Task: React.FC<TaskProps> = ({ tasks, userTasks }) => {
    const [taskList, setTaskList] = useState(userTasks);

    useEffect(() => {
        setTaskList(userTasks);
    }, [userTasks]);

    const handleTaskCompletion = (taskId: string) => {
        setTaskList(prevTasks =>
            prevTasks.map(task =>
                task.taskId === taskId ? { ...task, status: 'Done' } : task
            )
        );
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 md:p-12 mb-8">
            <h1 className="text-gray-900 dark:text-white text-3xl md:text-5xl font-extrabold mb-2">My Task</h1>
            <p className="text-lg font-normal text-gray-500 dark:text-gray-400 mb-6">Finish the following tasks to get points</p>
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
                                        {tasks.map((task, index) => {
                                            const userTask = taskList.find(t => t.taskId === task.id);
                                            return (
                                                <tr key={task.id}>
                                                    <td className="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                                                        <div className="inline-flex items-center gap-x-3">
                                                            <span>{index + 1}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">{task.name}</td>
                                                    <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                                        <div className={`inline-flex items-center px-3 py-1 rounded-full gap-x-2 ${userTask?.status === 'Done' ? 'text-emerald-500 bg-emerald-100/60 dark:bg-gray-800' : 'text-red-500 bg-red-100/60 dark:bg-gray-800'}`}>
                                                            {userTask?.status === 'Done' ? (
                                                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>
                                                            ) : (
                                                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>
                                                            )}
                                                            <h2 className="text-sm font-normal">{userTask?.status || 'Not Done'}</h2>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                                                        <div className="flex items-center gap-x-6">
                                                            <button
                                                                className="text-blue-500 transition-colors duration-200 hover:text-indigo-500 focus:outline-none"
                                                                onClick={() => handleTaskCompletion(task.id)}
                                                            >
                                                                {userTask?.status === 'Done' ? 'View' : 'Complete'}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Task;
