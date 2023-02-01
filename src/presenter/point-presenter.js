import RoutePointView from '../view/route-point-view';
import FormEditingView from '../view/form-editing-view';
import {render, replace, remove} from '../framework/render.js';
import {UserAction, UpdateType} from '../const/const';
import {isDatesEqual} from '../utils/utils';

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
      onFormSubmit: this.#handleEditorFormSubmit,
      onDeleteClick: this.#handleDeleteClick
    });

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#routePointComponent, this.#listPointsComponent);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#routePointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#routePointComponent, prevPointEditComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#formEditingComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  }

  destroy() {
    remove(this.#routePointComponent);
    remove(this.#formEditingComponent);
  }

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#formEditingComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#formEditingComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#routePointComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#formEditingComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#formEditingComponent.shake(resetFormState);
  }

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
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      {...this.#point, isFavorite: !this.#point.isFavorite},
    );
  };

  #handleDeleteClick = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #handleEditorFormSubmit = (point) => {
    const isMinorUpdate = !(isDatesEqual(this.#point.dateFrom, point.dateFrom)
    && isDatesEqual(this.#point.dateTo, point.dateTo))
    || (this.#point.basePrice !== point.basePrice);

    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      point
    );
  };

  #handleOpenPointBoardButtonClick = () => this.#replacePointToForm();
  #handleClosePointBoardButtonClick = () => {
    this.#formEditingComponent.reset(this.#point);
    this.#replaceFormToPoint();
  };
}
