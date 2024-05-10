// CalendarItem.js
import React from 'react';
import css from './CalendarItem.module.css';
import { format } from 'date-fns';

const CalendarItem = ({ day, waterPercentage }) => {
  // console.log('Is current day:', isCurrentDay);
  console.log('Day:', day);
  const isCurrentDay = new Date() == day;

  return (
    <div className={`${css.day} ${isCurrentDay ? css.currentDay : ''}`}>
      <div
        className={css.waterLevel}
        style={{ height: `${waterPercentage}%` }}
      />
      <div className={css.dayNumber}>{format(day, 'd')}</div>
      <div className={css.waterPercentage}>{waterPercentage}%</div>
    </div>
  );
};

export default CalendarItem;
