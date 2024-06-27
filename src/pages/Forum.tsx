import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, query, onSnapshot, doc, getDoc, addDoc, serverTimestamp, Unsubscribe, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../FirebaseConfig'; // Adjust according to your Firebase configuration
import { useAuth } from '../provider/AuthProvider'; // Adjust according to your project structure

interface Participant {
    id: string;
    username: string;
    profilePicture?: string;
}

interface Message {
    sender: string;
    text: string;
    type: string;
    timestamp?: any;
}

const Forum: React.FC = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [admins, setAdmins] = useState<Participant[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!eventId) return;

        // Fetch participants
        const fetchParticipants = async () => {
            const eventDoc = await getDoc(doc(db, 'Events', eventId));
            const eventData = eventDoc.data();
            if (eventData) {
                const participantsData = eventData.participants.map(async (participantId: string) => {
                    const userDoc = await getDoc(doc(db, 'Users', participantId));
                    return { id: participantId, ...userDoc.data() };
                });
                setParticipants(await Promise.all(participantsData));
            }
        };

        // Fetch admins
        const fetchAdmins = () => {
            const adminQuery = query(collection(db, 'Users'), where('role', '==', 'admin'));
            return onSnapshot(adminQuery, (snapshot) => {
                const adminsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setAdmins(adminsData as Participant[]);
            });
        };

        // Fetch messages
        const fetchMessages = () => {
            const messagesQuery = query(collection(db, 'Events', eventId, 'forumMessages'));
            return onSnapshot(messagesQuery, (snapshot) => {
                const messagesData = snapshot.docs.map(doc => doc.data());
                setMessages(messagesData as Message[]);
            });
        };

        fetchParticipants();
        const unsubscribeAdmins: Unsubscribe = fetchAdmins();
        const unsubscribeMessages: Unsubscribe = fetchMessages();

        return () => {
            if (unsubscribeAdmins) {
                unsubscribeAdmins();
            }
            if (unsubscribeMessages) {
                unsubscribeMessages();
            }
        };
    }, [eventId]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSendMessage = async () => {
        if (newMessage.trim() !== '' || selectedImage) {
            let imageUrl = '';
            if (selectedImage) {
                const imageRef = ref(storage, `images/${selectedImage.name}`);
                await uploadBytes(imageRef, selectedImage);
                imageUrl = await getDownloadURL(imageRef);
            }

            const messageType = selectedImage ? 'image' : 'text';

            await addDoc(collection(db, 'Events', eventId!, 'forumMessages'), {
                sender: user?.username || 'Unknown',
                text: messageType === 'text' ? newMessage : imageUrl,
                type: messageType,
                timestamp: serverTimestamp(),
            });

            setNewMessage('');
            setSelectedImage(null);
            setImagePreview(null);
        }
    };

    const handleToggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleBackToDashboard = () => {
        navigate(`/events/dashboard/${eventId}`);
    };

    return (
        <div className="flex h-screen antialiased text-gray-800">
            <div className={`flex flex-row h-full w-full overflow-x-hidden ${sidebarOpen ? 'block' : 'hidden'} md:flex`}>
                {/* Chat Sidebar */}
                <div className="flex flex-col py-8 pl-6 pr-6 w-64 bg-white flex-shrink-0 rounded-xl">
                    <div className="flex flex-row items-center justify-between h-12 w-full">
                        <div className="flex items-center justify-center rounded-2xl text-indigo-700 bg-indigo-100 h-10 w-10">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                ></path>
                            </svg>
                        </div>
                        <div className="ml-2 font-bold text-2xl">Event Forum</div>
                        <button onClick={handleToggleSidebar} className="md:hidden">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                ></path>
                            </svg>
                        </button>
                    </div>
                    <div className="flex flex-col items-center bg-indigo-100 border border-gray-200 mt-4 w-full py-6 px-4 rounded-lg">
                        <div className="h-20 w-20 rounded-full border overflow-hidden">
                            <img
                                src={user?.profilePicture || 'https://images.unsplash.com/photo-1513553404607-988bf2703777?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
                                alt="Avatar"
                                className="h-full w-full"
                            />
                        </div>
                        <div className="text-sm font-semibold mt-2">{user?.username}</div>
                        <div className="text-xs text-gray-500">{user?.role}</div>
                    </div>
                    <div className="flex flex-col mt-4">
                        <button onClick={handleBackToDashboard} className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl mb-4">
                            Back to Dashboard
                        </button>

                        {/* Admins */}
                        <div className="flex flex-row items-center justify-between text-xs mt-0">
                            <span className="font-bold">Admins</span>
                        </div>
                        <div className="flex flex-col space-y-1 mt-4 -mx-2">
                            {admins.map(admin => (
                                <div key={admin.id} className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2">
                                    <div className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full">
                                        {admin.username.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="ml-2 text-sm font-semibold">{admin.username}</div>
                                </div>
                            ))}
                        </div>

                        {/* Participants */}
                        <div className="flex flex-row items-center justify-between text-xs mt-6">
                            <span className="font-bold">Participants</span>
                        </div>
                        <div className="flex flex-col space-y-1 mt-4 -mx-2 h-48 overflow-y-auto">
                            {participants.map(participant => (
                                <div key={participant.id} className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2">
                                    <div className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full">
                                        {participant.username.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="ml-2 text-sm font-semibold">{participant.username}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Chat */}
                <div className="flex flex-col flex-auto h-full p-6">
                    <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-400 h-full p-4">
                        <div className="flex flex-col h-full overflow-x-auto mb-4 mt-4">
                            <div className="flex flex-col h-full">
                                <div className="grid grid-cols-0 gap-y-2">
                                    {messages.map((message, index) => (
                                        <div
                                            key={index}
                                            className={`col-start-${message.sender === user?.username ? '6' : '1'} col-end-${message.sender === user?.username ? '13' : '8'} p-3 rounded-lg`}
                                        >
                                            <div className={`flex ${message.sender === user?.username ? 'items-center justify-start flex-row-reverse' : 'items-center'}`}>
                                                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0 ml-2">
                                                    {message.sender.substring(0, 2).toUpperCase()}
                                                </div>
                                                {message.type === 'text' ? (
                                                    <div className={`relative ml-3 text-sm ${message.sender === user?.username ? 'bg-indigo-100' : 'bg-white'} py-2 px-4 shadow rounded-xl`}>
                                                        <div>{message.text}</div>
                                                    </div>
                                                ) : (
                                                    <div className={`relative ml-3 text-sm ${message.sender === user?.username ? 'bg-indigo-100' : 'bg-white'} py-2 px-4 shadow rounded-xl`}>
                                                        <img src={message.text} alt="Message" className="rounded-lg max-w-xs" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
                            <div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="fileInput"
                                />
                                <label htmlFor="fileInput" className="flex items-center justify-center text-gray-400 hover:text-gray-600">
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                        ></path>
                                    </svg>
                                </label>
                            </div>
                            <div className="flex-grow ml-4">
                                <div className="relative w-full">
                                    <input
                                        type="text"
                                        className="flex w-full border rounded-xl focus:outline-none text-white focus:border-indigo-300 pl-4 h-10"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="ml-4">
                                <button
                                    className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-2 flex-shrink-0"
                                    onClick={handleSendMessage}
                                >
                                    <span>Send</span>
                                    <span className="ml-2">
                                        <svg
                                            className="w-4 h-4 transform rotate-45 -mt-px"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                            ></path>
                                        </svg>
                                    </span>
                                </button>
                            </div>
                        </div>
                        {imagePreview && (
                            <div className="flex flex-col items-center mt-4">
                                <img src={imagePreview} alt="Preview" className="max-w-xs rounded-lg" />
                                <button
                                    className="mt-2 text-red-500 hover:underline"
                                    onClick={() => {
                                        setSelectedImage(null);
                                        setImagePreview(null);
                                    }}
                                >
                                    Remove
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Forum;
