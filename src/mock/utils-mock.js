import {FilterType} from '../const/const';
import {isEventPast, isEventPresent, isEventFuture} from '../utils/utils';

export const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

export const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const filter = {
  [FilterType.EVERYTHING]: (points) => points.filter((point) => point),
  [FilterType.FUTURE]: (points) => points.filter((point) => isEventFuture(point.dueDate)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isEventPresent(point.dateFrom, point.dateTo)),
  [FilterType.PAST]: (points) => points.filter((point) => isEventPast(point.dateFrom)),
};

