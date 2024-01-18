$(function () {

  $(".delete-button").on('click', function () {
    var tid = $(this).data('templateId');
    $.showModal({
      title: gettext('Warning'),
      message: gettext('Are you sure to delete this template?'),
      onOk: function () {
        $.requestJSON({
          url: Urls.resolve('api_v1_storage:template_one', {tid: tid}),
          method: "DELETE",
          onSuccess: function () {
            setTimeout(function () {
                $.showModal({
                  title: gettext("Success"),
                  message: gettext("Template deleted"),
                  onHide: function () {
                    window.location.reload();
                  }
                })
              },
              500
            )

          }
        });
      }
    });
  });
  $(".edit-button").on('click', function () {
    var tid = $(this).data('templateId');
    $(this).on('click', function () {
      window.open(Urls.resolve('storage:edit_template', {'tid': tid}));
    })
  });
  $(".view-button").on('click', function () {
    $(this).on('click', function () {
      window.open(Urls.resolve('storage:check_template', {tid: $(this).data('templateId')}));
    })
  });

  var paginator = $('#paginator');
  var options = {
    bootstrapMajorVersion: 3,
    currentPage: paginator.data('currentPage'),
    numberOfPages: 15,
    totalPages: paginator.data('pageCount'),
    onPageClicked: function (e, originalEvent, type, page) {
      window.location = Urls.resolve('account:my_templates_state', {
        page: page,
        state: $("#template-table").data('state')
      });
      e.stopImmediatePropagation();

    }
  };
  if (options.totalPages > 1) {
    paginator.bootstrapPaginator(options);  // 仅大于一页时分页
  }
});
