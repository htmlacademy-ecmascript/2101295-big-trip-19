import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from './model/points-model';
import FiltersModel from './model/filters-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewPointButtonView from './view/new-point-button-view';
import { render, RenderPosition } from './framework/render.js';
import PointsApiService from './points-api-service';

const AUTHORIZATION = 'Basic 1q2w3e4r5t';
const END_POINT = 'https://19.ecmascript.pages.academy/big-trip/';


const siteCotentPlace = document.querySelector('.trip-events');
const headerContainer = document.querySelector('.trip-main');
const siteHeaderElement = document.querySelector('.trip-controls__filters');

const pointsModel = new PointsModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)
});
const filtersModel = new FiltersModel();
const boardPresenter = new BoardPresenter({boardContainer: siteCotentPlace, pointsModel, filtersModel, onNewPointDestroy: handleNewEventFormClose});

const newPointButtonComponent = new NewPointButtonView({onClick: handleAddWaypoinButtonClick});
function handleAddWaypoinButtonClick (){
  boardPresenter.createPoints();
  newPointButtonComponent.element.disabled = true;
}

function handleNewEventFormClose (){
  newPointButtonComponent.element.disabled = false;
}


const filterPresenter = new FilterPresenter(
  siteHeaderElement,
  filtersModel,
  pointsModel
);

filterPresenter.init();
boardPresenter.init();
pointsModel.init()
  .finally(() => {
    render(newPointButtonComponent, headerContainer, RenderPosition.BEFOREEND);
  });
