import React, { useState } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { FaChevronLeft, FaChevronRight, FaCalendarAlt } from 'react-icons/fa';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevDay = () => setCurrentDate(subDays(currentDate, 1));
  const handleNextDay = () => setCurrentDate(addDays(currentDate, 1));

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 dark:bg-green-950 dark:text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-6 flex items-center justify-between text-white">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FaCalendarAlt />
          Calendar
        </h2>
        <span className="text-sm font-light">
          {format(currentDate, 'EEEE')}
        </span>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-between p-6 bg-gray-100 dark:bg-green-900">
        <button
          onClick={handlePrevDay}
          className="bg-white dark:bg-green-800 hover:bg-gray-200 dark:hover:bg-green-700 text-gray-800 dark:text-white font-semibold py-2 px-4 rounded-lg shadow-md transition"
        >
          <FaChevronLeft />
        </button>

        <div className="text-xl font-semibold text-gray-900 dark:text-white">
          {format(currentDate, 'MMMM dd, yyyy')}
        </div>

        <button
          onClick={handleNextDay}
          className="bg-white dark:bg-green-800 hover:bg-gray-200 dark:hover:bg-green-700 text-gray-800 dark:text-white font-semibold py-2 px-4 rounded-lg shadow-md transition"
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Events */}
      <div className="p-6 bg-white dark:bg-green-950">
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          Events for {format(currentDate, 'MMMM dd, yyyy')}:
        </p>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-100 space-y-1">
          <li>No events scheduled.</li>
        </ul>
      </div>
    </div>
  );
};

export default Calendar;
