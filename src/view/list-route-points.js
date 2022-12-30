import AbstractView from '../framework/view/abstract-view.js';

function createFiltersFormTemplate() {
  return (
    `<ul class="trip-events__list">
    </ul>`
  );
}

export default class ListRoutePointsView extends AbstractView{
  get template() {
    return createFiltersFormTemplate();
  }
}
