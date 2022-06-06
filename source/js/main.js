import {Swiper, Navigation} from 'swiper';
import Inputmask from "inputmask";

document.addEventListener('DOMContentLoaded', () => {
  const body = document.querySelector('body');
  const nav = document.querySelector('.nav__list');
  const btnMenu = document.querySelector('.button--burger');
  const menu = document.querySelector('.nav__wrapper');
  const main = document.querySelector('.main');
  const menuItems = document.querySelectorAll('.nav__item a');
  const inputPhone = document.querySelector('#phone-field');

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
      menu.classList.toggle('nav__wrapper--show');
      main.classList.toggle('blur');
      body.classList.toggle('page__body--hidden');
      checkStateBtn();
      trapFocus(nav);
    }
  };

  btnMenu.addEventListener('click', openOrCloseMenu);
  menuItems.forEach(item => item.addEventListener('click', openOrCloseMenu));

  menu.addEventListener('click', (e) => {
    if (btnMenu.classList.contains('button--close') && e.target.classList.contains('nav__wrapper--show')) {
      openOrCloseMenu();
    }
  });

  validateInput(inputPhone, '+7 (999) 999-99-99');
  new Swiper('.swiper', swiperOptions);
});
