export const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('default', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };
  
  export const validateTimeRange = (startTime, endTime) => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    return start < end;
  };