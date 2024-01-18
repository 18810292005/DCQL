// import {gettext} from "../../../static_src/typings/django";

var update_view = function (node) {
  // node 是 传过来的 jquery 对象
  // 将本元素和之前的元素一起渲染成实星星
  node.prevAll('i').removeClass('fa-star-o').addClass('fa-star');
  node.removeClass('fa-star-o').addClass('fa-star');
  node.nextAll('i').removeClass('fa-star').addClass('fa-star-o');
};
var get_score = function () {
  //获取到当前的分数
  return $('div.star i.fa-star').length;
};
var update_score_view = function (node, score) {
  var score = score || get_score();
  node.text(Math.floor(score).toFixed(1));
  if (score === 4 || score === 5) {
    node.attr('class', 'label label-success');
  } else if (score === 3 || score === 2) {
    node.attr('class', 'label label-warning');
  } else {
    node.attr('class', 'label label-danger');
  }
};
$(function () {
  // 用一个变量记录鼠标是否已经点击
  var current_score = 0;
  var score_label = $('div.rating span.label');
  $('div.star i').hover(function () {
    update_view($(this));
    update_score_view(score_label);
  });
  $('div.star i').click(function (event) {
    event.stopPropagation();
    update_view($(this));
    current_score = get_score();
    update_score_view(score_label);
  });
  $('div.star i').mouseleave(function (event) {
    event.stopPropagation();
    // 根据当前的分数来更新视图
    if (current_score === 0) {
      $('div.star i').removeClass('fa-star').addClass('fa-star-o');
      update_score_view(score_label, 0);
    } else {
      update_view($('div.star i:eq(' + (current_score - 1) + ')'));
      update_score_view(score_label, current_score);
    }
  });


  $('#submit-score').click(function (event) {
    var data = {'score': get_score()};
    var did = $.getURLParam('did');
    if (did === null) {
      did = 1; // 当没有默认值的时候, 将整个值设置成-1
    }
    $.requestJSON({
      url: Urls.resolve('api_v1_storage:data_score', {did: did}),
      method: 'POST',
      data: data,
      silentError: true,
      onSuccess: function () {
        $.showModal({
          title: gettext('Success'),
          message: gettext('you have successfully submit score for this data'),
          onHide: function () {
            location.reload(true);
          }
        });
      }
    });
  });
});
