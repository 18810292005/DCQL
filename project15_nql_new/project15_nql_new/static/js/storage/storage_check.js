/**
 * @file storage.js
 * @author Yuvv
 * @date 2017/12/7
 */

// 各类工具函数
var Utils = {
  /**
   * 删除 that 对象的 parent
   * @param {Object} that 删除图片或按钮的document对象
   */
  removeP: function (that) {
    $(that).parent().remove();
  },
  /**
   * 删除 that 对象的 parent.parent
   * @param {Object} that 删除图片或按钮的document对象
   */
  removePP: function (that) {
    $(that).parent().parent().remove();
  },
  /**
   * 删除 that 对象的第 n 个 parent
   * @param {Object} that 删除图片或按钮的document对象
   * @param {number} n 父级个数
   */
  removeNP: function (that, n) {
    var $that = $(that);
    while (n > 0) {
      $that = $that.parent();
      n -= 1;
    }
    $that.remove();
  },
  /**
   * 闪烁提示错误字段 (对目标添加 .bad 类)
   * @param {Object} field 字段 document 或 jQuery 对象
   * @param {string=} el jQuery选择其，如果 field 不是该选择器，则向上层查找第一个
   */
  flashBadField: function (field, el) {
    if (!(field instanceof $)) {
      field = $(field);
    }
    if (el && !field.is(el)) {
      field = field.parents(el + ':first');
    }
    field.addClass('bad')
        .fadeIn(100).fadeOut(100)
        .fadeIn(100).fadeOut(100)
        .fadeIn(100, function () {
          field.removeClass('bad');
        });
  },
  /**
   * 删除指定 id 的文件，包括图片和文件类型
   * @param {Array} urls 文件 url 的数组
   */
  deleteFile: function (urls) {
    $.ajax({
      url: Urls.resolve('api_v1_storage:data_content_file'),
      method: 'DELETE',
      data: JSON.stringify(urls),
      dataType: 'json',
      contentType: 'application/json'
    });
  },
  uploadFile: function (input) {
    console.log('Deprecated, DO NOT USE!');
    var $input = $(input);
    var fType = input.accept.startsWith('image') ? 'image' : 'file';
    var urls = $input.data('urls') || [];
    if (urls.length) {
      Utils.deleteFile(urls);
      $input.data('urls', []);
    }
    if (input.files.length === 0) {
      $input.data('urls', []);
      return;
    }
    var formData = new FormData(),
        fLength = 0;  // 为辣鸡 safari/ie/edge 设置的flag;
    $.each(input.files, function (i, file) {
      if (file.size > 100 * 1024 * 1024) {   // 文件最大只能 100 MB
        $.notify({
          type: 'warning',
          message: gettext('Your file is large than 100MB, it will be ignored.')
        });
        return
      }
      formData.append('files[]', file);
      fLength += 1;
    });
    if (fLength < 1) {
      return;   // 说明formData中没有任何数据
    }
    $('body').preloader({
      text: gettext('Uploading...'),
      percent: '0'
    });
    formData.append('type', fType);
    $.ajax({
      url: Urls.resolve('api_v1_storage:data_content_file'),
      data: formData,
      processData: false,
      contentType: false,
      type: 'POST',
      xhr: function () {
        var myXhr = $.ajaxSettings.xhr();
        if (myXhr.upload) {
          myXhr.upload.addEventListener('progress', function (e) {
            if (e.lengthComputable) {
              var complete = (e.loaded / e.total * 100 | 0);
              $('body').preloader('update', {
                percent: complete.toString(),
                text: gettext('Uploading...')
              });   // 更新loading进度
            }
          }, false);
        }
        return myXhr;
      }
    }).done(function (data) {
      $input.data('urls', data.data);
    }).fail(function (data) {
      data.msg = data.msg || 'ERROR! ';
      $.notify({
        type: 'danger',
        message: data.msg + '\n' + gettext('Upload failed, please reselect files.')
      });
    }).always(function () {
      $('body').preloader('remove');
    });
  },
  /**
   * 伪文件选择框点击事件，触发真的文件选择框点击事件
   * @param {Object} that 文件选择框选择按钮对象
   */
  chooseFile: function (that) {
    $(that).parent().parent().children('input:first-child').click();
  },
  /**
   * 真文件选择框的change事件（此处将文件名显示到伪文件选择框）
   * @param {Object} that 真的文件选择框的 document 对象
   */
  afterChooseFile: function (that) {
    var viewInput = $(that).next('input');
    var name = that.files.length ? that.files[0].name : '';
    viewInput.val(name);
  },
  /**
   * 判断当前输入框中的值是否与已有值重复（最多只能有两级），若重复会弹出错误通知
   * @param {Object} $input 所对应的输入框的 jQuery 对象
   * @param {boolean=false} group 是否为添加 group，默认为false
   * @returns {boolean} 能为 true，不能为 false
   */
  canAppend: function ($input, group) {
    if (!$input.val().trim()) {
      $.notify({type: 'danger', message: gettext('Option/Group name cannot be null or spaces.')});
      Utils.flashBadField($input, '.t-field');
      return false;
    }

    group = group || false;
    var $root, el;
    if (group) {
      $root = $input.parents('ul:first');
      el = '>li.group>b';    // group 只要同意层级分组名不同即可
    } else {
      $root = $input.parents('ul.t-field-content-extra:first');
      el = 'li.option';     // 选项需要全局都不同
    }

    var lis = $root.find(el);
    for (var i = 0; i < lis.length; i++) {
      if ($(lis[i]).text().trim() === $input.val().trim()) {
        $.notify({type: 'danger', message: gettext('Option/Group name duplicate')});
        Utils.flashBadField($input, '.t-field');
        return false;
      }
    }

    return true;
  },
  /**
   * 在输入框中输入值后按下 enter 键添加 option
   * @param {Object} e 键盘 key up 事件
   * @param {Object} that 对应输入框 document 对象
   */
  appendOptionByKeyUp: function (e, that) {
    var $input = $(that);
    if (e.which === 13 && Utils.canAppend($input)) {
      $input.parent().parent().before(TemplateFactory._CHOICE_LI({type: 'option', name: that.value.trim()}));
      $input.val('').focus();  // 可添加则清空输入并 focus
    }
  },
  /**
   * 点击添加选项按钮添加对应选项
   * @param {Object} that 对应输入框 document 对象
   */
  appendOptionByClick: function (that) {
    var $that = $(that);
    var $input = $that.prev().children('input:first-child');
    if (Utils.canAppend($input)) {
      $(that).parent().before(TemplateFactory._CHOICE_LI({type: 'option', name: $input.val()}));
      $input.val('').focus();  // 可添加则清空输入并 focus
    }
  },
  /**
   * 点击添加分组按钮添加对应分组
   * @param {Object} that 对应输入框 document 对象
   */
  appendGroup: function (that) {
    var $that = $(that);
    var $input = $that.prev().prev().children('input:first-child');
    if (Utils.canAppend($input, true)) {
      var $groupLi = $(TemplateFactory._CHOICE_LI({type: 'group', name: '<b>' + $input.val() + '</b>'}));
      $groupLi.append(TemplateFactory._CHOICE_SCOPE({addGroup: false}));
      $that.parent().before($groupLi);
      $input.val('').focus();  // 可添加则清空输入并 focus
    }
  },
  /**
   * 点击添加数组类型，每次点击会清空原有内容（数组选项类型唯一）
   * @param {Object} that 对应按钮 document 对象
   */
  setArrayType: function (that) {
    var $that = $(that);
    var $select = $that.prev().find('select:first');
    var $cttExtra = $that.parents('.t-field-content:first').find('>.t-field-content-extra');
    $cttExtra.children().remove();    // 清空原有内容
    var selTypeName = FieldTypeEnum._getNameByValue(parseInt($select.val()));
    var $field = TemplateFactory[selTypeName]();
    $field.find('.t-field-content>.form-inline>.form-group>input[name="name"]').attr('disabled', true)
        .attr('placeholder', gettext('You don\'t need to fill this field'));    // 字段名不需要设置
    $cttExtra.append($field);
  },
  /**
   * 点击添加一列（创建模板部分需要，生成器类型也用到此函数）
   * @param {Object} that 对应按钮 document 对象
   */
  addTableCol: function (that) {
    var $that = $(that);
    var $select = $that.prev().find('select:first');
    var $cttExtra = $that.parents('.t-field-content:first').find('>.t-field-content-extra');
    var selTypeName = FieldTypeEnum._getNameByValue(parseInt($select.val()));
    var $field = TemplateFactory[selTypeName]();
    $cttExtra.append($field);
  },
  /**
   * 点击添加一行（提交数据过程中表格型数据添加行）
   * @param {Object} that 对应按钮 document 对象
   */
  appendRow: function (that) {
    var $that = $(that);
    var blank = 0;    // 记录空值数目并给出相应提示
    var hasError = false;
    var $tr = $('<tr><td>' + FormFieldFactory._DELETE_ICON({
      title: gettext('Delete this row'),
      clk: 'Utils.removePP(this)'
    }) + '</td></tr>');   // 预先添加了删除列
    var $fgs = $that.parent().siblings('div').find('>.form-group');
    $fgs.each(function (i, fg) {
      if (hasError) return;
      var $fcs = $(fg).find('input.form-control,select.form-control,span.input-group-addon');
      var $fg = $(fg);
      var val1, val2;  // 定义两个变量供后面使用
      switch ($fg.data('type')) {
        case FieldTypeEnum.STRING:
        case FieldTypeEnum.NUMBER:
        case FieldTypeEnum.CHOICE:
          val1 = $fcs.val().trim();
          if (!val1) {
            blank += 1;
          }
          $tr.append('<td>' + $fcs.val() + '</td>');
          break;
        case FieldTypeEnum.RANGE:
          val1 = $fcs[0].value;
          val2 = $fcs[2].value;
          if (!val1 || !val2) {
            blank += 1;
          }
          val1 = val1 || 0;
          val2 = val2 || 0;
          $tr.append('<td>' + $fcs.first().val() + $fcs[1].textContent + $fcs[2].value + '</td>');
          break;
        case FieldTypeEnum.IMAGE:
        case FieldTypeEnum.FILE:
          var urls = $fcs.data('urls') || [];
          var $td = $('<td></td>');
          val1 = $fcs.val();
          if (!val1) {
            blank += 1;
            $tr.append($td);
            break;
          }
          var media_prefix=$('meta[name=media-url-prefix]').attr('content');
          urls.forEach(function (url, i) {
            var $lnk;
            if ($(fg).data('type') === FieldTypeEnum.FILE) {
              $lnk = $('<a target="_blank"></a>');
              $lnk.text($fcs.prop('files')[i].name);
              $lnk.attr('href', url);
            } else {
              $lnk = $('<img class="img-thumbnail mge-thumbnail" src="' + media_prefix + url + '">');
              $lnk.attr('title', $fcs.prop('files')[i].name);
              $lnk.attr('mge_url', url);
            }
            // $lnk.data('id', id.id);
            $td.append($lnk);
          });
          $tr.append($td);
          break;
        default:
          console.error('Row fields wrong!');
          break;
      }
      if ($fcs.attr('required') && !val1) {
        Utils.flashBadField(fg);
        hasError = true;
        $fcs.focus();
        $.notify({
          type: 'danger',
          message: gettext('This field cannot be null.')
        });
        return null;
      }
      if ($fg.data('type') === FieldTypeEnum.RANGE && val1 && val2) {
        val1 = parseFloat(val1);
        val2 = parseFloat(val2);
        if ($fcs[1].textContent === '±' && (Math.abs(val1) <= val2 || val2 < 0)) {    // 误差型第一个绝对值大于第二个，且第二个大于等于 0
          $.notify({
            type: 'danger',
            message: gettext('Abstract value of first must large than second and second value must large than 0')
          });
          Utils.flashBadField(fg, '.form-group');
          hasError = true;
          return null;
        } else if ($fcs[1].textContent === '~' && val1 > val2) {    // 区间第一个值要小于等于第二个
          $.notify({
            type: 'danger',
            message: gettext('First value must less than or equal to second value')
          });
          Utils.flashBadField(fg, '.form-group');
          hasError = true;
          return null;
        }
      }
    });
    if (hasError) {
      return null;
    } else if ($fgs.length <= blank) {
      $.notify({
        type: 'danger',
        message: gettext('Fields are empty!')
      });
    } else {
      $fgs.find('input[type=file]').each(function (i, input) {
        $(input).data('urls', []);   // 添加后将文件部分值置为空
        input.value = null;
      });
      if (blank > 0) {
        $.notify({
          type: 'warning',
          message: gettext('Some fields are empty!')
        });
      }
      $that.parents('.panel-body:first').find('table>tbody').append($tr);
    }
  },
  addArrayItem: function (that) {
    var $that = $(that);
    var $thatP = $that.parent();
    var $thatPS = $thatP.siblings();
    var name = '#' + $thatPS.length;      // 因为包含一个dividing所以数目刚好
    var $panel = $that.parents('.panel:first');
    var itemMaker = FormFieldFactory[FieldTypeEnum._getNameByValue($panel.data('arrType'))];
    var $item = itemMaker(name, $panel.data('arrRequired'),  $panel.data('arrTypeMisc'));
    var el = $item.hasClass('row') ? '.form-group>label:first' : '.panel-title:first';
    $item.find(el).append(FormFieldFactory._DELETE_ICON({
      title: gettext('Delete this field'),
      clk: 'Utils.delArrayItem(this)'
    }));   // 添加删除按钮
    $thatP.prev().before($item);
  },
  delArrayItem: function (that) {
    var $that = $(that);
    var elItem = $that.prev().length ? '.panel' : '.row';
    var $item = $that.parents(elItem + ':first');
    var $sib = $item.siblings(elItem);
    if ($sib.length) {   // 重新调整序号
      var $nexts = $item.nextAll(elItem);
      var startIdx = $sib.length - $nexts.length + 1;
      $nexts.each(function (i, item) {
        var $item = $(item);
        var $serial;
        if ($item.hasClass('row')) {
          $serial = $item.find('.form-group>label:first');
          var $icon = $serial.find('>i');
          $serial.text('#' + startIdx).append($icon);
        } else {
          $serial = $item.find('.panel-title>a:first');
          $serial.text('#' + startIdx);
        }
        startIdx += 1;
      });
      $item.remove();
    } else {
      $.notify({
        type: 'warning',
        message: gettext('You can\'t delete any more')
      });
    }
  },
  genDataField: function (that) {
    var $sel = $(that);
    var $panel = $sel.parents('.panel:first');
    var $panelBody = $panel.find('.panel-body');
    $panelBody.find('.dividing-small').nextAll().remove();
    var option = $panel.data('options')[$sel.val()];
    $panelBody.append(FormFieldFactory[FieldTypeEnum._getNameByValue(option.t)]($sel.val(), option.r, option.misc));
  },
  moveRowDown: function (that) {
    var $row = $(that).parent().parent();
    var $nextRow = $row.next('.row.t-field');
    if ($nextRow.length > 0) {
      $nextRow.after($row);
    }
  },
  moveRowUp: function (that) {
    var $row = $(that).parent().parent();
    var $prevRow = $row.prev('.row.t-field');
    if ($prevRow.length > 0) {
      $prevRow.before($row);
    }
  }
};

