$(document).ready(function(){
  // стилизация кнопок слайдера
    $('.carousel__inner').slick({
        infinite: true,
        speed: 1000,
        prevArrow: '<button type="button" class="slick-prev"><img src="img/chevron left solid.png"></button>',
        nextArrow: '<button type="button" class="slick-next"><img src="img/chevron right solid.png"></button>',
        adaptiveHeight: true,
        dotsClass: 'carousel__dots',
        responsive: [
          {
            breakpoint: 768,
            settings:{
              arrows: false,
              dots: true
            }
          }
        ]
      });
  //
  // обработка нажатий на табы
  //
    $('ul.catalog__tabs').on('click','li:not(.catalog__tab_active)',// находим все ul с классом catalog__tabs
    // при нажатии на li который не имеет класс catalog__tab_active - назначаем функцию
        function(){
          // этому элементу на который кликнули добавляем класс catalog__tab_active, а всем соседним элементам (братьям) удаляем класс catalog__tab_active
          $(this).addClass('catalog__tab_active').siblings().removeClass('catalog__tab_active')
          // в первом родителе выше по DOM  с классом container находим все div.catalog__content и удаляем класс catalog__content_active у всех 
          //, а у блока с индексом таким же как и индекс нажатого таба добавляем класс catalog__content_active
          .closest('div.container').find('div.catalog__content')
          .removeClass('catalog__content_active')
          .eq( $(this).index())
          .addClass('catalog__content_active')
        });


    // отображение обратной стороны карточки товара
    function toggleSlide(item) {
      $(item).each( function(i) {
        $(this).on('click', function(e) {
          e.preventDefault();
          $('.catalog-item__content').eq(i).toggleClass('catalog-item__content_active');
          $('.catalog-item__list').eq(i).toggleClass('catalog-item__list_active');
        })
      });
    }; 

    toggleSlide('.catalog-item__content');
    toggleSlide('.catalog-item__list');
  
    // modal
    $('[data-modal=consultation]').on('click', function(){
      $('.overlay, #consultation').fadeIn('slow');
    });

    $('.modal__close').on('click', function() {
    $('.overlay, #order, #consultation, #thanks').fadeOut('slow');
    });

    

    $('.button__mini').each(function(i){
      $(this).on('click', function(){
        $('#order .modal__descr').text( $('.catalog-item__subtitle').eq(i).text() );
        $('.overlay, #order').fadeIn('slow');
      })
    })

  /*Эта функция присваивает кастомные свойства
  к форме при валидации*/ 
    function myValidateForm(any_form){
    $(any_form).validate({
      rules:{
        name: {
          required: true,
          minlength: 2
        },
        phone:"required",
        email:{
          required: true,
          email: true
        }
      },
      messages:{
        name:{
          required: " Нам нужно Ваше имя!  ",
          minlength: jQuery.validator.format("В имени должно быть не менее {0} символов!")
        } ,
        email:{
          required: "Обязательно адрес электронной почты",
          email: "Адрес электронной почты в формате name@domain.com"
        },
        phone:{
          required: "Телефон в международном формате"
        }
      }  
    });
  }

  myValidateForm('#ConsultationForm');
  myValidateForm('#order form');
  myValidateForm('#consultation form');

  $('input[name=phone]').mask("+7(999) 999-9999");

  $('form').submit(function(e){
    e.preventDefault();
    if(!$(this).valid()){ // если отправленная форма не прошла валидацию, то выход из функции не доходя до отправки запроса на сервер
      return;             // метод .valid() вызывается после использования функции validate()
    }
    $.ajax({
      type:"POST",
      url:"mailer/smart.php", // скрипт выполняющий отправку данных форм на заданую почту
      data:$(this).serialize(), // данные из этой формы представляются в виде текстовой строки
      // success: function(msg){
      //   alert('Отправлено - '+msg);
            
      //    },
      // error: function(msg){
      //   alert('Ошибка - '+msg);
      //      }
    }).done(function(){
      $(this).find("input").val("");
      $('#consultation, #order').fadeOut();
      $('.overlay, #thanks').fadeIn('slow');
      $('form').trigger('reset');
    });
    return false;   // false отменяет перезагрузку страницы
  });
 // показать - скрыть кнопку "Вверх" при прокручивании экрана
  $(window).scroll( function(){
    if( $(this).scrollTop() > 1600){
      $('.pageup').fadeIn();
    }else{
      $('.pageup').fadeOut();
    }
  });
  // плавный скролл  при нажатии на любую ссылку 
  //  $('a[href^="#"]').click(

  // плавный скролл  при нажатии на ссылку c id="up"
  $('a[href="#up"]').click(function(){ // выбираем все ссылки у которых атрибут href начинается с # и задаем обработчик при нажатии на неё
    const _href = $(this).attr('href');  // создаём переменную в которую передаем аттрибут параметра href (т.е. id куда указывает ссылка после значка #)
    //console.log(_href);
    $('html, body').animate({ // прописываем анимацию для всего html и body
      scrollTop: $(_href).offset().top+"px"}, // offset().top позиция элемента _href от верхнего края документа в пикселях 
      {
        duration: 1500,
        easing: "linear"
      });   
      return false;
  });

  // WoW анимация
  new WOW().init();
});