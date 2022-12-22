import { DESTINATION, PICTURES } from './mocks-const';
import {getRandomArrayElement, getRandomNumber} from './utils-mock';


export const getDestination = () => DESTINATION.map((el, id) => ({
  id: id,
  description: el.description,
  name: el.name,
  pictures: Array.from({length: getRandomNumber(0, 6)}, () => (
    {
      src: [getRandomArrayElement(PICTURES.map((obj) => obj.src))],
      description: 'фото не загружается',
    }
  ))
}));

export const destinations = getDestination();
