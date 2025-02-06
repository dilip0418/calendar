/* eslint-disable react/prop-types */
// CalendarHeader.jsx
import { ChevronLeft, ChevronRight } from "lucide-react";

const CalendarHeader = ({ currentDate, onPrevMonth, onNextMonth }) => {
    return (
        <div className="flex items-center justify-between mb-6 px-6 py-4 bg-white rounded-t-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex space-x-2">
                <button
                    onClick={onPrevMonth}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Previous month"
                >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <button
                    onClick={onNextMonth}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Next month"
                >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
            </div>
        </div>
    );
};

export default CalendarHeader;