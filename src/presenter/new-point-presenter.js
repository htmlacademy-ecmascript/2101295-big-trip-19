import {remove, render, RenderPosition} from '../framework/render.js';
import FormEditingView from '../view/form-editing-view';
import {nanoid} from 'nanoid';
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
      //formType:'add',
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleFormReset,
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

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {id: nanoid(), ...point},
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
