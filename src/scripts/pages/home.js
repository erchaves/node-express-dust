import Modal from '../components/modal';
import pubSub from '../components/pubSub';

const $ = require('@erchaves/sprinkles');

class PageHome {
  constructor(el) {
    this.init();
  }

  init() {
    var modalEl = $('.js-component-modal')[0];

    this.modal = new Modal(modalEl);
    this.bindEvents();
  }

  handleModalShow(e) {
    e.preventDefault();
    pubSub.trigger('modal.show');
  }

  onEscHideModal(e) {
    if (e.which === 27 || e.keyCode === 27) {
      pubSub.trigger('modal.close');
    }
  }

  bindEvents() {
    var _this = this;

    document.onkeydown = this.onEscHideModal.bind(this);

    $('.js-btn-modal-show').on('click', this.handleModalShow.bind(this));
  }
}

export default PageHome;
