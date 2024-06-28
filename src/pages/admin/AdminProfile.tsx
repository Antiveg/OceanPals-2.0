import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../../FirebaseConfig'; // Ensure this points to your Firebase configuration
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import { updatePassword } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const AdminProfile: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        profilePicture: ''
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        // Fetch current admin data
        const fetchAdminData = async () => {
            if (auth.currentUser) {
                const userDoc = await getDoc(doc(db, 'Users', auth.currentUser.uid));
                const userData = userDoc.data();
                if (userData) {
                    setFormData({
                        ...formData,
                        username: userData.username,
                        email: userData.email,
                        profilePicture: userData.profilePicture || ''
                    });
                    if (userData.profilePicture) {
                        setPreviewUrl(userData.profilePicture);
                    }
                }
            }
        };
        fetchAdminData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { username, password, confirmPassword } = formData;

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            let profilePictureUrl = formData.profilePicture;
            if (imageFile) {
                const imageRef = ref(storage, `profilePictures/${auth.currentUser?.uid}`);
                await uploadBytes(imageRef, imageFile);
                profilePictureUrl = await getDownloadURL(imageRef);
            }

            if (auth.currentUser) {
                // Update name and profile picture in Firestore
                const userRef = doc(db, 'Users', auth.currentUser.uid);
                await updateDoc(userRef, { 
                    username, 
                    profilePicture: profilePictureUrl 
                });

                // Update password if provided
                if (password) {
                    await updatePassword(auth.currentUser, password);
                }

                alert('Profile updated successfully');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <div className="container mx-auto mt-8 text-left mt-20">
            <div className="max-w-xl mx-auto bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-100 mb-4">Admin Profile</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-100">Name</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className="bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-100">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            value={formData.email}
                            readOnly
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-100">New Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-100">Confirm New Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className="bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-100">Profile Picture</label>
                        <input
                            type="file"
                            id="profilePicture"
                            name="profilePicture"
                            className="bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            onChange={handleImageChange}
                        />
                        {previewUrl && (
                            <div className="mt-4">
                                <img src={previewUrl} alt="Profile Preview" className="w-32 h-32 rounded-full object-cover" />
                            </div>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        Update Profile
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminProfile;
