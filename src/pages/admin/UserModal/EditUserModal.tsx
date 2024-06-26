import React, { useState, useEffect } from 'react';
import { db, storage } from '../../../FirebaseConfig'; // Ensure this points to your Firebase configuration
import { updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const EditUserModal: React.FC<{ isOpen: boolean; onClose: () => void; fetchData: () => void; userData: any; }> = ({ isOpen, onClose, fetchData, userData }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        role: 'user',
        profilePicture: ''
    });
    const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
    const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);

    useEffect(() => {
        if (userData) {
            setFormData({
                username: userData.username,
                email: userData.email,
                role: userData.role,
                profilePicture: userData.profilePicture
            });
            setProfilePicturePreview(userData.profilePicture);
        }
    }, [userData]);

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
            setProfilePictureFile(file);
            setProfilePicturePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let profilePictureUrl = formData.profilePicture;
            if (profilePictureFile) {
                const profilePictureRef = ref(storage, `profilePictures/${profilePictureFile.name}`);
                await uploadBytes(profilePictureRef, profilePictureFile);
                profilePictureUrl = await getDownloadURL(profilePictureRef);
            }

            await updateDoc(doc(db, 'Users', userData.id), {
                ...formData,
                profilePicture: profilePictureUrl,
            });
            fetchData();
            onClose();
        } catch (error) {
            console.error('Error updating document: ', error);
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 text-left">
            <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
            <div className="relative bg-gray-800 rounded-lg shadow-lg p-6 max-w-lg w-full mx-auto text-left">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-100">Edit User</h3>
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
                            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-100">Username</label>
                            <input 
                                type="text" 
                                name="username" 
                                id="username" 
                                className="bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                                placeholder="Type username" 
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
                                placeholder="Type email" 
                                readOnly 
                                value={formData.email} 
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
                            {profilePicturePreview && (
                                <img src={profilePicturePreview} alt="Profile Preview" className="mt-2 w-24 h-24 rounded-full" />
                            )}
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        Update user
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditUserModal;
