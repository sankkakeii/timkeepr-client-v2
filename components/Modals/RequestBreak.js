import React, { useState } from 'react';
import Modal from 'react-modal';
import DateTimePicker from 'react-datetime-picker';

Modal.setAppElement('#__next'); // replace #__next with your app's mount point

export default function RequestBreak({closeRequest}) {
    const [breakReason, setBreakReason] = useState('');
    const [breakDuration, setBreakDuration] = useState(new Date());

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(`Break Reason: ${breakReason}`);
        console.log(`Break Duration: ${breakDuration}`);
        closeRequest(); // Close the modal after submitting
    }

    return (
        <Modal isOpen={true} onRequestClose={closeRequest} 
            style={{
                overlay: { backgroundColor: 'rgba(0,0,0,0.5)' },
                content: { color: 'lightsteelblue', maxWidth: '400px', height: 'auto', margin: 'auto', padding: '20px', backgroundColor: 'white', borderRadius: '10px' }
            }}>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Request a Break</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Reason for break</label>
                    <textarea className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none focus:ring-indigo-500"
                        value={breakReason}
                        onChange={e => setBreakReason(e.target.value)}
                        required />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Duration for break</label>
                    <DateTimePicker
                        className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none focus:ring-indigo-500"
                        value={breakDuration}
                        onChange={setBreakDuration}
                        required />
                </div>
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full" type="submit">Submit</button>
            </form>
        </Modal>
    );
}
