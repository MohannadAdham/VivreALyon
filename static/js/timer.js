
function timer() {

var decrementDigit;

$(function() {
  window.digit_one = $('div.digit-one');
  window.digit_two = $('div.digit-two');
  window.digit_three = $('div.digit-three');
  window.digit_four = $('div.digit-four');
  return window.timer_int = self.setInterval((function() {
    return decrementDigit(window.digit_four);
  }), 1000);
});

decrementDigit = function(e) {
  if ($('.digit-two').hasClass('num-zero') && $('.digit-one').hasClass('num-zero')
    && $('.digit-three').hasClass('num-zero') && $('.digit-four').hasClass('num-zero')) {
    $('.timer-contain').remove();
    alert("Time Over");
  }

  if ($('.digit-two').hasClass('num-zero') && $('.digit-one').hasClass('num-zero')
    && $('.digit-three').hasClass('num-zero') && ($('.digit-four').hasClass('num-five') ||
      $('.digit-four').hasClass('num-four') || $('.digit-four').hasClass('num-three') ||
      $('.digit-four').hasClass('num-two') || $('.digit-four').hasClass('num-one') ||
      $('.digit-four').hasClass('num-six') || $('.digit-four').hasClass('num-seven') ||
      $('.digit-four').hasClass('num-eight') ||
      $('.digit-four').hasClass('num-nine') )) {
    $('#watch-tick').get(0).play();
  }

  if ($('.digit-two').hasClass('num-zero') && $('.digit-one').hasClass('num-zero')
    && $('.digit-three').hasClass('num-one') && ($('.digit-four').hasClass('num-zero') ||
      $('.digit-four').hasClass('num-one'))) {
    $('#watch-tick').get(0).play();
  }


  if (e.hasClass('num-zero')) {
    if (e.hasClass('digit-three')) {
      decrementDigit(window.digit_two);
      e.removeClass('num-zero').addClass('num-five');
    }
    if (e.hasClass('digit-two')) {
      decrementDigit(window.digit_one);
      e.removeClass('num-zero').addClass('num-nine');
    }
    if (e.hasClass('digit-four')) {
      decrementDigit(window.digit_three);
      e.removeClass('num-zero').addClass('num-nine');
    }
  } else if (e.hasClass('num-nine')) {
    e.removeClass('num-nine').addClass('num-eight');
  } else if (e.hasClass('num-eight')) {
    e.removeClass('num-eight').addClass('num-seven');
  } else if (e.hasClass('num-seven')) {
    e.removeClass('num-seven').addClass('num-six');
  } else if (e.hasClass('num-six')) {
    e.removeClass('num-six').addClass('num-five');
  } else if (e.hasClass('num-five')) {
    e.removeClass('num-five').addClass('num-four');
  } else if (e.hasClass('num-four')) {
    e.removeClass('num-four').addClass('num-three');
  } else if (e.hasClass('num-three')) {
    e.removeClass('num-three').addClass('num-two');
  } else if (e.hasClass('num-two')) {
    e.removeClass('num-two').addClass('num-one');
  } else if (e.hasClass('num-one')) {
    e.removeClass('num-one').addClass('num-zero');
  } else if (e.hasClass('num-zero')) {
    e.removeClass('num-zero').addClass('num-nine');
  }
  if ($('.digit-two').hasClass('num-zero') && $('.digit-one').hasClass('num-zero') &&
    $('.digit-four').hasClass('num-zero') && $('.digit-three').hasClass('num-two')) {
    return $('.circle-contain').addClass('warning');
  }
  // else if ($('.circle-contain').hasClass('warning')) {
  //   return $('.circle-contain').removeClass('warning');
  // }


};
}
