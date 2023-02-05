import ListPointsView from '../view/list-route-points';
import PointsListEmptyView from '../view/points-list-empty-view';
import FormSortView from '../view/form-sort-view';
import {render, remove, RenderPosition} from '../framework/render.js';
import PointPresenter from './point-presenter';
import NewPointPresenter from './new-point-presenter';
import { filter } from '../utils/filters';
import {SortType, UserAction, UpdateType, FilterType} from '../const/const';
import {sortByTime, sortByPrice, sortByDay} from '../utils/utils';
import LoadingView from '../view/loading-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
//import ErrorPresenter from './error-presenter';
import ErrorView from '../view/error-view';


const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};
export default class BoardPresenter {
  #listPointsComponent = new ListPointsView();
  #pointsListEmptyView = null;
  #errorComponent = new ErrorView;
  #sortComponent = null;
  #loadingComponent = new LoadingView();
  #boardContainer = null;
  #pointsModel = null;
  #filterType = FilterType.EVERYTHING;
  #destinations = [];
  #offersList = [];
  #offersListByType = null;
  #pointsPresenter = new Map();
  #newPointPresenter = null;
  #currentSortType = SortType.DAY;
  #filtersModel = null;
  #isLoading = true;
  #handleNewPointButtonStatus = null;
  #isLoadingError = false;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({boardContainer, pointsModel, filtersModel, onNewPointDestroy, handleAddPointButtonStatus: handleNewPointButtonStatus}) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
    this.#filtersModel = filtersModel;
    this.#handleNewPointButtonStatus = handleNewPointButtonStatus;

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#listPointsComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy,
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filtersModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredPoints.sort(sortByDay);
      case SortType.TIME:
        return filteredPoints.sort(sortByTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortByPrice);
    }
    return filteredPoints;
  }

  #renderNoTasks() {
    this.#pointsListEmptyView = new PointsListEmptyView({
      filterType: this.#filterType
    });

    render(this.#pointsListEmptyView, this.#boardContainer, RenderPosition.AFTEREND);
  }

  init() {
    this.#destinations = [...this.#pointsModel.destinations];
    this.#offersList = [...this.#pointsModel.offers];
    this.#renderPointsList();
  }

  createPoints() {
    this.#currentSortType = SortType.DAY;
    this.#filtersModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init(this.#pointsModel.destinations, this.#pointsModel.offers);
  }

  #handleModeChange = () => {
    this.#pointsPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderEventsList(points) {
    render(this.#listPointsComponent, this.#boardContainer);
    points.forEach((point) => this.#renderRoutePoint({point, destinations: this.#pointsModel.destinations, offersList: this.#pointsModel.offers, offersListByType: this.#offersListByType}));
  }

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsPresenter.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointsPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch(err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointsPresenter.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch {
          this.#pointsPresenter.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointsPresenter.get(data.id).init(data, this.#pointsModel.destinations, this.#pointsModel.offers, this.#offersListByType);
        break;
      case UpdateType.MINOR:
        this.#clearPointsList();
        this.#renderPointsList();
        break;
      case UpdateType.MAJOR:
        this.#clearPointsList({resetSortType: true});
        this.#renderPointsList();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderPointsList();
        break;
      case UpdateType.ERROR:
        this.#isLoading = false;
        this.#isLoadingError = true;
        this.#renderErrorComponent(data);
        this.#clearPointsList({resetSortType: true});
        this.#handleNewPointButtonStatus(true);
        break;
    }
  };

  #renderErrorComponent(data) {
    this.#errorComponent = new ErrorView(data);
    render(this.#errorComponent, this.#listPointsComponent.element, RenderPosition.AFTERBEGIN);
  }

  #clearPointsList({resetSortType = false} = {}) {
    this.#pointsPresenter.forEach((presenter) => presenter.destroy());
    this.#pointsPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);
    if (this.#pointsListEmptyView) {
      remove(this.#pointsListEmptyView);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderRoutePoint({point, destinations, offersList, offersListByType}) {
    const eventPointPresenter = new PointPresenter({listContainer: this.#listPointsComponent.element, onDataChange: this.#handleViewAction, onModeChange: this.#handleModeChange});
    eventPointPresenter.init(point, destinations, offersList, offersListByType);
    this.#pointsPresenter.set(point.id, eventPointPresenter);
  }

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

  #renderLoading() {
    render(this.#loadingComponent, this.#listPointsComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderPointsList() {
    render(this.#listPointsComponent, this.#boardContainer);

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.#pointsModel.points.length === 0 && this.#isLoadingError === false) {
      this.#renderNoTasks();
      return;
    }
    this.#renderSort();
    this.#renderEventsList(this.points);
  }
}
