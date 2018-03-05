const $ = require('@erchaves/sprinkles');
// const dustRender = require('@erchaves/sugarcone').dustRender;

export default class {
  constructor(el) {
    this.el = el;

    this.init();
  }

  init() {
    var _this = this;

    // todo: this doesn't work anymore after some breaking change somewhere in adaro or gulp.
    // getting weird Error: Cannot find module 'v8' from './node_modules/natives'
    // dustRender('partials/client-side-render-test', {filterString: 'filter'}, function(html) {
    //   $(_this.el).html(html);
    // });
  }
}
