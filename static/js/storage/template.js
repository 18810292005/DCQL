/**
 * @file template.js
 * @author Yuvv
 * @date 2017/12/7
 */

/**
 * 获取 misc 内容，若解析过程种出错，则返回 null，并弹出相应notification，否则返回对应 misc 对象
 * @param {Object} $fieldRow 对应待解析的 node 部分 jQuery 对象
 * @returns {*} 返回 null 或 对应 misc
 * @private
 */
//alert("")
function parseField($fieldRow) {
  if (!($fieldRow instanceof $)) {
    $fieldRow = $($fieldRow);
  }
  var $form = $fieldRow.find('>.t-field-content>.form-inline');
  var $n = $form.find('>.form-group>input[name="name"]'),
    $r = $form.find('>.checkbox>label>input[name="required"]');

  var rVal = {t: $fieldRow.data('type'), r: $r.prop('checked'), misc: {}};
  var val1, val2, val3, val4;   // 定义几个变量后面 switch 使用

  switch ($fieldRow.data('type')) {
    case FieldTypeEnum.STRING:
      break;  // noting to do with string
    case FieldTypeEnum.NUMBER:
      val1 = $form.find('>.form-group>input[name="unit"]').val().trim();
      if (val1) {
        rVal.misc.unit = val1;
      }
      break;
    case FieldTypeEnum.RANGE:
      rVal.misc.type = parseInt($form.find('select').val());
      val1 = $form.find('input[name="unit"]').val().trim();
      if (val1) {
        rVal.misc.unit = val1;
      }
      break;
    case FieldTypeEnum.IMAGE:
    case FieldTypeEnum.FILE:
      rVal.misc.multi = $form.find('input[name="multi"]')[0].checked;
      break;
    case FieldTypeEnum.CHOICE:
      val1 = [];   // options
      val2 = [];   // groups
      $fieldRow.find('ul.t-field-content-extra:first>li.option').each(function (i, optLi) {
        val1.push($(optLi).text());
      });
      $fieldRow.find('ul.t-field-content-extra:first>li.group').each(function (i, groupLi) {
        val3 = $(groupLi);
        val4 = {name: val3.find('>b').text(), items: []};
        val3.find('>ul>li.option').each(function (ii, optLi) {
          val4.items.push($(optLi).text());
        });
        if (val4.items.length === 0) {
          Utils.flashBadField($fieldRow);
          $.notify({type: 'danger', message: gettext('Group items cannot be empty')});
          val2 = null;
          return null;
        }
        val2.push(val4);
      });
      if (val2.length === 0 && val1.length === 0) {
        Utils.flashBadField($fieldRow);
        $.notify({type: 'danger', message: gettext('You have to add at lease one option')});
        return null;
      } else if (val2 === null) {
        Utils.flashBadField($fieldRow);
        $.notify({type: 'danger', message: gettext('Group is empty, add options or remove it')});
        return null;
      }
      rVal.misc.opt = val1;
      rVal.misc.grp = val2;
      break;
    case FieldTypeEnum.ARRAY:
      val1 = $form.find('select');    // select form-control
      val2 = $fieldRow.find('.t-field-content-extra:first>.row.t-field:first');   // array node
      if (val2.length === 0) {
        $.notify({type: 'danger', message: gettext('You have to set array type')});
        Utils.flashBadField($fieldRow);
        val1.focus();
        return null;
      } else {
        rVal.misc = parseField(val2).v;   // 只需要值部分
        if (rVal.misc === null) {
          return null;
        }
      }
      break;
    case FieldTypeEnum.CONTAINER:    // 容器型也可以同样处理
    case FieldTypeEnum.GENERATOR:   // 生成器和表格可以同样处理
    case FieldTypeEnum.TABLE:
      val1 = $fieldRow.find('.t-field-content-extra:first>.row.t-field');   // table columns node
      if (val1.length === 0) {
        $.notify({type: 'danger', message: gettext('You have to add at lease one field.')});
        Utils.flashBadField($fieldRow);
        $form.find('select').focus();
        return null;
      } else {
        rVal.misc._head = [];
        val1.each(function (i, col) {
          val2 = parseField(col);
          if (val2) {
            if (rVal.misc._head.indexOf(val2.n) !== -1) {
              Utils.flashBadField(col);
              $.notify({
                type: 'danger',
                message: gettext('Field name duplicate')
              });
              return null
            }
            rVal.misc._head.push(val2.n);
            rVal.misc[val2.n] = val2.v;
          }
        });
        if (val1.length !== rVal.misc._head.length) {   // 字段长度不一致说明有错误发生
          return null;
        }
      }
      if ($fieldRow.data('type') === FieldTypeEnum.GENERATOR) {   // 生成器型更改 _head 为 _opt
        rVal.misc._opt = rVal.misc._head;
        delete rVal.misc._head;
      } else if ($fieldRow.data('type') === FieldTypeEnum.CONTAINER) {   // 容器型更改 _head 为 _ord
        rVal.misc._ord = rVal.misc._head;
        delete rVal.misc._head;
      }
      break;
    default:
      console.error('Field type wrong');
      break;
  }

  return {
    n: $n.val().trim(),
    v: rVal
  };
}

