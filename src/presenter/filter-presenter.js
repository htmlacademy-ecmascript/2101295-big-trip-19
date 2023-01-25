import {remove, render, replace} from '../framework/render.js';
import FiltersFormView from '../view/filters-form-view';
import { filter } from '../utils/filters';
import { FilterType, UpdateType } from '../const/const';

export default class FilterPresenter {
  #filterContainer = null;

  #filtersModel = null;
  #pointsModel = null;

  #filterComponent = null;

  constructor(filterContainer, filtersModel, pointsModel) {
    this.#filterContainer = filterContainer;
    this.#filtersModel = filtersModel;
    this.#pointsModel = pointsModel;

    this.#filtersModel.addObserver(this.#handleModelUpdate);
    this.#pointsModel.addObserver(this.#handleModelUpdate);
  }

  get filteredPoints() {
    const points = this.#pointsModel.points;

    return [
      {
        type: FilterType.EVERYTHING,
        name: 'EVERYTHING',
        count: filter[FilterType.EVERYTHING](points).length
      },
      {
        type: FilterType.FUTURE,
        name: 'FUTURE',
        count: filter[FilterType.FUTURE](points).length
      },
      {
        type: FilterType.PRESENT,
        name: 'PRESENT',
        count: filter[FilterType.PRESENT](points).length
      },
      {
        type: FilterType.PAST,
        name: 'PAST',
        count: filter[FilterType.PAST](points).length
      }
    ];
  }


  init() {
    const prevFilterComponent = this.#filterComponent;
    this.#filterComponent = new FiltersFormView(
      this.filteredPoints,
      this.#filtersModel.filter,
      this.#handleFilterTypeChange
    );

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelUpdate = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filtersModel.filter === filterType) {
      return;
    }
    this.#filtersModel.setFilter(UpdateType.MAJOR, filterType);
  };


}
