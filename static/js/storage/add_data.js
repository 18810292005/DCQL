/**
 * @file add_data.js
 * @author Yuvv, Jasper0819X
 * @date 2017/12/9
 */

var RANGE_STR_REG = /^([+-]?\d+(\.\d+)?)[~±]([+-]?\d+(\.\d+)?)$/;

// FILE_OID_REG = /\/([a-f\d]{24})\//;

function checkControlFilled($fc) {
  if (!($fc instanceof $)) {
    $fc = $($fc);
  }
  var required = $fc.attr('required');
  var value;
  if ($fc.is('.mge-file-picker')) {
    value = ($fc.data('urls') || []).length;
  }
  else {
    value = $fc.val().trim();
  }
  if (required && !value) {
    Utils.flashBadField($fc, '.form-group');
    $fc.focus();
    $.notify({
      type: 'danger',
      message: gettext('This field cannot be null.')
    });
    return false;
  }
  return true;
}

/**
 * 解析数据字段（row or panel）
 * @param {Object} r_or_p 待解析的 row 或 panel 类的 document 对象
 * @returns {{}|null} 返回解析的字段结果对象，包含`name`, `count`, `blank`三个属性
 */
function parseField(r_or_p) {
  var $r_or_p = $(r_or_p);
  var field = {};
  var curFC;  // 当前form-control，主要用于检测是否填写
  var elName = $r_or_p.hasClass('row') ? '>div>div.form-group>label' : '>.panel-heading>.panel-title>a';
  field.name = $r_or_p.find(elName).text();
  field.count = 1;   // 默认为 1，特殊的会在下面重新设置
  switch ($r_or_p.data('type')) {
    case FieldTypeEnum.STRING:
    case FieldTypeEnum.CHOICE:
      curFC = $r_or_p.find('>div>.form-group>.form-control');
      if (!checkControlFilled(curFC)) {
        return null;
      }
      field.value = curFC.val().trim();
      field.blank = (field.value === '') ? 1 : 0;
      break;
    case FieldTypeEnum.NUMBER:
      curFC = $r_or_p.find('>div>.form-group input.form-control');
      if (!checkControlFilled(curFC)) {
        return null;
      }
      field.value = parseFloat(curFC.val());
      field.blank = field.value ? 0 : 1;
      break;
    case FieldTypeEnum.RANGE:
      var $inputGroup = $r_or_p.find('>div>.form-group>.input-group');
      var $inputs = $inputGroup.find('input.form-control');
      var sep = $inputGroup.find('span.input-group-addon:first').text();
      // 不能两个都是空
      if (!checkControlFilled($inputs.first()) && !checkControlFilled($inputs.last())) {
        return null;
      }
      var val1 = parseFloat($inputs.first().val()),
        val2 = parseFloat($inputs.last().val());
      if (sep === '±') {
        // 误差型两个都不能为空
        if (!checkControlFilled($inputs.first()) || !checkControlFilled($inputs.last())) {
          return null;
        }
        if (Math.abs(val1) <= val2 || val2 < 0) {    // 误差型第一个绝对值大于第二个，且第二个大于等于 0
          $.notify({
            type: 'danger',
            message: gettext('Abstract value of first must large than second and second value must large than 0')
          });
          Utils.flashBadField($inputs, '.form-group');
          return null;
        }
        field.value = {val: val1, err: val2};
      } else {
        if (val1 == null || val1 == '') val1 = val2;
        if (val2 == null || val2 == '') val2 = val1;
        if (val1 > val2) {    // 区间第一个值要小于等于第二个
          $.notify({
            type: 'danger',
            message: gettext('First value must less than or equal to second value')
          });
          Utils.flashBadField($inputs, '.form-group');
          return null;
        }
        field.value = {lb: val1, ub: val2};
      }
      field.blank = (val1 && val2) ? 0 : 1;
      break;
    case FieldTypeEnum.IMAGE:
    case FieldTypeEnum.FILE:
      //curFC = $r_or_p.find('>div>.form-group>input[type="file"]');
      curFC = $r_or_p.find('.mge-file-picker');
      if (!checkControlFilled(curFC)) {
        return null;
      }
      field.value = curFC.data('urls') || [];
      field.blank = (field.value.length > 0) ? 0 : 1;
      break;
    case FieldTypeEnum.ARRAY:
      var items = [];
      field.blank = 0;
      $r_or_p.find('>.panel-collapse>.panel-body>div.row,>.panel-collapse>.panel-body>div.panel').each(function (i, item) {
        var itemValue = parseField(item);
        if (itemValue.blank !== itemValue.count) {
          items.push(itemValue.value);
          field.count += itemValue.count;
          field.blank += itemValue.blank;
        }
      });
      if ($r_or_p.data('r') && items.length === 0) {  // 数组必填时，items 不能为空
        return null;
      }
      field.value = items;
      field.blank = (items.length > 0) ? field.blank : 1;
      break;
    case FieldTypeEnum.TABLE:
      var head = $r_or_p.data('head'),
        headType = $r_or_p.data('headType');
      var $rows = $r_or_p.find('>.panel-collapse>.panel-body>.table-responsive>table>tbody>tr');
      field.value = [];
      if ($rows.length) {
        $rows.each(function (i, row) {
          var rowValue = {};
          $(row).find('td:not(:first)').each(function (j, td) {
            var $td = $(td);
            switch (headType[head[j]].t) {
              case FieldTypeEnum.STRING:
              case FieldTypeEnum.CHOICE:
                rowValue[head[j]] = $td.text();
                break;
              case FieldTypeEnum.NUMBER:
                rowValue[head[j]] = parseFloat($td.text());
                break;
              case FieldTypeEnum.RANGE:
                var execResult = RANGE_STR_REG.exec($td.text());
                var val1, val2;
                if (execResult) {
                  val1 = parseFloat(execResult[1]);
                  val2 = parseFloat(execResult[3]);
                } else {
                  val1 = NaN;
                  val2 = NaN;
                }
                if (headType[head[j]].misc.type) {
                  rowValue[head[j]] = {val: val1, err: val2};
                } else {
                  rowValue[head[j]] = {lb: val1, ub: val2};
                }
                break;
              case FieldTypeEnum.IMAGE:
              case FieldTypeEnum.FILE:
                var tagName = (headType[head[j]].t === FieldTypeEnum.IMAGE) ? 'img' : 'a';
                var attrName = 'mge_url';
                //  attrName = (headType[head[j]].t === FieldTypeEnum.IMAGE) ? 'src' : 'href';
                var f_or_i = [];
                $td.find(tagName).each(function (i, i_or_f) {
                  f_or_i.push($(i_or_f).attr(attrName));
                });
                rowValue[head[j]] = f_or_i;
                break;
              default:
                console.error('Field type error!');
                break;
            }
          });
          field.value.push(rowValue);
        });
        field.blank = 0;
      } else {
        field.blank = 1;
      }
      if ($r_or_p.data('r') && field.value.length === 0) {  // 表格必填时，至少应该有一行
        $.notify({
          type: 'danger',
          message: gettext('You need to add at lease one row in this table.')
        });
        Utils.flashBadField($r_or_p);
        return null;
      }
      break;
    case FieldTypeEnum.CONTAINER:
      var parsedData = parseData($r_or_p.find('>.panel-collapse>.panel-body'));
      if ($r_or_p.data('r') && parsedData === null) {  // 容器必填时，不应该返回null
        return null;
      }
      field.value = parsedData.content;
      field.count = parsedData.fields;
      field.blank = parsedData.blanks;
      break;
    case FieldTypeEnum.GENERATOR:
      var $genField = $r_or_p.find('>.panel-collapse>.panel-body>div.dividing-small').next();
      var parsedResult = parseField($genField);
      if ($r_or_p.data('r') && parsedData === null) {  // 生成器必填时，不应该返回null
        return null;
      }
      field.count = parsedResult.count;
      field.value = {};
      field.value[parsedResult.name] = parsedResult.value;
      field.blank = parsedResult.blank;
      break;
    default:
      console.error('Field type wrong!');
      break;
  }
  return field;
}

