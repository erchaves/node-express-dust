import pubSub from '../components/pubSub';

const $ = require('@erchaves/sprinkles');

class Modal {
  constructor(el) {
    this.el = el;
    this.bindEvents();
    this.init();
  }

  bindEvents() {
    var el = this.el;

    pubSub.bind('modal.close', () => {
       this.hide();
    });

    pubSub.bind('modal.show', () => {
      this.show();
    });

    $('.js-btn-close').on('click', this.handleClose.bind(this));
  }

  show() {
    this.el.classList.add('is-active');
  }

  hide() {
    this.el.classList.remove('is-active');
  }

  handleClose(e) {
    pubSub.trigger('modal.close');
  }

  init() {
  }
}

export default Modal;
