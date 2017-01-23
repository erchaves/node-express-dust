import {CLASSES, QRY} from '../consts';
import Modal from '../components/modal';
import pubSub from '../components/pubSub';

const $ = require('@erchaves/sprinkles');

class PageHome {
  constructor(el) {
    this.init_();
  }

  init_() {
    var modalEl = $(QRY.componentModal)[0];

    this.btnModalShow = $(QRY.btnModalShow)[0];
    this.modal = new Modal(modalEl);
    this.bindEvents_();
  }

  handleModalShow_(e) {
    e.preventDefault();
    pubSub.trigger('modal.show');
  }

  onEscHideModal_(e) {
    if (e.which === 27 || e.keyCode === 27) {
      pubSub.trigger('modal.close');
    }
  }

  bindEvents_() {
    var _this = this;

    document.onkeydown = this.onEscHideModal_.bind(this);

    this.btnModalShow.onclick = this.handleModalShow_.bind(this);
  }
}

export default PageHome;
