import {$, $$} from './utils';
import pubSub from './components/pubSub';
import routes from './routes';
import PageHome from './pages/home';
import PageAbout from './pages/about';

import {
  EVT_STRS,
  CLASSES,
  QRY,
} from './consts';

class App {
  constructor (data) {
    // todo there should be a better way to get this.
    this.route = data.route;
  }

  start() {
    var Page = this.route === 'home' ? PageHome : PageAbout;
    var page = new Page();
    this.bindEvents_();
  }

  bindEvents_() {
    //
  }
}

export default App;
