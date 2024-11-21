$(function () {
  function retract(history_id) {
    $.showModal({
      title: gettext('Are you sure?'),
      message: gettext('All data within this record will be deleted!'),
      onOk: function () {
        setTimeout(function () {
          $.showModal({
            title: gettext('Are you really sure?'),
            message: gettext('Click OK to delete.'),
            onOk: function () {
              $.requestJSON({
                url: Urls.resolve('api_v1_storage:retract_data', {history_id: history_id}),
                method: 'DELETE',
                onSuccess: function () {
                  window.location.reload();
                }
              });
            }
          });
        }, 700);
      },
    });
  }


  $(".view-button").each(function () {
    $(this).on('click', function () {
      window.open(Urls.resolve('account:upload_history_data', {history_id: $(this).data('historyId')}));
    })
  });
  $(".delete-button").each(function () {
    $(this).on('click', function () {
      retract($(this).data('historyId'));
    })
  });


  var paginator = $('#paginator');
  var options = {
    bootstrapMajorVersion: 3,
    currentPage: paginator.data('currentPage'),
    numberOfPages: 15,
    totalPages: paginator.data('pageCount'),
    onPageClicked: function (e, originalEvent, type, page) {
      window.location = Urls.resolve('account:upload_history_state', {
        page: page,
        state: $("#history-table").data('state')
      });
      e.stopImmediatePropagation();

    }
  };
  if (options.totalPages > 1) {
    paginator.bootstrapPaginator(options);  // 仅大于一页时分页
  }
});
