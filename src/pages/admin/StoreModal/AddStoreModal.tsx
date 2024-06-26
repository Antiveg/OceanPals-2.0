import React, { useState } from 'react';
import { db, storage } from '../../../FirebaseConfig'; // Ensure this points to your Firebase configuration
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const AddStoreModal: React.FC<{ isOpen: boolean; onClose: () => void; fetchData: () => void; }> = ({ isOpen, onClose, fetchData }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: '',
        point: '',
        stock: ''
    });
    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
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
            let imageUrl = '';
            if (imageFile) {
                const imageRef = ref(storage, `stores/${imageFile.name}`);
                await uploadBytes(imageRef, imageFile);
                imageUrl = await getDownloadURL(imageRef);
            }

            await addDoc(collection(db, 'Stores'), {
                ...formData,
                image: imageUrl,
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
                    <h3 className="text-lg font-semibold text-gray-100">Add New Store</h3>
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
                                placeholder="Type store name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-100">Description</label>
                            <textarea
                                name="description"
                                id="description"
                                className="bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                placeholder="Type store description"
                                required
                                value={formData.description}
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
                            <label htmlFor="point" className="block mb-2 text-sm font-medium text-gray-100">Point</label>
                            <input
                                type="number"
                                name="point"
                                id="point"
                                className="bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                required
                                value={formData.point}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="stock" className="block mb-2 text-sm font-medium text-gray-100">Stock</label>
                            <input
                                type="number"
                                name="stock"
                                id="stock"
                                className="bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                required
                                value={formData.stock}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        Add new store
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddStoreModal;
