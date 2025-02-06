/* eslint-disable react/prop-types */

import { isToday, formatDateToYYYYMMDD, getDaysInMonth, getFirstDayOfMonth } from "../utils/calendarUtils";
import { Clock, ChevronRight } from 'lucide-react';

const CalendarGrid = ({ currentDate, events, onDateClick, onEventClick, onShowMoreEvents }) => {
    const getEventClasses = (event, dateStr) => {
        const dayEvents = events[dateStr] || [];
        const isConflict = dayEvents.some((e) =>
            e.id !== event.id &&
            ((event.startTime >= e.startTime && event.startTime < e.endTime) ||
                (event.endTime > e.startTime && event.endTime <= e.endTime) ||
                (event.startTime <= e.startTime && event.endTime >= e.endTime))
        );

        if (isConflict) {
            return "bg-gradient-to-r from-rose-50 to-rose-100 border-l-2 border-rose-500";
        }

        // Alternate colors for non-conflicting events
        const colorSchemes = [
            "bg-gradient-to-r from-blue-50 to-indigo-50 border-l-2 border-blue-500",
            "bg-gradient-to-r from-emerald-50 to-teal-50 border-l-2 border-emerald-500",
            "bg-gradient-to-r from-violet-50 to-purple-50 border-l-2 border-violet-500"
        ];

        return colorSchemes[event.id % colorSchemes.length];
    };

    const renderCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDayOfMonth = getFirstDayOfMonth(currentDate);
        const days = [];

        // Empty cells for padding
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(
                <div key={`empty-${i}`} className="min-h-[8rem] bg-gray-50/30"></div>
            );
        }

        // Generate calendar days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const dateStr = formatDateToYYYYMMDD(date);
            const dayEvents = events[dateStr] || [];
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;

            days.push(
                <div
                    key={dateStr}
                    className={`
                        min-h-[8rem] p-2 relative group
                        transition-all duration-300 ease-in-out
                        ${isToday(date)
                            ? 'bg-blue-50/20'
                            : isWeekend
                                ? 'bg-gray-50/10'
                                : 'bg-white'
                        }
                        hover:bg-gray-50/80
                        before:absolute before:inset-0 before:border-t before:border-l 
                        before:border-gray-100 before:pointer-events-none
                    `}
                    onClick={() => onDateClick(dateStr)}
                >
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex flex-col items-center">
                            <span className={`
                                w-7 h-7 flex items-center justify-center
                                text-sm font-medium rounded-full
                                transition-all duration-300
                                ${isToday(date)
                                    ? 'bg-blue-500 text-white'
                                    : isWeekend
                                        ? 'text-gray-400'
                                        : 'text-gray-700'
                                }
                                group-hover:scale-110
                            `}>
                                {day}
                            </span>
                        </div>
                        {dayEvents.length > 0 && (
                            <span className="
                                text-xs px-2 py-1 rounded-full
                                bg-gray-100 text-gray-600
                                transition-all duration-300
                                group-hover:bg-gray-200
                            ">
                                {dayEvents.length}
                            </span>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        {dayEvents.slice(0, 2).map((event) => (
                            <div
                                key={event.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEventClick(event, e);
                                }}
                                className={`
                                p-2 rounded-lg w-full flex flex-col items-start
                                text-xs font-medium leading-tight
                                transition-all duration-300
                                hover:translate-x-1 hover:shadow-md
                                ${getEventClasses(event, dateStr)}
                            `}
                            >
                                <div className="w-full truncate min-w-0 text-gray-700">
                                    {event.title}
                                </div>
                                <div className="flex items-center mt-1 text-gray-500 text-[11px]">
                                    <Clock size={12} className="mr-1 flex-shrink-0" />
                                    <span className="truncate min-w-0">{event.startTime}</span>
                                </div>
                            </div>

                        ))}

                        {dayEvents.length > 2 && (
                            <button
                                className="
                                    w-full py-1 px-2
                                    flex items-center justify-center gap-1
                                    text-xs text-gray-500
                                    bg-gray-50 rounded-md
                                    transition-all duration-300
                                    hover:bg-gray-100 hover:text-gray-700
                                    group/more
                                "
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onShowMoreEvents(dateStr, dayEvents);
                                }}
                            >
                                <span>{dayEvents.length - 2} more</span>
                                <ChevronRight size={14} className="transition-transform group-hover/more:translate-x-0.5" />
                            </button>
                        )}
                    </div>
                </div>
            );
        }

        return days;
    };

    return (
        <div className="rounded-xl overflow-hidden shadow-lg bg-white border border-gray-100">
            <div className="grid grid-cols-7">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div
                        key={day}
                        className="
                            py-3 text-center
                            text-sm font-medium text-gray-500
                            bg-gray-50/50 border-b border-gray-100
                        "
                    >
                        {day}
                    </div>
                ))}
                {renderCalendarDays()}
            </div>
        </div>
    );
};

export default CalendarGrid;
