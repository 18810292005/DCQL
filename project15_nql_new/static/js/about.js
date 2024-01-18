/**
 * @file about.js
 * @author Yuvv
 * @date 2018/1/13
 */


$(function () {
  $('.docs-sidebar>ul>li>a').click(function () {
    var parent = $(this).parent();
    var activeLi = parent.siblings('li.active');
    activeLi.find('>ul.collapse').collapse('hide');
    activeLi.removeClass('active');
    parent.addClass('active');
  });

  $('.docs-sidebar>ul>li>ul>li>a').click(function () {
    var parent = $(this).parent();
    parent.siblings('li.active').removeClass('active');
    parent.addClass('active');
  });

  $('body').scrollspy({
    target: '#docs-sidebar',
    offset: 75
  }).on('activate.bs.scrollspy', function (e) {
    var target = $(e.target);
    var ul = target.find('>ul.collapse');
    if (ul.length) {
      ul.collapse('show');
      target.siblings('li').find('>ul.collapse').collapse('hide');
    }
  });
});
