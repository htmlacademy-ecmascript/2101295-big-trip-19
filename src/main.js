// import FiltersFormView from './view/filters-form-view';
// import {render} from './render.js';
import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from './model/points-model';
import FiltersModel from './model/filters-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
//import {generateFilter} from './mock/filters';


const siteCotentPlace = document.querySelector('.trip-events');
const siteHeaderElement = document.querySelector('.trip-controls__filters');

const pointsModel = new PointsModel();
const filtersModel = new FiltersModel();
const boardPresenter = new BoardPresenter({boardContainer: siteCotentPlace, pointsModel, filtersModel});

//const filters = generateFilter(pointsModel.points);

const filterPresenter = new FilterPresenter(
  siteHeaderElement,
  filtersModel,
  pointsModel
);

filterPresenter.init();
boardPresenter.init();
