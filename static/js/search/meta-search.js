'use strict';

$(function () {
  // 首先拿到分类树
  getMaterialClassTree(null, function (data) {
    $.classTree = data.data;
    fillMaterialClassTree($.classTree, $('.tree-select'));
  });
  // 定义各种数据类型支持的操作、对应的显示字符
  var type_ops = {
    'string': {
      'contains': { type: 'string', text: gettext('contains'), default: true },
      'ncontains': { type: 'string', text: gettext('not contains') },
      'eq': { type: 'string', text: '=' },
      'neq': { type: 'string', text: '&ne;' },
      'in': { type: 'string_array', text: gettext('in') },
      'nin': { type: 'string_array', text: gettext('not in') }
    },
    'string_array': {
      'contains': { type: 'string_array', text: gettext('contains'), default: true },
      'ncontains': { type: 'string_array', text: gettext('not contains') },
      'in': { type: 'string_array', text: gettext('in') },
      'nin': { type: 'string_array', text: gettext('not in') }
    },
    'number': {
      'eq': { type: 'number', text: '=', default: true },
      'neq': { type: 'number', text: '&ne;' },
      'lt': { type: 'number', text: '&lt;' },
      'gt': { type: 'number', text: '&gt;' },
      'lte': { type: 'number', text: '&le;' },
      'gte': { type: 'number', text: '&ge;' },
      'in': { type: 'number_array', text: gettext('in') },
      'nin': { type: 'number_array', text: gettext('not in') }
    },
    'date': {
      'eq': { type: 'date', text: '=', default: true },
      'neq': { type: 'date', text: '&ne;' },
      'lt': { type: 'date', text: '&lt;' },
      'gt': { type: 'date', text: '&gt;' },
      'lte': { type: 'date', text: '&le;' },
      'gte': { type: 'date', text: '&ge;'
        /*'in': { type: 'date_array' },
        'nin': { type: 'date_array' }*/
        /* 暂时不支持in 和 nin */
      } },
    'category': {
      'eq': { type: 'category', text: '=', default: true },
      'neq': { type: 'category', text: '&ne;' }
    }
  };

  function metaArgProvider(callback) {
    var list = {
      title: { path: ['title'], type: 'string', text: gettext('Title'), default: true },
      doi: { path: ['doi'], type: 'string', text: gettext('DOI') },
      abstract: { path: ['abstract'], type: 'string', text: gettext('Abstract') },
      purpose: { path: ['purpose'], type: 'string', text: gettext('Purpose') },
      author: { path: ['author'], type: 'string', text: gettext('Author') },
      source: { path: ['source'], type: 'string', text: gettext('Source') },
      project: { path: ['project'], type: 'string', text: gettext('Project') },
      reference: { path: ['reference'], type: 'string', text: gettext('Reference') },
      others: { path: ['others'], type: 'string', text: gettext('Others') },
      created: { path: ['created'], type: 'date', text: gettext('Created') },
      views: { path: ['views'], type: 'number', text: gettext('Views') },
      score: { path: ['score'], type: 'number', text: gettext('Score') },
      keywords: { path: ['keywords'], type: 'string_array', text: gettext('Keywords') },
      category: { path: ['category'], type: 'category', text: gettext('Category') }
    };
    // callback 格式： list, 默认value
    callback(list);
  }

  function setValueContainer(parent, type) {
    var string_array_placeholder = gettext('Separate keywords with commas.');
    var number_array_placeholder = gettext('Separate numbers with commas');
    var containers = {
      'string': '<input class="form-control arg-value"></input>',
      'number': '<input class="form-control arg-value" type="number" min="0" max="100"></input>',
      'date': '<input class="form-control arg-value" type="date"></input>',
      'string_array': '<input class="form-control arg-value" placeholder="' + string_array_placeholder + '"></input>',
      'number_array': '<input type="text" class="form-control arg-value" placeholder="' + number_array_placeholder + '"></input>',
      'category': '<select class="form-control arg-value tree-select"><option value="-1">----- ' + gettext('Select a category') + ' -----</option></select>'
    };
    parent.empty();
    var obj = $(containers[type]);
    obj.attr('value_type', type).appendTo(parent);
    // 如果是分类，那么还要进行一次设置
    if (type === 'category' && $.classTree) {
      fillMaterialClassTree($.classTree, obj);
    }
  }

  // 当操作符改变的时候调用此函数
  // item为jquery对象
  function onOpChange(arg_list, item) {
    // 首先查询到path，然后获取对应的参数类型
    var arg_type = arg_list[item.find('.arg-path').val()].type;
    // 查询到操作符
    var op = item.find('.arg-op').val();
    // 从参数类型、操作符得到操作数类型
    var value_type = type_ops[arg_type][op].type;
    setValueContainer(item.find('.arg-value-parent'), value_type);
  }
  // 当path改变时调用此函数
  function onPathChange(arg_list, item) {
    // 设置path用于合成json时查询
    item.attr('path', arg_list[item.find('.arg-path').val()].path.join(','));
    // 然后设置op
    var op_type = arg_list[item.find('.arg-path').val()].type;
    var ops = type_ops[op_type];
    var op = item.find('.arg-op');
    op.empty();
    for (var i in ops) {
      $('<option value="' + i + '" ' + (ops[i].default ? 'selected="selected"' : '') + '>' + ops[i].text + '</option>').appendTo(op);
    }
    onOpChange(arg_list, item);
  }

  // 传入对应容器的id，然后添加一个新的list到尾部
  function createNewMetaItem(id) {
    var meta_arg_template = '\n      <div class="row arg-list">\n        <div class="col-sm-2 col-xs-8 slim-padding">\n          <select class="form-control arg-path"></select>\n        </div>\n        <div class="col-sm-2 col-xs-4 slim-padding">\n          <select class="form-control arg-op"></select>\n        </div>\n        <div class="col-sm-7 col-xs-10 slim-padding arg-value-parent"></div>\n        <div class="col-sm-1 col-xs-2 slim-padding">\n          <button class="form-control btn btn-danger arg-action">\n            <i class="fa fa-close" aria-hidden="true"></i>\n          </button>\n        </div>\n      </div>';

    var new_item = $(meta_arg_template);
    metaArgProvider(function (list) {
      // 首先设置path
      for (var i in list) {
        var option = $('<option value="' + i + '">' + list[i].text + '</option>');
        if (list[i].default) {
          option.attr('selected', 'selected');
        }
        option.appendTo(new_item.find('.arg-path'));
      }
      new_item.find('.arg-path').change(function () {
        return onPathChange(list, new_item);
      });
      new_item.find('.arg-op').change(function () {
        return onOpChange(list, new_item);
      });
      new_item.find('.arg-action').click(function () {
        $(this).parents('.arg-list').remove();
        if ($('#meta-container').children().length == 0) {
          $('#btn-clear-all').attr('disabled', true);
        }
      });
      new_item.appendTo($('#' + id));
      onPathChange(list, new_item);
    });
  }
  createNewMetaItem('meta-container');

  $('#btn-add-new').click(function () {
    $('#btn-clear-all').removeAttr('disabled');
    return createNewMetaItem('meta-container');
  });
  $('#btn-clear-all').click(function () {
    $('#btn-clear-all').attr('disabled', true);
    return $('#meta-container').empty();
  });

  function args2Array(container) {
    var items = container.children();
    var result = [];
    for (var i = 0; i < items.length; ++i) {
      var op = $(items[i]).find('.arg-op').val();
      var path = $(items[i]).attr('path').split(',');
      var value_type = $(items[i]).find('.arg-value').attr('value_type');
      var value = $(items[i]).find('.arg-value').val();
      if (value === '') continue;
      if (value_type === 'string') {
        result.push({ path: path, op: op, value: value });
      } else if (value_type === 'number') {
        result.push({ path: path, op: op, value: Number(value) });
      } else if (value_type === 'category') {
        if (value === '-1') continue;
        result.push({ path: path, op: op, value: Number(value) });
      } else if (value_type === 'date') {
        var date = new Date(value);
        var year = date.getFullYear().toString();
        var month = date.getMonth() + 1 < 10 ? '0' + date.getMonth() : date.getMonth();
        var day = date.getDate() + 1 < 10 ? '0' + date.getDate() : date.getDate();
        result.push({ path: path, op: op, value: year + '-' + month + '-' + day });
      } else if (value_type === 'string_array') {
        result.push({ path: path, op: op, value: value.split(',').map(function (s) {
            return s.trim();
          }) });
      } else if (value_type === 'number_array') {
        var arr = value.split(',').map(function (s) {
          return Number(s);
        });
        if (arr.includes(NaN)) throw gettext('Invalid number.');
        result.push({ path: path, op: op, value: arr });
      }
    }
    return result;
  }
  // TEMPLATE 部分
  // 分类选择改变后，获取对应的模板列表
  $('#category').change(function () {
    var temp_list = $('#template-list');
    temp_list.empty();
    if ($(this).val() === '-1') return;

    $.get(Urls.resolve('api_v1_storage:templates'), {
      per_page: 100,
      category: $(this).val(),
      meta_only: true
    }).done(function (resp) {
      if (resp.data.length === 0) {
        $.notify({
          type: 'warning',
          message: gettext('There are no templates under the current category!')
        });
        return;
      }
      temp_list.append('<option value="-1">----- ' + gettext('Select a template') + ' -----</option>');
      $.each(resp.data, function (i, it) {
        temp_list.append('<option value="' + it.id + '">' + it.title + '</option>');
      });
    });
  });

  $('#template-list').change(function () {
    if ($(this).val() === '-1') {
      // 清空值列表
      return;
    }
    // 否则更新值列表供树结构使用
  });

  function templateArgs2Array() {
    return [];
  }

  $('#btn-template-picker').click(function () {
    var modal = $('#modal-template-picker');
    modal.find('.md-close').unbind('click').click(function () {
      modal.removeClass('md-show');
      // 这里添加点击的代码
    });
    $('.md-overlay').unbind('click').click(function () {
      modal.removeClass('md-show');
    });
    modal.addClass('md-show');
  });

  // 设置搜索按钮功能
  $('#btn-search').click(function () {
    try {
      var q = {
        'tid': cur_temp_id,
        'meta': args2Array($('#meta-container')),
        'template': constructTempParam(collect_filter_data())
      };
      if (q.meta.length === 0 && q.template.length === 0) return;
      var params = {
        type: 'mix',
        query: $.base64.btoa(JSON.stringify(q), true),
        page: 1
      };
      console.log(q);
      window.open(Urls.resolve('search:search') + '/?' + $.param(params));
    } catch (e) {
      $.showModal({ message: e });
    }
  });
});
