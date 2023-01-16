import ListPointsView from '../view/list-route-points';
import PointsListEmptyView from '../view/points-list-empty-view';
import FormSortView from '../view/form-sort-view';
import {render} from '../render.js';
import PointPresenter from './point-presenter';
import {updateItem} from '../utils/common.js';

export default class BoardPresenter {
  #listPointsComponent = new ListPointsView();
  #pointsListEmptyView = new PointsListEmptyView();
  #sortComponent = new FormSortView();
  #boardContainer = null;
  #pointsModel = null;
  #boardOffers = null;
  #destinations = null;
  #offersList = null;
  #offersListByType = null;
  #pointsPresenter = new Map();

  constructor({boardContainer, pointsModel}) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#boardOffers = [...this.#pointsModel.points];
    this.#destinations = [...this.#pointsModel.destinations];
    this.#offersList = [...this.#pointsModel.offers];
    this.#offersListByType = [...this.#pointsModel.offersByType];
    this.#renderListPoints();

  }

  #handleModeChange = () => {
    this.#pointsPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderEventsList() {
    render(this.#listPointsComponent, this.#boardContainer);

    for (let i = 0; i < this.#boardOffers.length; i++) {
      this.#renderRoutePoint({point: this.#boardOffers[i], destinations: this.#destinations, offersList: this.#offersList, offersListByType: this.#offersListByType});
    }
  }

  #clearTaskList() {
    this.#pointsPresenter.forEach((presenter) => presenter.destroy());
    this.#pointsPresenter.clear();
  }

  #renderRoutePoint({point, destinations, offersList, offersListByType}) {
    const eventPointPresenter = new PointPresenter({listContainer: this.#listPointsComponent.element, onDataChange: this.#handleTaskChange, onModeChange: this.#handleModeChange});
    eventPointPresenter.init(point, destinations, offersList, offersListByType);
    this.#pointsPresenter.set(point.id, eventPointPresenter);
  }

  #handleTaskChange = (updatedPoint) => {
    this.#boardOffers = updateItem(this.#boardOffers, updatedPoint);
    this.#pointsPresenter.get(updatedPoint.id).init(updatedPoint, this.#destinations, this.#offersList, this.#offersListByType);
  };

  #renderSort() {
    render(this.#sortComponent, this.#boardContainer);
  }

  #renderListPoints() {
    render(this.#listPointsComponent, this.#boardContainer);
    if (!this.#pointsModel.points) {
      render(this.#pointsListEmptyView, this.#boardContainer);
    }
    this.#renderSort();
    this.#renderEventsList();
  }
}