// 字段类型枚举
var FieldTypeEnum = {
  STRING: 1,      // 字符串型
  NUMBER: 2,      // 数值型
  RANGE: 3,      // 范围型
  IMAGE: 4,      // 图片型
  FILE: 5,      // 文件型
  CHOICE: 6,      // 候选型
  ARRAY: 7,      // 数组型
  TABLE: 8,      // 表格型
  CONTAINER: 9,   // 容器型
  GENERATOR: 10,  // 生成器型
  /**
   * 获取枚举类型映射
   * @param {Array=} exclude 需要排除的字段
   * @returns {Array} 结果为 {name: "name", val: "val"} 的数组
   * @private
   */
  _getMapping: function (exclude) {
    exclude = exclude || [];
    var mapping = [];
    for (var k in this) {
      if (this.hasOwnProperty(k) && k[0] !== '_') {
        if (exclude.indexOf(this[k]) === -1) {
          mapping.push({
            name: gettext(k),    // 别忘了此处的国际化
            val: this[k]
          });
        }
      }
    }
    return mapping;
  },
  /**
   * 通过枚举值获取名称
   * @param {number} val 枚举值
   * @returns {*}
   * @private
   */
  _getNameByValue: function (val) {
    for (var k in this) {
      if (this[k] === val) {
        return k;
      }
    }
    return null;
  }
};

