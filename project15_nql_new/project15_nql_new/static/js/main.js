/**
 * @file main.js
 * @author Yuvv
 * @date 2017/11/30
 */
$.getURLParam = function (param, url) {
  /*
  * 获取URL参数
  * param: 参数名
  * url: url，默认为当前窗口的url
  */
  var reg = new RegExp("(^|&)" + param + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
  url = url || window.location;
  var r = url.search.substr(1).match(reg);  //匹配目标参数
  if (r !== null) return unescape(r[2]);
  return null; //返回参数值
};

$(function () {
  /**
   * 获取一个随机的 id（理论上不会重复）
   * 在Utils.ts中重新实现
   * @return {string}
   */
  $.getUniqueId = function () {
    // 当前时间再加一个随机数，理论上同一时间不可能生成相同值
    return Date.now() + Math.random().toString().slice(2);   // id 里面不能加点
  };

  $.showModal = function (options) {
    /*
    * options对象包括：
    *
    * title：错误的标题，默认是"出错了"
    * message：错误的消息
    * extra: 额外的隐藏消息，点击显示详情
    * size: 模态框大小，"lg" or "sm"，默认为 "sm"
    * onOk: 点击确定框之后的回调函数（点击后模态框会隐藏），ok回调被设置的话会显示取消按钮
    * okText: Ok 按钮上需要显示的文字，默认为 `OK`
    * onHide: 模态框隐藏时的回调函数（一旦隐藏都会触发）
    * cancelText: cancel 按钮上需要显示的文字，默认为 `Cancel`
    */
    if (options.title === null || options.title === undefined) {
      options.title = gettext("Note");
    }
    options.size = options.size || "sm";
    options.okText = options.okText || gettext("OK");
    options.cancelText = options.cancelText || gettext('Cancel');

    var modal = $("#ce5151df-e67e-47ee-9609-b1a8bf2a4259");

    if (modal.length === 0) {
      modal = $('<div class="modal fade" id="ce5151df-e67e-47ee-9609-b1a8bf2a4259" role="dialog">' +
        '    <div class="modal-dialog modal-' + options.size + '">' +
        '        <div class="modal-content">' +
        '            <div class="modal-header">' +
        '                <button type="button" class="close" data-dismiss="modal">&times;</button>' +
        '                <h4 class="modal-title"></h4>' +
        '            </div>' +
        '            <div class="modal-body"></div>' +
        '            <div class="modal-footer">' +
        '                <button type="button" class="btn btn-primary" data-dismiss="modal">' + options.okText + '</button>' +
        '            </div>' +
        '        </div>' +
        '    </div>' +
        '</div>');
      $('body').append(modal);
    }
    modal.find('.modal-title').html(options.title);
    var bodyContent = '<p>' + options.message + '</p>';
    if (options.extra) {
      bodyContent += '<p id="err-detail" class="text-danger">' + options.extra + '</p>'
    }
    modal.find('.modal-body').html(bodyContent);

    if (options.onHide) {
      modal.off('hide.bs.modal');
      modal.on('hide.bs.modal', options.onHide);
    }
    var modalFooterOkButton = modal.find('.modal-footer>.btn-primary');
    modalFooterOkButton.off('click');
    modalFooterOkButton.text(options.okText);
    if (options.onOk) {
      if (modalFooterOkButton.siblings('.btn').length === 0) {
        modalFooterOkButton.before('<button type="button" class="btn btn-default" data-dismiss="modal">' + options.cancelText + '</button>');
      }
      modalFooterOkButton.on('click', options.onOk);
    } else {
      modalFooterOkButton.siblings('.btn').remove();
    }

    modal.modal('show');
  };

  $.requestJSON = function (options) {
    /*
    * param对象包括
    *
    * url: 请求url
    * data： 要发送的数据对象
    * data_type: 指明data的类型，默认为json
    * param: URL参数
    * method： 请求方法，默认POST
    * silentError：发生错误时不弹出错误消息窗口，默认false
    * showLoading：发送请求时是否显示载入动画，默认true
    * onSuccess：请求成功时的回调函数，接收返回的json对象
    * onError：请求失败的时的回调函数，接收返回的json对象
    * onHide：用户关闭错误消息窗口后执行的回调函数，接收返回的json对象
    * */
    options.showLoading = (options.showLoading === undefined ? true : !!options.showLoading);
    options.method = options.method || 'POST';
    options.silentError = (options.silentError === undefined ? false : !!options.silentError);
    options.data_type = options.data_type || 'json';
    options.global = (options.global === undefined ? true : !!options.global);
    var loading_timeout_id;
    if (options.showLoading) {
      loading_timeout_id = setTimeout("$.showLoading(true)", 200);
    }
    if (options.param) {
      options.url += ('?' + $.param(options.param));
    }
    var contentType = 'application/json';
    var dataType = 'json';
    var processData = true;
    var cache = true;
    if (options.data_type === 'json') {
      options.data = JSON.stringify(options.data);
    } else if (options.data_type === 'multipart') {
      processData = false;
      contentType = false;
      cache = false;
    }
    $.ajax({
      url: options.url,
      data: options.data,
      method: options.method,
      global: options.global,
      dataType: dataType,
      contentType: contentType,
      cache: cache,
      processData: processData
    }).done(function (data, textStatus, jqXHR) {
      if (options.onSuccess) options.onSuccess(data);
    }).fail(function (jqXHR, textStatus, errorThrown) {
      var j = jqXHR.responseJSON;
      if (j) {
        if (options.onError) {
          options.onError(j);
        }
        if (!options.silentError) {
          j.extra = j.extra || {};
          $.showModal({
            title: gettext("ERROR"),
            message: j.msg,
            extra: j.extra.err_detail,
            onHide: function () {
              if (options.onHide) {
                options.onHide(j);
              }
            }
          });
        }
      } else {
        if (options.onNonJSON) {
          options.onNonJSON(j);
        }
        window._jqHandled = true;
      }
    }).always(function () {
      if (options.showLoading) {
        clearTimeout(loading_timeout_id);
        $.showLoading(false);
      }
    })
  };

  $.showLoading = function (show) {
    /*
    text: '', // explaining text under animation
    percent: '', // from 0 to 100
    duration: '', // in ms
    zIndex: '', // setting z-index rule to .preloader
    setRelative: false, // setting relative position to preloader's parent
    setFull: true
   */
    if (show) {
      $("body").preloader();
    } else {
      $("body").preloader('remove');
    }
  };

  $.notify = function (options) {
    /*
    * options对象包括：
    *
    * message： 消息
    * type: 通知的样式（success, info, warning, danger），默认为success
    * align: 通知的位置 （left, right, center），默认为right
    * width: 宽度，默认是250，"auto"为自适应
    * topOffset: 顶部间距，默认为50px
    * delay: 出现多少毫秒之后自动消失，默认3000ms，0为不自动消失
    * fadeOut: 消失时的淡出时间，默认为1000ms
    * allowDismiss: 是否允许关闭，默认为true
    * stackUpSpacing: 层叠间距，默认为10
    *
    * */
    options = options || {};
    options = $.extend({
      ele: "body",
      type: "success",
      topOffset: 60,
      offset: {
        from: "top",
        amount: 20
      },
      align: "right",
      width: 250,
      delay: 3000,
      fadeOut: 1000,
      allowDismiss: true,
      stackUpSpacing: 10
    }, options);
    options.offset.amount = options.topOffset || 20;
    var $alert, css, offsetAmount;
    $alert = $("<div>");
    $alert.attr("class", "alert-bar alert");
    if (options.type) {
      $alert.addClass("alert-" + options.type);
    }
    if (options.allowDismiss) {
      $alert.addClass("alert-dismissible");
      $alert.append("<button  class=\"close\" data-dismiss=\"alert\" type=\"button\"><span aria-hidden=\"true\">&#215;</span><span class=\"sr-only\">Close</span></button>");
    }
    $alert.append(options.message);

    offsetAmount = options.offset.amount;
    $(".alert-bar").each(function () {
      return offsetAmount = Math.max(offsetAmount, parseInt($(this).css(options.offset.from)) + $(this).outerHeight() + options.stackUpSpacing);
    });
    css = {
      "position": (options.ele === "body" ? "fixed" : "absolute"),
      "margin": 0,
      "z-index": "9999",
      "display": "none"
    };
    css[options.offset.from] = offsetAmount + "px";
    $alert.css(css);
    if (options.width !== "auto") {
      $alert.css("width", options.width + "px");
    }
    $(options.ele).append($alert);
    switch (options.align) {
      case "center":
        $alert.css({
          "left": "50%",
          "margin-left": "-" + ($alert.outerWidth() / 2) + "px",
          "top": "50%",
          "margin-top": "-" + ($alert.outerHeight() / 2) + "px"
        });
        break;
      case "left":
        $alert.css("left", "20px");
        break;
      default:
        $alert.css("right", "20px");
    }
    $alert.fadeIn();
    if (options.delay > 0) {
      $alert.delay(options.delay).fadeOut(options.fadeOut, function () {
        return $(this).alert("close");
      });
    }
    return $alert;
  };

  $.getCookie = function (name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = jQuery.trim(cookies[i]);
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  document.CSRF_TOKEN = $.getCookie('csrftoken');

  $(document).ajaxSend(function (event, xhr, options) {
    if (!(/^(GET|HEAD|OPTIONS|TRACE)$/.test(xhr.type)) && !options.crossDomain) {
      xhr.setRequestHeader("X-CSRFtoken", document.CSRF_TOKEN);
    }
  }).ajaxError(function (event, jqXHR, ajaxSettings, thrownError) {
    // 仅有在 _jqHandled 为 true 时调用
    if (window._jqHandled) {
      if (thrownError.name === "SyntaxError") {
        console.error("Server returned 200 but the response is not json.");
      } else if (jqXHR.status === 0) {
        $.showModal({
          title: gettext("Network Error"),
          message: gettext("Connection Timeout")
        });
      } else if (jqXHR.responseJSON) {
        var resp = jqXHR.responseJSON;
        if (resp.hasOwnProperty('code') && resp.hasOwnProperty('msg') && window._jqHandledCode !== resp.code) {
          var extra = resp.extra || {};
          extra = (typeof extra === 'string') ? extra : extra.err_detail;
          $.showModal({
            title: gettext('Error'),
            message: window._jqErrMsg || gettext('An error has occurred'),
            extra: extra
          });
        }
      } else {
        $.showModal({
          title: gettext("Internal Server Error"),
          message: gettext("Please try again later or contact admin.")
        });
        console.error(jqXHR.responseText);
      }
    }
  }).ajaxComplete(function () {
    window._jqHandled = false;
    window._jqHandledCode = undefined;
  });

  $.vf = {
    _setHandler: function ($it, eventName) {
      if ($it.data('vfHandler')) {
        return;  // handler 避免重复设置 vf handler
      }
      $it.on(eventName, function () {
        $.vf.validateField($it, new RegExp($it.data('vfRegex')), $it.data('vfInverse'), $it.data('vfHelp'));
      });
      $it.data('vfHandler', true);
    },
    /**
     * 查找所有 form-control 类且 data-vf 属性为 true 的表单控件检查其正确性，
     * 正确则返回 true，错误返回 false，且错误字段会显示错误提示，并 focus 到第一个错误字段
     * @return {boolean}
     */
    validate: function () {
      var valid = true,
        result,
        focused = false;   // focus 到第一个错误
      $('.form-control[data-vf=true]').each(function (i, it) {
        var $it = $(it);
        if ($it.attr('disabled')) {
          return;
        }
        result = $.vf.validateField($it, new RegExp($it.data('vfRegex')), $it.data('vfInverse'), $it.data('vfHelp'));
        valid = valid && result;
        if (!result && !focused) {
          focused = true;
          $it.focus();
        }
        if ($it.is('select,input[type=checkbox],input[type=radio]')) {
          $.vf._setHandler($it, 'change');
        } else if ($it.is('input,texture')) {
          $.vf._setHandler($it, 'keyup');
        } else {
          console.error('Wrong form control');
        }
      });
      return valid;
    },
    /**
     * 验证表单字段正确性
     * @param {(Object|string)} field 对应的表单字段document/jQuery对象或表单字段 name，required
     * @param {RegExp} regex 验证值的正则表达式，required
     * @param {boolean=false} inverse 反向匹配，匹配时返回 false，不匹配返回 true，默认为 false
     * @param {string=} helpText 错误提示信息，默认为 `This field wrong!`
     * @return {boolean} 若表单字段值与 regex 匹配则返回 true，否则为 that 父节点添加 has-error 类并返回false
     */
    validateField: function (field, regex, inverse, helpText) {
      inverse = inverse || false;
      helpText = helpText || 'This field wrong!';
      var $field = null, result;
      if (field instanceof $) {
        $field = field;
      } else if (typeof field === 'string') {
        $field = $('input[name="' + field + '"]');
      } else if (field.tagName) {
        $field = $(field);
      } else {
        console.error('Form field type wrong!');
        return false;
      }
      if (!(regex instanceof RegExp)) {
        console.error('Validator must be a RegExp!');
        return false;
      }
      result = regex.test($field.val().trim());
      if (inverse) {
        result = !result;
      }
      var $parent = $field.parent();
      while (!$parent.is('.form-group,.checkbox,.radio')) {
        $parent = $parent.parent();
      }
      $parent.find('span.help-block,span.form-control-feedback').remove();
      $parent.removeClass('has-error has-success');
      if (result) {
        $parent.append('<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>');
        $parent.addClass('has-success has-feedback');
        return true;
      } else {
        $parent.append('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>');
        $parent.append('<span class="help-block">' + helpText + '</span>');
        $parent.addClass('has-error has-feedback');
        return false;
      }
    }
  };
});

$(document).ready(function () {
  $('[data-toggle="tooltip"]').tooltip({
    trigger: 'hover',
    container: 'body',
    template: '<div class="tooltip" style="position: fixed; z-index: 2147483647;" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  });
});

// 模板名字查询

$(function () {
  var templateNameProvider = {
    // 从storage获取对象，仅类内部使用
    _getObj: function () {
      var obj = JSON.parse(localStorage.getItem('template-names')) || {};
      return obj;
    },
    // 存储对象到storage，仅类内部使用
    _setObj: function (obj) {
      localStorage.setItem('template-names', JSON.stringify(obj));
    },
    // 异步查询一个模板的名字
    asyncQueryName: function (tid, callback, done) {

      if (Array.isArray(tid)) {
        // 如果是数组，那么做批量查询
        // 批量查询总是向服务器发起请求，防止名字不一致的情况
        $.requestJSON({
          url: Urls.resolve('api_v2_storage:template_names') + '?list=' + tid.join(','),
          method: 'GET',
          showLoading: false,
          onSuccess: function (data) {
            var obj = templateNameProvider._getObj();
            var ret = data.data;
            for (var id in ret) {
              obj[id] = ret[id];
              callback(id, obj[id]);
            }
            templateNameProvider._setObj(obj);
            if (done) done();
          }
        });
      } else {
        // 单个查询
        var obj = this._getObj();
        if (obj[tid] != undefined) {
          callback(tid, obj[tid]);
          if (done) done();
        } else {
          $.requestJSON({
            url: Urls.resolve('api_v2_storage:template_names') + '?list=' + tid,
            method: 'GET',
            showLoading: false,
            onSuccess: function (data) {
              var obj = templateNameProvider._getObj();
              var name = data.data[tid];
              obj[tid] = name;
              templateNameProvider._setObj(obj);
              callback(tid, obj[tid]);
              if (done) done();
            }
          });
        }
      }
    }
  };
  window.templateNameProvider = templateNameProvider;
});

$(function () {
  // 购物车在页面加载时要读取localStorage
  var cart = {};
  // 初始化页面里所有的.btn-add-to-cart按钮
  // 当页面有新的button要设置时，
  // 调用此函数设置button的onclick

  // 检测localStorage里是否包含该id

  cart.selected = {
    _get: function () {
      var obj = JSON.parse(sessionStorage.getItem('cart-selected')) || {};
      return obj;
    },
    _set: function (data) {
      sessionStorage.setItem('cart-selected', JSON.stringify(data));
    },
    // 获取模板的checkbox
    _getTemplateCheckbox: function (tid) {
      var template_checkbox_id = "template-checkbox-" + tid;
      return $('#' + template_checkbox_id)
    },
    // 获取数据的checkbox
    _getDataCheckbox: function (id) {
      var data_checkbox_id = "data-checkbox-" + id;
      return $('#' + data_checkbox_id);
    },
    // 根据数据更新全部的checkbox
    _updateView: function () {
      // 首先是checkbox
      //     先全部清空
      $('.dl_tree').find('input[type="checkbox"]').not('.item').prop('checked', false);
      //     然后逐个设置
      var data = this._get();
      for (var tid in data) {
        for (var id in data[tid]) {
          this._getDataCheckbox(id).prop('checked', true);
        }
        if (Object.keys(data[tid]).length === cart.getTemplateAddedIdCount(tid)) {
          this._getTemplateCheckbox(tid).prop('checked', true);
        }
      }

      // 然后是btn
      if ($.isEmptyObject(data)) {
        $('.drawer-button-float').hide();
      } else {
        $('.drawer-button-float').show();
      }
    },
    // 添加
    add: function (tid, id) {
      var data = this._get();

      if (!data[tid]) data[tid] = {};
      if (id) {
        data[tid][id] = true;
      } else {
        var obj = cart._getStorage();
        for (var did in obj[tid]) {
          data[tid][did] = true;
        }
      }
      this._set(data);
      this._updateView();
    },
    // 取消勾选，如果id是null那么删除整个tid
    remove: function (tid, id) {
      var data = this._get();
      if (data[tid]) {
        if (id == null) {
          delete data[tid];
        } else {
          delete data[tid][id];
          if (Object.keys(data[tid]).length === 0) delete data[tid];
        }
      }

      this._set(data);
      this._updateView();
    },
    // 把所有id变成数组
    toArray: function () {
      var data = this._get();
      var result = [];
      for (var tid in data) {
        for (var id in data[tid]) {
          result.push(Number(id));
        }
      }
      console.log(result);
      return result;
    }
  }

  cart._getStorage = function () {
    var obj = JSON.parse(localStorage.getItem('cart')) || {};
    return obj;
  }

  cart._saveStorage = function (obj) {
    localStorage.setItem('cart', JSON.stringify(obj));
  }

  cart.isEmpty = function () {
    var obj = this._getStorage();
    return $.isEmptyObject(obj);
  }

  cart.removeAllId = function () {
    var obj = this._getStorage();
    var tids = []
    for (var x in obj) {
      tids.push(x);
    }
    for (var i = 0; i < tids.length; ++i) {
      this.removeTemplate(tids[i]);
    }
  }

  cart.hasId = function (tid, id) {
    var obj = this._getStorage();
    return (tid in obj && id in obj[tid]);
  }

  // addId，不触发其他标签页的更新事件
  cart._addId = function (tid, id, title) {
    // 更新data
    var obj = this._getStorage();
    var insert_new_template = false;
    if (!(tid in obj)) {
      obj[tid] = {};
      insert_new_template = true;
    }
    obj[tid][id] = title;
    this._saveStorage(obj);

    templateNameProvider.asyncQueryName(tid, function (tid, data) {
      cart.updateDrawer(tid, id, data);
      cart.selected._updateView();
    });

    this.updateButton(tid, id);
    // 因为小红点比较简单，所以就直接写在这里
    $('.corner-button-dot').removeClass('corner-button-dot-hidden');
  }

  // 添加一个id到localStorage
  cart.addId = function (tid, id, title) {
    this._addId(tid, id, title);
    // 然后写入bridge
    localStorage.setItem('bridge', JSON.stringify({type: 'addId', tid: tid, id: id, title: title}));
  }

  // 从localStorage删除一个id
  // 该函数同时更新view
  cart._removeId = function (tid, id) {
    // 更新data
    var is_delete_template = false;
    var obj = this._getStorage();
    if (tid in obj) {
      delete obj[tid][id];
      if ($.isEmptyObject(obj[tid])) {
        delete obj[tid];
        is_delete_template = true;
      }
    }
    this._saveStorage(obj);
    // 更新view
    this.updateButton(tid, id);
    this.updateDrawer(tid, (is_delete_template ? null : id));
    // 更新选取状态
    cart.selected.remove(tid, id);
  }

  cart.removeId = function (tid, id) {

    var obj = this._getStorage();
    var count = 0
    if (tid in obj) {
      count = Object.keys(obj[tid]).length;
    }

    this._removeId(tid, id);
    // 写入bridge
    var obj = this._getStorage();

    if (count === 1) {
      localStorage.setItem('bridge', JSON.stringify({type: 'removeTemplate', tid: tid}));
    } else {
      localStorage.setItem('bridge', JSON.stringify({type: 'removeId', tid: tid, id: id}));
    }
  }

  cart.toggleId = function (tid, id, title) {
    if (this.hasId(tid, id))
      this.removeId(tid, id);
    else
      this.addId(tid, id, title);
  }
  // 从localStorage删除一个模板
  cart._removeTemplate = function (tid) {
    // 更新data
    var obj = this._getStorage();
    delete obj[tid];
    this._saveStorage(obj);
    // 首先更新drawer的view
    this.updateDrawer(tid);
    this.updateButton(tid);
    // 然后更新选取状态
    this.selected.remove(tid);
  }

  cart.removeTemplate = function (tid) {
    this._removeTemplate(tid);
    // 写入bridge
    localStorage.setItem('bridge', JSON.stringify({type: 'removeTemplate', tid: tid}));
  }

  cart.updateButtonByView = function (btn) {

    function setButtonAdd(btn) {
      $(btn).removeClass('btn-info').addClass('btn-default');
      $(btn).html('<i class="fa fa-plus"></i>');
      $(btn).attr('data-original-title', gettext('Add to download list'));
      $(btn).attr('title', gettext('Add to download list'));
    }

    // 将按钮设置为已添加状态
    function setButtonRemove(btn) {
      $(btn).removeClass('btn-default').addClass('btn-info');
      $(btn).html('<i class="fa fa-check"></i>');
      $(btn).attr('data-original-title', gettext('Already in download list'));
      $(btn).attr('title', gettext('Already in download list'));
    }

    var id = $(btn).attr('data-id');
    var tid = $(btn).attr('data-tid');

    if (this.hasId(tid, id)) {
      setButtonRemove(btn);
    } else {
      setButtonAdd(btn);
    }
  }

  // 获取模板下添加了多少数据到cart
  cart.getTemplateAddedIdCount = function (tid) {
    var data = this._getStorage();
    return Object.keys(data[tid]).length
  }

  // 更新对应的button的view
  // 如果id是null/undefined，那么更新tid下出现的所有id
  cart.updateButton = function (tid, id) {
    if (id == null) {
      // 更新所有的id
      $('.btn-add-to-cart[data-tid="' + tid + '"]').each(function (indxe) {
        cart.updateButtonByView(this);
      });
    } else {
      this.updateButtonByView($('.btn-add-to-cart[data-tid="' + tid + '"][data-id="' + id + '"]'));
    }
  }

  cart.addTemplateToDrawer = function (tid, title) {
    var dl_tree = $('.dl_tree');
    if (dl_tree.length === 0) {
      // 这里是添加第一条数据，所以新加dl_tree
      $('.drawer-slim-dl_tree-wrapper').append('<ul class="dl_tree animated noscrollbar"></ul>');
      dl_tree = $('.dl_tree');
    }
    if (dl_tree.find('#template-' + tid).length !== 0) return;
    // 这个id用于标识li
    var template_id = "template-" + tid;
    // 这个id用于整体选择模板下的所有data
    var template_checkbox_id = "template-checkbox-" + tid;
    // 这个id用于dl_tree的收起展开
    var template_checkbox_toggle_id = "template-checkbox-toggle-" + tid;
    var view = ''
      + '<li class="has-children" id="' + template_id + '">'
      + '  <input class="item" type="checkbox" name="' + template_checkbox_toggle_id + '" id="' + template_checkbox_toggle_id + '">'
      + '  <label class="item" for="' + template_checkbox_toggle_id + '">'
      + '    <div class="material-checkbox">'
      + '      <input id="' + template_checkbox_id + '" class="for-template" tid="' + tid + '"type="checkbox">'
      + '      <label for="' + template_checkbox_id + '" class="noselect"></label>'
      + '    </div>'
      + title
      + '    <button class="dl_tree-delete-button for-template" tid="' + tid + '"><i class="material-icons">close</i></button>'
      + '  </label>'
      + '  <ul style="display: none;"></ul>'
      + '</li>';
    dl_tree.append(view);

    var template = dl_tree.find('#' + template_id);
    // 列表的展开收起功能
    template.find('input[type="checkbox"].item').unbind('change').on('change', function () {
      var checkbox = $(this);
      (checkbox.prop('checked')) ? checkbox.siblings('ul').attr('style', 'display:none;').slideDown(300) : checkbox.siblings('ul').attr('style', 'display:block;').slideUp(300);
    });

    // 模板项的删除功能
    // 删除是cart的操作，cart会去更新selected
    template.find('.dl_tree-delete-button.for-template').unbind('click').click(function () {
      var tid = $(this).attr('tid');
      cart.removeTemplate(tid);
    });

    // 模板项目的选择框
    // 选择框的更改是selected的操作，cart不变
    template.find('#' + template_checkbox_id).unbind('change').on('change', function () {
      var checkbox = $(this);
      var dl_tree = $('.dl_tree');
      if (checkbox.prop('checked')) {
        cart.selected.add(tid);
      } else {
        cart.selected.remove(tid);
      }
    });
  }

  // 添加数据到drawer，默认一定存在对应的模板
  // 这样做是因为，模板的标题在addTemplate的时候传递
  cart.addDataToDrawer = function (tid, id) {
    var li = $('#template-' + tid);
    var data_id = 'data-' + id;
    var data_checkbox_id = 'data-checkbox-' + id;
    var title = this._getStorage()[tid][id];
    if (li.find('#' + data_id).length !== 0) return;
    var data_view = ''
      + '<li id="' + data_id + '">'
      + '  <label class="noselect item nochild">'
      + '    <div class="material-checkbox">'
      + '      <input id="' + data_checkbox_id + '" type="checkbox">'
      + '      <label for="' + data_checkbox_id + '" class="noselect for-data"></label>'
      + '    </div>'
      + title
      + '<sm>/' + id + '</sm>'
      + '    <button class="dl_tree-delete-button for-data" tid="' + tid + '"did="' + id + '"><i class="material-icons">close</i></button>'
      + '  </label>'
      + '</li>';
    li.find('ul').append(data_view);
    var data = li.find('#' + data_id);
    // 删除按钮
    // 是对cart的操作，cart会去更新selected
    data.find('.dl_tree-delete-button.for-data').unbind('click').click(function () {
      var did = $(this).attr('did');
      var tid = $(this).attr('tid');
      cart.removeId(tid, did);
    });
    // 选择框
    // 是对selected的操作
    data.find('#' + data_checkbox_id).unbind('change').on('change', function () {
      var checkbox = $(this);
      if (checkbox.prop('checked')) {
        cart.selected.add(tid, id);
      } else {
        cart.selected.remove(tid, id);
      }
    });
  }

  // 只影响view
  cart.removeTemplateFromDrawer = function (tid) {
    var dl_tree = $('.dl_tree');
    var template_id = "template-" + tid;
    dl_tree.find('#' + template_id).remove();
    if (dl_tree.is(':empty'))
      dl_tree.remove();
  }

  // 只影响view
  cart.removeDataFromDrawer = function (tid, id) {
    var data_id = 'data-' + id;
    var li = $('#' + data_id);
    var obj = this._getStorage();
    if (tid in obj) {
      // 只删除自己
      li.remove();
    } else {
      // 删除模板
      this.removeTemplateFromDrawer(tid);
    }
  }

  // 对cart数据操作完毕后，更新Drawer的结构
  // 如果id为null，表示删除了整个模板
  // title只在添加新模板的数据时要用到
  // 这个函数只影响view
  cart.updateDrawer = function (tid, id, title) {
    var dl_tree = $('.dl_tree');
    if (id == null) {
      // 删除了整个模板
      this.removeTemplateFromDrawer(tid);
    } else if (this.hasId(tid, id)) {
      this.addTemplateToDrawer(tid, title);
      this.addDataToDrawer(tid, id);
    } else if (!this.hasId(tid, id)) {
      this.removeDataFromDrawer(tid, id);
    }
  }

  // 初始化数据列表的+按钮
  cart.initButtons = function () {
    $('.btn-add-to-cart').each(function (index) {
      $(this).unbind('click').click(function (event) {
        event.stopPropagation();
        var id = $(this).attr('data-id');
        var tid = $(this).attr('data-tid');
        var title = $(this).attr('data-title');
        cart.toggleId(tid, id, title);
        $(this).blur();
      });
      cart.updateButtonByView(this);
    });
  };

  // 初始化抽屉的View
  cart.initDrawer = function () {
    if (!this.isEmpty()) {
      var obj = this._getStorage();
      var tids = Object.keys(obj);
      templateNameProvider.asyncQueryName(tids, function (tid, title) {
        for (var id in obj[tid]) {
          cart.updateDrawer(tid, id, title);
        }
      }, function () {
        cart.selected._updateView();
      });
    }
  }

  // 暴露到全局
  window.cart = cart;

  // view的初始化
  cart.initButtons();
  cart.initDrawer();

  $('#btn-drawer-clear-all').click(function () {
    cart.removeAllId();
  });

  $('.drawer-button-float').click(function () {
    var type = $('#download_type').val();
    var dids = cart.selected.toArray();

    $.requestJSON({
      url: Urls.resolve('api_v1_storage:data_export'),
      data: {format: type, meta_id_list: dids},
      onSuccess: function () {
        $.showModal({
          title: gettext('Success'),
          message: gettext('An exporting task has been added to your task list. Click OK to check the progress.'),
          onOk: function () {
            window.open(Urls.resolve('task:index'));
          },
          okText: gettext('OK')
        });
      },
      onError: function (resp) {
        if (resp.status === 401) {
          var next = window.location.href.replace(window.location.origin, '');
          window.location.href = Urls.resolve('account:login') + '?next=' + next;
        }
      }
    });
  });

  $(window).bind('storage', function (e) {
    if (e.originalEvent.key === 'bridge') {
      console.log('bridge');
      var bridge = JSON.parse(e.originalEvent.newValue);
      if (bridge.type === 'addId') {
        cart._addId(bridge.tid, bridge.id, bridge.title);
      } else if (bridge.type === 'removeId') {
        cart._removeId(bridge.tid, bridge.id);
      } else if (bridge.type === 'removeTemplate') {
        cart._removeTemplate(bridge.tid);
      }
    }
  });
});

function service() { //智能客服跳转事件
  window.open('https://www.talkinggenie.com/h5/?param=C6776126512242061312','','width=600,height=800,toolbar=no, status=no, menubar=no, resizable=yes, scrollbars=yes')
}
// 注销函数
function logout() {
  $.requestJSON({
    url: Urls.resolve('api_v1_account:session_api'),
    method: 'DELETE',
    silentError: true,
    onSuccess: function (json) {
      window.location.reload();
    },
    onError: function (json) {
      console.error(json);
    }
  })
}

function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function switchLang() {
  console.log('click');
  var lang = $.getCookie('django_language');
  var other_lang = (lang == 'en' ? 'zh-hans' : 'en');
  setCookie('django_language', other_lang, 1);
  window.location.reload();
}

// // for data url
// $(function () {
//   $('div[url]').click(function () {
//     var url = $(this).attr('url');
//     window.location = url;
//   });
// });
// for edit data button
$(function () {
  $('button[data-id].btn-edit').click(function (event) {
    event.stopPropagation();
    var did = $(this).attr('data-id');
    var url = Urls.resolve('storage:add_data') + '?action=modify&did=' + did;
    window.location = url;
  })
});

$(function () {
  $('button[data-id].btn-delete-data').click(function (event) {
    event.stopPropagation();
    var did = $(this).attr('data-id');
    $.showModal({
      title: gettext('Warning'),
      message: gettext('Are you sure to delete this data?'),
      onOk: function () {
        $.ajax(Urls.resolve('api_v1_storage:data_meta_one', {mid: did}), {
          method: 'DELETE'
        }).done(function () {
          window.location = Urls.resolve('search:index');
        });
      }
    });
  });
});

$(function () {
  $.requestJSON({
    url: Urls.resolve('api_v1_service:user_visits'),
    method: 'GET',
    onSuccess: function (json) {
      $('#visits_count').text('累计访问量：'+json['data']['counts']);
    }
  });
  $.requestJSON({
    url: Urls.resolve('api_v1_service:online_user_counts'),
    method: 'GET',
    onSuccess: function (json) {
      $('#online_count').text('在线人数：'+json['data']['counts']);
    }
  })
})
