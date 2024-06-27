import React, { useState, useEffect } from 'react';
import { useAuth } from '../../provider/AuthProvider'; // Adjust the path according to your project structure
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../FirebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Modal from './ProfileModal';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayName, setDisplayName] = useState(user?.username || '');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setDisplayName(user.username || '');
      // Fetch additional user details from Firestore if available
      const fetchUserDetails = async () => {
        const userDoc = await getDoc(doc(db, 'Users', user.uid));
        const userData = userDoc.data();
        if (userData) {
          setPhoneNumber(userData.phoneNumber || '');
          setAddress(userData.address || '');
          setProfilePicture(userData.profilePicture || null);
        }
      };
      fetchUserDetails();
    }
  }, [user]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleEditProfile = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    let profilePictureUrl = profilePicture;

    if (selectedImage) {
      const storageRef = ref(storage, `profilePictures/${user.uid}`);
      await uploadBytes(storageRef, selectedImage);
      profilePictureUrl = await getDownloadURL(storageRef);
    }

    const updates = {
      username: displayName,
      phoneNumber,
      address,
      profilePicture: profilePictureUrl,
    };

    const userRef = doc(db, 'Users', user.uid);
    await updateDoc(userRef, updates);

    // Assuming the user object in context is updated manually
    setIsModalOpen(false);
  };

  return (
    <section className="bg-gradient-to-tr from-teal-50 to-blue-200 flex flex-col items-center justify-center py-5 px-3 text-left">
      <div className="bg-white overflow-hidden shadow rounded-lg border">
        <div className="px-4 py-5 sm:px-6 flex flex-col items-center justify-center">
          <div className="relative inline-flex items-center justify-center w-20 h-20 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 mb-3">
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="font-medium text-gray-600 dark:text-gray-300">
                {user.username ? user.username.substring(0, 2).toUpperCase() : 'US'}
              </span>
            )}
          </div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            User Profile
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            This is some information about the user.
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Full Name
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {displayName}
              </dd>
            </div>
            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Email address
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user.email}
              </dd>
            </div>
            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Phone number
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {phoneNumber}
              </dd>
            </div>
            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Address
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {address}
              </dd>
            </div>
          </dl>
        </div>
        <div className="px-4 py-3 sm:px-6">
          <button
            onClick={handleEditProfile}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Edit Profile
          </button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleModalClose} onSave={handleSave}>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm"
            />
            {profilePicture && (
              <img src={profilePicture} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded-full" />
            )}
          </div>
        </form>
      </Modal>
    </section>
  );
};

export default Profile;
