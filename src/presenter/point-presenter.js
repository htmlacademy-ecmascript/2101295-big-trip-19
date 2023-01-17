import RoutePointView from '../view/route-point-view';
import FormEditingView from '../view/form-editing-view';
import {render, replace, remove} from '../framework/render.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};
export default class PointPresenter {
  #listPointsComponent = null;
  #handleModeChange = null;
  #handleDataChange = null;

  #routePointComponent = null;
  #formEditingComponent = null;

  #point = null;
  #destinations = null;
  #offersList = null;
  #offersListByType = null;

  #mode = Mode.DEFAULT;

  constructor({listContainer, onDataChange, onModeChange}) {
    this.#listPointsComponent = listContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
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

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#routePointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#formEditingComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToPoint();
    }
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
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToPoint () {
    replace(this.#routePointComponent, this.#formEditingComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #handleFavoriteClick = () => {
    this.#handleDataChange({...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #handleOpenPointBoardButtonClick = () => this.#replacePointToForm();
  #handleClosePointBoardButtonClick = () => this.#replaceFormToPoint();
}
