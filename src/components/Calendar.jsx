import { useState } from "react";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import EventModal from "./EventModal";
import EventsListModal from "./EventListModal";
import eventsData from "./eventsData.json";  // ✅ Load static events

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [showEventModal, setShowEventModal] = useState(false);
    const [showEventsListModal, setShowEventsListModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [userEvents, setUserEvents] = useState([]); // ✅ Store user-created events

    // ✅ Merge static events with user-created events
    const eventsByDate = {};
    [...eventsData, ...userEvents].forEach(event => {
        if (!eventsByDate[event.date]) {
            eventsByDate[event.date] = [];
        }
        eventsByDate[event.date].push(event);
    });

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const handleDateClick = (date) => {
        setSelectedDate(date);
        setSelectedEvent(null);
        setShowEventModal(true);
    };

    const handleEventClick = (event, e) => {
        if (e) e.stopPropagation();
        setSelectedEvent(event);
        setShowEventModal(true);
    };

    const handleAddEvent = (newEvent) => {
        const formattedDate = newEvent.date;
        const newStart = newEvent.startTime;
        const newEnd = newEvent.endTime;

        // ✅ Check for event conflicts
        const conflictingEvents = userEvents.filter(event =>
            event.id !== selectedEvent?.id &&  // ✅ Ignore the current event when updating
            event.date === formattedDate &&
            ((newStart >= event.startTime && newStart < event.endTime) ||
                (newEnd > event.startTime && newEnd <= event.endTime) ||
                (newStart <= event.startTime && newEnd >= event.endTime))
        );


        if (conflictingEvents.length > 0) {
            const userConfirmed = window.confirm(
                `⚠️ Conflict detected with ${conflictingEvents.length} event(s). Do you still want to proceed?`
            );

            if (!userConfirmed) {
                return;
            }
        }

        if (selectedEvent) {
            // ✅ Update existing event
            alert('Successfully Updated the event ✅')
            setUserEvents(userEvents.map(event =>
                event.id === selectedEvent.id ? { ...newEvent, id: event.id } : event
            ));
        } else {
            // ✅ Add new event
            alert('Successfully added the event ✅')
            setUserEvents([...userEvents, { ...newEvent, id: Date.now() }]);
        }

        setShowEventModal(false);
        setSelectedEvent(null);
    };

    const handleDeleteEvent = (eventId) => {
        const eventToDelete = userEvents.find(event => event.id === eventId);
        if (!eventToDelete) {
            alert("❌ You cannot delete static events!");
            return;
        }

        setUserEvents(userEvents.filter(event => event.id !== eventId));
        alert('Successfully deleted the selected event. ✅')
        setShowEventModal(false);
    };

    const handleShowMoreEvents = (date) => {
        setSelectedDate(date);
        setShowEventsListModal(true);
    };

    return (
        <>
            <CalendarHeader
                currentDate={currentDate}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
            />
            <CalendarGrid
                currentDate={currentDate}
                events={eventsByDate}  // ✅ Pass events grouped by date
                onDateClick={handleDateClick}
                onEventClick={handleEventClick}
                onShowMoreEvents={handleShowMoreEvents}
            />
            {showEventModal && (
                <EventModal
                    event={selectedEvent}
                    selectedDate={selectedDate}
                    onClose={() => {
                        setSelectedEvent(null);
                        setShowEventModal(false);
                    }}
                    onSave={handleAddEvent}
                    onDelete={handleDeleteEvent}
                />
            )}
            {showEventsListModal && (
                <EventsListModal
                    date={selectedDate}
                    events={eventsByDate[selectedDate] || []}  // ✅ Only show events for selected date
                    onClose={() => setShowEventsListModal(false)}
                    onEventClick={handleEventClick}
                    onDeleteEvent={handleDeleteEvent}
                />
            )}
        </>
    );
};

export default Calendar;
