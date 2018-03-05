const $ = require('@erchaves/sprinkles');
const dustRender = require('@erchaves/sugarcone').dustRender;

export default class {
  constructor(el) {
    this.el = el;

    this.init();
  }

  init() {
    var _this = this;

    dustRender('partials/client-side-render-test', {filterString: 'filter'}, function(html) {
      $(_this.el).html(html);
    });
  }
}
