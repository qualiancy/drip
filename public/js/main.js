
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

    return false;
  });

  $('.code-wrap').hide();
});