// container上的拖拽事件函数
var TemplateFieldDragDropEvents = {
  dragstart: function (e) {
    if (e.target.id === 'root-container' || e.target !== e.currentTarget) {
      e.preventDefault();
      return false;
    }
    e.originalEvent.dataTransfer.setData('text', e.target.dataset.type);
  },
  dragenter: function (e) {
    $(this).addClass('enter');
  },
  dragover: function (e) {
    e.preventDefault();
    if (e.target !== e.currentTarget) {
      $(this).removeClass('enter');
    } else {
      $(this).addClass('enter');
    }
  },
  dragleave: function (e) {
    $(this).removeClass('enter');
  },
  drop: function (e) {
    $(this).removeClass('enter');
    if (e.target !== e.currentTarget) {
      return;
    }
    var $this = $(this);
    var itemType = e.originalEvent.dataTransfer.getData('text');
    var item = TemplateFactory[itemType]();
    item.on(FieldDnDEvents);
    $this.append(item);
  }
};

// 模板字段上的拖拽事件函数
var FieldDnDEvents = {
  dragover: function (e) {
    e.preventDefault();
    var $that = $(this);
    if (e.target !== e.currentTarget) {
      $that.removeClass('before after');
      return;
    }
    if (e.offsetY > $that.height() / 2) {
      $that.removeClass('before').addClass('after');
    } else {
      $that.removeClass('after').addClass('before');
    }
  },
  dragleave: function (e) {
    $(this).removeClass('before after');
  },
  dragend: function (e) {
    $(this).removeClass('before after');
  },
  drop: function (e) {
    var $that = $(this);
    if (e.target !== e.currentTarget) {
      $that.removeClass('before after');
      return;
    }
    var itemType = e.originalEvent.dataTransfer.getData('text');
    var item = TemplateFactory[itemType]();
    item.on(FieldDnDEvents);
    if ($that.hasClass('before')) {
      $that.before(item);
    } else {
      $that.after(item);
    }
    $that.removeClass('before after');
  }
};