/**
 * 获取模板内容
 * @param {Object} $tFieldContainer 根容器jQuery对象
 */
function getTemplateContent($tFieldContainer) {
  var content = {_ord: []};
  var hasError = false;
  var fVal;
  var fieldRows = $tFieldContainer.find('>.t-field.row');

  for (var i = 0; i < fieldRows.length; i++) {
    fVal = parseField(fieldRows[i]);
    if (fVal === null) {
      hasError = true;
      return null;
    }
    if (content._ord.indexOf(fVal.n) !== -1) {
      Utils.flashBadField(fieldRows[i]);
      $.notify({
        type: 'danger',
        message: gettext('Field name duplicate')
      });
      hasError = true;
      return null;
    }
    content._ord.push(fVal.n);
    content[fVal.n] = fVal.v;
  }

  if (hasError) {
    return null;
  } else if (!content._ord.length) {
    $.notify({
      type: 'danger',
      message: gettext('You have to add at lease one field.')
    });
    return null;
  }
  return content;
}

/**
 * 提交模板
 * @param {Function} onDone 成功响应函数
 * @param {Function} onFail 失败响应函数
 * @param {boolean=false} publish 是否发布，默认为 false
 */
function commitTemplate(onDone, onFail, publish) {
  publish = publish || false;
  if (!$.vf.validate()) {
    return;
  }
  var tContent = getTemplateContent(rootContainer);
  if (tContent) {
    $.requestJSON({
      url: Urls.resolve('api_v1_storage:templates'),
      method: 'POST',
      data: [{
        title: tTitle.val().trim(),
        category: tCategory.val(),
        abstract: tAbstract.val().trim(),
        content: tContent,
        published: publish
      }],
      silentError: true,
      onSuccess: onDone,
      onError: onFail
    });
  }
}

/**
 * 保存模板
 * @param {Function=} onDone 成功响应函数
 * @param {Function=} onFail 失败响应函数
 * @param {boolean=false} publish 是否发布，默认为 false
 */
function saveTemplate(onDone, onFail, publish) {
  publish = publish || false;
  onDone = onDone || function (resp) {
    if (resp.data && resp.data.hasOwnProperty('succeed')) {
      window._oid = resp.data.succeed[0];
    } else {
      window._oid = resp.data;
    }
    window._saved = true;
    $.notify({
      title: 'info',
      message: gettext('Template saved!')
    });
  };
  onFail = onFail || function (resp) {
    $.notify({
      title: 'danger',
      message: gettext('Saved failed! Please check your template title or fields.')
    });
  };

  if (!window._saved) {
    commitTemplate(onDone, onFail, publish);
    return;
  }

  if (!$.vf.validate()) {
    return;
  }
  var tContent = getTemplateContent(rootContainer);
  if (tContent) {
    $.requestJSON({
      url: Urls.resolve('api_v1_storage:template_one', {tid: window._oid}),
      method: 'PATCH',
      data: {
        title: tTitle.val(),
        category: tCategory.val(),
        abstract: tAbstract.val(),
        content: tContent,
        //published: publish
      },
      onSuccess: onDone,
    });
  }
}

/**
 * 设置自动保存模板
 * @param {boolean=true} enabled 使生效/失效，默认为 true
 * @param {number=600000} interval 间隔时长，默认 10 min
 */
function autoSave(enabled, interval) {
  // interval = interval || 10 * 60 * 1000;  // 默认 10 min 一次
  //
  // var btnAutoSave = $('#btn-auto-save');
  // if (enabled && !window._SAVE_TIMER) {
  //   window._SAVE_TIMER = setInterval(function () {
  //     saveTemplate();
  //   }, interval);
  //   if (btnAutoSave.attr('data-state') === 'off') {
  //     btnAutoSave.click();
  //   }
  // } else if (!enabled && window._SAVE_TIMER) {
  //   clearInterval(window._SAVE_TIMER);
  //   window._SAVE_TIMER = undefined;
  //   if (btnAutoSave.attr('data-state') === 'on') {
  //     btnAutoSave.click();
  //   }
  // }
}

