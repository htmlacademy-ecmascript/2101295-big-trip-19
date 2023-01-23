import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../const/const';

const NoTasksTextType = {
  [FilterType.EVERYTHING]:'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now'
};

function createPointsListEmpty (filterType) {
  const noTaskTextValue = NoTasksTextType[filterType];
  return (
    `<p class="trip-events__msg">${noTaskTextValue}</p>`
  );
}

export default class PointsListEmptyView extends AbstractView {

  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createPointsListEmpty(this.#filterType);
  }
}
