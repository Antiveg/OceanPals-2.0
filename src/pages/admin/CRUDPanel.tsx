import React, { useEffect, useState } from 'react';
import { db } from '../../FirebaseConfig'; // Ensure this points to your Firebase configuration
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import AddUserModal from './UserModal/AddUserModal';
import EditUserModal from './UserModal/EditUserModal';
import AddEventModal from './EventModal/AddEventModal';
import EditEventModal from './EventModal/EditEventModal';
import AddVolunteerModal from './VolunteerModal/AddVolunteerModal';
import EditVolunteerModal from './VolunteerModal/EditVolunteerModal';
import AddStoreModal from './StoreModal/AddStoreModal';
import EditStoreModal from './StoreModal/EditStoreModal';
import ConfirmationModal from './ConfirmationModal'; // Import ConfirmationModal

const CRUDPanel: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [type, setType] = useState('Users');
    const [addModalIsOpen, setAddModalIsOpen] = useState(false);
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);
    const [confirmationModalIsOpen, setConfirmationModalIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [itemToDelete, setItemToDelete] = useState<any>(null);

    const fetchData = async () => {
        const querySnapshot = await getDocs(collection(db, type));
        const fetchedData = querySnapshot.docs.map((doc, index) => ({
            ...doc.data(),
            id: doc.id,
            index: index + 1,
        }));
        setData(fetchedData);
    };

    useEffect(() => {
        fetchData();
    }, [type]);

    const handleDelete = async () => {
        if (itemToDelete) {
            await deleteDoc(doc(db, type, itemToDelete.id));
            fetchData();
            setConfirmationModalIsOpen(false);
        }
    };

    const openAddModal = () => {
        setAddModalIsOpen(true);
    };

    const closeAddModal = () => {
        setAddModalIsOpen(false);
    };

    const openEditModal = (item: any) => {
        setSelectedItem(item);
        setEditModalIsOpen(true);
    };

    const closeEditModal = () => {
        setEditModalIsOpen(false);
    };

    const openConfirmationModal = (item: any) => {
        setItemToDelete(item);
        setConfirmationModalIsOpen(true);
    };

    const closeConfirmationModal = () => {
        setConfirmationModalIsOpen(false);
    };

    const renderTableHeaders = () => {
        if (type === 'Users') {
            return (
                <>
                    <th>No.</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Profile Picture</th>
                    <th>Points</th>
                    <th>Action</th>
                </>
            );
        } else if (type === 'Events') {
            return (
                <>
                    <th>No.</th>
                    <th>Name</th>
                    <th>Short Description</th>
                    <th>Full Description</th>
                    <th>Point</th>
                    <th>Image</th>
                    <th>Location</th>
                    <th>Latitude</th>
                    <th>Longitude</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Special</th>
                    <th>Participants</th>
                    <th>Action</th>
                </>
            );
        } else if (type === 'Volunteers') {
            return (
                <>
                    <th>No.</th>
                    <th>Name</th>
                    <th>Short Description</th>
                    <th>Full Description</th>
                    <th>Image</th>
                    <th>Current Volunteered User</th>
                    <th>Action</th>
                </>
            );
        } else if (type === 'Stores') {
            return (
                <>
                    <th>No.</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Image</th>
                    <th>Point</th>
                    <th>Stock</th>
                    <th>Action</th>
                </>
            );
        }
    };

    const renderTableRows = () => {
        if (data.length === 0) {
            return (
                <tr>
                    <td colSpan={type === 'Users' ? 6 : 13} className="text-center py-4">
                        No Items to Display
                    </td>
                </tr>
            );
        }

        return data.map((item) => (
            <tr key={item.id}>
                <td>{item.index}</td>
                <td>{item.username || item.name}</td>
                {type === 'Users' && (
                    <>
                        <td>{item.email}</td>
                        <td>{item.role}</td>
                        <td>
                            <img src={item.profilePicture} alt={item.username} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                        </td>
                        <td>{item.point}</td>
                    </>
                )}
                {type === 'Events' && (
                    <>
                        <td>{item.shortDescription}</td>
                        <td>{item.fullDescription}</td>
                        <td>{item.point}</td>
                        <td>
                            <img src={item.image} alt={item.name} style={{ width: '100px', height: '100px' }} />
                        </td>
                        <td>{item.place}</td>
                        <td>{item.latitude}</td>
                        <td>{item.longitude}</td>
                        <td>{item.date}</td>
                        <td>{item.time}</td>
                        <td>{new Date(item.date + ' ' + item.time) < new Date() ? 'Finished' : 'Unfinished'}</td>
                        <td>{item.special ? 'Yes' : 'No'}</td>
                        <td></td>
                    </>
                )}
                {type === 'Volunteers' && (
                    <>
                        <td>{item.shortDescription}</td>
                        <td>{item.fullDescription}</td>
                        <td>
                            <img src={item.image} alt={item.name} style={{ width: '100px', height: '100px' }} />
                        </td>
                        <td>{item.currentVolunteeredUser}</td>
                    </>
                )}
                {type === 'Stores' && (
                    <>
                        <td>{item.description}</td>
                        <td>
                            <img src={item.image} alt={item.name} style={{ width: '100px', height: '100px' }} />
                        </td>
                        <td>{item.point}</td>
                        <td>{item.stock}</td>
                    </>
                )}
                <td>
                    <button onClick={() => openEditModal(item)}>Edit</button>
                    <button onClick={() => openConfirmationModal(item)}>Delete</button>
                </td>
            </tr>
        ));
    };

    return (
        <section className="container px-4 mx-auto">
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-x-3">
                        <h2 className="text-lg font-medium text-gray-800 dark:text-white">{type.charAt(0).toUpperCase() + type.slice(1)}</h2>
                        <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">{data.length} {type}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">Manage your {type} data.</p>
                </div>
                <div className="flex items-center mt-4 gap-x-3">
                    <button className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700" onClick={openAddModal}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_3098_154395)">
                                <path d="M13.3333 13.3332L9.99997 9.9999M9.99997 9.9999L6.66663 13.3332M9.99997 9.9999V17.4999M16.9916 15.3249C17.8044 14.8818 18.4465 14.1806 18.8165 13.3321C19.1866 12.4835 19.2635 11.5359 19.0351 10.6388C18.8068 9.7417 18.2862 8.94616 17.5555 8.37778C16.8248 7.80939 15.9257 7.50052 15 7.4999H13.95C13.6977 6.52427 13.2276 5.61852 12.5749 4.85073C11.9222 4.08295 11.104 3.47311 10.1817 3.06708C9.25943 2.66104 8.25709 2.46937 7.25006 2.50647C6.24304 2.54358 5.25752 2.80849 4.36761 3.28129C3.47771 3.7541 2.70656 4.42249 2.11215 5.23622C1.51774 6.04996 1.11554 6.98785 0.935783 7.9794C0.756025 8.97095 0.803388 9.99035 1.07431 10.961C1.34523 11.9316 1.83267 12.8281 2.49997 13.5832" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                            </g>
                            <defs>
                                <clipPath id="clip0_3098_154395">
                                    <rect width="20" height="20" fill="white"/>
                                </clipPath>
                            </defs>
                        </svg>
                        <span>Add {type.slice(0, -1)}</span>
                    </button>
                </div>
            </div>
            <div className="mt-6 md:flex md:items-center md:justify-between">
                <div className="inline-flex overflow-hidden bg-white border divide-x rounded-lg dark:bg-gray-900 rtl:flex-row-reverse dark:border-gray-700 dark:divide-gray-700">
                    <button onClick={() => setType('Users')} className={`px-5 py-2 text-xs font-medium ${type === 'Users' ? 'bg-gray-100 dark:bg-gray-800' : 'text-gray-600'} transition-colors duration-200 sm:text-sm dark:text-gray-300`}>
                        Users
                    </button>
                    <button onClick={() => setType('Events')} className={`px-5 py-2 text-xs font-medium ${type === 'Events' ? 'bg-gray-100 dark:bg-gray-800' : 'text-gray-600'} transition-colors duration-200 sm:text-sm dark:text-gray-300`}>
                        Events
                    </button>
                    <button onClick={() => setType('Volunteers')} className={`px-5 py-2 text-xs font-medium ${type === 'Volunteers' ? 'bg-gray-100 dark:bg-gray-800' : 'text-gray-600'} transition-colors duration-200 sm:text-sm dark:text-gray-300`}>
                        Volunteers
                    </button>
                    <button onClick={() => setType('Stores')} className={`px-5 py-2 text-xs font-medium ${type === 'Stores' ? 'bg-gray-100 dark:bg-gray-800' : 'text-gray-600'} transition-colors duration-200 sm:text-sm dark:text-gray-300`}>
                        Stores
                    </button>
                </div>
                <div className="relative flex items-center mt-4 md:mt-0">
                    <span className="absolute">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mx-3 text-gray-400 dark:text-gray-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                    </span>
                    <input type="text" placeholder="Search" className="block w-full py-1.5 pr-5 text-gray-700 bg-white border border-gray-200 rounded-lg md:w-80 placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"/>
                </div>
            </div>
            <div className="flex flex-col mt-6">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        {renderTableHeaders()}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                                    {renderTableRows()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <AddUserModal isOpen={addModalIsOpen && type === 'Users'} onClose={closeAddModal} fetchData={fetchData} />
            <AddEventModal isOpen={addModalIsOpen && type === 'Events'} onClose={closeAddModal} fetchData={fetchData} />
            <AddVolunteerModal isOpen={addModalIsOpen && type === 'Volunteers'} onClose={closeAddModal} fetchData={fetchData} />
            <AddStoreModal isOpen={addModalIsOpen && type === 'Stores'} onClose={closeAddModal} fetchData={fetchData} />
            <EditUserModal isOpen={editModalIsOpen && type === 'Users'} onClose={closeEditModal} fetchData={fetchData} userData={selectedItem} />
            <EditEventModal isOpen={editModalIsOpen && type === 'Events'} onClose={closeEditModal} fetchData={fetchData} eventData={selectedItem} />
            <EditVolunteerModal isOpen={editModalIsOpen && type === 'Volunteers'} onClose={closeEditModal} fetchData={fetchData} volunteerData={selectedItem} />
            <EditStoreModal isOpen={editModalIsOpen && type === 'Stores'} onClose={closeEditModal} fetchData={fetchData} storeData={selectedItem} />
            <ConfirmationModal 
                isOpen={confirmationModalIsOpen} 
                onClose={closeConfirmationModal} 
                onConfirm={handleDelete} 
                message={`Are you sure you want to delete this ${type.slice(0, -1)}?`} 
            />
        </section>
    );
};

export default CRUDPanel;
