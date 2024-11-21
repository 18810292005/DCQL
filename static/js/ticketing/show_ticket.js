$(function () {
  var ticket_id = $('#ticket-subject').data('ticket-id');
  $('#reply-btn').on('click', function () {
    var content = $('#my-editor').summernote('code');
    var contentText = content.indexOf('<') >= 0 ? $(content).text().trim(): $('<div>' + content + '</div>').text().trim();
    if (!contentText) {
          $.showModal({
            message: gettext('Please input a description.')
          });
          return;
        }
    $.requestJSON({
      url: Urls.resolve('api_v1_ticketing:reply'),
      data: {'ticket_id': ticket_id, 'content': content},
      onSuccess: function () {
        window.location.reload();
      }
    });
  });
  $('#ticket-content').each(function () {
    $(this).html($(this).data('ticket-content'));
    $(this).removeAttr('ticket-content');
  });
  $('.panel-body').each(function () {
    $(this).html($(this).data('content'));
    $(this).removeAttr('data-content');
  });

  $('#close-ticket-btn').on('click', function () {
    $.requestJSON({
      url: Urls.resolve('api_v1_ticketing:close_ticket'),
      data: {'ticket_id': ticket_id},
      onSuccess: function () {
        window.location.reload();
      }
    });
  });
  $('#end-ticket-btn').on('click', function () {
    $.requestJSON({
      url: Urls.resolve('api_v1_ticketing:finish_ticket'),
      data: {'ticket_id': ticket_id},
      onSuccess: function () {
        window.location.reload();
      }
    });
  })
});