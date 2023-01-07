import FiltersFormView from './view/filters-form-view';
import FormSortView from './view/form-sort-view';
import {render} from './render.js';
import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from './model/points-model';
import {generateFilter} from './mock/filters';


const siteCotentPlace = document.querySelector('.trip-events');
const siteHeaderElement = document.querySelector('.trip-controls__filters');

const pointsModel = new PointsModel();
const boardPresenter = new BoardPresenter({boardContainer: siteCotentPlace, pointsModel});

const filters = generateFilter(pointsModel.points);

render(new FormSortView(), siteCotentPlace);
render(new FiltersFormView({filters}), siteHeaderElement);

boardPresenter.init();
