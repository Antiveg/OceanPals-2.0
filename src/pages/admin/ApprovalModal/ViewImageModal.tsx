import React from 'react';

interface ViewImageModalProps {
    imageUrl: string;
    onClose: () => void;
}

const ViewImageModal: React.FC<ViewImageModalProps> = ({ imageUrl, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto h-screen">
            <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col justify-center items-center w-[50%]">
                <img src={imageUrl} alt="Task Image" className="max-w-[100%] max-h-[50%] flex justify-center items-center" />
                <button onClick={onClose} className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg">Close</button>
            </div>
        </div>
    );
};

export default ViewImageModal;
