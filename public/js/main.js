
$(function () {
  $('pre code').addClass('prettyprint');
  prettyPrint();

  $('.view-source').click(function(){
    var $obj = $(this).next('.code-wrap')
      , will = ($obj.css('display') == 'none') ? true : false;

    $obj.toggle(200);

    if (will) {
      $('html,body').animate({
        scrollTop: $obj.offset().top
      });
    }

    var tag = $(this).siblings('.header').find('h1').text()
      , action = (will) ? 'opened' : 'closed'
      , note = 'User ' + action + ' ' + tag + '.';

    mpq.track('View Source clicked', {
      'tag': tag,
      'action': action,
      'mp_note': note
    });

    return false;
  });

  $('a.button.github').click(function () {
    mpq.track('Github Fork clicked');
  });

  $('.code-wrap').hide();
});