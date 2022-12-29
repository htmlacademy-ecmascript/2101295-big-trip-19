import FormEditingView from '../view/form-editing-view';
import ListPointsView from '../view/list-route-points';
import RoutePointView from '../view/route-point-view';
import PointsListEmptyView from '../view/points-list-empty-view';
//import FormCreateView from '../view/form-create-view';
import {render} from '../render.js';

export default class BoardPresenter {
  #listPointsComponent = new ListPointsView();
  #pointsListEmptyView = new PointsListEmptyView();
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
    if (this.#pointsModel.points) {
      this.#boardOffers = [...this.#pointsModel.points];
      this.#destinations = [...this.#pointsModel.destinations];
      this.#offersList = [...this.#pointsModel.offers];
      this.#offersListByType = [...this.#pointsModel.offersByType];

      render(this.#listPointsComponent, this.#boardContainer);
      //render(new FormEditingView({point: this.#boardOffers[0], destinations: this.#destinations, offersList: this.#offersList, offersListByType: this.#offersListByType}), this.#listPointsComponent.element);
      //render(new FormCreateView(), this.#listPointsComponent.element);

      for (let i = 0; i < this.#boardOffers.length; i++) {
        this.#renderRoutePoint({point: this.#boardOffers[i], destinations: this.#destinations, offersList: this.#offersList, offersListByType: this.#offersListByType});
      }
    } else {
      render(this.#pointsListEmptyView, this.#boardContainer);
    }
  }

  #renderRoutePoint({point, destinations, offersList, offersListByType}) {

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToPoint.call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const routePoint = new RoutePointView({
      point,
      destinations,
      offersList,
      onClick: () => {
        replacePointToForm.call(this);
        document.addEventListener('keydown', escKeyDownHandler);
      }});

    const formEditingPoint = new FormEditingView({
      point,
      destinations,
      offersList,
      offersListByType,
      onClick: () => {
        replaceFormToPoint.call(this);
      }
    });

    function replacePointToForm() {
      this.#listPointsComponent.element.replaceChild(formEditingPoint.element, routePoint.element);
    }

    function replaceFormToPoint() {
      this.#listPointsComponent.element.replaceChild(routePoint.element, formEditingPoint.element);
    }

    render(routePoint, this.#listPointsComponent.element);
  }
}
