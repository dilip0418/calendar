/* eslint-disable react/prop-types */
import { Clock, X, Trash2 } from 'lucide-react';

const EventsListModal = ({ date, events, onClose, onEventClick, onDeleteEvent }) => {
    // Calculate if an event is effectively expired (less than 25% time remaining)
    const isEventExpired = (event) => {
        const now = new Date();
        const eventDate = new Date(event.date);

        // Parse start and end times
        const [startHours, startMinutes] = event.startTime.split(':').map(Number);
        const [endHours, endMinutes] = event.endTime.split(':').map(Number);

        // Set up event start and end times
        const eventStart = new Date(eventDate);
        eventStart.setHours(startHours, startMinutes, 0);

        const eventEnd = new Date(eventDate);
        eventEnd.setHours(endHours, endMinutes, 0);

        // Calculate total duration in minutes
        const totalDurationMinutes = (eventEnd - eventStart) / (1000 * 60);

        // If the event date is in the past, it's expired
        if (now > eventEnd) return true;

        // If the event hasn't started yet, it's not expired
        if (now < eventStart) return false;

        // Calculate remaining time in minutes
        const remainingMinutes = (eventEnd - now) / (1000 * 60);

        // Check if less than 25% time remains
        return remainingMinutes < (totalDurationMinutes * 0.25);
    };

    // Handle event click and modal transition
    const handleEventClick = (event) => {
        onClose(); // Close the list modal first
        onEventClick(event); // Open the event modal
    };

    // Sort events by start time and expiration status
    const sortedEvents = [...events].sort((a, b) => {
        const aExpired = isEventExpired(a);
        const bExpired = isEventExpired(b);

        // Sort expired events to the bottom
        if (aExpired && !bExpired) return 1;
        if (!aExpired && bExpired) return -1;

        // Then sort by start time
        return a.startTime.localeCompare(b.startTime);
    });

    // Calculate and format remaining time for display
    const getRemainingTime = (event) => {
        const now = new Date();
        const eventDate = new Date(event.date);
        const [endHours, endMinutes] = event.endTime.split(':').map(Number);
        const eventEnd = new Date(eventDate);
        eventEnd.setHours(endHours, endMinutes, 0);

        const remainingMinutes = Math.max(0, (eventEnd - now) / (1000 * 60));

        if (remainingMinutes === 0) return "Event ended";
        if (remainingMinutes < 60) return `${Math.round(remainingMinutes)}m remaining`;
        return `${Math.round(remainingMinutes / 60)}h ${Math.round(remainingMinutes % 60)}m remaining`;
    };

    // Format the date for display
    const formatDate = (dateStr) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString(undefined, options);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">
                            Events for {formatDate(date)}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {events.length} event{events.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
                    {sortedEvents.map((event) => {
                        const expired = isEventExpired(event);

                        return (
                            <div
                                key={event.id}
                                className={`
                                    p-4 rounded-lg border border-gray-100
                                    transition-all duration-300
                                    hover:shadow-md
                                    ${expired ? 'opacity-60' : ''}
                                    relative
                                    group
                                `}
                            >
                                <div className="flex justify-between items-start">
                                    <div
                                        className={`flex-1 cursor-pointer ${expired ? 'line-through' : ''}`}
                                        onClick={() => handleEventClick(event)}
                                    >
                                        <h3 className="font-medium text-gray-800 mb-1">
                                            {event.title}
                                        </h3>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Clock size={14} className="mr-1" />
                                            <span>
                                                {event.startTime} - {event.endTime}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-2">
                                            {getRemainingTime(event)}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => onDeleteEvent(event.id)}
                                        className="
                                            p-2 rounded-full
                                            text-gray-400 hover:text-red-500
                                            hover:bg-red-50
                                            transition-colors
                                            opacity-0 group-hover:opacity-100
                                        "
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    {events.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No events scheduled for this day
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventsListModal;