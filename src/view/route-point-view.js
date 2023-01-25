import AbstractView from '../framework/view/abstract-view.js';
import {humanizeTravelDay, humanizeTimeFromTo, humanizeTravelTime} from '../utils/utils';

const DEFAULT_POINT = {
  basePrice: '0',
  dateFrom: '2019-07-10T22:55:56.845Z',
  dateTo: '2019-07-11T11:22:13.375Z',
  destination: 0,
  id: 123,
  isFavorite: false,
  offers: 1,
  type: 'taxi'
};


function createOffersTemplate(offer) {
  return (
    `<li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>`);
}


function createRoutePointTemplate(point, destinations, offersList) {
  const {basePrice, dateFrom, dateTo, destination, isFavorite, offers, type} = point;

  const date = humanizeTravelDay(dateFrom);
  const selectedsOffers = offersList.filter((el) => offers.includes(el.id));
  const selectedDestination = destinations.find((el) => el.id === destination);
  const dateStart = humanizeTimeFromTo(dateFrom);
  const dateFinish = humanizeTimeFromTo(dateTo);

  const travelTime = humanizeTravelTime(dateFrom, dateTo);

  const favoriteClassName = isFavorite ? 'event__favorite-btn--active' : '';

  return (
    `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="2019-03-19">${date}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/sightseeing.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${selectedDestination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="2019-03-19T11:20">${dateStart}</time>
          &mdash;
          <time class="event__end-time" datetime="2019-03-19T13:00">${dateFinish}</time>
        </p>
        <p class="event__duration">${travelTime}H</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
      ${selectedsOffers.map((offer) => createOffersTemplate(offer)).join('')}
      </ul>
      <button class="event__favorite-btn ${favoriteClassName}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`
  );
}

export default class RoutePointView extends AbstractView {
  #point = null;
  #destinations = null;
  #offersList = null;
  #handleClick = null;
  #handleFavoriteCLick = null;

  constructor({point = DEFAULT_POINT, destinations, offersList, onClick, onFavoriteClick}) {
    super();
    this.#point = point;
    this.#destinations = destinations;
    this.#offersList = offersList;
    this.#handleClick = onClick;
    this.#handleFavoriteCLick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickHandler);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteButtonCLickHandler);
  }

  get template() {
    return createRoutePointTemplate(this.#point, this.#destinations, this.#offersList);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick();
  };

  #favoriteButtonCLickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteCLick();
  };
}
