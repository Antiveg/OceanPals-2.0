import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../FirebaseConfig'; // Adjust according to your Firebase configuration
import ViewImageModal from './ApprovalModal/ViewImageModal'; // Modal for viewing images
import ApprovalModal from './ApprovalModal/ApprovalModal'; // Modal for approving/declining participants

interface Participant {
    id: string;
    username: string;
    task1Image?: string;
    task3Image?: string;
    task4Image?: string;
    weight?: number;
    status: 'Approved' | 'Waiting for Approval' | 'Not Approved';
}

const EventApproval: React.FC = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const navigate = useNavigate();
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [approvalParticipant, setApprovalParticipant] = useState<Participant | null>(null);

    useEffect(() => {
        if (!eventId) return;

        const fetchParticipants = async () => {
            const eventDoc = await getDoc(doc(db, 'Events', eventId));
            const eventData = eventDoc.data();
            if (eventData && eventData.participants) {
                const participantsData = await Promise.all(
                    eventData.participants.map(async (participantId: string) => {
                        const userDoc = await getDoc(doc(db, 'Users', participantId));
                        const userData = userDoc.data();
                        const userTaskDoc = await getDoc(doc(db, 'Users', participantId, 'UserTaskProgress', eventId));
                        const userTaskData = userTaskDoc.data();

                        return {
                            id: participantId,
                            username: userData?.username || '',
                            task1Image: userTaskData?.beforePhoto || '',
                            task3Image: userTaskData?.afterPhoto || '',
                            task4Image: userTaskData?.weightPhoto || '',
                            weight: userTaskData?.weight || '',
                            status: userTaskData?.status || 'Waiting for Approval'
                        };
                    })
                );
                setParticipants(participantsData);
            }
        };

        fetchParticipants();
    }, [eventId]);

    const handleBackToEvents = () => {
        navigate('/admin/events');
    };

    const handleViewImage = (imageUrl: string) => {
        setSelectedImage(imageUrl);
    };

    const handleCloseImageModal = () => {
        setSelectedImage(null);
    };

    const handleOpenApprovalModal = (participant: Participant) => {
        setApprovalParticipant(participant);
    };

    const handleCloseApprovalModal = () => {
        setApprovalParticipant(null);
    };

    const handleApprovalStatusChange = async (status: 'Approved' | 'Not Approved') => {
        if (approvalParticipant) {
            const userTaskDocRef = doc(db, 'Users', approvalParticipant.id, 'UserTaskProgress', eventId!);
            await updateDoc(userTaskDocRef, { status });
            handleCloseApprovalModal();
            const updatedParticipants = participants.map(participant =>
                participant.id === approvalParticipant.id ? { ...participant, status } : participant
            );
            setParticipants(updatedParticipants);
        }
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'Approved':
                return 'bg-green-100 text-green-800 rounded px-2 py-1';
            case 'Not Approved':
                return 'bg-red-100 text-red-800 rounded px-2 py-1';
            case 'Waiting for Approval':
            default:
                return 'bg-yellow-100 text-yellow-800 rounded px-2 py-1';
        }
    };

    return (
        <section className="container px-4 mx-auto mt-20">
            <div className="flex items-center gap-x-3 justify-between">
                <h2 className="text-lg font-medium text-gray-800 dark:text-white">Event Approval</h2>
                <button
                onClick={handleBackToEvents}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl mt-4 mb-4"
            >
                Go Back
            </button>
            </div>
            
            <div className="flex flex-col mt-6">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">No.</th>
                                        <th className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Name</th>
                                        <th className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Before Photo</th>
                                        <th className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">After Photo</th>
                                        <th className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Weight Photo</th>
                                        <th className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Weight</th>
                                        <th className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Status</th>
                                        <th className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                                    {participants.map((participant, index) => (
                                        <tr key={participant.id}>
                                            <td className="px-4 py-4 text-sm font-medium text-gray-200 whitespace-nowrap">{index + 1}</td>
                                            <td className="px-4 py-4 text-sm font-medium text-gray-200 whitespace-nowrap">{participant.username}</td>
                                            <td className="px-4 py-4 text-sm font-medium text-gray-200 whitespace-nowrap">
                                                <button onClick={() => handleViewImage(participant.task1Image!)} className="text-indigo-600 hover:text-indigo-900">View</button>
                                            </td>
                                            <td className="px-4 py-4 text-sm font-medium text-gray-200 whitespace-nowrap">
                                                <button onClick={() => handleViewImage(participant.task3Image!)} className="text-indigo-600 hover:text-indigo-900">View</button>
                                            </td>
                                            <td className="px-4 py-4 text-sm font-medium text-gray-200 whitespace-nowrap">
                                                <button onClick={() => handleViewImage(participant.task4Image!)} className="text-indigo-600 hover:text-indigo-900">View</button>
                                            </td>
                                            <td className="px-4 py-4 text-sm font-medium text-gray-200 whitespace-nowrap">{participant.weight}</td>
                                            <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                                                <span className={getStatusClass(participant.status)}>{participant.status}</span>
                                            </td>
                                            <td className="px-4 py-4 text-sm font-medium text-gray-200 whitespace-nowrap">
                                                <button onClick={() => handleOpenApprovalModal(participant)} className="text-indigo-600 hover:text-indigo-900">Action</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {selectedImage && <ViewImageModal imageUrl={selectedImage} onClose={handleCloseImageModal} />}
            {approvalParticipant && (
                <ApprovalModal
                    participant={approvalParticipant}
                    onClose={handleCloseApprovalModal}
                    onApprove={() => handleApprovalStatusChange('Approved')}
                    onDecline={() => handleApprovalStatusChange('Not Approved')}
                />
            )}
        </section>
    );
};

export default EventApproval;