/**
 * 解析一个字段容器内的字段（根容器和容器型都用得到）
 * @param {Object} $container 待解析的容器
 * @returns {{content: {}, blanks: number, fields: number}||null}
 */
function parseData($container) {
  var content = {};
  var blankCount = 0,
    fieldCount = 0;
  var invalid = false;
  $container.find('>div.row,>div.panel').each(function (i, field) {
    var fieldValue = invalid || parseField(field);  // 加invalid只是为了利用截断来阻止继续解析字段
    if (fieldValue === null || invalid) {
      invalid = true;
      return;
    }
    content[fieldValue.name] = fieldValue.value;
    blankCount += fieldValue.blank;
    fieldCount += fieldValue.count;
  });
  if (invalid) {
    return null;
  }
  return {
    content: content,
    blanks: blankCount,
    fields: fieldCount
  };
}

/**
 * 通过表单方式提交数据，点击提交之后的响应函数，
 * 包括解析各字段、检查内容等
 */
function commitData(patch) {
  patch = patch || false;
  if (!$.vf.validate()) {
    return;
  }
  var dContent = parseData($('#form-container'));
  if (dContent === null) {
    return;
  }
  if (dContent.blanks === dContent.fields) {
    $.notify({
      type: 'danger',
      message: gettext('You have not fill any field!')
    });
    return;
  }
  if (dContent.blanks > 0) {
    $.notify({
      type: 'warning',
      message: interpolate(gettext('%s fields are empty!'), [dContent.blanks])
    });
  }
  function checkboxTo01(b) {
    if (b) return '1'; else return '0';
  }
  var final_data = {
    meta: {
      title: $('#d-title').val().trim(),
      category: $('#m-category').val(),
      tid: $('#d-template').val(),
      doi: $('#d-doi').val(),
      keywords: $('#d-keywords').val(),   // 后端去做分词
      purpose: '',
      abstract: $('#d-abstract').val(),
      source: {
        source: $('#d-o-source').val() || '10',
        reference: $('#d-o-reference').val(),
        project: $('#d-o-project').val(),
        methods: checkboxTo01($('#d-o-methods-calc').prop('checked')) + checkboxTo01($('#d-o-methods-exp').prop('checked')) + checkboxTo01($('#d-o-methods-prod').prop('checked')),
        // others: $('#d-o-others').val()
      }
    },
    content: dContent.content
  };
  // 如果来源是摘录，那么Reference为必填
  if (final_data.meta.source.source === '01') {
    if (final_data.meta.source.reference.trim() === '') {
      $.notify({
        type: 'warning',
        message: gettext('Reference field is required')
      });
      return;
    }
  }

  if (patch) {
    $.requestJSON({
      url: Urls.resolve('api_v2_storage:get_data', {oid:$('#d-id').val()}),
      method: 'PATCH',
      data: final_data,
      silentError: true,
      onSuccess: function (data) {
        window._committed = true;
        enterStep(5);  // final
        var fileInputs = $('input[type=file]');
        fileInputs.data('urls', []);
        fileInputs.val('');   // 清空所有文件
        var fmts = gettext('Successfully committed the data!\nYou can continue adding new data or jump to the %s data details page %s to view data.');
        $.showModal({
          title: gettext('Data committed successfully!'),
          message: interpolate(fmts, ['<a href="storage/data/' + data.data + '">', '</a>'])
        });
      },
      onError: function (data) {
        $.showModal({
          title: gettext('ERROR') + ' ' + data.code + ': ' + data.msg,
          message: gettext('An error has occurred! Please check your data and try again.')
        });
      }
    });
  }
  else {
    $.requestJSON({
      url: Urls.resolve('api_v1_1_storage:data_full'),
      method: 'POST',
      data: final_data,
      silentError: true,
      onSuccess: function (data) {
        window._committed = true;
        enterStep(5);  // final
        var fileInputs = $('input[type=file]');
        fileInputs.data('urls', []);
        fileInputs.val('');   // 清空所有文件
        var fmts = gettext('Successfully committed the data!\nYou can continue adding new data or jump to the %s data details page %s to view data.');
        $.showModal({
          title: gettext('Data committed successfully!'),
          message: interpolate(fmts, ['<a href="storage/data/' + data.data + '">', '</a>'])
        });
        if (patch) {
          $.ajax(Urls.resolve('api_v1_storage:data_meta_one', {mid: $('#d-id').val()}), {
            method: 'DELETE'
          });
        }
      },
      onError: function (data) {
        $.showModal({
          title: gettext('ERROR') + ' ' + data.code + ': ' + data.msg,
          message: gettext('An error has occurred! Please check your data and try again.')
        });
      }
    });
  }

}

