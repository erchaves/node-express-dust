import {h, render, Component} from 'preact';
import Clock from '../components/clock';

const $ = require('@erchaves/sprinkles');

class PageHome {
  constructor(el) {
    // dom element searches should be restricted to the module's el.
    this.$btnModalShow = $('.js-btn-modal-show', el);
    this.$clock = $('Clock', el);

    this.init();
  }

  init() {
    var x = Clock;

    // render(h(Clock), this.$clock[0]);
    render(<Clock />, this.$clock[0]);
    this.bindEvents();
  }

  handleModalShow(e) {
    e.preventDefault();
    $.trigger('modal.show');
  }

  bindEvents() {
    // use bind(this) if the bound funtion needs to reference the 'this' module instance
    this.$btnModalShow.on('click', this.handleModalShow);
  }
}

export default PageHome;
