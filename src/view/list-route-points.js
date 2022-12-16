import {createElement} from '../render.js';

function createFiltersFormTemplate() {
  return (
    `<ul class="trip-events__list">
    </ul>`
  );
}

export default class ListRoutePointsView {
  getTemplate() {
    return createFiltersFormTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
