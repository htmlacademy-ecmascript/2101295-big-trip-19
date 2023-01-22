import ListPointsView from '../view/list-route-points';
import PointsListEmptyView from '../view/points-list-empty-view';
import FormSortView from '../view/form-sort-view';
import {render, remove} from '../framework/render.js';
import PointPresenter from './point-presenter';
//import {updateItem} from '../utils/common.js';
import {SortType, UserAction, UpdateType} from '../const/const';
import {sortByTime, sortByPrice, sortByDay} from '../utils/utils';


export default class BoardPresenter {
  #listPointsComponent = new ListPointsView();
  #pointsListEmptyView = new PointsListEmptyView();
  #sortComponent = null;
  #boardContainer = null;
  #pointsModel = null;
  #boardOffers = null;
  #destinations = null;
  #offersList = null;
  #offersListByType = null;
  #pointsPresenter = new Map();
  #currentSortType = null;
  #originalEventPoints = [];

  constructor({boardContainer, pointsModel}) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    switch (this.#currentSortType) {
      case SortType.DAY:
        return this.#boardOffers.sort(sortByDay);
      case SortType.TIME:
        return this.#boardOffers.sort(sortByTime);
      case SortType.PRICE:
        return this.#boardOffers.sort(sortByPrice);
    }
    return this.#pointsModel.points;
  }

  init() {
    this.#boardOffers = [...this.#pointsModel.points];
    this.#originalEventPoints = [...this.#pointsModel.points];
    this.#destinations = [...this.#pointsModel.destinations];
    this.#offersList = [...this.#pointsModel.offers];
    this.#offersListByType = [...this.#pointsModel.offersByType];
    this.#renderPointsList();
  }


  #handleModeChange = () => {
    this.#pointsPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderEventsList(points) {
    render(this.#listPointsComponent, this.#boardContainer);
    points.forEach((point) => this.#renderRoutePoint({point, destinations: this.#destinations, offersList: this.#offersList, offersListByType: this.#offersListByType}));
  }

  #handleViewAction = (actionType, updateType, update) => {
    //console.log(actionType, updateType, update);
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    //console.log(updateType, data);
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointsPresenter.get(data.id).init(data, this.#destinations, this.#offersList, this.#offersListByType);
        break;
      case UpdateType.MINOR:
        this.#clearPointsList();
        this.#renderPointsList();
        break;
      case UpdateType.MAJOR:
        this.#clearPointsList({resetSortType: true});
        this.#renderPointsList();
        break;
    }
  };

  #clearPointsList({resetSortType = false} = {}) {
    this.#pointsPresenter.forEach((presenter) => presenter.destroy());
    this.#pointsPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#pointsListEmptyView);

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderRoutePoint({point, destinations, offersList, offersListByType}) {
    const eventPointPresenter = new PointPresenter({listContainer: this.#listPointsComponent.element, onDataChange: this.#handleViewAction, onModeChange: this.#handleModeChange});
    eventPointPresenter.init(point, destinations, offersList, offersListByType);
    this.#pointsPresenter.set(point.id, eventPointPresenter);
  }

  // #handlePointChange = (updatedPoint) => {
  //   this.#boardOffers = updateItem(this.#boardOffers, updatedPoint);
  //   this.#pointsPresenter.get(updatedPoint.id).init(updatedPoint, this.#destinations, this.#offersList, this.#offersListByType);
  // };

  #handleSortTypeChange = (sortType)=>{
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearPointsList();
    this.#renderPointsList();
  };

  #renderSort() {
    this.#sortComponent = new FormSortView({
      onSortTypeChange: this.#handleSortTypeChange,
      currentSortType: this.#currentSortType,
    });
    render(this.#sortComponent, this.#boardContainer);
  }

  #renderPointsList() {
    render(this.#listPointsComponent, this.#boardContainer);
    if (!this.#pointsModel.points) {
      render(this.#pointsListEmptyView, this.#boardContainer);
    }
    this.#renderSort();
    this.#renderEventsList(this.points);
  }
}
