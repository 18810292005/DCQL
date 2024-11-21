function removeNullParameters(params) {
  for (var propName in params) {
    if (params[propName] === null || params[propName] === undefined) {
      delete params[propName];
    }
  }
  return params;
}

function getQueryParameters() {
  return {
    type: $.getURLParam('type'),
    query: $.getURLParam('query'),
    sort: $.getURLParam('sort'),
    order: $.getURLParam('order'),
    page: $.getURLParam('page'),
    state: $.getURLParam('state'),
  };
}

$(function () {
  // var doi_list = {};
  var paginator = $('#paginator');
  var state = $.getURLParam('state');
  var review_btn = $('#submit-review-btn');

  var options = {
    bootstrapMajorVersion: 3,
    currentPage: paginator.data('currentPage'),
    numberOfPages: 15,
    totalPages: paginator.data('pageCount'),
    onPageClicked: function (e, originalEvent, type, page) {
      var success_list = [];
      var failed_list = [];
      $('div.switch input').each(function () {
        var id = $(this).parents('tr.doi-row').attr('data-doi-id');
        if ($(this).prop('checked') === true) {
          if ($(this).attr('disabled') === undefined) { // 过滤掉已经审核通过的项
            success_list.push(id);
          }
        } else {
          if ($(this).attr('disabled') === undefined) {
            failed_list.push(id);
          }
        }
      });
      if (success_list.length != 0 || failed_list.length != 0) {
        alert("请先提交到该页面的审核结果");
        e.stopImmediatePropagation();
      } else {
        var params = removeNullParameters(getQueryParameters());
        params.page = page;
        window.location = Urls.resolve('storage:doi_list') + "?" + $.param(params);
        e.stopImmediatePropagation();
      }

    }
  };
  if (options.totalPages > 1) {
    paginator.bootstrapPaginator(options);
  }

  $('a.doi-row-content').click(function () {
    var id = $(this).parents('tr.doi-row').first().attr('data-doi-id');
    window.open(Urls.resolve('storage:doi_detail', {'did': id}));
  });


  // doi_list.get_success_list = function () {
  //   var object = JSON.parse(sessionStorage.getItem('doi_success_list')) || [];
  //   return object;
  // };
  // doi_list.get_fail_list = function () {
  //   var object = JSON.parse(sessionStorage.getItem('doi_fail_list')) || [];
  //   return object;
  // };
  // doi_list.set_success_list = function (object) {
  //   sessionStorage.setItem('doi_success_list', JSON.stringify(object));
  //   return object;
  // };
  // doi_list.set_fail_list = function (object) {
  //   sessionStorage.setItem('doi_fail_list', JSON.stringify(object));
  //   return object;
  // };
  // doi_list.hasId_success = function (id) {
  //   var data_ids = this.get_success_list();
  //   if ($.inArray(id, data_ids) == -1) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // };
  // doi_list.hasId_fail = function (id) {
  //   var data_ids = this.get_fail_list();
  //   if ($.inArray(id, data_ids) == -1) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // };
  // doi_list.addId_success = function (id) {
  //   var dataids = this.get_success_list();
  //   if (!this.hasId_success(id)) {
  //     dataids.push(id);
  //   }
  //   this.set_success_list(dataids);
  // };
  // doi_list.addId_fail = function (id) {
  //   var dataids = this.get_fail_list();
  //   if (!this.hasId_fail(id)) {
  //     dataids.push(id);
  //   }
  //   this.set_fail_list(dataids);
  // };
  // doi_list.removeId_success = function (id) {
  //   var dataids = this.get_success_list();
  //   if (this.hasId_success(id)) {
  //     var index = $.inArray(id, dataids);
  //     dataids.splice(index, 1);
  //   }
  //   this.set_success_list();
  // };
  // doi_list.removeId_fail = function (id) {
  //   var dataids = this.get_fail_list();
  //   if (this.hasId_fail(id)) {
  //     var index = $.inArray(id, dataids);
  //     dataids.splice(index, 1);
  //   }
  //   this.set_fail_list();
  // };
  // doi_list.initial = function () {
  //   $('div.switch input').each(function () {
  //     var id = $(this).parents('tr.doi-row').attr('data-doi-id');
  //     if ($(this).prop('checked') === true) {
  //       if ($(this).attr('disabled') === undefined) { // 过滤掉已经审核通过的项
  //         // success_list.push(id);
  //         doi_list.removeId_fail(id);
  //         doi_list.addId_success(id);
  //       }
  //     } else {
  //       if ($(this).attr('disabled') === undefined) {
  //         doi_list.removeId_success(id);
  //         doi_list.addId_fail(id);
  //       }
  //       // failed_list.push(id);
  //     }
  //   });
  // };


  $('div.switch input').bootstrapSwitch({
    onColor: "primary",
    offColor: "danger",
    size: "small",
    onText: gettext("Yes"),
    offText: gettext("No"),
    // onSwitchChange: function (event, state) {
    //   var id = $(this).parents('tr.doi-row').attr('data-doi-id');
    //   if (state == true) {
    //     doi_list.removeId_fail(id);
    //     doi_list.addId_success(id);
    //   } else {
    //     doi_list.removeId_success(id);
    //     doi_list.addId_fail(id);
    //   }
    // },
  });

  review_btn.click(function () {
    var success_list = [];
    var failed_list = [];
    $('div.switch input').each(function () {
      var id = $(this).parents('tr.doi-row').attr('data-doi-id');
      if ($(this).prop('checked') === true) {
        if ($(this).attr('disabled') === undefined) { // 过滤掉已经审核通过的项
          success_list.push(id);
        }
      } else {
        if ($(this).attr('disabled') === undefined) {
          failed_list.push(id);
        }

      }
    });
    var data = {
      'success': success_list,
      'failed': failed_list,
    };
    $.requestJSON({
      url: Urls.resolve('api_v1_storage:doi_review'),
      method: 'PATCH',
      data: data,
      silentError: true,
      onSuccess: function (data) {
        $.showModal({
          title: gettext('Register successfully'),
          message: gettext('you have successfully register some DOI numbers'),
          onOk: function () {
            // 自动跳转到下一个页面
            var params = removeNullParameters(getQueryParameters());
            // params.page = page;
            if (options.currentPage === options.totalPages) {
              params.page = 1;
            } else {
              params.page = options.currentPage + 1;
            }
            window.location = Urls.resolve('storage:doi_list') + "?" + $.param(params);
          },
        });
      },
      onError: function (data) {
        $.showModal({
          title: gettext('ERROR') + ' ' + data.code + ':' + data.msg,
          message: gettext('Your operation has an encounter an error'),
        });
      }
    });

  });

  // 初始化提交按钮的样式
  function init_review_btn() {
    if (state === 'approved' || state === 'notapproved') {
      review_btn.attr('disabled', true);
    }
    var success_list = [];
    var failed_list = [];
    $('div.switch input').each(function () {
      var id = $(this).parents('tr.doi-row').attr('data-doi-id');
      if ($(this).prop('checked') === true) {
        if ($(this).attr('disabled') === undefined) { // 过滤掉已经审核通过的项
          success_list.push(id);
        }
      } else {
        if ($(this).attr('disabled') === undefined) {
          failed_list.push(id);
        }
      }
    });
    if (success_list.length === 0 && failed_list.length === 0) {
      review_btn.attr('disabled', true);
    }
  }

  init_review_btn();

  // window.doi_list = doi_list;
  // doi_list.initial();


});


// 这里同样要改成能够自己实现翻页的时候SessionStorage
