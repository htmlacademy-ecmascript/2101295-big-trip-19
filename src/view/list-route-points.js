import {createElement} from '../render.js';

function createFiltersFormTemplate() {
  return (
    `<ul class="trip-events__list">
    </ul>`
  );
}

export default class ListRoutePointsView {
  #element = null;
  get template() {
    return createFiltersFormTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
