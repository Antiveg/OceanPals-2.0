import React, { useEffect, useState, useContext } from 'react';
import { db } from '../../FirebaseConfig'; // Ensure this points to your Firebase configuration
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { Pie, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { AuthContext } from '../../provider/AuthProvider'; // Adjust the path according to your project structure

const AdminDashboard: React.FC = () => {
    const { user, loading } = useContext(AuthContext) || { user: null, loading: true };
    const [counts, setCounts] = useState({ users: 0, events: 0, volunteers: 0, stores: 0 });
    const [loginData, setLoginData] = useState<number[]>([]);

    useEffect(() => {
        const fetchCounts = async () => {
            const usersSnapshot = await getDocs(collection(db, 'Users'));
            const eventsSnapshot = await getDocs(collection(db, 'Events'));
            const volunteersSnapshot = await getDocs(collection(db, 'Volunteers'));
            const storesSnapshot = await getDocs(collection(db, 'Stores'));

            setCounts({
                users: usersSnapshot.size,
                events: eventsSnapshot.size,
                volunteers: volunteersSnapshot.size,
                stores: storesSnapshot.size,
            });
        };

        const fetchLoginData = async () => {
            const today = new Date();
            const weekAgo = new Date(today);
            weekAgo.setDate(today.getDate() - 7);

            const loginQuery = query(collection(db, 'UserLogins'), where('timestamp', '>=', Timestamp.fromDate(weekAgo)));
            const loginSnapshot = await getDocs(loginQuery);

            const loginCounts = Array(7).fill(0);
            loginSnapshot.forEach(doc => {
                const date = doc.data().timestamp.toDate();
                const dayIndex = today.getDay() - date.getDay();
                loginCounts[dayIndex]++;
            });

            setLoginData(loginCounts);
        };

        fetchCounts();
        fetchLoginData();
    }, []);

    const pieData = {
        labels: ['Users', 'Events', 'Volunteers', 'Stores'],
        datasets: [
            {
                data: [counts.users, counts.events, counts.volunteers, counts.stores],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
            }
        ]
    };

    const lineData = {
        labels: ['7 days ago', '6 days ago', '5 days ago', '4 days ago', '3 days ago', '2 days ago', 'Yesterday'],
        datasets: [
            {
                label: 'User Logins',
                data: loginData,
                fill: false,
                backgroundColor: '#36A2EB',
                borderColor: '#36A2EB',
            }
        ]
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Hello, {user?.username || "Admin"}! <span role="img" aria-label="waving">👋</span> What Would You Like to Do Today?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">Counts</h3>
                    <Pie data={pieData} />
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">User Logins This Week</h3>
                    <Line data={lineData} />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
