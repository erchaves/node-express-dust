import ClientSidePartialTest from '../components/client-side-partial-test';
const $ = require('@erchaves/sprinkles');

export default class {
  constructor(el) {
    this.el = el;

    this.init();
  }

  init() {
    const $tester = $(this.el).find('.js-test-client-side-render');

    new ClientSidePartialTest($tester);
  }
}