// 创建模板部分产生各式各样的 jQuery 对象和 doT 模板
var TemplateFactory = {
  _CHECK_FORM: doT.compile('<div class="checkbox" disabled="disabled"><label><input type="checkbox" disabled="disabled" name="{{=it.name}}" {{?it.chk}}checked{{?}}>{{=it.label}}</label></div>'),
  _CONTEXTUAL_SCOPE: doT.compile('<p style="display:none" class="bg-{{=it.type||\'info\'}}">{{=it.message}}{{?!it.stay}}<button type="button" class="close" aria-label="Close" onclick="Utils.removeP(this)"><span aria-hidden="true">&times;</span></button>{{?}}</p>'),
  _CHOICE_SCOPE: doT.compile('<ul><li class="tools" style="display:none"><div  class="col-xm-3 col-xs-3"><input class="form-control input-sm" onkeyup="Utils.appendOptionByKeyUp(event,this)" placeholder="' + gettext('Press Enter to add option') + '"></div><button class="btn btn-sm btn-default" onclick="Utils.appendOptionByClick(this)"  style="display:none">' + gettext('Add option') + '</button>{{?it.addGroup}}<button class="btn btn-sm btn-default" onclick="Utils.appendGroup(this)" style="display:none">' + gettext('Add group') + '</button>{{?}}</li></ul>'),
  _CHOICE_LI: doT.compile('<li class="{{=it.type}}">{{=it.name}}<i class="fa fa-remove" onclick="Utils.removeP(this)" style="display:none"></i></li>'),
  _getNameField: function (n) {
    var $nameInput = $(FormFieldFactory._TEXT_INPUT({name: 'name', val: n, plh: gettext('Field name')}));
    $nameInput.attr('data-vf', true);
    $nameInput.data('vfRegex', '^$|^_.*|.*\\..*');    // 字段名不能为空、空白、以下划线开头、包含 .
    $nameInput.data('vfInverse', true);
    $nameInput.data('vfHelp', gettext('Field name cannot be empty or start with `_` or contains `.`'));
    var $fg = $(FormFieldFactory._FORM_GROUP);
    $fg.append(FormFieldFactory._FORM_LABEL({lb: gettext('Name')}));
    $fg.append($nameInput);
    return $fg;
  },

  _wrapTFieldRow: function (type, inlineCtt, extraCtt, n, r) {
    var $field = $(FormFieldFactory._ROW_WRAP).addClass('t-field'),
        $fieldLbCol = $(FormFieldFactory._FORM_WIDTH_WRAP({lg: 2, md: 2, sm: 2, xs: 2})).addClass('t-field-label'),
        moveDownIcon = '<i class="fa fa-chevron-down"  title="' + gettext('Down') + '" onclick="Utils.moveRowDown(this)" style="display:none"></i>',
        moveUpIcon = '<i class="fa fa-chevron-up"  title="' + gettext('Up') + '" onclick="Utils.moveRowUp(this)" style="display:none"></i>',
        delIcon = FormFieldFactory._DELETE_ICON({clk: 'Utils.removePP(this)'}),
        fieldLb = '<span class="label label-primary">' + gettext(FieldTypeEnum._getNameByValue(type)) + '</span>',
        $fieldCttCol = $(FormFieldFactory._FORM_WIDTH_WRAP({
          lg: 10,
          md: 10,
          sm: 10,
          xs: 10
        })).addClass('t-field-content'),
        $formInline = $(FormFieldFactory._FORM_INLINE);

    $formInline.append(TemplateFactory._getNameField(n || ''))
        .append(TemplateFactory._CHECK_FORM({name: 'required', chk: r, label: gettext('Required')}));
    if (inlineCtt) {
      $formInline.append(inlineCtt);
    }
    $fieldCttCol.append($formInline);
    if (extraCtt) {
      $fieldCttCol.append(extraCtt);
    }
    $fieldLbCol.append(moveUpIcon).append(moveDownIcon).append(delIcon).append(fieldLb);
    $field.append($fieldLbCol).append($fieldCttCol);
    $field.data('type', type);
    return $field;
  },
  _wrapFormGroup: function (label, formControl) {
    return $(FormFieldFactory._FORM_GROUP)
        .append(FormFieldFactory._FORM_LABEL({lb: label}))
        .append(formControl);
  },
  /**
   * 获取 string 类型字段
   * @param {string=} n 字段名称，默认为空
   * @param {boolean=false} r 是否必填，默认为 false
   * @return {*|jQuery|HTMLElement}
   */
  getString: function (n, r) {
    n = n || '';
    r = r || false;
    return TemplateFactory._wrapTFieldRow(FieldTypeEnum.STRING, '', '', n, r);
  },
  /**
   * alias of getString
   */
  STRING: function (n, r) {
    return TemplateFactory.getString(n, r);
  },
  /**
   * 获取 number 类型字段
   * @param {string=} n 字段名称，默认为空
   * @param {boolean=false} r 是否必填，默认为 false
   * @param {string=} unit 数值单位，默认为空
   * @return {*|jQuery|HTMLElement}
   */
  getNumber: function (n, r, unit) {
    n = n || '';
    r = r || false;
    unit = unit || '';
    var $fg = $(FormFieldFactory._FORM_GROUP)
        .append(FormFieldFactory._FORM_LABEL({lb: gettext('Unit')}))
        .append(FormFieldFactory._TEXT_INPUT({name: 'unit', val: unit, plh: gettext('Unit')}));
    return TemplateFactory._wrapTFieldRow(FieldTypeEnum.NUMBER, $fg, '', n, r);
  },
  /**
   * alias of getNumber
   */
  NUMBER: function (n, r, misc) {
    misc = misc || {};
    return TemplateFactory.getNumber(n, r, misc.unit);
  },
  /**
   * 获取 range 类型字段
   * @param {string=} n 字段名称，默认为空
   * @param {boolean=false} r 是否必填，默认为 false
   * @param {number=0} rangeType 范围型数据类型，默认为 0
   * @param {string=} unit 数值单位，默认为空
   * @return {*|jQuery|HTMLElement}
   */
  getRange: function (n, r, rangeType, unit) {
    n = n || '';
    r = r || false;
    rangeType = rangeType || 0;
    unit = unit || '';
    var $ctt = $();
    var $fgSel = $(FormFieldFactory._FORM_GROUP)
        .append(FormFieldFactory._FORM_LABEL({lb: gettext('Type')}))
        .append(FormFieldFactory._SELECT_INPUT2({
          name: 'type',
          sel: rangeType,
          opts: [{name: gettext('Interval'), val: 0}, {name: gettext('Error'), val: 1}]
        }));
    $ctt = $ctt.add($fgSel);
    var $fgUnt = $(FormFieldFactory._FORM_GROUP)
        .append(FormFieldFactory._FORM_LABEL({lb: gettext('Unit')}))
        .append(FormFieldFactory._TEXT_INPUT({name: 'unit', val: unit, plh: gettext('Unit')}));
    $ctt = $ctt.add($fgUnt);
    return TemplateFactory._wrapTFieldRow(FieldTypeEnum.RANGE, $ctt, '', n, r);
  },
  /**
   * alias of getRange
   */
  RANGE: function (n, r, misc) {
    misc = misc || {};
    return TemplateFactory.getRange(n, r, misc.type, misc.unit);
  },
  /**
   * 获取 image 类型字段
   * @param {string=} n 字段名称，默认为空
   * @param {boolean=false} r 是否必填，默认为 false
   * @param {boolean=false} multi 是否允许多个图片，默认为 false
   * @return {*|jQuery|HTMLElement}
   */
  getImage: function (n, r, multi) {
    n = n || '';
    var multiField = TemplateFactory._CHECK_FORM({label: gettext('Multiple Images'), name: 'multi', chk: multi});
    return TemplateFactory._wrapTFieldRow(FieldTypeEnum.IMAGE, multiField, '', n, r);
  },
  /**
   * alias of getImage
   */
  IMAGE: function (n, r, misc) {
    misc = misc || {};
    return TemplateFactory.getImage(n, r, misc.multi);
  },
  /**
   * 获取 file 类型字段
   * @param {string=} n 字段名称，默认为空
   * @param {boolean=false} r 是否必填，默认为 false
   * @param {boolean=false} multi 是否允许多个图片，默认为 false
   * @return {*|jQuery|HTMLElement}
   */
  getFile: function (n, r, multi) {
    n = n || '';
    var multiField = TemplateFactory._CHECK_FORM({label: gettext('Multiple Files'), name: 'multi', chk: multi});
    return TemplateFactory._wrapTFieldRow(FieldTypeEnum.FILE, multiField, '', n, r);
  },
  /**
   * alias of getFile
   */
  FILE: function (n, r, misc) {
    misc = misc || {};
    return TemplateFactory.getFile(n, r, misc.multi);
  },
  /**
   * 获取 choice 类型字段
   * @param {string=} n 字段名称，默认为空
   * @param {boolean=false} r 是否必填，默认为 false
   * @param {Array=} opts 选项数组，默认为空数组
   * @param {Array.<Object>=} grps 分组选项数组，默认为空数组
   * @return {*|jQuery|HTMLElement}
   */
  getChoice: function (n, r, opts, grps) {
    n = n || '';
    opts = opts || [];
    grps = grps || [];
    var $node = $(TemplateFactory._CHOICE_SCOPE(({addGroup: true})));
    var $nodeTools = $node.find('>li.tools');
    $node.addClass('t-field-content-extra');
    if (opts.length) {
      $.each(opts, function (i, it) {
        $nodeTools.before(TemplateFactory._CHOICE_LI({type: 'option', name: it}));
      });
    }
    if (grps.length) {
      $.each(grps, function (i, grp) {
        var $groupLi = $(TemplateFactory._CHOICE_LI({type: 'group', name: '<b>' + grp.name + '</b>'}));
        var $groupUl = $(TemplateFactory._CHOICE_SCOPE(({addGroup: false})));  // 最多只能允许二级
        var $groupUlTools = $groupUl.find('>li.tools');
        $.each(grp.items, function (ii, grp_opt) {
          $groupUlTools.before(TemplateFactory._CHOICE_LI({type: 'option', name: grp_opt}));
        });
        $groupLi.append($groupUl);
        $nodeTools.before($groupLi);
      });
    }
    var $contextual = $(TemplateFactory._CONTEXTUAL_SCOPE({message: gettext('Add your choices bellow')}));
    return TemplateFactory._wrapTFieldRow(FieldTypeEnum.CHOICE, '', $contextual.add($node), n, r);
  },
  /**
   * alias of getChoice
   */
  CHOICE: function (n, r, misc) {
    misc = misc || {};
    return TemplateFactory.getChoice(n, r, misc.opt, misc.grp);
  },
  /**
   * 获取 array 类型字段
   * @param {string=} n 字段名称，
   * @param {boolean=false} r 是否必填，默认为 false
   * @param {Object=} field 数组元素类型对象，包括 t, misc 部分
   * @return {*|jQuery|HTMLElement}
   */
  getArray: function (n, r, field) {
    n = n || '';
    r = r || false;
    field = field || {};
    var $fgSel = TemplateFactory._wrapFormGroup(
        gettext('Array Type'),
        FormFieldFactory._SELECT_INPUT2({
          name: 'type',
          sel: field.t,
          opts: FieldTypeEnum._getMapping([FieldTypeEnum.ARRAY, FieldTypeEnum.TABLE])    // 不允许二维数组，不能加表格
        }));
    var $inlineCtt = $fgSel.add('<button type="button" class="btn btn-sm btn-default" onclick="Utils.setArrayType(this)" style="display:none">' + gettext('Set this type') + '</button>');
    var $extraCttP = $(this._CONTEXTUAL_SCOPE({message: gettext('Choose array type and click add button, then array type attributes will show bellow')}));
    var $extraCttF = $('<div class="t-field-content-extra"></div>');
    if (field.t) {  // 通过 field.t 判断是否需要填充
      $extraCttF.append(TemplateFactory[FieldTypeEnum._getNameByValue(field.t)]('', field.r, field.misc));
      $extraCttF.find('>.t-field>.t-field-content>.form-inline>.form-group>input[name=name]').attr('disabled', true)
        .attr('placeholder', gettext('You don\'t need to fill this field'));    // 字段名不需要设置;
    }
    return TemplateFactory._wrapTFieldRow(
        FieldTypeEnum.ARRAY,
        $inlineCtt,
        $extraCttP.add($extraCttF),
        n, r);
  },
  /**
   * alias of getArray
   */
  ARRAY: function (n, r, misc) {
    misc = misc || {};
    return TemplateFactory.getArray(n, r, misc);
  },
  /**
   * 获取 table 类型字段
   * @param {string=} n 字段名称，默认为空
   * @param {boolean=false} r 是否必填，默认为 false
   * @param {Array=} head 表头名称数组
   * @param {Object=} headType 表头名称与其 type 对应的对象（type为包含 t 和 misc 字段的对象）
   * @return {*|jQuery|HTMLElement}
   */
  getTable: function (n, r, head, headType) {
    n = n || '';
    r = r || false;
    head = head || [];
    headType = headType || {};
    var $fgSel = TemplateFactory._wrapFormGroup(
        gettext('Column Type'),
        FormFieldFactory._SELECT_INPUT2({
          name: 'type',
          sel: FieldTypeEnum.STRING,
          opts: FieldTypeEnum._getMapping([
            FieldTypeEnum.ARRAY,
            FieldTypeEnum.TABLE,
            FieldTypeEnum.CONTAINER,
            FieldTypeEnum.GENERATOR])   // 表格型不能添加数组、表格、容器、生成器
        }));
    var $inlineCtt = $fgSel.add('<button type="button" class="btn btn-sm btn-default" onclick="Utils.addTableCol(this)" style="display:none">' + gettext('Add column') + '</button>');
    var $tfcExtra = $('<div class="t-field-content-extra"></div>');

    $.each(head, function (i, hName) {
      var hMisc = headType[hName];
      $tfcExtra.append(TemplateFactory[FieldTypeEnum._getNameByValue(hMisc.t)](hName, hMisc.r, hMisc.misc));
    });

    var $extraCtt = $(TemplateFactory._CONTEXTUAL_SCOPE({message: gettext('Choose column type and click add button, then column attributes will show bellow')}))
        .add($tfcExtra);
    return TemplateFactory._wrapTFieldRow(
        FieldTypeEnum.TABLE,
        $inlineCtt,
        $extraCtt,
        n, r);
  },
  /**
   * alias of getTable
   */
  TABLE: function (n, r, misc) {
    misc = misc || {};
    return TemplateFactory.getTable(n, r, misc._head, misc);
  },
  /**
   * 获取 container 类型字段
   * @param {string=} n 字段名称，默认为空
   * @param {boolean=false} r 是否必填，默认为 false
   * @param {Object=} fields 包含 _ord（记录字段顺序）和个字段对应类型的对象
   * @return {*|jQuery|HTMLElement}
   */
  getContainer: function (n, r, fields) {
    n = n || '';
    fields = fields || {_ord: []};
    fields._ord = fields._ord || [];

    var $extraCtt = $('<div class="t-field-content-extra t-field-container"></div>');
    $extraCtt.on(TemplateFieldDragDropEvents);
    $.each(fields._ord, function (i, fName) {
      var fMisc = fields[fName];
      $extraCtt.append(TemplateFactory[FieldTypeEnum._getNameByValue(fMisc.t)](fName, fMisc.r, fMisc.misc));
    });
    return TemplateFactory._wrapTFieldRow(
        FieldTypeEnum.CONTAINER,
        '',
        $extraCtt,
        n, r);
  },
  /**
   * alias of getContainer
   */
  CONTAINER: function (n, r, misc) {
    misc = misc || {_ord: []};
    return TemplateFactory.getContainer(n, r, misc);
  },
  /**
   * 获取 generator 类型字段
   * @param {string=} n 字段名称，默认为空
   * @param {boolean=false} r 是否必填，默认为 false
   * @param {Array=} opts 选项数组，默认为空数组
   * @param {Object=} optVals 选项和类型属性对应的对象
   * @return {*|jQuery|HTMLElement}
   */
  getGenerator: function (n, r, opts, optVals) {
    n = n || '';
    r = r || false;
    opts = opts || [];
    optVals = optVals || {};
    var $fgSel = TemplateFactory._wrapFormGroup(
        gettext('Field Type'),
        FormFieldFactory._SELECT_INPUT2({
          name: 'type',
          sel: FieldTypeEnum.STRING,
          opts: FieldTypeEnum._getMapping([FieldTypeEnum.GENERATOR])   // 生成器不允许嵌套
        }));
    var $inlineCtt = $fgSel.add('<button type="button" class="btn btn-sm btn-default" onclick="Utils.addTableCol(this)" style="display:none">' + gettext('Add field') + '</button>');
    var $tfcExtra = $('<div class="t-field-content-extra"></div>');

    $.each(opts, function (i, optName) {
      var optMisc = optVals[optName];
      $tfcExtra.append(TemplateFactory[FieldTypeEnum._getNameByValue(optMisc.t)](optName, optMisc.r, optMisc.misc));
    });

    var $extraCtt = $(TemplateFactory._CONTEXTUAL_SCOPE({message: gettext('Choose field type and click add button, then field attributes will show bellow')}))
        .add($tfcExtra);
    return TemplateFactory._wrapTFieldRow(
        FieldTypeEnum.GENERATOR,
        $inlineCtt,
        $extraCtt,
        n, r);
  },
  /**
   * alias of getGenerator
   */
  GENERATOR: function (n, r, misc) {
    misc = misc || {};
    return TemplateFactory.getGenerator(n, r, misc._opt, misc);
  }
};

