import React, { useState } from 'react';
import { db, storage } from '../../../FirebaseConfig'; // Ensure this points to your Firebase configuration
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const AddUserModal: React.FC<{ isOpen: boolean; onClose: () => void; fetchData: () => void; }> = ({ isOpen, onClose, fetchData }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'user',
    });
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProfilePicture(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let profilePictureUrl = '';
            if (profilePicture) {
                const profilePictureRef = ref(storage, `profilePictures/${profilePicture.name}`);
                await uploadBytes(profilePictureRef, profilePicture);
                profilePictureUrl = await getDownloadURL(profilePictureRef);
            }

            await addDoc(collection(db, 'Users'), {
                ...formData,
                profilePicture: profilePictureUrl,
            });
            fetchData();
            onClose();
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 text-left">
            <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
            <div className="relative bg-gray-800 rounded-lg shadow-lg p-6 max-w-lg w-full mx-auto">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-100">Add New User</h3>
                    <button
                        type="button"
                        className="text-gray-400 hover:bg-gray-600 hover:text-gray-100 rounded-lg text-sm p-1.5"
                        onClick={onClose}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 mb-4 grid-cols-1">
                        <div>
                            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-100">Name</label>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                className="bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                placeholder="Type user name"
                                required
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-100">Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                placeholder="Type user email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-100">Password</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                className="bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                placeholder="Type user password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-100">Role</label>
                            <select
                                name="role"
                                id="role"
                                className="bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="profilePicture" className="block mb-2 text-sm font-medium text-gray-100">Profile Picture</label>
                            <input
                                type="file"
                                name="profilePicture"
                                id="profilePicture"
                                className="bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                onChange={handleProfilePictureChange}
                            />
                            {previewUrl && (
                                <div className="mt-2">
                                    <img src={previewUrl} alt="Profile Preview" className="w-24 h-24 object-cover rounded-full" />
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        Add new user
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddUserModal;
