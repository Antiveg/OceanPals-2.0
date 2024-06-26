import React, { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../../FirebaseConfig'; // Ensure this points to your Firebase configuration
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const EditEventModal: React.FC<{ isOpen: boolean; onClose: () => void; fetchData: () => void; eventData: any; }> = ({ isOpen, onClose, fetchData, eventData }) => {
    const [formData, setFormData] = useState({
        name: '',
        shortDescription: '',
        fullDescription: '',
        image: '',
        location: '',
        latitude: 0,
        longitude: 0,
        date: '',
        time: '',
        special: false,
        place: '',
        point: 0,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        if (isOpen && eventData) {
            setFormData(eventData);
        }
    }, [isOpen, eventData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
        setFormData({
            ...formData,
            [name]: checked !== undefined ? checked : value,
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let imageUrl = formData.image;
            if (imageFile) {
                const imageRef = ref(storage, `events/${imageFile.name}`);
                await uploadBytes(imageRef, imageFile);
                imageUrl = await getDownloadURL(imageRef);
            }

            await updateDoc(doc(db, 'Events', eventData.id), {
                ...formData,
                image: imageUrl,
            });
            fetchData();
            onClose();
        } catch (error) {
            console.error('Error updating document: ', error);
        }
    };

    const handleMapClick = (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
            setFormData({
                ...formData,
                latitude: event.latLng.lat(),
                longitude: event.latLng.lng(),
            });
        }
    };

    const onLoad = (map: google.maps.Map) => {
        console.log('Map loaded:', map);
    };

    const containerStyle = {
        width: '100%',
        height: '400px',
    };

    const center = {
        lat: formData.latitude,
        lng: formData.longitude,
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 text-left">
            <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
            <div className="relative bg-gray-800 rounded-lg shadow-lg p-6 max-w-lg w-full mx-auto max-h-[90%] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-100">Edit Event</h3>
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
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-100">Name</label>
                            <input 
                                type="text" 
                                name="name" 
                                id="name" 
                                className="bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                                placeholder="Type event name" 
                                required 
                                value={formData.name} 
                                onChange={handleChange} 
                            />
                        </div>
                        <div>
                            <label htmlFor="shortDescription" className="block mb-2 text-sm font-medium text-gray-100">Short Description</label>
                            <input 
                                type="text" 
                                name="shortDescription" 
                                id="shortDescription" 
                                className="bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                                placeholder="Type short description" 
                                required 
                                value={formData.shortDescription} 
                                onChange={handleChange} 
                            />
                        </div>
                        <div>
                            <label htmlFor="fullDescription" className="block mb-2 text-sm font-medium text-gray-100">Full Description</label>
                            <textarea 
                                name="fullDescription" 
                                id="fullDescription" 
                                className="bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                                placeholder="Type full description" 
                                required 
                                value={formData.fullDescription} 
                                onChange={handleChange} 
                            />
                        </div>
                        <div>
                            <label htmlFor="point" className="block mb-2 text-sm font-medium text-gray-100">Point</label>
                            <input
                                type='number' 
                                name="point" 
                                id="point" 
                                className="bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                                placeholder="Type point" 
                                required 
                                value={formData.point} 
                                onChange={handleChange} 
                            />
                        </div>
                        <div>
                            <label htmlFor="image" className="block mb-2 text-sm font-medium text-gray-100">Image</label>
                            <input 
                                type="file" 
                                name="image" 
                                id="image" 
                                className="bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                                onChange={handleImageChange} 
                            />
                        </div>
                        <div>
                            <label htmlFor="place" className="block mb-2 text-sm font-medium text-gray-100">Place</label>
                            <input 
                                type="text" 
                                name="place" 
                                id="place" 
                                className="bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                                placeholder="Type event place" 
                                required 
                                value={formData.place} 
                                onChange={handleChange} 
                            />
                        </div>
                        <div>
                            <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-100">Date</label>
                            <input 
                                type="date" 
                                name="date" 
                                id="date" 
                                className="bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                                required 
                                value={formData.date} 
                                onChange={handleChange} 
                            />
                        </div>
                        <div>
                            <label htmlFor="time" className="block mb-2 text-sm font-medium text-gray-100">Time</label>
                            <input 
                                type="time" 
                                name="time" 
                                id="time" 
                                className="bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                                required 
                                value={formData.time} 
                                onChange={handleChange} 
                            />
                        </div>
                        <div className="flex items-center mb-4">
                            <input
                                id="special"
                                name="special"
                                type="checkbox"
                                checked={formData.special}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                            />
                            <label htmlFor="special" className="ml-2 text-sm font-medium text-gray-100">
                                Special
                            </label>
                        </div>
                        <div className="col-span-2">
                            <label className="block mb-2 text-sm font-medium text-gray-100">Location</label>
                            <LoadScript googleMapsApiKey="AIzaSyCC4uvj9fFdWhDTi9qo-0zMQuj_odeEUFE">
                                <GoogleMap
                                    mapContainerStyle={containerStyle}
                                    center={center}
                                    zoom={10}
                                    onClick={handleMapClick}
                                    onLoad={onLoad}
                                >
                                    {formData.latitude && formData.longitude && (
                                        <Marker position={{ lat: formData.latitude, lng: formData.longitude }} />
                                    )}
                                </GoogleMap>
                            </LoadScript>
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        Update event
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditEventModal;