// 提交数据部分产生各式各样的 jQuery 对象和 doT 模板
var FormFieldFactory = {
  _FORM_INLINE: '<div class="form-inline"></div>',
  _FORM_GROUP: '<div class="form-group"></div>',
  _ROW_WRAP: '<div class="row"></div>',
  // eg: {title: 'Delete row', clk: 'Utils.removePP(this)'}  (title default to 'delete', clk default to `removeP`, clk must be a string)
  _DELETE_ICON: doT.compile('<i class="fa fa-remove" style="display:none" title="{{=it.title||gettext(\'Delete\')}}" onclick="{{=it.clk||\'Utils.removeP(this)\'}}"></i>'),
  // eg: {lb: 'label'} (required)
  _FORM_LABEL: doT.compile('<label class="control-label">{{=it.lb}}</label>'),
  // eg: {lg: 6, md: 6, sm: 9, xs: 12} (default)
  _FORM_WIDTH_WRAP: doT.compile('<div class="col-lg-{{=it.lg||6}} col-md-{{=it.md||6}} col-sm-{{=it.sm||9}} col-xs-{{=it.xs||12}}" display="none"></div>'),
  // eg: {bf: '@', af: '.com'}  (set at lease one param)
  _INPUT_GROUP_WRAP: doT.compile('<div class="input-group">{{?it.bf}}<span class="input-group-addon">{{=it.bf}}</span>{{?}}{{?it.af}}<span class="input-group-addon">{{=it.af}}</span>{{?}}</div>'),
  // eg: {name: 'name', val: 'text', plh: 'hei hei hei'}  (default to null string)
  _TEXT_INPUT: doT.compile('<input class="form-control" disabled="disabled" name="{{=it.name||\'\'}}" value="{{=it.val||\'\'}}" placeholder="{{=it.plh||\'\'}}">'),
  // eg: {name: 'name', val: 5, plh: 'e e e', max: 10, min: 1, step: 2}  (name, plh default to null string, max, min, step not required)
  _NUMBER_INPUT: doT.compile('<input type="number" class="form-control" disabled="disabled" name="{{=it.name||\'\'}}" value="{{=it.val||\'\'}}" placeholder="{{=it.plh||\'\'}}" {{?it.max}}max="{{=it.max}}"{{?}} {{?it.min}}min="{{it.min}}"{{?}} {{?it.step}}step="{{=it.step}}"{{?}}>'),
  // eg: {name: 'name', sel: 1, opts: [{val: 1, name: 'opt1'}], grps: [{name: 'grp1', items: [{val: 2, name: 'grp1-opt1'}]}]} (name default to null string, sel must set, opts & grps not required)
  _SELECT_INPUT2: doT.compile('<select name="{{=it.name||\'\'}}" class="form-control" disabled="disabled">{{~it.opts :opt}}<option value="{{=opt.val}}" {{?it.sel === opt.val}}selected{{?}}>{{=opt.name}}</option>{{~}}{{~it.grps :grp}}<optgroup label="{{=grp.name}}">{{~grp.items :item}}<option value="{{=item.val}}" {{?it.sel === item.val}}selected{{?}}>{{=item.name}}</option>{{~}}</optgroup>{{~}}</select>'),
  // eg: {name: 'name', sel: 1, chg: null, opts: ['opt1', '...'], grps: [{name: 'grp1', items: ['opt11', '...']} (name default to null string, sel must set, opts & grps not required)
  _SELECT_INPUT: doT.compile('<select name="{{=it.name||\'\'}}" class="form-control " disabled="disabled" {{?it.chg}}onchange="{{=it.chg}}"{{?}}>{{~it.opts :opt}}<option {{?it.sel === opt}}selected{{?}}>{{=opt}}</option>{{~}}{{~it.grps :grp}}<optgroup label="{{=grp.name}}">{{~grp.items :item}}<option {{?it.sel === item}}selected{{?}}>{{=item}}</option>{{~}}</optgroup>{{~}}</select>'),
  // eg: {name: 'name', multi: false, acc: 'image/*', chg: 'Utils.uploadFile(this)'}  (default accept *)
  _FILE_INPUT: doT.compile('<input type="file" class="form-control" disabled="disabled" name="{{=it.name||\'\'}}" {{?it.multi}}multiple{{?}} accept="{{=it.acc||\'\'}}" {{?it.chg}}onchange="{{=it.chg}}"{{?}}>'),
  // eg: {head: ['col1', 'col2', '...'], rows: []} (head not required, thead>tr, tbody will be set)
  _TABLE: doT.compile('<div class="table-responsive"><table class="table table-striped table-bordered table-condensed"><thead><tr>{{~it.head :hd}}<th>{{=hd}}</th>{{~}}</tr></thead><tbody>{{~it.rows :row}}<tr>{{~row :td}}<td>{{=td}}</td>{{~}}</tr>{{~}}</tbody></table></div>'),
  _getRangeInputGroup: function (name, r, rangeType, unit, val1, val2) {
    unit = unit || '';
    val1 = val1 || '';
    val2 = val2 || '';
    var sep = rangeType ? '±' : '~';
    var plh1 = rangeType ? gettext('value') : gettext('lower bound'),
        plh2 = rangeType ? gettext('error') : gettext('upper bound');
    var $group = $(this._INPUT_GROUP_WRAP({bf: sep, af: unit}));
    $group.prepend(this._NUMBER_INPUT({val: val1, plh: plh1 + (r ? ("(" + gettext('Required') + ")") : '')}));
    $group.find('span:first').after(this._NUMBER_INPUT({val: val2, plh: plh2 + (r ? ("(" + gettext('Required') + ")") : '')}));
    return $group;
  },
  // 包裹每个字段的内容
  _wrapFormField: function (label, inputs, required, widths) {
    widths = widths || {};
    var $row = $(this._ROW_WRAP);
    var $fg = $(this._FORM_GROUP),
        $ww = $(this._FORM_WIDTH_WRAP(widths));
    $fg.append(this._FORM_LABEL({lb: label})).append(inputs);
    if (required) {
      $fg.addClass('required');
      $fg.find('input.form-control').attr('required', true);
    }
    $ww.append($fg);
    $row.append($ww);
    return $row;
  },
  _wrapPanel: function (title, content) {
    var pid = $.getUniqueId();
    var $panel = $('<div class="panel panel-default"></div>');
    var heading = '<div class="panel-heading"><h4 class="panel-title"><a role="button" data-toggle="collapse" href="#' + pid + '">' + title + '</a></h4></div>';
    var $collapse = $('<div id="' + pid + '" class="panel-collapse collapse in"></div>');
    var $body = $('<div class="panel-body"></div>');
    $body.append(content);
    $collapse.append($body);
    $panel.append(heading).append($collapse);
    return $panel;
  },
  /**
   * 获取 string 类型表单
   * @param {string} name 字段名
   * @param {boolean=false} r 是否必填，默认为 false
   * @param {string=} val 字段值，若设置则填写到对应表单
   * @returns {*|jQuery|HTMLElement}  返回对应的 form-group
   */
  getString: function (name, r, val) {
    var input = FormFieldFactory._TEXT_INPUT({name: name, val: val, plh: name + (r ? ("(" + gettext('Required') + ")") : '')});
    var $row = FormFieldFactory._wrapFormField(name, input, r);
    $row.data('type', FieldTypeEnum.STRING);
    return $row;
  },
  /**
   * alias of getString
   * @param {string} n 字段名
   * @param {boolean=false} r 是否必填，默认为 false
   * @param {*|Object} misc 对应的在 template 中记录的 misc
   * @param {string=} val 字段值，若设置则填写到对应表单
   * @returns {*} 返回对应的 form-group
   */
  STRING: function (n, r, misc, val) {
    val = val || '';
    return FormFieldFactory.getString(n, r, val);
  },
  getNumber: function (name, r, unit, val) {
    var input = FormFieldFactory._NUMBER_INPUT({name: name, val: val, plh: name + (r ? ("(" + gettext('Required') + ")") : '')});
    if (unit) {
      var $iGroupWrap = $(FormFieldFactory._INPUT_GROUP_WRAP({af: unit}));
      $iGroupWrap.prepend(input);
      input = $iGroupWrap;
    }
    var $row = FormFieldFactory._wrapFormField(name, input, r);
    $row.data('type', FieldTypeEnum.NUMBER);
    return $row;
  },
  NUMBER: function (n, r, misc, val) {
    misc = misc || {};
    misc.unit = misc.unit || '';
    val = val || NaN;
    return FormFieldFactory.getNumber(n, r, misc.unit, val);
  },
  getRange: function (name, r, type, unit, val1, val2) {
    var $inputs = FormFieldFactory._getRangeInputGroup(name, r, type, unit, val1, val2);
    var $row = FormFieldFactory._wrapFormField(name, $inputs, r);
    $row.data('type', FieldTypeEnum.RANGE);
    return $row;
  },
  RANGE: function (n, r, misc, val) {
    misc = misc || {};
    misc.type = misc.type || 0;
    misc.unit = misc.unit || '';
    val = val || {};
    if (misc.type) {   // 误差型
      return FormFieldFactory.getRange(n, r, misc.type, misc.unit, val.val, val.err);
    } else {    // 区间型
      return FormFieldFactory.getRange(n, r, misc.type, misc.unit, val.lb, val.ub);
    }
  },
  getImage: function (name, r, multi, val) {
    var media_prefix=$('meta[name=media-url-prefix]').attr('content');
    val = val || [];
    if (typeof val === 'string') {
      val = [val];
    }
    for(var i = 0; i < val.length; ++i) {
      if(val[i].startsWith(media_prefix)) val[i] = val[i].slice(media_prefix.length);
    }
    //var input = FormFieldFactory._FILE_INPUT({name: name, multi: multi, acc: 'image/*', chg: 'Utils.uploadFile(this)'});
    var input = window.MGE.filePickerView.createPicker(multi, true, r, val);
    var $row = FormFieldFactory._wrapFormField(name, input, r);
    
    //$(input).data('urls', val);   // 图片字段单独存储，此处为 url
    $row.data('type', FieldTypeEnum.IMAGE);
    return $row;
  },
  IMAGE: function (n, r, misc, val) {
    misc = misc || {};
    misc.multi = misc.multi || false;
    return FormFieldFactory.getImage(n, r, misc.multi, val);
  },
  getFile: function (name, r, multi, val) {
    var media_prefix=$('meta[name=media-url-prefix]').attr('content');
    val = val || [];
    for(var i = 0; i < val.length; ++i) {
      if(val[i].startsWith(media_prefix)) val[i] = val[i].slice(media_prefix.length);
    }
    if (typeof val === 'string') {
      val = [val];
    }
    var input = window.MGE.filePickerView.createPicker(multi, false, r, val);
    var $row = FormFieldFactory._wrapFormField(name, input, r);
    
    // var $row = FormFieldFactory.getImage(name, r, multi, val);
    
    //$row.find('input[type=file]').attr('accept', '');
    $row.data('type', FieldTypeEnum.FILE);
    return $row;
  },
  FILE: function (n, r, misc, val) {
    misc = misc || {};
    misc.multi = misc.multi || false;
    return FormFieldFactory.getFile(n, r, misc.multi, val);
  },
  getChoice: function (name, r, opts, grps, val) {
    // sel 必须设置，而 opts 和 grps 在模板创建过程中已限制必须要有值
    if (opts.length) {
      val = val || opts[0];
    } else {
      val = val || grps[0].items[0];
    }
    var select = FormFieldFactory._SELECT_INPUT({name: name, sel: val, opts: opts, grps: grps});
    var $row = FormFieldFactory._wrapFormField(name, select, r);
    $row.data('type', FieldTypeEnum.CHOICE);
    return $row;
  },
  CHOICE: function (n, r, misc, val) {
    misc = misc || {};
    misc.opt = misc.opt || [];
    misc.grp = misc.grp || [];
    return FormFieldFactory.getChoice(n, r, misc.opt, misc.grp, val);
  },
  getArray: function (name, r, arrType, arrRequired, arrTypeMisc, items) {
    items = items || [];
    var $rows = $();
    var el;
    switch (arrType) {
      case FieldTypeEnum.STRING:
      case FieldTypeEnum.NUMBER:
      case FieldTypeEnum.RANGE:
      case FieldTypeEnum.IMAGE:
      case FieldTypeEnum.FILE:
      case FieldTypeEnum.CHOICE:
        el = '.form-group>label';
        break;
      case FieldTypeEnum.TABLE:
      case FieldTypeEnum.CONTAINER:
      case FieldTypeEnum.GENERATOR:
        el = '.panel-title';
        break;
      default:
        console.error('Field type wrong!');
        return;
    }
    if (items.length === 0) {
      items.push(undefined);   // 添加初始元素
    }
    var itemMaker = FormFieldFactory[FieldTypeEnum._getNameByValue(arrType)];
    items.forEach(function (item, i) {
      var $row = itemMaker('#' + (i + 1), arrRequired, arrTypeMisc, item);
      $row.find(el).append(FormFieldFactory._DELETE_ICON({
        title: gettext('Delete this field'),
        clk: 'Utils.delArrayItem(this)'
      }));   // 添加删除按钮
      $rows = $rows.add($row);
    });
    $rows = $rows.add('<div class="dividing-small"></div>');
    $rows = $rows.add('<p class="text-center"><button type="button" class="btn btn-default" onclick="Utils.addArrayItem(this)">' + gettext('Add new') + '</button></p>');
    var $panel = FormFieldFactory._wrapPanel(name, $rows);
    $panel.data('type', FieldTypeEnum.ARRAY);
    if (r) {
      $panel.data('r', r);
      $panel.addClass('required');
    }
    $panel.data('arrType', arrType);
    $panel.data('arrRequired', arrRequired);
    $panel.data('arrTypeMisc', arrTypeMisc);
    return $panel;
  },
  ARRAY: function (n, r, misc, val) {
    misc = misc || {};
    return FormFieldFactory.getArray(n, r, misc.t, misc.r, misc.misc, val);
  },
  getTable: function (name, r, head, headType, rows) {
    rows = rows || [];
    var newHead = head.map(function (hName) {
      if (headType[hName].misc && headType[hName].misc.unit) {
        return hName + '(' + headType[hName].misc.unit + ')';
      }
      return hName;
    });
    newHead.unshift('#');   // 第一列为删除按钮
    // var oidUrlReg = /\/([a-f\d]{24})\//;
    rows = rows.map(function (row) {
      var tds = head.map(function (hName) {
        var tdVal = row[hName], tVal;
        switch (headType[hName].t) {
          case FieldTypeEnum.STRING:
          case FieldTypeEnum.NUMBER:
          case FieldTypeEnum.CHOICE:
            tVal = tdVal;
            break;
          case FieldTypeEnum.RANGE:
            if (headType[hName].misc.type) {
              tVal = tdVal.val + '±' + tdVal.err;
            } else {
              tVal = tdVal.lb + '~' + tdVal.ub;
            }
            break;
          case FieldTypeEnum.IMAGE:
            
            if (!tdVal) {
              tVal = tdVal;
              break;
            }
            tdVal = (typeof tdVal === 'string') ? [tdVal] : tdVal;
            console.log(tdVal);
            var media_prefix=$('meta[name=media-url-prefix]').attr('content');
            tVal = tdVal.map(function (url) {
              // var oid = oidUrlReg.exec(url)[1];
              var raw_url = url;
              if(url.startsWith(media_prefix)) url = url.slice(media_prefix.length);
              return '<img class="mge-thumbnail img-thumbnail" mge_url="'+ url +'" src="' + raw_url + '">';
            }).join('');
            break;
          case FieldTypeEnum.FILE:
            if (!tdVal) {
              tVal=tdVal;
              break;
            }
            var media_prefix=$('meta[name=media-url-prefix]').attr('content');
            tdVal = (typeof tdVal === 'string') ? [tdVal] : tdVal;
            tVal = tdVal.map(function (url, i) {
              // var oid = oidUrlReg.exec(url)[1];
              var raw_url = url;
              if(url.startsWith(media_prefix)) url = url.slice(media_prefix.length);
              return '<a href="' + raw_url + '" mge_url="'+ url +'">file ' + (i + 1) + '</a>';
            }).join('');
            break;
          default:
            console.error('field type error.');
            break;
        }
        return tVal;
      });
      tds.unshift(FormFieldFactory._DELETE_ICON({title: gettext('Delete this row'), clk: 'Utils.removePP(this)'}));  // 第一列为删除按钮
      return tds;
    });
    var $table = $(FormFieldFactory._TABLE({head: newHead, rows: rows}));
    $table.perfectScrollbar();    // 设置滚动条
    var $rowWrap = $(this._ROW_WRAP);   // 输入框 row
    head.forEach(function (hName) {
      var $fg = $(FormFieldFactory._FORM_GROUP).append(FormFieldFactory._FORM_LABEL({lb: hName}));
      var $widthWrap = $(FormFieldFactory._FORM_WIDTH_WRAP({lg: 3, md: 3, sm: 6}));
      var headR = headType[hName].r;
      switch (headType[hName].t) {
        case FieldTypeEnum.STRING:
          $fg.append(FormFieldFactory._TEXT_INPUT({name: hName, plh: hName + (headR ? ("(" + gettext('Required') + ")") : '')}));
          break;
        case FieldTypeEnum.NUMBER:
          var input = FormFieldFactory._NUMBER_INPUT({name: hName, plh: hName + (headR ? ("(" + gettext('Required') + ")") : '')});
          if (headType[hName].misc && headType[hName].misc.unit) {
            var $wrap = $(FormFieldFactory._INPUT_GROUP_WRAP({af: headType[hName].misc.unit}));
            $wrap.prepend(input);
            $fg.append($wrap);
          } else {
            $fg.append(input);
          }
          break;
        case FieldTypeEnum.RANGE:
          $fg.append(FormFieldFactory._getRangeInputGroup(name, headR, headType[hName].misc.type, headType[hName].misc.unit));
          break;
        case FieldTypeEnum.IMAGE:
          $fg.append(FormFieldFactory._FILE_INPUT({
            name: hName,
            multi: headType[hName].misc.multi,
            acc: 'image/*',
            chg: 'Utils.uploadFile(this)'
          }));
          break;
        case FieldTypeEnum.FILE:
          $fg.append(FormFieldFactory._FILE_INPUT({
            name: hName,
            multi: headType[hName].misc.multi,
            chg: 'Utils.uploadFile(this)'
          }));
          break;
        case FieldTypeEnum.CHOICE:
          var $choiceGroup = FormFieldFactory.getChoice(hName, headR, headType[hName].misc.opt, headType[hName].misc.grp);
          $fg.append($choiceGroup.find('select:first'));
          break;
        default:
          console.error('Field type wrong!');
          break;
      }
      $fg.data('type', headType[hName].t);
      if (headR) {
        $fg.data('r', headR);
        $fg.addClass('required');
        $fg.find('input.form-control').attr('required', true);
      }
      $widthWrap.append($fg);
      $rowWrap.append($widthWrap);
    });
    var $btnWidthWrap = $(FormFieldFactory._FORM_WIDTH_WRAP({lg: 3, md: 3, sm: 6}));  // add row 按钮
    $btnWidthWrap.append(FormFieldFactory._FORM_LABEL({lb: '<i class="fa fa-angle-double-down move-down"></i>'}));
    $btnWidthWrap.append('<input type="button" class="form-control btn btn-default" onclick="Utils.appendRow(this)" value="' + gettext('Add row') + '">');
    $rowWrap.append($btnWidthWrap);
    $table.append($rowWrap);
    var $panel = FormFieldFactory._wrapPanel(name, $table);
    $panel.data('head', head);      // 解析提交数据时使用
    $panel.data('headType', headType);
    $panel.data('type', FieldTypeEnum.TABLE);
    if (r) {
      $panel.data('r', r);
      $panel.addClass('required');
    }
    return $panel;
  },
  TABLE: function (n, r, misc, val) {
    misc = misc || {};
    misc._head = misc._head || [];
    return FormFieldFactory.getTable(n, r, misc._head, misc, val);
  },
  getContainer: function (name, r, fields, vals) {
    vals = vals || {};
    var $items = $();
    fields._ord.forEach(function (fName) {
      $items = $items.add(FormFieldFactory[FieldTypeEnum._getNameByValue(fields[fName].t)](fName, fields[fName].r, fields[fName].misc, vals[fName]));
    });
    var $panel = FormFieldFactory._wrapPanel(name, $items);
    $panel.data('type', FieldTypeEnum.CONTAINER);
    if (r) {
      $panel.data('r', r);
      $panel.addClass('required');
    }
    return $panel;
  },
  CONTAINER: function (n, r, misc, val) {
    misc = misc || {};
    misc._ord = misc._ord || [];
    return FormFieldFactory.getContainer(n, r, misc, val);
  },
  // getGenerator: function (name, r, options, val) {
  //   val = val || {};
  //   val.sel = val.sel || options._opt[0];
  //   var $items = $();
  //   var sel = FormFieldFactory._SELECT_INPUT({opts: options._opt, sel: val.sel, chg: 'Utils.genDataField(this)'});
  //   $items = $items.add(FormFieldFactory._wrapFormField(gettext('Select item then click button'), sel, r));
  //   $items = $items.add('<div class="dividing-small"></div>');
  //   $items = $items.add(FormFieldFactory[FieldTypeEnum._getNameByValue(options[val.sel].t)](val.sel, options[val.sel].r, options[val.sel].misc, val.val));
  //   var $panel = FormFieldFactory._wrapPanel(name, $items);
  //   $panel.data('type', FieldTypeEnum.GENERATOR);
  //   $panel.data('options', options);
  //   if (r) {
  //     $panel.data('r', r);
  //     $panel.addClass('required');
  //   }
  //   return $panel;
  // },
  getGeneratorV2: function(name, is_required, options, value) {
    value = value || {};
    var selected = Object.keys(value)[0] || options._opt[0];
    var $items = $();
    var sel_view = FormFieldFactory._SELECT_INPUT({opts: options._opt, sel: selected, chg: 'Utils.genDataField(this)'});
    $items = $items.add(FormFieldFactory._wrapFormField(gettext('Select item then click button'), sel_view, is_required));
    $items = $items.add('<div class="dividing-small"></div>');
    $items = $items.add(FormFieldFactory[FieldTypeEnum._getNameByValue(options[selected].t)](selected, options[selected].r, options[selected].misc, value[selected]));
    var $panel = FormFieldFactory._wrapPanel(name, $items);
    $panel.data('type', FieldTypeEnum.GENERATOR);
    $panel.data('options', options);
    if (is_required) {
      $panel.data('r', is_required);
      $panel.addClass('required');
    }
    return $panel;
  },
  GENERATOR: function (n, r, misc, val) {
    misc = misc || {};
    misc._opt = misc._opt || [];
    return FormFieldFactory.getGeneratorV2(n, r, misc, val);
  }
};

