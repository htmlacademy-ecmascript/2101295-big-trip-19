import FormEditingView from '../view/form-editing-view';
import ListPointsView from '../view/list-route-points';
import RoutePointView from '../view/route-point-view';
import FormCreateView from '../view/form-create-view';
import {render} from '../render.js';
import {COUNT_POINTS} from '../const/const';

export default class BoardPresenter {
  listPointsComponent = new ListPointsView();


  constructor({boardContainer}) {
    this.boardContainer = boardContainer;
  }

  init() {
    render(this.listPointsComponent, this.boardContainer);
    render(new FormEditingView(), this.listPointsComponent.getElement());
    render(new FormCreateView(), this.listPointsComponent.getElement());

    for (let i = 0; i < COUNT_POINTS; i++) {
      render(new RoutePointView(), this.listPointsComponent.getElement());
    }
  }
}