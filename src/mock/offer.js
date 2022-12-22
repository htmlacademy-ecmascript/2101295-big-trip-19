import { PROPETYS, OFFES_BY_TYPE} from '../const/const';
import {getRandomArrayElement, getRandomNumber} from './utils-mock';


const getOffers = () => {
  const lengthOfArray = getRandomNumber(0, 90);
  const arrayOffers = [];
  while (arrayOffers.length < lengthOfArray) {
    const el = {
      id: arrayOffers.length,
      title: getRandomArrayElement(PROPETYS),
      price: getRandomNumber(10, 400),
    };
    arrayOffers.push(el);
  }
  return arrayOffers;
};

export const offersList = getOffers();

export const getOffersByType = () => OFFES_BY_TYPE.map((offer, id) => ({
  type: offer,
  offers: offersList.slice(id * Math.floor(offersList.length / 10), (id + 1) * Math.floor(offersList.length / 10)),
}));

export const offersListByType = getOffersByType();

