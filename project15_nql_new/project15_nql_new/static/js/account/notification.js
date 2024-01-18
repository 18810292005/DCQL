/**
 * Notifications
 *
 */

var PER_PAGE = 10;   // 每一页显示的通知数目

function makeNotificationDiv(notification) {
  return '<div class="alert alert-default alert-dismissible fade in" role="alert" data-nid="' + notification.id + '">\n' +
  '  <button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
  '<span aria-hidden="true"><i class="fa fa-trash"></i></span>' +
  '</button>\n' +
  '  <h4>' + notification.timestamp + '</h4><p>' + notification.content + '</p>' +
  '</div>';
}

function addNotification(notification, type) {
  var d = $(makeNotificationDiv(notification));
  d.on('close.bs.alert', function () {
    removeNotification(d.data('nid'));
  });
  $("#" + type + "-group").append(d);
}

function removeNotification(nid) {
  $.requestJSON({
    url: Urls.resolve('api_v1_account:notification_resource', {n_id: nid}),
    method: "DELETE"
  });
}

function removeAllNotifications(type) {
  $('#' + type + '-group').empty();
}

function loadPage(notification_list, type, page) {
  removeAllNotifications(type);
  var arr = notification_list.slice((page - 1) * PER_PAGE, (page - 1) * PER_PAGE + PER_PAGE);
  arr.forEach(function (value) {
    addNotification(value, type);
  });
}

// function loadUnreadNotifications() {
//   $.requestJSON({
//     url: Urls.resolve('api_v1_account:notification_list'),
//     method: "GET",
//     param: {type: 'unread'},
//     onSuccess: function (data) {
//       loadPage(data.data.notifications, 'unread', 1);
//       if (data.data.pages > 1) {
//         var element = $('#unread-paginator');
//         var options = {
//           bootstrapMajorVersion: 3,
//           currentPage: 1,
//           numberOfPages: 5,
//           totalPages: data.data.pages > 0 ? data.data.pages : 1,
//           onPageClicked: function (e, originalEvent, type, page) {
//             loadPage(data.data.notifications, 'unread', page);
//           }
//         };
//         element.bootstrapPaginator(options);
//       }
//     },
//     onError: function (resp) {
//       console.log(resp);
//     }
//   })
// }

$(function () {
  loadUnreadNotifications();
  loadReadNotifications();
});
