/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { X } from "lucide-react";

const EventModal = ({ event, selectedDate, onClose, onSave, onDelete, existingEvents = [] }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        color: "blue",
    });
    const [error, setError] = useState("");
    const [showConfirmOverlap, setShowConfirmOverlap] = useState(false);

    useEffect(() => {
        if (event) {
            setFormData({
                ...event,
                date: event.date,
            });
        } else if (selectedDate) {
            setFormData((prev) => ({
                ...prev,
                date: selectedDate,
            }));
        }
    }, [event, selectedDate]);

    const checkOverlap = (newEvent) => {
        return existingEvents.some((e) =>
            e.date === newEvent.date &&
            e.id !== newEvent.id &&
            (
                (newEvent.startTime >= e.startTime && newEvent.startTime < e.endTime) ||
                (newEvent.endTime > e.startTime && newEvent.endTime <= e.endTime) ||
                (newEvent.startTime <= e.startTime && newEvent.endTime >= e.endTime)
            )
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.startTime >= formData.endTime) {
            setError("Start time must be earlier than end time.");
            return;
        }

        if (checkOverlap(formData)) {
            setShowConfirmOverlap(true);
            return;
        }

        onSave(formData);
        setError("");
        onClose();
    };

    const confirmOverlapSave = () => {
        onSave(formData);
        setShowConfirmOverlap(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">{event ? "Edit Event" : "Create Event"}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <textarea
                        placeholder="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full p-2 border rounded"
                        rows="3"
                    />

                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full p-2 border rounded"
                        required
                    />

                    <div className="flex gap-2">
                        <input
                            type="time"
                            value={formData.startTime}
                            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                            className="w-1/2 p-2 border rounded"
                            required
                        />
                        <input
                            type="time"
                            value={formData.endTime}
                            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                            className="w-1/2 p-2 border rounded"
                            required
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                    <div className="flex justify-between mt-4">
                        {event && (
                            <button
                                type="button"
                                onClick={() => onDelete(event.id)}
                                className="px-4 py-2 bg-red-500 text-white rounded"
                            >
                                Delete
                            </button>
                        )}
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                            {event ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </div>

            {showConfirmOverlap && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-80">
                        <h3 className="text-lg font-semibold mb-4">⚠ Overlapping Event</h3>
                        <p className="text-sm text-gray-700">Another event overlaps with this one. Do you want to continue?</p>
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={() => setShowConfirmOverlap(false)}
                                className="px-4 py-2 bg-gray-300 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmOverlapSave}
                                className="px-4 py-2 bg-blue-500 text-white rounded"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventModal;