/**
 * 查看和修改操作
 * @param {string=null} action 具体的操作 `view`, `modify`, `add`
 * @param {number=null} t_ref_count 模板引用计数，在修改操作时用于警告
 */
function enableAction(action, t_ref_count) {
  if (action === 'check') {
    $('#save-template').attr('disabled', true);
    $('#commit-template').attr('disabled', true);
    $('#add-new-template').removeClass('hidden');

    //alert(action);
    $('input').attr("readonly", "readonly");//将input元素设置为readonly
    $('button').attr('disabled', true);
    $('span').attr('disabled', true);
    //$('#form-container').attr('disabled', true);

    window._committed = true;
    autoSave(false);  // 查看模式不需要自动保存

  } else if (action === 'modify') {
    // if (t_ref_count > 0) {
    //   $.showModal({
    //     title: gettext('Warning'),
    //     message: gettext('Already have data using your template, modify the operation will create a new template, the original template will not be deleted, are you sure you want to modify it?'),
    //     onOk: function () {
    //       enableAction('modify', 0);
    //       window._enterModify = true;
    //       window._saved = false;
    //       window._oid = undefined;
    //       tTitle.val(tTitle.val() + '-' + gettext('Copy'));
    //       $('#btn-enable-modify').parents('.form-group:first').remove(); // 启用编辑后删除此 开关
    //       setPublishState(false);
    //     },
    //     onHide: function () {
    //       if (!window._enterModify) {
    //         enableAction('view', 0);
    //       }
    //     }
    //   });
    // } else {
    //   $('#save-template').attr('disabled', false);
    //   $('#commit-template').attr('disabled', false);
    //   $('#add-new-template').addClass('hidden');
    //   window._committed = false;
    //   autoSave(true);
    //   $('#btn-enable-modify').parent().remove(); // 启用编辑后删除此 开关
    // }
    $('body>div.alert').remove();
    // if (t_ref_count === 0) {
    //   $.notify({
    //     message: gettext('You have entered the modifying mode, you can change controls or other attributes of this template, and then publish it.'),
    //     delay: 0
    //   });
    // } else {
    //   $.notify({
    //     message: gettext('Already have data using your template, modify the operation will create a new template, the original template will not be deleted, are you sure you want to modify it?'),
    //     delay: 0
    //   });
    // }
  }
}

function setPublishState(state) {
  var $state = $('#publish-state');
  if (state) {
    $state.removeClass('btn-warning').addClass('btn-success');
    $state.val(gettext('State') + '(' + gettext('Published') + ')');
  } else {
    $state.removeClass('btn-success').addClass('btn-warning');
    $state.val(gettext('State') + '(' + gettext('Unpublished') + ')');
  }
}

var rootContainer = $('#root-container'),
  tTitle = $('#t-title'),
  tCategory = $('#t-category'),
  tAbstract = $('#t-abstract');
