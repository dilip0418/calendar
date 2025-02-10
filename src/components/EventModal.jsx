/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { X, Clock, AlertTriangle } from "lucide-react";

const EventModal = ({ event, selectedDate, onClose, onSave, onDelete, existingEvents = [] }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: selectedDate || "",
        startTime: "",
        endTime: "",
        color: "blue",
    });
    const [error, setError] = useState("");
    const [showConfirmOverlap, setShowConfirmOverlap] = useState(false);

    useEffect(() => {
        if (event) {
            setFormData({ ...event });
        } else if (selectedDate) {
            setFormData((prev) => ({ ...prev, date: selectedDate }));
        }
    }, [event, selectedDate]);

    const updateField = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

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
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-lg w-[26rem] p-6 border border-gray-100">
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">{event ? "Edit Event" : "Create Event"}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition">
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Event Title"
                        value={formData.title}
                        onChange={(e) => updateField("title", e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                        required
                    />
                    <textarea
                        placeholder="Event Description"
                        value={formData.description}
                        onChange={(e) => updateField("description", e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                        rows="3"
                    />
                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => updateField("date", e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                        required
                    />

                    <div className="flex gap-3">
                        <div className="relative w-1/2">
                            <Clock className="absolute left-2 top-2 text-gray-400" size={16} />
                            <input
                                type="time"
                                value={formData.startTime}
                                onChange={(e) => updateField("startTime", e.target.value)}
                                className="w-full p-2 pl-8 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                                required
                            />
                        </div>
                        <div className="relative w-1/2">
                            <Clock className="absolute left-2 top-2 text-gray-400" size={16} />
                            <input
                                type="time"
                                value={formData.endTime}
                                onChange={(e) => updateField("endTime", e.target.value)}
                                className="w-full p-2 pl-8 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                                required
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    {/* Buttons */}
                    <div className="flex justify-between mt-4">
                        {event && (
                            <button
                                type="button"
                                onClick={() => onDelete(event.id)}
                                className="px-4 py-2 bg-rose-500 text-white text-sm font-medium rounded-md hover:bg-rose-600 transition"
                            >
                                Delete
                            </button>
                        )}
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition"
                        >
                            {event ? "Update Event" : "Create Event"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Overlap Confirmation Modal */}
            {showConfirmOverlap && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-80 p-5 border border-gray-100">
                        <div className="flex items-center gap-3 text-yellow-600">
                            <AlertTriangle size={20} />
                            <h3 className="text-lg font-semibold">Event Overlap</h3>
                        </div>
                        <p className="text-sm text-gray-700 mt-2">
                            Another event overlaps with this one. Do you want to continue?
                        </p>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => setShowConfirmOverlap(false)}
                                className="px-4 py-2 bg-gray-300 text-sm font-medium rounded-md hover:bg-gray-400 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmOverlapSave}
                                className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition"
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
