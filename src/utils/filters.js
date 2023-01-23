import {FilterType} from '../const/const';
import {isEventPast, isEventPresent, isEventFuture} from '../utils/utils';

export const filter = {
  [FilterType.EVERYTHING]: (points) => points.filter((point) => point),
  [FilterType.FUTURE]: (points) => points.filter((point) => isEventFuture(point.dateFrom)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isEventPresent(point.dateFrom, point.dateTo)),
  [FilterType.PAST]: (points) => points.filter((point) => isEventPast(point.dateFrom)),
};

