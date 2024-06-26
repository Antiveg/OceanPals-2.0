import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../FirebaseConfig'; // Ensure this points to your Firebase configuration
import { useAuth } from '../../provider/AuthProvider'; // Adjust the path according to your project structure
import { doc, getDoc } from 'firebase/firestore';

const AdminSidebar: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [profilePicture, setProfilePicture] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfilePicture = async () => {
            if (user) {
                const userDoc = await getDoc(doc(db, 'Users', user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    if (userData && userData.profilePicture) {
                        setProfilePicture(userData.profilePicture);
                    }
                }
            }
        };

        fetchProfilePicture();
    }, [user]);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/login');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    return (
        <aside className="flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700">
            <a href="#" className="mx-auto">
                <img className="w-auto h-6 sm:h-7" src="https://merakiui.com/images/full-logo.svg" alt="Logo" />
            </a>

            <div className="flex flex-col items-center mt-6 -mx-2">
                {user && (
                    <>
                        <img
                            className="object-cover w-24 h-24 mx-2 rounded-full"
                            src={profilePicture || "https://unsplash.com/photos/white-and-brown-wooden-end-table-near-wall-inside-room-2dTeBxsF-Q0"}
                            alt="avatar"
                        />
                        <h4 className="mx-2 mt-2 font-medium text-gray-800 dark:text-gray-200">{user.username || user.email}</h4>
                        <p className="mx-2 mt-1 text-sm font-medium text-gray-600 dark:text-gray-400">{user.email}</p>
                    </>
                )}
            </div>

            <div className="flex flex-col justify-between flex-1 mt-6">
                <nav>
                    <button onClick={() => handleNavigation('/admin/dashboard')} className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg dark:bg-gray-800 dark:text-gray-200 w-full text-left">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="mx-4 font-medium">Dashboard</span>
                    </button>

                    <button onClick={() => handleNavigation('/admin/crud-panel')} className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 w-full text-left">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="mx-4 font-medium">CRUD Panel</span>
                    </button>

                    <button onClick={() => handleNavigation('/admin/profile')} className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 w-full text-left">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" fill="currentColor" className="fill-current text-gray-600 group-hover:text-cyan-600" />
                            <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" fill="currentColor" className="fill-current text-gray-300 group-hover:text-cyan-300" />
                        </svg>
                        <span className="mx-4 font-medium">Profile</span>
                    </button>

                    {/* Add more navigation items here as needed */}
                </nav>
            </div>

            <div className="px-6 -mx-6 pt-4 flex justify-between items-center border-t">
                <button onClick={handleLogout} className="bg-red-500 px-4 py-3 flex items-center space-x-4 rounded-md text-gray-100 group w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="group-hover:text-gray-700">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
