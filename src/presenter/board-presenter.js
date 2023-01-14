import FormEditingView from '../view/form-editing-view';
import ListPointsView from '../view/list-route-points';
import RoutePointView from '../view/route-point-view';
import PointsListEmptyView from '../view/points-list-empty-view';
import FormSortView from '../view/form-sort-view';
import {render} from '../render.js';
import PointPresenter from './point-presenter';

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

  #renderEventsList() {
    render(this.#listPointsComponent, this.#boardContainer);

    for (let i = 0; i < this.#boardOffers.length; i++) {
      this.#renderRoutePoint({point: this.#boardOffers[i], destinations: this.#destinations, offersList: this.#offersList, offersListByType: this.#offersListByType});
    }
  };


  #renderRoutePoint({point, destinations, offersList, offersListByType}) {

    const eventPointPresenter = new PointPresenter(this.#listPointsComponent);

    eventPointPresenter.init(point, destinations, offersList, offersListByType);
  }

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
