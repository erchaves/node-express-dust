const $ = require('@erchaves/sprinkles');

class Modal {
  constructor(el) {
    this.el = el;
    this.bindEvents();
    this.init();
  }

  bindEvents() {
    var el = this.el;

    $.on('modal.close', () => {
       this.hide();
    });

    $.on('modal.show', () => {
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
    e.preventDefault();
    $.trigger('modal.close');
  }

  init() {
  }
}

export default Modal;
