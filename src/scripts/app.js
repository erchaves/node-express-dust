import {$, $$} from './utils';
import pubSub from './components/pubSub';

import {
  EVT_STRS,
  CLASSES,
  QRY,
} from './consts';

import PageHome from './pages/home';
import PageAbout from './pages/about';

const pages = {
  home: PageHome,
  about: PageAbout,
};

class App {
  constructor (data) {
    this.route = data.route || 'home';
  }

  start() {
    var Page = pages[this.route];
    var page = new Page();

    this.bindEvents_();
  }

  bindEvents_() {
    //
  }
}

export default App;
