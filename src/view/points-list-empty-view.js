import {createElement} from '../render.js';

const createPointsListEmpty = () => (
  '<p class="trip-events__msg">Click New Event to create your first point</p>'
);

export default class PointsListEmptyView {
  #element = null;

  get template() {
    return createPointsListEmpty();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  remove() {
    this.#element = null;
  }
}
