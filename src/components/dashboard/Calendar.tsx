import React, { useState } from 'react';
import { format, addDays, subDays } from 'date-fns';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevDay = () => {
    setCurrentDate(subDays(currentDate, 1));
  };

  const handleNextDay = () => {
    setCurrentDate(addDays(currentDate, 1));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Calendar</h2>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevDay}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
        >
          Previous
        </button>
        <span className="text-xl font-semibold">{format(currentDate, 'MMMM dd, yyyy')}</span>
        <button
          onClick={handleNextDay}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
        >
          Next
        </button>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-gray-700">Events for {format(currentDate, 'MMMM dd, yyyy')}:</p>
        <ul className="list-disc list-inside mt-2">
          <li>No events scheduled.</li>
        </ul>
      </div>
    </div>
  );
};

export default Calendar;