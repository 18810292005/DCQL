/**
 * @file create-ticket.js
 * @author Yuvv
 * @date 2018/1/19
 */

$(function () {
  $('#submit-btn').on('click', function () {
    var editor = $('#my-editor');
    var content = editor.summernote('code');
    var contentText = content.indexOf('<') >= 0 ? $(content).text().trim(): $('<div>' + content + '</div>').text().trim();
    var title = $("#ticket-title").val().trim();
    if (!contentText) {
      $.showModal({
        message: gettext('Please input a description.')
      });
      return;
    }
    if (!title) {
      $.showModal({
        message: gettext('Please input the subject.')
      });
      return;
    }
    $.requestJSON({
      url: Urls.resolve('api_v1_ticketing:create_ticket'),
      data: {
        'content': content,
        't_type': parseInt($("#ticket-type").val()),
        'title': title,
        'images': window._editorFiles.images,
        'files': window._editorFiles.files
      },
      onSuccess: function () {
        $.showModal({
          title: gettext('Success'),
          message: gettext('We will handle your ticket as soon as possible.'),
          onHide: function () {
            window.location = Urls.resolve('ticketing:list_tickets');
          }
        });
      }
    });
  });
});