function dataOnClick(view) {
    window.open(Urls.resolve('storage:show_data', {did: $(view).attr('data-id')}));
  }
  
  function getQueryParameters() {
    return {
      type: $.getURLParam('type'),
      query: $.getURLParam('query'),
      sort: $.getURLParam('sort'),
      order: $.getURLParam('order'),
      page: $.getURLParam('page'),
      state:$.getURLParam('state'),
    };
  }
  
  function removeNullParameters(params) {
    for (var propName in params) {
      if (params[propName] === null || params[propName] === undefined) {
        delete params[propName];
      }
    }
    return params;
  }
  
  function setImageQueryParams(page, sort, order) {
    var page = arguments[0] ? arguments[0] : 1;
    var sort = arguments[1] ? arguments[1] : $('#sort-by').val();
    var order = arguments[2] ? arguments[2] : $('#sort-order').val();
    var file = $("#com-search-image")[0].files[0];
    var formData = new FormData();
    formData.append("page", page);
    formData.append("sort", sort);
    formData.append("order", order);
    formData.append("image", file);
    return formData
  }
  
  $(function () {
    //根据select选项改变输入框组的type
    $('#image-browse-btn').show();
    //  上传图像时，输入框显示文件名
    $('#com-search-image').change(function () {
      $('#com-search-text').val($(this)[0].files[0].name);
    });
  
    $.ajaxSetup({
      url: Urls.resolve('image_search:query'),
      type: 'POST',
      data: setImageQueryParams(),
      cache: false,
      contentType: false,
      processData: false,
      dataType: 'html',
      timeout: 60000,
      async: false,
      success: function (res) {
        $('#image-search-update').html(res);
     //   $('.selectpicker').selectpicker('render');
        $('#sort-btn').on('click', function () {
          $.ajax({data: setImageQueryParams()})
        });
        var paginator = $('#paginator');
        var options = {
          bootstrapMajorVersion: 3,
          currentPage: paginator.data('current-page'),
          numberOfPages: 15,
          totalPages: paginator.data('page-count'),
          onPageClicked: function (e, originalEvent, type, page) {
            $.ajax({data: setImageQueryParams(page)});
          }
        };
        if (options.totalPages > 1) {
          paginator.bootstrapPaginator(options);  // 仅大于一页时分页
        }
      },
      error: function () {
        console.log("upload failed");
      }
    });
  })
  
  $(function () {
    var paginator = $('#paginator');
    var options = {
      bootstrapMajorVersion: 3,
      currentPage: paginator.data('current-page'),
      numberOfPages: 15,
      totalPages: paginator.data('page-count'),
      onPageClicked: function (e, originalEvent, type, page) {
        var params = removeNullParameters(getQueryParameters());
        params.page = page;
        //window.location = Urls.resolve('search:search') + '/?' + $.param(params);
        window.location= window.location.href.split("?")[0]+ '?page=' + page;
        e.stopImmediatePropagation();
      }
    };
    if (options.totalPages > 1) {
      paginator.bootstrapPaginator(options);  // 仅大于一页时分页
    }
  });
  
  $(function () {
    $('#com-search-btn').on('click', function () {
  
      $.ajax({data: setImageQueryParams()});
  
    });
  
    // 绑定回车
    $("#com-search-text").bind('keypress', function (event) {
      if (event.keyCode === 13) {
        $('#com-search-btn').click();
      }
    });
  
    $('#sort-btn').on('click', function () {
      var params = getQueryParameters();
      params.page = null;
      removeNullParameters(params);
      params.sort = $('#sort-by').val();
      params.order = $('#sort-order').val();
      window.location = Urls.resolve('search:search') + '/?' + $.param(params);
    });
  });
  