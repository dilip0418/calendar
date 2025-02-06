/* eslint-disable react/prop-types */
// EventItem.jsx
import { AlertCircle } from "lucide-react";

const EventItem = ({ event, onClick }) => {
    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
                onClick?.(event);
            }}
            className={`
        px-3 py-1 rounded-lg text-sm font-medium
        ${event.isConflict
                    ? 'bg-red-100 text-red-800 border border-red-200'
                    : 'bg-blue-100 text-blue-800 border border-blue-200'}
        transition-all hover:shadow-md cursor-pointer
      `}
        >
            <div className="flex items-center justify-between">
                <span className="truncate">{event.title}</span>
                {event.isConflict && (
                    <AlertCircle className="w-4 h-4 text-red-500 ml-2" />
                )}
            </div>
            <div className="text-xs opacity-75 mt-0.5">
                {event.startTime} - {event.endTime}
            </div>
        </div>
    );
};

export default EventItem;