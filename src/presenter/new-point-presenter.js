import {remove, render, RenderPosition} from '../framework/render.js';
import FormEditingView from '../view/form-editing-view';
import {UserAction, UpdateType} from '../const/const';

export default class NewWaypointPresenter {
  #pointsListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;

  #pointsAddComponent = null;

  constructor({pointListContainer, onDataChange, onDestroy}) {
    this.#pointsListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init(destinations, offersList, offersListByType) {
    if (this.#pointsAddComponent !== null) {
      return;
    }

    this.#pointsAddComponent = new FormEditingView({
      destinations: destinations,
      offersList: offersList,
      offersListByType: offersListByType,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleFormReset,
      onClick: this.#handleFormReset,
    });

    render(this.#pointsAddComponent, this.#pointsListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointsAddComponent === null) {
      return;
    }
    this.#handleDestroy();
    remove(this.#pointsAddComponent);
    this.#pointsAddComponent = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving() {
    this.#pointsAddComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#pointsAddComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointsAddComponent.shake(resetFormState);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
    this.destroy();
  };

  #handleFormReset = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
