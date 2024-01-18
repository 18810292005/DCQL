$(function () {
  $('button.btn-watch').each(function () {
    $(this).click(function () {
      var tpl_id = $(this).parent().data('templateId');
      window.open(Urls.resolve('storage:check_template', {tid: tpl_id}));
    })
  });

  $('button.btn-pass').each(function () {

    $(this).click(function () {
      var tpl_id = $(this).parent().data('templateId');
      $.requestJSON({
        url: Urls.resolve('api_v2_storage:review_template', {tpl_id: tpl_id}),
        method: 'PATCH',
        data: {approved: true},
        onSuccess: function () {
          $.showModal({
            title: gettext("Success"),
            message: gettext("Template approved"),
            onHide: function () {
              window.location.reload();
            }
          })

        }
      });
    })
  });

  $('button.btn-trash').each(function () {
    $(this).click(function () {
      var tpl_id = $(this).parent().data('templateId');
      var cloned = $("#reason-div").clone();
      cloned.attr('id', 'real-reason-div');
      cloned.children().attr('id', 'real-reason-form');
      $.showModal({
        message: cloned.html(),
        onOk: function (e) {
          var reasons = [];
          $("#real-reason-form").find('input').each(function () {
            if ($(this).prop('checked')) {
              reasons.push(parseInt($(this).data('reasonId')));
            }
          });
          if (reasons.length === 0) {
            alert(gettext("Please choose at least one reason."));
            e.stopImmediatePropagation();
            return;
          }
          $.requestJSON({
            url: Urls.resolve('api_v2_storage:review_template', {tpl_id: tpl_id}),
            method: 'PATCH',
            data: {approved: false, reasons: reasons},
            onSuccess: function () {
              $.showModal({
                title: gettext("Success"),
                message: gettext("Template disapproved"),
                onHide: function () {
                  window.location.reload();
                }
              })
            }
          });
        },
        title: gettext("Please choose reasons of disapproval:")
      });
    })
  });

});


var paginator = $('#paginator');
var options = {
  bootstrapMajorVersion: 3,
  currentPage: paginator.data('currentPage'),
  numberOfPages: 15,
  totalPages: paginator.data('pageCount'),
  onPageClicked: function (e, originalEvent, type, page) {
    var state = $('#state-group').data('state');
    window.location = Urls.resolve('storage:show_template_review', {page: page, state: state});
    e.stopImmediatePropagation();

  }
};
if (options.totalPages > 1) {
  paginator.bootstrapPaginator(options);  // 仅大于一页时分页
}
