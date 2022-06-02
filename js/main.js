import {Swiper, Navigation} from 'swiper';
import Inputmask from "inputmask";

document.addEventListener('DOMContentLoaded', () => {
  const body = document.querySelector('body');
  const btnMenu = document.querySelector('.button--burger');
  const menu = document.querySelector('.nav__wrapper');
  const main = document.querySelector('.main');
  const menuItems = document.querySelectorAll('.nav__item a');
  const inputPhone = document.querySelector('#phone-field');

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
    }
  };

  btnMenu.addEventListener('click', openOrCloseMenu);
  menuItems.forEach(item => item.addEventListener('click', openOrCloseMenu));

  main.addEventListener('click', () => {
    if (btnMenu.classList.contains('button--close')) {
      openOrCloseMenu();
    }
  });

  validateInput(inputPhone, '+7 (999) 999-99-99');
  new Swiper('.swiper', swiperOptions);
});
