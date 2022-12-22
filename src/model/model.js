import {getPoint} from '../mock/points';
import {destinations} from '../mock/destinstion';
import {COUNT_POINTS} from '../const/const';
import {offersList, offersListByType} from '../mock/offer';


export default class PointsModel {
  point = getPoint(COUNT_POINTS);
  destinations = destinations;
  offersList = offersList;
  offersListByType = offersListByType;

  getPoints() {
    return this.point;
  }

  getDestinations() {
    return this.destinations;
  }

  getOffers() {
    return this.offersList;
  }

  getByOffers() {
    return this.offersListByType;
  }
}
