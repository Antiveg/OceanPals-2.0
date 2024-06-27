import React from 'react';

interface ApprovalModalProps {
    participant: {
        id: string;
        username: string;
    };
    onClose: () => void;
    onApprove: () => void;
    onDecline: () => void;
}

const ApprovalModal: React.FC<ApprovalModalProps> = ({ participant, onClose, onApprove, onDecline }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <h2 className="text-lg font-bold mb-4">Approve or Decline {participant.username}</h2>
                <div className="flex justify-between">
                    <button onClick={onApprove} className="bg-green-500 text-white px-4 py-2 rounded-lg">Approve</button>
                    <button onClick={onDecline} className="bg-red-500 text-white px-4 py-2 rounded-lg">Not Approve</button>
                </div>
                <button onClick={onClose} className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg">Close</button>
            </div>
        </div>
    );
};

export default ApprovalModal;