/**
 * 填充材料分类树
 * @param {Object} data 获取到的数据
 * @param {Object} $target 目标填充位置（jQuery对象）
 * @param {string=""} prefix 前缀字符串，默认为空，当分组高于一级后每级加两个 &nbsp;
 */
function fillMaterialClassTree(data, $target, prefix) {
  prefix = prefix || '';
  $.each(data, function (i, it) {
    window._R_FILL_MC_DONE = false;
    if (it.children.length) {
      var $optgroup = $('<optgroup label="' + prefix + it.name + '"></optgroup>');
      fillMaterialClassTree(it.children, $optgroup, prefix + '&nbsp;&nbsp;');
      $target.append($optgroup);
    } else {
      $target.append('<option value="' + it.id + '">' + prefix + it.name + '</option>');
    }
  });
  window._R_FILL_MC_DONE = true;
}

/**
 * 获取材料分类树
 * @param {Object} $originTarget 最开始的目标对象（主要是 timer 要用）
 * @param {Function} callback 回调函数（$.get success 方法回调函数）
 */
function getMaterialClassTree($originTarget, callback) {
  $.get(Urls.resolve('api_v1_storage:material_category_tree')).done(callback);
  if($originTarget == null) return;
  // fixme: 我也不知道为什么会出现这样的 bug，浏览器你能不能认真的渲染一下 (╬▔皿▔)凸
  window._R_FILL_MC_DONE = false;
  window._R_FILL_TIMER = setInterval(function () {
    console.log('R_FILL_MC_DONE: checking...');
    if (window._R_FILL_MC_DONE) {
      var html = $originTarget.html();
      $originTarget.html(html);
      clearInterval(window._R_FILL_TIMER);
      delete window._R_FILL_MC_DONE;
      delete window._R_FILL_TIMER;
      console.log('R_FILL_MC_DONE: done!');
    }
  }, 1000);
}