/**
 * 生成数据表单
 * @param {Object} template 模板内容，即 template content
 * @param {Object} $target 待添加生成的表单的目标 jquery 对象
 */
function generateForm(template, $target) {
  template._ord.forEach(function (fieldName) {
    var fieldValue = template[fieldName];
    $target.append(FormFieldFactory[FieldTypeEnum._getNameByValue(fieldValue.t)](fieldName, fieldValue.r, fieldValue.misc));
  });
}

/**
 * 生成对应类型文件，并在下方显示合适的内容
 * @param fType
 * @param tid
 */
function generateFile(fType, tid) {
  if (!tid || tid === 'null') {
    $.showModal({
      message: gettext('Please select a template first!')
    });
    return;
  }
  var tFileContent = $('#t-file-content');
  tFileContent.val('');
  $.get(Urls.resolve('api_v1_storage:template_file', {tid: tid}), {type: fType}).done(function (resp) {
    var fileLink = resp.data;
    $('#by-file-hint').addClass('hidden');
    $('#by-file-hint-success').removeClass('hidden');
    $('#by-file-success-link').attr('href', fileLink);
    if (fType === 'xlsx') {
      $.showModal({
        title: gettext('Success'),
        message: gettext('Excel file cannot preview, download it yourself.'),
        onOk: function () {
          window.open(fileLink);
        },
        okText: gettext('Download')
      });
      tFileContent.val(gettext('Excel file cannot preview, download it yourself.'));
      return;
    }
    $.get(fileLink).done(function (resp) {
      if (fType === 'json') {
        tFileContent.val(JSON.stringify(resp, null, 2));
      } else if (fType === 'xml') {
        var ser = new XMLSerializer();
        tFileContent.val(ser.serializeToString(resp.documentElement));
      }
    }).fail(function (data) {
      window._jqHandled = true;
    });
  }).fail(function (resp) {
    window._jqHandled = true;
  });
}