$(function () {
  window._committed = false;   // 提交状态
  window._saved = false;       // 保存状态
  // 设置窗口关闭确认事件
  $(window).bind('beforeunload', function (e) {
    if (!window._committed) {
      return 'Are you sure to leave this page?';
    }
  });

  // 侧边栏滚动条
  // $('#left-sidebar').perfectScrollbar({
  //   suppressScrollX: true
  // });

  // 设置控件DnD事件、双击添加事件、tooltip事件
  $('.t-controls>.t-control').dblclick(function () {
    var item = TemplateFactory[this.dataset.type]();
    item.on(FieldDnDEvents);
    rootContainer.append(item);
  }).tooltip().on({dragstart: TemplateFieldDragDropEvents.dragstart});

  // 设置root容器DnD事件
  rootContainer.on(TemplateFieldDragDropEvents);

  // 获取所有材料分类
  getMaterialClassTree(tCategory, function (data) {
    fillMaterialClassTree(data.data, tCategory, '');
  });

  // 提交模板
  $('#commit-template').click(function (e) {
    saveTemplate(function (resp) {
      window._saved = true;
      window._committed = true;
      var fmts = gettext('Successfully created the template!\nYou can continue adding new templates or jump to the %s add data page %s to add data after this template has been approved. ');
      $.showModal({
        title: gettext('Template created!'),
        message: interpolate(fmts, ['<a href="' + Urls.resolve('storage:add_data') + '"><b>', '</b></a>'])
      });
      $('#commit-template').attr('disabled', true);
      $('#save-template').attr('disabled', true);
      autoSave(false);
      $('#add-new-template').removeClass('hidden');
      setPublishState(true);
    }, function (resp) {
      $.showModal({
        title: gettext('ERROR') + ' ' + resp.code + ': ' + resp.msg,
        message: gettext('An error has occurred! May be the template title already exists, please change and try again.')
      });
    }, true);
  });

  // // 保存模板
  // $('#save-template').click(function (e) {
  //   saveTemplate();
  // });

  // // 设置自动保存开关
  // $('#btn-auto-save').click(function () {
  //   var $this = $(this);
  //   if ($this.attr('data-state') === 'on') {
  //     $this.removeClass('btn-primary').addClass('btn-default');
  //     $this.val(gettext('AutoSave') + '(' + gettext('OFF') + ')');
  //     $this.attr('title', gettext('Click to turn on'));
  //     $this.attr('data-state', 'off');
  //     if (window._SAVE_TIMER) {
  //       autoSave(false);
  //     }
  //   } else if ($this.attr('data-state') === 'off') {
  //     $this.removeClass('btn-default').addClass('btn-primary');
  //     $this.val(gettext('AutoSave') + '(' + gettext('ON') + ')');
  //     $this.attr('title', gettext('Click to turn off'));
  //     $this.attr('data-state', 'on');
  //     if (!window._SAVE_TIMER) {
  //       autoSave(true);
  //     }
  //   }
  // });
  // // 自动保存模板 (10 min 一次)
  // autoSave(true);

  $('#add-new-template').click(function (e) {
    window._saved = false;
    window._committed = false;
    $('#commit-template').attr('disabled', false);
    $('#save-template').attr('disabled', false);
    autoSave(true);
    $('#add-new-template').addClass('hidden');
    tTitle.val('');
    tCategory.val('null');
    $('#t-category').attr('disabled', false);
    tAbstract.val('');
    setPublishState(false);
  });

  // 查阅和修改模板部分
  var action = $('#t-action');
  if (action.val() === 'restricted' || action.val() === 'modify' || action.val() === 'check') {
    $.get(Urls.resolve('api_v1_storage:template_one', {tid: action.data('tid')})).done(function (resp) {
      var data = resp.data;
      if (action.val() === 'restricted') {
        $('#t-category').attr('disabled', true);
      }
      $('body').preloader({
        text: gettext('Loading...')
      });
      if (data.published) {
        setPublishState(true);
      }
      window._oid = data.id;
      window._saved = true;
      window._t_ref_count = data.ref_count;
      setTimeout(function () {
        try {
          tTitle.val(data.title);
          tAbstract.val(data.abstract);
          tCategory.find('option[value=' + data.category_id + ']').attr('selected', true);
          data.content._ord.forEach(function (fName) {
            var field = data.content[fName];
            var fieldMaker = TemplateFactory[FieldTypeEnum._getNameByValue(field.t)];
            rootContainer.append(fieldMaker(fName, field.r, field.misc));
          });
          enableAction(action.val(), window._t_ref_count,);
        } catch (err) {
          console.error(err);
        } finally {
          $('body').preloader('remove');
        }
      }, 1000);
    }).fail(function () {
      window._jqHandled = true;
    });
  }

  // 设置 启用编辑 开关
  var enableModify = $('#btn-enable-modify');
  if (enableModify.length) {
    enableModify.click(function () {
      enableAction('modify', window._t_ref_count);
    });
  }
  var message = '<p>1.同一条数据下的不同字段应该建立在同一个模板下，不应为每个字段创建模板。</p>' +
    '<p>2.同一条数据下的不同类型的字段也应建立在同一个模板下，无需为每个类型的字段创建模板。</p>' +
    '<p>3.为提高效率，在保证数据能够正确存储的基础上，应该使模板结构简单清晰。</p>';
  var title = "模板创建须知";
  if (action.val() === 'modify') {
    title = "模板修改须知";
    message = '<p>您的模板下暂未有数据，您可以随意修改模板内容</p>';
  } else if (action.val() === 'restricted') {
    title = "模板修改须知";
    message = '<p>您的模板已有数据，因此您无法随意修改模板，只能遵循以下规则：</p>' +
      '<p>1.不能修改字段的名称和类型</p>' +
      '<p>2.不能删除字段</p>' +
      '<p>3.可以添加新的字段</p>' +
      '<p>4.可以修改字段的顺序</p>';
  }
  if (action.val() !== 'check') {
    $.showModal({
      title: title,
      message: message
    })
  }
});




