import {nanoid} from 'nanoid';
import { OFFES_BY_TYPE} from '../const/const';
import { offersListByType} from './offer';
import {getRandomArrayElement, getRandomNumber} from './utils-mock';

export const getPoint = (lengthOfArray) => {
  const arrayPoints = [];
  while (arrayPoints.length < lengthOfArray) {
    const typeOfOffers = getRandomArrayElement(OFFES_BY_TYPE);
    const allOffersForType = offersListByType.find((obj) => obj.type === typeOfOffers).offers.map((offer) => offer.id);

    const offersChekid = () => {
      if (allOffersForType) {
        return allOffersForType.slice(0, (allOffersForType.length - getRandomNumber(0, allOffersForType.length)));
      } else {
        return '';
      }
    };

    const selectidOffers = offersChekid();

    const price = getRandomNumber(10, 1500);
    const el = {
      basePrice: `${price}`,
      dateFrom: '2019-07-10T22:55:56.845Z',
      dateTo: '2019-07-11T11:22:13.375Z',
      destination: getRandomNumber(0, 3),
      id: nanoid(),
      isFavorite: true,
      offers: selectidOffers,
      type: typeOfOffers
    };
    arrayPoints.push(el);
  }
  return arrayPoints;
};
