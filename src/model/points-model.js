import Observable from '../framework/observable.js';
import {getPoint} from '../mock/points';
import {destinations} from '../mock/destinstion';
import {COUNT_POINTS} from '../const/const';
import {offersList, offersListByType} from '../mock/offer';


export default class PointsModel extends Observable {
  #points = getPoint(COUNT_POINTS);
  #destinations = destinations;
  #offersList = offersList;
  #offersListByType = offersListByType;

  get points() {
    return this.#points;
  }

  updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];
    this._notify(updateType);
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offersList;
  }

  get offersByType() {
    return this.#offersListByType;
  }
}
