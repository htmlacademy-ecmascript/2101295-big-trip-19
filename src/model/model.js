import {getPoint} from '../mock/points';
import {destinations} from '../mock/destinstion';
import {COUNT_POINTS} from '../const/const';
import {offersList, offersListByType} from '../mock/offer';


export default class PointsModel {
  #point = getPoint(COUNT_POINTS);
  #destinations = destinations;
  #offersList = offersList;
  #offersListByType = offersListByType;

  get points() {
    return this.#point;
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
