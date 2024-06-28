import React, { useEffect, useState } from 'react';
import { db } from '../../FirebaseConfig'; // Ensure this points to your Firebase configuration
import { collection, deleteDoc, doc, getDoc, getDocs } from 'firebase/firestore';
import AddUserModal from './UserModal/AddUserModal';
import EditUserModal from './UserModal/EditUserModal';
import AddEventModal from './EventModal/AddEventModal';
import EditEventModal from './EventModal/EditEventModal';
import AddVolunteerModal from './VolunteerModal/AddVolunteerModal';
import EditVolunteerModal from './VolunteerModal/EditVolunteerModal';
import AddStoreModal from './StoreModal/AddStoreModal';
import EditStoreModal from './StoreModal/EditStoreModal';
import AddTrainingModal from './TrainingModal/AddTrainingModal';
import EditTrainingModal from './TrainingModal/EditTrainingModal';
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
        const fetchedData = querySnapshot.docs.map((doc, index) => {
            const data2 = doc.data();
            return {
                ...data2,
                id: doc.id,
                index: index + 1,
                date: data2.date && typeof data2.date.toDate === 'function' ? data2.date.toDate().toLocaleDateString() : data2.date,
                timestamp: data2.timestamp && typeof data2.timestamp.toDate === 'function' ? data2.timestamp.toDate().toLocaleString() : data2.timestamp
            };
        });
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
        switch (type) {
            case 'Users':
                return (
                    <>
                        <th className="whitespace-nowrap">No.</th>
                        <th className="whitespace-nowrap text-left">Username</th>
                        <th className="whitespace-nowrap text-left">Email</th>
                        <th className="whitespace-nowrap text-left">Role</th>
                        <th className="whitespace-nowrap text-left">Profile Picture</th>
                        <th className="whitespace-nowrap text-left">Points</th>
                        <th className="whitespace-nowrap text-left">Action</th>
                    </>
                );
            case 'Events':
                return (
                    <>
                        <th className="whitespace-nowrap">No.</th>
                        <th className="whitespace-nowrap text-left">Name</th>
                        <th className="whitespace-nowrap text-left">Short Description</th>
                        <th className="whitespace-nowrap text-left">Full Description</th>
                        <th className="whitespace-nowrap text-left">Point</th>
                        <th className="whitespace-nowrap text-left">Image</th>
                        <th className="whitespace-nowrap text-left">Location</th>
                        <th className="whitespace-nowrap text-left">Latitude</th>
                        <th className="whitespace-nowrap text-left">Longitude</th>
                        <th className="whitespace-nowrap text-left">Date</th>
                        <th className="whitespace-nowrap text-left">Time</th>
                        <th className="whitespace-nowrap text-left">Status</th>
                        <th className="whitespace-nowrap text-left">Special</th>
                        <th className="whitespace-nowrap text-left">Participants</th>
                        <th className="whitespace-nowrap text-left">Action</th>
                    </>
                );
            case 'Volunteers':
                return (
                    <>
                        <th className="whitespace-nowrap">No.</th>
                        <th className="whitespace-nowrap text-left">Name</th>
                        <th className="whitespace-nowrap text-left">Short Description</th>
                        <th className="whitespace-nowrap text-left">Full Description</th>
                        <th className="whitespace-nowrap text-left">Image</th>
                        <th className="whitespace-nowrap text-left">Current Volunteered User</th>
                        <th className="whitespace-nowrap text-left">Action</th>
                    </>
                );
            case 'Stores':
                return (
                    <>
                        <th className="whitespace-nowrap">No.</th>
                        <th className="whitespace-nowrap text-left">Name</th>
                        <th className="whitespace-nowrap text-left">Description</th>
                        <th className="whitespace-nowrap text-left">Image</th>
                        <th className="whitespace-nowrap text-left">Point</th>
                        <th className="whitespace-nowrap text-left">Stock</th>
                        <th className="whitespace-nowrap text-left">Action</th>
                    </>
                );
            case 'Training':
                return (
                    <>
                        <th className="whitespace-nowrap">No.</th>
                        <th className="whitespace-nowrap text-left">Name</th>
                        <th className="whitespace-nowrap text-left">Category</th>
                        <th className="whitespace-nowrap text-left">Short Description</th>
                        <th className="whitespace-nowrap text-left">Full Description</th>
                        <th className="whitespace-nowrap text-left">Image</th>
                        <th className="whitespace-nowrap text-left">Author Image</th>
                        <th className="whitespace-nowrap text-left">Author Name</th>
                        <th className="whitespace-nowrap text-left">Author Position</th>
                        <th className="whitespace-nowrap text-left">Timestamp</th>
                        <th className="whitespace-nowrap text-left">Date</th>
                        <th className="whitespace-nowrap text-left">Action</th>
                    </>
                );
            default:
                return null;
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
                <td className="text-center">{item.index}</td>
                <td className="text-left">{item.username || item.name}</td>
                {type === 'Users' && (
                    <>
                        <td className="text-left">{item.email}</td>
                        <td className="text-left">{item.role}</td>
                        <td className="text-left">
                            <img src={item.profilePicture} alt={item.username} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                        </td>
                        <td className="text-left">{item.point}</td>
                    </>
                )}
                {type === 'Events' && (
                    <>
                        <td className="text-left">{item.shortDescription}</td>
                        <td className="text-left">{item.fullDescription}</td>
                        <td className="text-left">{item.point}</td>
                        <td className="text-left">
                            <img src={item.image} alt={item.name} style={{ width: '100px', height: '100px' }} />
                        </td>
                        <td className="text-left">{item.place}</td>
                        <td className="text-left">{item.latitude}</td>
                        <td className="text-left">{item.longitude}</td>
                        <td className="text-left">{item.date}</td>
                        <td className="text-left">{item.time}</td>
                        <td className="text-left">{new Date(item.date + ' ' + item.time) < new Date() ? 'Finished' : 'Unfinished'}</td>
                        <td className="text-left">{item.special ? 'Yes' : 'No'}</td>
                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                            <div className="flex items-center">
                                {item.participants && item.participants.slice(0, 4).map((participant: string, index: number) => (
                                    <ParticipantTooltip key={index} participantId={participant} />
                                ))}
                                {item.participants && item.participants.length > 4 && (
                                    <p className="flex items-center justify-center w-6 h-6 -mx-1 text-xs text-blue-600 bg-blue-100 border-2 border-white rounded-full">
                                        +{item.participants.length - 4}
                                    </p>
                                )}
                            </div>
                        </td>
                    </>
                )}
                {type === 'Volunteers' && (
                    <>
                        <td className="text-left">{item.shortDescription}</td>
                        <td className="text-left">{item.fullDescription}</td>
                        <td className="text-left">
                            <img src={item.image} alt={item.name} style={{ width: '100px', height: '100px' }} />
                        </td>
                        <td className="text-left">{item.currentVolunteeredUser}</td>
                    </>
                )}
                {type === 'Stores' && (
                    <>
                        <td className="text-left">{item.description}</td>
                        <td className="text-left">
                            <img src={item.image} alt={item.name} style={{ width: '100px', height: '100px' }} />
                        </td>
                        <td className="text-left">{item.point}</td>
                        <td className="text-left">{item.stock}</td>
                    </>
                )}
                {type === 'Training' && (
                    <>
                        <td className="text-left">{item.category}</td>
                        <td className="text-left">{item.shortDescription}</td>
                        <td className="text-left">{item.fullDescription}</td>
                        <td className="text-left">
                            <img src={item.image} alt={item.name} style={{ width: '100px', height: '100px' }} />
                        </td>
                        <td className="text-left">
                            <div className="flex items-center">
                                <img src={item.authorImage} alt={item.author} style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                                <span className="ml-2">{item.author}</span>
                            </div>
                        </td>
                        <td className="text-left">{item.authorName}</td>
                        <td className="text-left">{item.authorPosition}</td>
                        <td className="text-left">{item.timestamp}</td>
                        <td className="text-left">{item.date}</td>
                    </>
                )}
                <td className="text-left">
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
                    <button onClick={() => setType('Training')} className={`px-5 py-2 text-xs font-medium ${type === 'Training' ? 'bg-gray-100 dark:bg-gray-800' : 'text-gray-600'} transition-colors duration-200 sm:text-sm dark:text-gray-300`}>
                        Training
                    </button>
                </div>
                {/* <div className="relative flex items-center mt-4 md:mt-0">
                    <span className="absolute">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mx-3 text-gray-400 dark:text-gray-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                    </span>
                    <input type="text" placeholder="Search" className="block w-full py-1.5 pr-5 text-gray-700 bg-white border border-gray-200 rounded-lg md:w-80 placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"/>
                </div> */}
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
                                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900 text-left">
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
            <AddTrainingModal isOpen={addModalIsOpen && type === 'Training'} onClose={closeAddModal} fetchData={fetchData} />
            <EditUserModal isOpen={editModalIsOpen && type === 'Users'} onClose={closeEditModal} fetchData={fetchData} userData={selectedItem} />
            <EditEventModal isOpen={editModalIsOpen && type === 'Events'} onClose={closeEditModal} fetchData={fetchData} eventData={selectedItem} />
            <EditVolunteerModal isOpen={editModalIsOpen && type === 'Volunteers'} onClose={closeEditModal} fetchData={fetchData} volunteerData={selectedItem} />
            <EditStoreModal isOpen={editModalIsOpen && type === 'Stores'} onClose={closeEditModal} fetchData={fetchData} storeData={selectedItem} />
            <EditTrainingModal isOpen={editModalIsOpen && type === 'Training'} onClose={closeEditModal} fetchData={fetchData} trainingData={selectedItem} />
            <ConfirmationModal 
                isOpen={confirmationModalIsOpen} 
                onClose={closeConfirmationModal} 
                onConfirm={handleDelete} 
                message={`Are you sure you want to delete this ${type.slice(0, -1)}?`} 
            />
        </section>
    );
};

const ParticipantTooltip: React.FC<{ participantId: string }> = ({ participantId }) => {
    const [participant, setParticipant] = useState<any>(null);

    useEffect(() => {
        const fetchParticipant = async () => {
            const participantDoc = await getDoc(doc(db, 'Users', participantId));
            if (participantDoc.exists()) {
                setParticipant(participantDoc.data());
            }
        };

        fetchParticipant();
    }, [participantId]);

    if (!participant) {
        return null;
    }

    return (
        <div className="relative inline-block">
            <img
                src={participant.profilePicture}
                alt={participant.username}
                className="object-cover w-6 h-6 -mx-1 border-2 border-white rounded-full dark:border-gray-700 cursor-pointer"
                data-tooltip={participant.username}
            />
            <span className="absolute z-10 p-2 -mt-10 text-xs leading-none text-white whitespace-no-wrap bg-black shadow-lg rounded-lg" style={{ visibility: 'hidden' }}>
                {participant.username}
            </span>
        </div>
    );
};

export default CRUDPanel;
