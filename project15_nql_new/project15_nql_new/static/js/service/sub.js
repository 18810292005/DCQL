function unsubscribeClass(oid, view) {
  $.post('/api/v1/service/sub/class/', '{"data":{"del":["'+oid+'"], "add":[]}}');
  $(view.parentElement).remove();
}

function unsubscribeTag(tag, view) {
  $.post('/api/v1/service/sub/tag/', '{"data":{"del":["' +tag+'"], "add":[]}}');
  $(view.parentElement).remove();
}

function unsubscribeUser(user, view){
  $.post('/api/v1/service/sub/user/', '{"data": {"del":["'+user+'"], "add": []}}');
  $(view.parentElement).remove();
}

$(function(){
  var classRender = doT.template(
    '{{~it.data :value:index}}' +
    '<span class="btn btn-primary">' +
    '{{=value.name}}' +
    '  <a href="#_" onclick="unsubscribeClass(\'{{=value.oid}}\', this);">' +
    '    <i class="fa fa-close"></i>' +
    '  </a>' +
    '</span>' +
    '{{~}}'
  );

  var tagRender = doT.template(
    '{{~it.data :value:index}}' +
    '<span class="btn btn-primary tag">' +
    '  {{=value}}' +
    '  <a href="#_" onclick="unsubscribeTag(\'{{=value}}\', this)">' +
    '    <i class="fa fa-close"></i>' +
    '  </a>' +
    '</span>' +
    '{{~}}'
  );

  var userRender = doT.template(
    '{{~it.data :value:index}}' +
    '<div class="avatar-wrapper">' +
    '  <span onclick="unsubscribeUser(\'{{=value}}\', this)"><i class="fa fa-window-close"></i></span>' +
    '  <a href="#">' +
    '    <img class="img-avatar img-circle " style="width: 100%" src="/api/v1/account/users/{{=value}}/avatar/?size=large"/>' +
    '  </a>' +
    '  <div class="title">' +
    '    <a href="#">{{=value}}</a>' +
    '  </div>' +

    '</div>' +
    '{{~}}'
  );

  $.get('/api/v1/service/sub/class/', '', function (data, textStatus, jqXHR) {
    $('#sub-classes').html(classRender(data));
  });

  $.get('/api/v1/service/sub/tag/', '', function (data, textStatus, jqXHR) {
    $('#sub-tags').html(tagRender(data));
  });

  $.get('/api/v1/service/sub/user/', '', function (data, textStatus, jqXHR) {
    $('#sub-users').html(userRender(data));
  })
});
