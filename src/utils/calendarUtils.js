// src/utils/calendarUtils.js
export const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
};

export const isEventExpired = (event) => {
    const now = new Date();
    const eventDate = new Date(event.date + 'T' + event.endTime);
    return now > eventDate;
};

export const generateCalendarDays = (currentDate) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days = [];

    // Add empty days for the start of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(null);
    }

    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
        days.push(new Date(year, month, day));
    }

    return days;
};


// calendarUtils.js
export const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

export const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};


export const formatDateToYYYYMMDD = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};