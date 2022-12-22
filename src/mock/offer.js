import { propetys, offersByType} from './mocks-const';
import {getRandomArrayElement, getRandomNumber} from './utils-mock';


const getOffers = () => {
  const lengthOfArray = getRandomNumber(0, 90);
  const arrayOffers = [];
  while (arrayOffers.length < lengthOfArray) {
    const el = {
      id: arrayOffers.length,
      title: getRandomArrayElement(propetys),
      price: getRandomNumber(10, 400),
    };
    arrayOffers.push(el);
  }
  return arrayOffers;
};

export const offersList = getOffers();

export const getOffersByType = () => offersByType.map((offer, id) => ({
  type: offer,
  offers: offersList.slice(id * Math.floor(offersList.length / 10), (id + 1) * Math.floor(offersList.length / 10)),
}));

export const offersListByType = getOffersByType();


