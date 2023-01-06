import dayjs from 'dayjs';

const DATE_FORMAT = 'MMM DD';
const TIME_FORMAT = 'hh:mm';


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


export function isEventPast(dueDate) {
  return dueDate && dayjs().isAfter(dueDate, 'D');
}

export function isEventPresent(dateFrom, dateTo) {
  return (dayjs(dateFrom).isSame(dayjs(), 'D') || dayjs(dateFrom).isBefore(dayjs(), 'D')) && (dayjs(dateTo).isSame(dayjs(), 'D') || dayjs(dateTo).isAfter(dayjs(), 'D'));
}

export function isEventFuture(dueDate) {
  return dueDate && dayjs(dueDate).isAfter(dayjs(), 'D');
}
