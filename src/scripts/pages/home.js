import {$, $$} from '../utils';
import {CLASSES, QRY} from '../consts';
import Modal from '../components/modal';
import pubSub from '../components/pubSub';

class PageHome {
  constructor(el) {
    this.init_();
  }

  init_() {
    var modalEl = $(QRY.componentModal);

    this.btnModalShow = $(QRY.btnModalShow);
    this.modal = new Modal(modalEl);
    this.bindEvents_();
  }

  // todo - move this logic to a generic page class
  onModalHide_() {
    $(QRY.componentPage).classList.remove(CLASSES.blur);
  }

  onModalShow_() {
    $(QRY.componentPage).classList.add(CLASSES.blur);
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

    pubSub.bind('modal.close', () => {
      _this.onModalHide_();
    });

    pubSub.bind('modal.show', () => {
      _this.onModalShow_();
    });
  }
}

export default PageHome;
