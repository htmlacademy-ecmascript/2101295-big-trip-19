import AbstractView from '../framework/view/abstract-view.js';

const createErrorComponent = (massage)=>`
<p class="trip-events__msg">${massage}. Please try again</p>
`;

export default class ErrorView extends AbstractView {
  #errorMassage = null;

  constructor(errorMassage) {
    super();
    this.#errorMassage = errorMassage;
  }

  get template(){
    return createErrorComponent(this.#errorMassage);
  }

}
