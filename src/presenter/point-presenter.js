
import RoutePointView from '../view/route-point-view';
import FormEditingView from '../view/form-editing-view';
//import {render} from '../render.js';
import {render, replace, remove} from '../framework/render.js';

export default class PointPresenter {
  #listPointsComponent = null;

  #routePointComponent = null;
  #formEditingComponent = null;

  #handleDataChange = null;

  #point = null;
  #destinations = null;
  #offersList = null;
  #offersListByType = null;

  constructor({listContainer, onDataChange}) {
    this.#listPointsComponent = listContainer;
    this.#handleDataChange = onDataChange;
  }

  init(point, destinations, offersList, offersListByType) {
    this.#point = point;
    this.#destinations = destinations;
    this.#offersList = offersList;
    this.#offersListByType = offersListByType;

    const prevPointComponent = this.#routePointComponent;
    const prevPointEditComponent = this.#formEditingComponent;

    this.#routePointComponent = new RoutePointView({
      point: this.#point,
      destinations: this.#destinations,
      offersList: this.#offersList,
      onFavoriteClick: this.#handleFavoriteClick,
      onClick: this.#handleOpenPointBoardButtonClick,
    });

    this.#formEditingComponent = new FormEditingView({
      point: this.#point,
      destinations: this.#destinations,
      offersList: this.#offersList,
      offersListByType: this.#offersListByType,
      onClick: this.#handleClosePointBoardButtonClick,
    });

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#routePointComponent, this.#listPointsComponent);
      return;
    }

    if (this.#listPointsComponent.contains(prevPointComponent.element)) {
      replace(this.#routePointComponent, prevPointComponent);
    }

    if (this.#listPointsComponent.contains(prevPointEditComponent.element)) {
      replace(this.#formEditingComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this.#routePointComponent);
    remove(this.#formEditingComponent);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };

  #replacePointToForm () {
    replace(this.#formEditingComponent, this.#routePointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceFormToPoint () {
    replace(this.#routePointComponent, this.#formEditingComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFavoriteClick = () => {
    this.#handleDataChange({...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #handleOpenPointBoardButtonClick = () => this.#replacePointToForm();
  #handleClosePointBoardButtonClick = () => this.#replaceFormToPoint();
}
