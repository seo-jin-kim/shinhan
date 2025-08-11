$(function () {
  // Prevent default anchor jumping
  $(document).off('click.anchor').on('click.anchor', 'a[href="#"]', function(e){
    e.preventDefault();
  });

  // Scrolla 초기화
  $('.animate').scrolla({
    mobile: true, //모바일버전시 활성화
    once: false //스크롤시 딱 한번만 하고싶을땐 true
  });    

  // Slick 슬라이더 초기화
 // Slick 슬라이더 초기화
var $slider = $('.visual .slide').slick({
  arrows: true,
  dots: true,
  fade: true,
  autoplay: true,
  autoplaySpeed: 5700,
  pauseOnHover: false,
  pauseOnFocus: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1
});

// 접근성 보호: 숨겨진 슬라이드에 포커스 금지
function fixSlickAriaFocus() {
  $slider.find('.slick-slide').each(function() {
    var $slide = $(this);
    if ($slide.attr('aria-hidden') === 'true') {
      $slide.attr('tabindex', '-1'); // 포커스 금지
      if ($slide.is(':focus') || $slide.find(':focus').length) {
        $slide.blur();
        $slide.find(':focus').blur();
      }
    } else {
      $slide.attr('tabindex', '0'); // 활성 슬라이드만 포커스 가능
    }
  });
}

// 초기 실행
fixSlickAriaFocus();

// 슬라이드 변경 시 실행
$slider.on('beforeChange afterChange', fixSlickAriaFocus);

// DOM 변경 감시 (Slick이 aria-hidden 바꿀 때마다 실행)
const observer = new MutationObserver(fixSlickAriaFocus);
observer.observe($slider[0], { attributes: true, subtree: true, attributeFilter: ['aria-hidden'] });


      
  // 모바일 메뉴 토글
  $('.more-btn').off('click.menu').on('click.menu', function() {
    $(this).toggleClass('active');
    $('header .innerHeader .gnb').toggleClass('on');
    $('header').toggleClass('active');
  });

  // 모바일 서브메뉴 토글 - 전체 영역 클릭 가능
  $(document).off('click.mobileMenu').on('click.mobileMenu', 'header .innerHeader .gnb > ul > li:nth-child(1), header .innerHeader .gnb > ul > li:nth-child(3)', function(e) {
    if (window.innerWidth <= 1024) {  // 1024px 이하에서 작동하도록 수정
      e.preventDefault();
      e.stopPropagation();
      
      const $li = $(this);
      const $innerBox = $li.find('.innerBox');
      const $toggle = $li.find('.plus-minus-toggle');
      
      // 다른 메뉴 닫기
      $('header .innerHeader .gnb > ul > li').not($li).removeClass('on');
      $('header .innerHeader .gnb > ul > li').not($li).find('.innerBox').slideUp(300);
      $('header .innerHeader .gnb > ul > li').not($li).find('.plus-minus-toggle').removeClass('collapsed');
      
      // 현재 메뉴 토글
      $li.toggleClass('on');
      if ($li.hasClass('on')) {
        $innerBox.slideDown(300);
        $toggle.addClass('collapsed');
      } else {
        $innerBox.slideUp(300);
        $toggle.removeClass('collapsed');
      }
    }
  });

  // 모바일 메뉴 외부 클릭시 닫기
  $(document).off('click.outsideMenu').on('click.outsideMenu', function(e) {
    if (window.innerWidth <= 1024) {
      if (!$(e.target).closest('header .innerHeader .gnb').length && 
          !$(e.target).closest('.more-btn').length) {
        $('header .innerHeader .gnb').removeClass('on');
        $('.more-btn').removeClass('active');
        $('header').removeClass('active');
        $('header .innerHeader .gnb > ul > li').removeClass('on');
        $('header .innerHeader .gnb > ul > li .plus-minus-toggle').removeClass('collapsed');
        $('header .innerHeader .gnb > ul > li .innerBox').slideUp(300);
      }
    }
  });

  // Play/Pause 버튼 토글
  var $playPauseBtn = $(".play-pause-btn");
  var isPlaying = true;

  $playPauseBtn.off('click.playPause').on('click.playPause', function () {
    if (isPlaying) {
      $slider.slick("slickPause");
      $playPauseBtn.addClass("paused");
      $(".visual .slide").addClass("paused");
    } else {
      $slider.slick("slickPlay");
      $playPauseBtn.removeClass("paused");
      $(".visual .slide").removeClass("paused");
    }
    isPlaying = !isPlaying;
  });

  // 스크롤 이벤트 핸들러 최적화
  let scrollTimeout;
  let lastScrollTop = 0;
  const scrollThrottle = 100; // 100ms 간격으로 실행

  function handleScroll() {
    const scrollPos = $(document).scrollTop();
    const $header = $('header');
    const $h1Img = $header.find('.innerHeader h1 img');
    const $plusToggle = $header.find('.plus-minus-toggle');

    if (window.innerWidth <= 1024) {
        // 모바일: 헤더를 아예 숨김
        if ($('header .innerHeader .gnb').hasClass('on')) return;

        if (scrollPos > lastScrollTop) {
            $header.addClass('on');
            $h1Img.hide();
            $plusToggle.hide();
        } else {
            $header.removeClass('on');
            $h1Img.show();
            $plusToggle.show();
        }
    } else {
        // PC: 헤더 크기만 줄임
        if (scrollPos > lastScrollTop) {
            $header.addClass('on');
        } else {
            $header.removeClass('on');
        }
    }

    lastScrollTop = scrollPos;
}

  // 스크롤 이벤트에 throttle 적용
  $(window).off('scroll.resizeHandler').on('scroll.resizeHandler', function() {
      if (!scrollTimeout) {
          scrollTimeout = setTimeout(function() {
              handleScroll();
              scrollTimeout = null;
          }, scrollThrottle);
      }
  });

    // GNB - PC 버전 hover 효과
    if (window.innerWidth > 1024) {
        $('header .innerHeader .gnb > ul > li').off('mouseenter.hover mouseleave.hover').hover(
            function() {
                $(this).find('.innerBox').addClass('on');
            },
            function() {
                $(this).find('.innerBox').removeClass('on');
            }
        );
    }

    // 화면 크기 변경 시 이벤트 재설정
    $(window).off('resize.resizeHandler').on('resize.resizeHandler', function() {
        if (window.innerWidth > 1024) {
            // PC 버전 이벤트 설정
            $('header .innerHeader .gnb > ul > li').off('mouseenter mouseleave').hover(
                function() {
                    $(this).find('.innerBox').addClass('on');
                },
                function() {
                    $(this).find('.innerBox').removeClass('on');
                }
            );
        } else {
            // 모바일 버전에서는 hover 이벤트 제거
            $('header .innerHeader .gnb > ul > li').off('mouseenter mouseleave');
        }
    });

  // FAQ Toggle Collapse (아코디언)
  // 초기 상태: 모든 답변 숨기기
  $('.partner .FAQ .inner ul li .answer').hide();

  // 클릭 이벤트
  $('.partner .FAQ .inner ul li').off('click.faq').on('click.faq', function(e) {
    e.preventDefault();
    
    var $li = $(this);
    var $toggle = $li.find('.plus-minus-toggle');

  // 다른 항목 닫기
  $li.siblings().removeClass('on').find('.answer').slideUp(200);
  $li.siblings().find('.plus-minus-toggle').removeClass('collapsed');

    // 현재 항목 토글
    if (!$li.hasClass('on')) {
      $li.addClass('on').find('.answer').stop(true, true).slideDown(200);
      $toggle.addClass('collapsed');
    } else {
      $li.removeClass('on').find('.answer').stop(true, true).slideUp(200);
      $toggle.removeClass('collapsed');
    }
  });

  // Footer Button Toggle
  // Family Site 버튼 클릭 이벤트 (이벤트 위임)
  $(document).off('click.footer').on('click.footer', 'footer .inner button, footer .inner button a', function(e){
      e.preventDefault();
      e.stopPropagation();
      $('footer .inner button').toggleClass('on');
  });

  // 다른 영역 클릭 시 메뉴 닫기
  $(document).off('click.footerOutside').on('click.footerOutside', function(e){
      if(!$(e.target).closest('footer .inner button').length){
          $('footer .inner button').removeClass('on');
      }
  });

  // GSAP과 ScrollTrigger 플러그인 등록
  gsap.registerPlugin(ScrollTrigger);
  gsap.timeline({
    scrollTrigger: {
      trigger: '.services',
      start: 'top top',
      end: '+=2700',
      endTrigger: ".list",
      pin: true,
      pinSpacing: true,
      scrub: 4,
      // markers: true,
      onUpdate: self => {
        gsap.to('.services .inner .list', {
          y: -1800 * self.progress,
          duration: 0.8,
          ease: 'power2.out',
        });

      let main_service = $('.services');
      main_service.removeClass('active01 active02 active03 active04 active05 active06 active07');

        if (self.progress >= 0.005 && self.progress < 0.091) {
          main_service.addClass('active01');
        } else if (self.progress >= 0.091 && self.progress < 0.276) {
          main_service.addClass('active02');
        } else if (self.progress >= 0.276 && self.progress < 0.387) {
          main_service.addClass('active03');
        } else if (self.progress >= 0.387 && self.progress < 0.602) {
          main_service.addClass('active04');
        } else if (self.progress >= 0.602 && self.progress < 0.758) {
          main_service.addClass('active05');
        } else if (self.progress >= 0.758 && self.progress < 0.9) {
          main_service.addClass('active06');
        } else if (self.progress >= 0.9) {
          main_service.addClass('active07');
        }
      },
      onLeave: () => {
        let main_service = $('.services');
        main_service.removeClass('active01 active02 active03 active04 active05 active06');
        // active07은 제거하지 않음 - 다른 섹션으로 이동해도 유지
      }
    }
  });
});








//touchstart와 touchmove 이벤트에 passive 옵션 추가
document.addEventListener('touchstart', function(e) {
  e.preventDefault();
}, { passive: false }); // passive를 false로 해야 preventDefault 가능

document.addEventListener('touchmove', function(e) {
  e.preventDefault();
}, { passive: false });

  