/* eslint-disable react/prop-types */
import { X } from "lucide-react";

const EventsListModal = ({ date, events, onClose, onEventClick, onDeleteEvent }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                        Events for {date}
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-2">
                    {events.map((event) => (
                        <div key={event.id} className={`p-4 rounded shadow-md bg-${event.color}-100`}>
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold text-lg">{event.title}</h4>
                                <div className="flex gap-2">
                                    <button
                                        onClick={(e) => {
                                            onEventClick(event, e);
                                            onClose();
                                        }}
                                        className="px-2 py-1 rounded text-gray-500 hover:text-blue-500 hover:bg-blue-100"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => {
                                            onDeleteEvent(event.id);
                                            onClose();
                                        }}
                                        className="px-2 py-1 rounded text-gray-500 hover:text-red-500 hover:bg-red-100"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                            <p className="text-sm">{event.description}</p>
                            <p className="text-sm">{event.startTime} - {event.endTime}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EventsListModal;
