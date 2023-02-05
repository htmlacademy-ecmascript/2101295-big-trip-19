import AbstractStatefulView from '../framework//view/abstract-stateful-view';
import { humanizeTimeFromTo, humanizeTravelDayForEditing} from '../utils/utils';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import he from 'he';

const DEFAULT_POINT = {
  basePrice: '0',
  dateFrom: '2019-07-10T22:55:56.845Z',
  dateTo: '2019-07-11T11:22:13.375Z',
  destination: 1,
  isFavorite: false,
  offers: [],
  type: 'taxi'
};

function createDestinationListTemplate(destinations) {
  return destinations.map((destination) => `<option value="${he.encode(destination.name)}"></option>`).join('');
}

function createPhotosTape(srcPhoto) {
  return (
    `<img class="event__photo" src="${srcPhoto}" alt="Event photo"></img>`
  );
}
function createAvailableOffers(offer, selectedsOffers) {
  const isChecked = selectedsOffers.some((el) => el.id === offer.id);

  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden"
        id="event-offer-luggage-${offer.id}"
        type="checkbox"
        name="event-offer-luggage"
        ${isChecked ? 'checked' : ''}>
        <label class="event__offer-label" for="event-offer-luggage-${offer.id}">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`
  );
}

function createFiltersFormTemplate(point, destinations, offersList) {
  const {basePrice, dateFrom, dateTo, destination, offers, type, isDisabled, isSaving, isDeleting} = point;

  const dateStart = humanizeTravelDayForEditing(dateFrom);
  const dateFinish = humanizeTravelDayForEditing(dateTo);

  const dateStartHouse = humanizeTimeFromTo(dateFrom);
  const dateFinishHouse = humanizeTimeFromTo(dateTo);

  const offersByType = offersList.find((el) => el.type === type).offers;
  const selectedsOffers = offersByType.filter((el) => offers.includes(el.id));
  const selectedDestination = destinations.find((el) => el.id === destination);

  return (
    `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>

              <div class="event__type-item">
                <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
                <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
                <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
                <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
                <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
                <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>
                <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
                <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
                <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
                <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
              </div>
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${selectedDestination?.name}" list="destination-list-1" required ${isDisabled ? 'disabled' : ''}>
          <datalist id="destination-list-1">
            ${createDestinationListTemplate(destinations)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateStart} ${dateStartHouse}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateFinish} ${dateFinishHouse}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${basePrice}" required>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>
          ${isSaving ? 'Saving...' : 'Save'}
        </button>
        <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>
          ${isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
          ${offersByType.map((offer) => createAvailableOffers(offer, selectedsOffers)).join('')}
          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${selectedDestination?.description}</p>
          <div class="event__photos-container">
              <div class="event__photos-tape">
              ${selectedDestination?.pictures.map((el) => createPhotosTape(el.src)).join('')}
            </div>
        </section>
      </section>
    </form>
    </li>`
  );
}

export default class FormEditingView extends AbstractStatefulView {
  #destinations = null;
  #offersList = null;
  #handleClick = null;
  #handleEditorFormSubmit = null;
  #startDatePicker = null;
  #endDatePicker = null;
  #handleDeleteClick = null;

  constructor ({point = DEFAULT_POINT, destinations, offersList, onClick, onFormSubmit, onDeleteClick}) {
    super();
    this._setState(FormEditingView.parsePointToState(point));
    this.#destinations = destinations;
    this.#offersList = offersList;
    this.#handleClick = onClick;
    this.#handleEditorFormSubmit = onFormSubmit;
    this._restoreHandlers();
    this.#handleDeleteClick = onDeleteClick;
  }

  removeElement() {
    super.removeElement();

    if (this.#startDatePicker || this.#endDatePicker) {
      this.#startDatePicker.destroy();
      this.#endDatePicker.destroy();

      this.#startDatePicker = null;
      this.#endDatePicker = null;
    }
  }

  get template() {
    return createFiltersFormTemplate(this._state, this.#destinations, this.#offersList);
  }

  reset(point) {
    this.updateElement(FormEditingView.parsePointToState(point));
  }

  _restoreHandlers() {
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#onEditPointComponentClick);
    this.element.querySelector('.event--edit').addEventListener('submit', this.#onEditPointComponentSubmit);
    this.element.querySelector('.event__type-list').addEventListener('change', this.#pointTypeChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#pointPriceInputHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#eventChangeDestinationHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);

    this.element.querySelectorAll('.event__offer-selector')
      .forEach((offer) => offer.addEventListener('change', this.#offerChangeHandler));

    this.#setDatePickers();
  }

  static parsePointToState(point) {
    return {...point,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToPoint(state){
    const point = {...state};

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  }

  #onEditPointComponentClick = () => {
    this.#handleClick();
  };

  #onEditPointComponentSubmit = (evt) => {
    evt.preventDefault();
    this.#handleEditorFormSubmit(FormEditingView.parseStateToPoint(this._state));
  };

  #pointTypeChangeHandler = (evt) => {
    const inputElement = evt.target.closest('.event__type-item').querySelector('.event__type-input');
    if (inputElement) {
      evt.preventDefault();
      this.updateElement({
        type: inputElement.value
      });
    }
  };

  #offerChangeHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.tagName === 'INPUT') {
      const checkedOfferId = Number(evt.target.id[20]);
      const checkedOfferIndex = this._state.offers.indexOf(checkedOfferId);
      if (checkedOfferIndex === -1) {
        this._state.offers.push(checkedOfferId);
        return;
      }
      this._state.offers = [
        ...this._state.offers.slice(0, checkedOfferIndex),
        ...this._state.offers.slice(checkedOfferIndex + 1),
      ];
    }
  };

  #pointPriceInputHandler = (evt) => {
    this.element.querySelector('.event__save-btn').disabled = true;
    evt.preventDefault();
    this._setState({
      basePrice: Number(evt.target.value)
    });
    if (this._state.basePrice > 0) {
      this.element.querySelector('.event__save-btn').disabled = false;
    }
  };

  #eventChangeDestinationHandler = (evt) => {
    const CITIES = [];
    this.#destinations.forEach((destination) => CITIES.push(destination.name));
    if (CITIES.includes(evt.target.value)) {
      this.updateElement({
        destination: CITIES.indexOf(evt.target.value) + 1,
      });
    } else {evt.target.value = ''; evt.target.placeholder = 'выберите из списка';}

  };

  #pointStartDateChangeHandler = ([startDate]) => {
    this._setState({
      dateFrom: startDate,
    });
  };

  #pointEndDateChangeHandler = ([endDate]) => {
    this._setState({
      dateTo: endDate,
    });
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(FormEditingView.parseStateToPoint(this._state));
  };

  #setDatePickers() {
    const startTimeElement = this.element.querySelector('#event-start-time-1');
    const endTimeElement = this.element.querySelector('#event-end-time-1');

    this.#startDatePicker = flatpickr(startTimeElement,
      {
        enableTime: true,
        defaultDate: this._state.dateFrom,
        dateFormat: 'd/m/y H:i',
        onChange: this.#pointStartDateChangeHandler,
      }
    );

    this.#endDatePicker = flatpickr(endTimeElement,
      {
        enableTime: true,
        defaultDate: this._state.dateTo,
        dateFormat: 'd/m/y H:i',
        onChange: this.#pointEndDateChangeHandler,
      }
    );
  }
}
