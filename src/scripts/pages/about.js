import Preactor from '../preactor';
import {h, render, Component} from 'preact';
import Clock from '../components/clock';

const $ = require('@erchaves/sprinkles');

class PageAbout extends Preactor {
  constructor(el) {
    super();

    this.$clock = $('Clock', el);

    this.init();
  }

  init() {
    render(<Clock />, this.$clock[0]);
    // note: you can opt not to use the jsx syntax like this.
    // render(h(Clock), this.$clock[0]);

    console.log('about init')
  }
}

export default PageAbout;
