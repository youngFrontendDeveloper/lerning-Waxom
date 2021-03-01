
// ++++++++++ Фильтр для элементов  mixitup  +++++++++++

var containerEl = document.querySelector('.portfolio__galery-wrapper');
var mixer = mixitup(containerEl);


// Изменение цвета фона активной кнопки

$('.portfolio__btn').click(function() {
  $('.portfolio__btn').removeClass('portfolio__btn--active');
  $(this).addClass('portfolio__btn--active');
});


// Карусель

const slider = document.querySelector('.swiper-container');

let mySwiper = new Swiper(slider, {
	slidesPerView: 1,
	// spaceBetween: 0,
	loop: true,
  autoplay: false,
	pagination: {
		el: '.swiper-pagination',
		clickable: true,
	},
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
});


// Добавление класса для изменения порядка элементов

// $(document).ready(function(){
//   $('.blog__item:odd').addClass('reverse');
// });


// Плавный переход для меню
$(function(){
  $('.menu__link').click(function(){
    var _href = $(this).attr("href");
    $("html, body").animate({scrollTop: $(_href).offset().top+"px"});
    $('.menu__link').removeClass('menu__link--active');
    $(this).addClass('menu__link--active');
    return false;
  });
});


// Кнопка вверх, -  исчезновение-появление

$(window).scroll(function() {
  if($(this).scrollTop() != 0) {
    $('.to-top').fadeIn();
  } else {
    $('.to-top').fadeOut();
  }
});

// Кнопка вверх, - пролистывание вверх
$('.to-top').on('click', function() {
  $('html, body').stop().animate({scrollTop : 0}, 300);
});


//Открытие-закрытие меню
$(document).ready(function(){
  if (document.documentElement.clientWidth < 768) {
    $('.menu').css({"display": "none"});
    $('.mobile-menu').css({"display": "block"});

    $('.mobile-menu').click(function() {
      $('.menu').slideToggle(500);
      // $('.fa-bars').toggle();
      // $('.fa-times').toggle();
    });
  }
});