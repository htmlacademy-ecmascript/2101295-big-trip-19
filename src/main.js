import FiltersFormView from './view/filters-form-view';
import FormSortView from './view/form-sort-view';
import {render} from './render.js';
import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from './model/points-model';


const siteCotentPlace = document.querySelector('.trip-events');
const siteHeaderElement = document.querySelector('.trip-controls__filters');

render(new FormSortView(), siteCotentPlace);
render(new FiltersFormView(), siteHeaderElement);

const pointsModel = new PointsModel();
const boardPresenter = new BoardPresenter({boardContainer: siteCotentPlace, pointsModel});


boardPresenter.init();
