import dayjs from 'dayjs';

const DATE_FORMAT = 'MMM DD';
const TIME_FORMAT = 'hh:mm';


export const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

export const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export function humanizeTravelDay(dateFrom) {
  return dateFrom ? dayjs(dateFrom).format(DATE_FORMAT) : '';
}

export function humanizeTravelDayForEditing(dateFrom) {
  return dateFrom ? dayjs(dateFrom).format('MM/DD/YYYY') : '';
}

export function humanizeTimeFromTo(dateTo) {
  return dateTo ? dayjs(dateTo).format(TIME_FORMAT) : '';
}

export function humanizeTravelTime(from, to) {
  return dayjs(to).diff(dayjs(from), 'h');
}