function uploadFile(file) {
  var formData = new FormData();
  formData.append('file', file);

  $('body').preloader({
    text: gettext('Uploading...'),
    percent: '0'
  });
  $.ajax({
    url: Urls.resolve('api_v1_storage:uploaded_file'),
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
  }).done(function (resp) {
    $.showModal({
      title: gettext('Success'),
      message: gettext('An importing task has been added to your task list. Click OK to check the progress.'),
      onOk: function () {
        window.open(Urls.resolve('task:index'));
      },
      okText: gettext('OK')
    });
  }).fail(function (data) {
    window._jqHandled = true;
  }).always(function () {
    $('body').preloader('remove');
  });
}

// 当前进入第几步，更新显示的状态
function enterStep(num) {
  num = num || 1;
  var step1 = $('#d-step1'),
    step2 = $('#d-step2'),
    step3 = $('#d-step3'),
    step4 = $('#d-step4');
  switch (num) {
    case 1:
      step1.removeClass('disabled complete').addClass('active');
      step2.removeClass('active complete').addClass('disabled');
      step3.removeClass('active complete').addClass('disabled');
      step4.removeClass('active complete').addClass('disabled');
      break;
    case 2:
      step1.removeClass('disabled active').addClass('complete');
      step2.removeClass('disabled complete').addClass('active');
      step3.removeClass('active complete').addClass('disabled');
      step4.removeClass('active complete').addClass('disabled');
      break;
    case 3:
      step1.removeClass('disabled active').addClass('complete');
      step2.removeClass('disabled active').addClass('complete');
      step3.removeClass('disabled complete').addClass('active');
      step4.removeClass('active complete').addClass('disabled');
      break;
    case 4:
      step1.removeClass('disabled active').addClass('complete');
      step2.removeClass('disabled active').addClass('complete');
      step3.removeClass('disabled active').addClass('complete');
      step4.removeClass('disabled complete').addClass('active');
      break;
    case 5:
      step1.removeClass('disabled active').addClass('complete');
      step2.removeClass('disabled active').addClass('complete');
      step3.removeClass('disabled active').addClass('complete');
      step4.removeClass('disabled active').addClass('complete');
      break;
    default:
      break;
  }
}

