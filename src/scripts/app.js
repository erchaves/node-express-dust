import pubSub from './components/pubSub';

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

    this.bindEvents();
  }

  bindEvents() {
    //
  }
}

export default App;
