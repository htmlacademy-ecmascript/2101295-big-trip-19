import FormEditingView from '../view/form-editing-view';
import ListPointsView from '../view/list-route-points';
import RoutePointView from '../view/route-point-view';
import FormCreateView from '../view/form-create-view';
import {render} from '../render.js';

export default class BoardPresenter {
  #listPointsComponent = new ListPointsView();
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

    render(this.#listPointsComponent, this.#boardContainer);
    render(new FormEditingView({point: this.#boardOffers[0], destinations: this.#destinations, offersList: this.#offersList, offersListByType: this.#offersListByType}), this.#listPointsComponent.element);
    render(new FormCreateView(), this.#listPointsComponent.element);

    for (let i = 1; i < this.#boardOffers.length; i++) {
      render(new RoutePointView({point: this.#boardOffers[i], destinations: this.#destinations, offersList: this.#offersList}), this.#listPointsComponent.element);
    }
  }
}
