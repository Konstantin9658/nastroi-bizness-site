import {Swiper, Navigation} from 'swiper';
import Inputmask from "inputmask";

document.addEventListener('DOMContentLoaded', () => {
  const body = document.querySelector('body');
  const nav = document.querySelector('.nav__list');
  const btnMenu = document.querySelector('.button--burger');
  const menu = document.querySelector('.nav__wrapper');
  const main = document.querySelector('.main');
  const menuItems = document.querySelectorAll('.nav__item a');

  const form = document.querySelector('.form');
  const inputPhone = form.querySelector('#phone-field');
  const inputs = Array.from(form.querySelectorAll('input'));
  const recaptcha = form.querySelector('.form__recaptcha');

  const formModal = document.querySelector('.form--modal');
  const inputPhoneModal = formModal.querySelector('#phone-modal');
  const recaptchaModal = formModal.querySelector('.form__recaptcha');
  const inputsModal = Array.from(formModal.querySelectorAll('input'));

  const btnsShowModal = document.querySelectorAll('[data-modal]');
  const btnCloseModal = document.querySelector('[data-close]');
  const popup = document.querySelector('.popup');

  const KEYCODE_TAB = 9;

  function trapFocus(element) {
    let focusableEls = element.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
    let firstFocusableEl = focusableEls[0];
    let lastFocusableEl = focusableEls[focusableEls.length - 1];

    element.addEventListener('keydown', function(e) {
      let isTabPressed = (e.key === 'Tab' || e.keyCode === KEYCODE_TAB);

      if (!isTabPressed) {
        return;
      }

      if ( e.shiftKey ) /* shift + tab */ {
        if (document.activeElement === firstFocusableEl) {
          lastFocusableEl.focus();
            e.preventDefault();
          }
        } else /* tab */ {
        if (document.activeElement === lastFocusableEl) {
          firstFocusableEl.focus();
            e.preventDefault();
          }
        }
    });
  }

  const swiperOptions = {
    modules: [Navigation],
    spaceBetween: 20,
    grabCursor: true,
    slidesPerView: 'auto',
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  };

  const validateInput = (element, example) => {
    const inputPhoneMask = new Inputmask(`${example}`);
    inputPhoneMask.mask(element);
  };

  const toggleClass = (item, toggleClass) => {
    item.classList.toggle(toggleClass);
  };

  const checkStateBtn = () => {
    if (btnMenu.classList.contains('button--burger')) {
      btnMenu.classList.remove('button--burger');
      btnMenu.classList.add('button--close');
    } else {
      btnMenu.classList.add('button--burger');
      btnMenu.classList.remove('button--close');
    }
  };

  const openOrCloseMenu = () => {
    if (window.innerWidth < 1279) {
      toggleClass(menu, 'nav__wrapper--show');
      toggleClass(main, 'blur');
      toggleClass(body, 'page__body--hidden');
      checkStateBtn();
      trapFocus(nav);
    }
  };

  const checkValueInput = input => input.value !== '';

  const showCaptcha = (inputs, captcha) => {
    if (inputs.every(checkValueInput)) {
      captcha.classList.add('form__recaptcha--show');
    } else {
      captcha.classList.remove('form__recaptcha--show');
    }
  };

  const showOrHideModal = () => {
    toggleClass(popup, 'popup--show');
    toggleClass(main, 'blur');
    toggleClass(body, 'page__body--hidden');
  };

  const postData = (evt, form, captcha, btnId) => {
    evt.preventDefault();

    const formMessage = form.querySelector('.form__message');
    const btnSubmit = form.querySelector(btnId);
    const spinner = document.createElement('img');

    const message = {
      loading: ['../img/icons/icon-spinner.svg', 'Отправка...'],
      success: 'Заявка успешно отправлена',
      error: 'Упс... Что-то пошло не так...',
      default: 'Осталось связаться с нами',
      defaultModal: 'Заполните форму и мы свяжемся с Вами в течении 30 минут!',
    };

    const showMessage = (status) => {
      switch (status) {
        case (message.loading):
          spinner.src = message.loading[0];
          formMessage.textContent = message.loading[1];
          btnSubmit.style.display = 'none';
          btnSubmit.insertAdjacentElement('afterend', spinner);
          break;
        case (message.success):
          formMessage.textContent = message.success;
          break;
        case (message.error):
          formMessage.textContent = message.error;
          break;
        case (message.defaultModal):
          formMessage.textContent = message.defaultModal;
          break;
        default:
          formMessage.textContent = message.default;
          break;
      }
    };

    showMessage(message.loading);

    const formData = new FormData(form);
    const URL = 'https://gooddeloNotify.tojefin.repl.co/api/v1/sendform/';

    let data = new URLSearchParams();

    for (let pair of formData) {
        data.append(pair[0], pair[1]);
    }

    data.append('getStatus', 'true');

    fetch(URL, {
        method: 'post',
        body: data,
    }).then(() => {
      showMessage(message.success);
    }).catch(() => {
      showMessage(message.error);
    }).finally(() => {
      form.reset();
      setTimeout(() => {
        if (form === formModal) {
          showMessage(message.defaultModal);
          showOrHideModal();
        } else {
          showMessage(message.default);
        }
      }, 3000);
      btnSubmit.style.display = 'block';
      spinner.remove();
      toggleClass(captcha, 'form__recaptcha--show');
    });
  };

  new Swiper('.swiper', swiperOptions);

  validateInput(inputPhone, '+7 (999) 999-99-99');
  validateInput(inputPhoneModal, '+7 (999) 999-99-99');

  btnMenu.addEventListener('click', openOrCloseMenu);
  btnCloseModal.addEventListener('click', showOrHideModal);

  btnsShowModal.forEach(btn => btn.addEventListener('click', showOrHideModal));
  menuItems.forEach(item => item.addEventListener('click', openOrCloseMenu));

  form.addEventListener('input', () => showCaptcha(inputs, recaptcha));
  form.addEventListener('submit', (evt) => postData(evt, form, recaptcha, '#submit'));

  formModal.addEventListener('input', () => showCaptcha(inputsModal, recaptchaModal));
  formModal.addEventListener('submit', (evt) => postData(evt, formModal, recaptchaModal, '#submit-modal'));

  menu.addEventListener('click', (evt) => {
    if (btnMenu.classList.contains('button--close') && evt.target.classList.contains('nav__wrapper--show')) {
      openOrCloseMenu();
    }
  });
});
