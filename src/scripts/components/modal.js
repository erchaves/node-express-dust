import {CLASSES, QRY} from '../consts';
import pubSub from '../components/pubSub';

const $ = require('@erchaves/sprinkles');

class Modal {
  constructor(el) {
    this.el = el;
    this.btnClose = $(QRY.btnClose, el)[0];
    this.bindEvents_();
    this.init_();
  }

  bindEvents_() {
    var _this = this;
    var el = this.el;

    pubSub.bind('modal.close', () => {
       this.hide();
    });

    pubSub.bind('modal.show', () => {
      this.show();
    });

    this.btnClose.onclick = this.handleClose_.bind(this);
  }

  show() {
    this.el.classList.add(CLASSES.isActive);
  }

  hide() {
    this.el.classList.remove(CLASSES.isActive);
  }

  handleClose_(e) {
    pubSub.trigger('modal.close');
  }

  init_() {
  }
}

export default Modal;