$(function () {
  var mCategory = $('#m-category'),
    dTemplate = $('#d-template'),
    byFileHint = $('#by-file-hint'),
    byFileHintSuccess = $('#by-file-hint-success'),
    tFileContent = $('#t-file-content'),
    genForm = $('#btn-gen-form'),
    formContainer = $('#form-container');

  window._committed = false;   // 保存状态
  // 设置窗口关闭确认事件
  $(window).bind('beforeunload', function (e) {
    if (!window._committed) {
      return 'Are you sure to leave this page?';
    }
  });
  $(window).bind("unload", function (e) {
    // 退出之前删除所有未保存但已上传的数据
    var urls;
    $('input[type=file]').each(function (i, input) {
      urls = $(input).data('urls');
      if (urls.length > 0) {
        Utils.deleteFile(urls);
      }
    });
  });

  // 获取所有材料分类
  getMaterialClassTree(mCategory, function (data) {
    fillMaterialClassTree(data.data, mCategory, '');
  });

  // category 改变时获取对应模板，同时更新step
  mCategory.change(function () {
    window._committed = false;
    enterStep(1);
    byFileHint.removeClass('hidden');
    byFileHintSuccess.addClass('hidden');
    tFileContent.val('');
    dTemplate.val('null');
    if (mCategory.val() !== 'null') {
      $.get(Urls.resolve('api_v1_storage:templates'), {
        per_page: 100,
        category: mCategory.val(),
        meta_only: true
      }).done(function (resp) {
        dTemplate.children('option:not(:first-child)').remove();
        if (resp.data.length === 0) {
          $.notify({
            type: 'warning',
            message: gettext('There are no templates under the current category!')
          });
          return;
        }
        $.each(resp.data.templates, function (i, it) {
          dTemplate.append('<option value="' + it.id + '">' + it.title + '</option>');
        });
        enterStep(2);
      });
    } else {
      enterStep(1);
    }
  });

  // template改变时删除formContainer，同时更新step
  dTemplate.change(function () {
    window._committed = false;
    formContainer.empty();
    genForm.attr('disabled', false);
    genForm.prev().addClass('move-right');
    byFileHint.removeClass('hidden');
    byFileHintSuccess.addClass('hidden');
    tFileContent.val('');
    if (dTemplate.val() !== 'null') {
      enterStep(3);
      if (genForm.attr('disabled')) {
        genForm.attr('disabled', false);
        genForm.prev().addClass('move-right');
      }
    } else {
      enterStep(2);
    }
  });

  // 生成数据提交表单，同时更新step
  genForm.click(function () {
    $.get(Urls.resolve('api_v1_storage:template_one', {tid: dTemplate.val()})).done(function (data) {
      generateForm(data.data.content, formContainer);
      formContainer.append('<div class="dividing"></div><p class="text-center"><button onclick="commitData()" type="button" class="btn btn-lg btn-primary">' + gettext('Commit Data') + '</button></p>');

      enterStep(4);
      genForm.attr('disabled', true);
      genForm.prev().removeClass('move-right');
      // 取消type=number
      $(':input[type=number]').on('mousewheel', function (e) {
        $(this).blur();
      });
    }).fail(function () {
      window._jqHandled = true;
      window._jqErrMsg = gettext('Please check your template selected !');
    });
  });

  // 生成三种类型文件
  $('#gen-xlsx').click(function () {
    generateFile('xlsx', dTemplate.val());
  });
  $('#gen-json').click(function () {
    generateFile('json', dTemplate.val());
  });
  $('#gen-xml').click(function () {
    generateFile('xml', dTemplate.val());
  });

  // 上传文件
  $('#upload-file').click(function () {
    var files = $('#true-file').prop('files');
    if (files.length) {
      uploadFile(files[0]);
    } else {
      $.notify({
        type: 'danger',
        message: gettext('Please select a file.')
      });
    }
  });

  // 修改文件逻辑，有 did 就进入修复该模式
  var did = $('#d-id');
  if (did.length) {
    $.get(Urls.resolve('api_v2_storage:get_data', {oid: did.val()})).done(function (data_resp) {
      var dMeta = data_resp.data;
      var dContent = data_resp.data.content;
      $.get(Urls.resolve('api_v1_storage:template_one', {tid: dMeta.tid})).done(function (temp_resp) {
        var template = temp_resp.data;
        $('body').preloader({
          text: gettext('Loading...')
        });
        window._committed = false;
        mCategory.find('option[value=' + template.category_id + ']').attr('selected', true);
        mCategory.attr('disabled', true);
        dTemplate.append('<option value="' + template.id + '" selected>' + template.title + '</option>');
        dTemplate.attr('disabled', true);
        setTimeout(function () {
          try {
            $('#d-title').val(dMeta.title);
            $('#d-doi').val(dMeta.doi);
            $('#d-keywords').val(dMeta.keywords.join(','));
            // $('#d-purpose').val(dMeta.purpose);
            $('#d-abstract').val(dMeta.abstract);
            $('#d-o-source').val(dMeta.source);
            $('#d-o-source option')
              .removeAttr('selected')
              .filter(dMeta.source === '自产' || dMeta.source === 'self-production' ? '[value=10]' : '[value=01]')
              .attr('selected', 'selected');
            $('#d-o-reference').val(dMeta.reference);
            $('#d-o-project').val(dMeta.project);
            // $('#d-o-others').val(dMeta.others);
            // for methods
            $('#d-o-methods-calc').prop('checked', dMeta.methods.lastIndexOf('计算') !== -1 || dMeta.methods.lastIndexOf('computation') !== -1);
            $('#d-o-methods-exp').prop('checked', dMeta.methods.lastIndexOf('实验') !== -1 || dMeta.methods.lastIndexOf('experiment') !== -1);
            $('#d-o-methods-prod').prop('checked', dMeta.methods.lastIndexOf('摘录') !== -1 || dMeta.methods.lastIndexOf('production') !== -1);
            template.content._ord.forEach(function (fName) {
              var tValue = template.content[fName],
                fValue = dContent[fName];
              var fieldMaker = FormFieldFactory[FieldTypeEnum._getNameByValue(tValue.t)];
              formContainer.append(fieldMaker(fName, tValue.r, tValue.misc, fValue));
            });
            formContainer.append('<div class="dividing"></div><p class="text-center"><button onclick="commitData(true)" type="button" class="btn btn-lg btn-primary">' + gettext('Commit Data') + '</button></p>');

            enterStep(4);
            $('a[href="#by-file"]').addClass('btn disabled');
            // 取消type=number
            $(':input[type=number]').on('mousewheel', function (e) {
              $(this).blur();
            });
          } catch (err) {
            console.error(err);
          } finally {
            $('body').preloader('remove');
          }
        }, 1000);
      }).fail(function () {
        window._jqHandled = true;
        window._jqErrMsg = gettext('Failed to get template content.');
      });
    }).fail(function () {
      window._jqHandled = true;
    });
  }
});
