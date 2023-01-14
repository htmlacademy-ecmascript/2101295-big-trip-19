
import RoutePointView from '../view/route-point-view';
import FormEditingView from '../view/form-editing-view';
import {render} from '../render.js';

export default class PointPresenter {
  #listPointsComponent = null;

  #routePointComponent = null;
  #formEditingComponent = null;

  #point = null;
  #destinations = null;
  #offersList = null;
  #offersListByType = null;

  constructor(listContainer) {
    this.#listPointsComponent = listContainer;
  }

  init(point, destinations, offersList, offersListByType) {
    this.#point = point;
    this.#destinations = destinations;
    this.#offersList = offersList;
    this.#offersListByType = offersListByType;


    this.#routePointComponent = new RoutePointView({
      point: this.#point,
      destinations: this.#destinations,
      offersList: this.#offersList,
      onClick: this.#handleOpenPointBoardButtonClick,
    });

    this.#formEditingComponent = new FormEditingView({
      point: this.#point,
      destinations: this.#destinations,
      offersList: this.#offersList,
      offersListByType: this.#offersListByType,
      onClick: this.#handleClosePointBoardButtonClick,
    });

    render(this.#routePointComponent, this.#listPointsComponent.element);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };

  #replacePointToForm () {
    this.#listPointsComponent.element.replaceChild(this.#formEditingComponent.element, this.#routePointComponent.element);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceFormToPoint () {
    this.#listPointsComponent.element.replaceChild(this.#routePointComponent.element, this.#formEditingComponent.element);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleOpenPointBoardButtonClick = () => this.#replacePointToForm();
  #handleClosePointBoardButtonClick = () => this.#replaceFormToPoint();
}
