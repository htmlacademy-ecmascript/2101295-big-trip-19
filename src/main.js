import FiltersFormView from './view/filters-view';
import FormSortView from './view/sorting-view';
import {render} from './render.js';
import BoardPresenter from './presenter/board-presenter.js';

const siteCotentPlace = document.querySelector('.trip-events');
const siteHeaderElement = document.querySelector('.trip-controls__filters');
const boardPresenter = new BoardPresenter({boardContainer: siteCotentPlace});

//не мог решить компонент FormSortView рендерить внутри презентера или же здесь отдельно?
render(new FormSortView(), siteCotentPlace);
render(new FiltersFormView(), siteHeaderElement);

boardPresenter.init();
