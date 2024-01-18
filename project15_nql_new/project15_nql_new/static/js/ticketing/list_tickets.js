$(function () {
  $(".ticket-row").each(function () {
    $(this).on('click', function () {
      window.location = Urls.resolve('ticketing:show_ticket', {ticket_id: $(this).data('ticket-id')});
    });
  });

  var element = $('#paginator');
  var options = {
    bootstrapMajorVersion: 3,
    currentPage: element.data('current-page'),
    numberOfPages: 15,
    totalPages: element.data('page-number'),
    onPageClicked: function (e, originalEvent, type, page) {
      window.location = Urls.resolve('ticketing:list_tickets') + '?page=' + page + '&type=' + element.data('ticket-type')
    }
  };
  if (options.totalPages > 1) {
    element.bootstrapPaginator(options);  // 仅大于一页时分页
  }
});