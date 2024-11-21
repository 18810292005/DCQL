/**
 * @file show_data.js
 * @author Jasper0819X
 * @date 2018/2/11
 */

/**
 * 高亮显示关键字, 构造函数
 * @param {} colors 颜色数组，其中每个元素是一个 '背景色,前景色' 组合
 */
var Highlighter = function (colors) {
  this.colors = colors;
  if (this.colors == null) {
    //默认颜色
    this.colors = ['#ffff00,#000000'];
  }
}

/**
 * 高亮显示关键字
 * @param {} node    html element
 * @param {} keywords  关键字， 多个关键字可以通过空格隔开， 其中每个关键字会以一种颜色显式
 *
 * 用法：
 * var hl = new Highlighter();
 * hl.highlight(document.body, '这个 世界 需要 和平');
 */
Highlighter.prototype.highlight = function (node, keywords) {
  if (!keywords || !node || !node.nodeType || node.nodeType != 1)
    return;

  keywords = this.parsewords(keywords);
  if (keywords == null)
    return;

  for (var i = 0; i < keywords.length; i++) {
    this.colorword(node, keywords[i]);
  }
}

/**
 * 对所有#text的node进行查找，如果有关键字则进行着色
 * @param {} node 节点
 * @param {} keyword 关键字结构体，包含了关键字、前景色、背景色
 */
Highlighter.prototype.colorword = function (node, keyword) {
  for (var i = 0; i < node.childNodes.length; i++) {
    var childNode = node.childNodes[i];

    if (childNode.nodeType == 3) {
      //childNode is #text
      var re = new RegExp(keyword.word, 'i');
      if (childNode.data.search(re) == -1) continue;
      re = new RegExp('(' + keyword.word + ')', 'gi');
      var forkNode = document.createElement('span');
      forkNode.innerHTML = childNode.data.replace(re, '<span style="background-color:' + keyword.bgColor + ';color:' + keyword.foreColor + '" mce_style="background-color:' + keyword.bgColor + ';color:' + keyword.foreColor + '">$1</span>');
      node.replaceChild(forkNode, childNode);
    } else if (childNode.nodeType == 1) {
      //childNode is element
      this.colorword(childNode, keyword);
    }
  }
}

/**
 * 将空格分隔开的关键字转换成对象数组
 * @param {} keywords
 * @return {}
 */
Highlighter.prototype.parsewords = function (keywords) {
  keywords = keywords.replace(/\s+/g, ' ');
  keywords = keywords.split(' ');
  if (keywords == null || keywords.length == 0)
    return null;

  var results = [];
  for (var i = 0; i < keywords.length; i++) {
    var keyword = {};
    var color = this.colors[i % this.colors.length].split(',');
    keyword.word = keywords[i];
    keyword.bgColor = color[0];
    keyword.foreColor = color[1];
    results.push(keyword);
  }
  return results;
}

/**
 * 按照字符串长度，由长到短进行排序
 * @param {} list 字符串数组
 */
Highlighter.prototype.sort = function (list) {
  list.sort(function (e1, e2) {
    return e1.length < e2.length;
  });
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}


//post http://127.0.0.1:8000/api/v1/storage/file/dataset/export
function export_data(did, type) {
  $.requestJSON({
    url: Urls.resolve('api_v1_storage:data_export'),
    data: {format: type, meta_id_list: [did], async: false},
    onSuccess: function (resp) {
      if (resp.data.async) {
        $.showModal({
          title: gettext('Success'),
          message: gettext('An exporting task has been added to your task list. Click OK to check the progress.'),
          onOk: function () {
            window.open(Urls.resolve('task:index'));
          },
          okText: gettext('OK')
        });
      } else {
        $.showModal({
          title: gettext('Success'),
          message: gettext('Click OK to download file.'),
          onOk: function () {
            window.open(resp.data.result, '_blank');
          },
          okText: gettext('OK')
        })
      }
    },
    onError: function (resp) {
      if (resp.status === 401) {
        var next = window.location.href.replace(window.location.origin, '');
        window.location.href = Urls.resolve('account:login') + '?next=' + next;
      }
    }
  });

}

function trimChar(str, charToRemove) {
  while (str.charAt(0) == charToRemove) {
    str = str.substring(1);
  }

  while (str.charAt(str.length - 1) == charToRemove) {
    str = str.substring(0, str.length - 1);
  }

  return str;
}

function ExtractKeywords(raw_kw) {
  if (raw_kw == null)
    return [];
  var quoted = raw_kw.match(/".+?"/g);
  var unquoted = raw_kw.replace(/".+?"/g, '').trim().split(' ');
  if (quoted == null) {
    return unquoted;
  } else {
    var quoted_strip = [];
    quoted.map(function (value) {
      quoted_strip.push(trimChar(value, '"'));
    })
    return quoted_strip.concat(unquoted);
  }
}

function Decode(str) {
  // replace dots with slash
  str = str.split('.').join('/');
  // Going backwards: from bytestream, to percent-encoding, to original string.
  return decodeURIComponent(atob(str).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}

var raw_kw = $.getURLParam('kw');
var kw;
if (raw_kw != null) {
  kw = ExtractKeywords(Decode($.getURLParam('kw')) || null);
} else {
  kw = [];
}

function HighlightText(text) {
  return text;
}

//表格
function tableRender(tp, data) {
  var head = tp._head;
  var thead = '<thead align="center"> <tr> <th>#</th>';
  // head
  for (var i = 0; i < head.length; ++i) {
    thead += '<th>' + head[i] + '</th>';
  }
  thead += '</tr> </thead>';

  var body = data;
  var tbody = '<tbody>';
  for (var i = 0; i < body.length; ++i) {
    tbody += '<tr> <th scope="row">' + (i + 1) + '</th>';
    for (var j = 0; j < head.length; ++j) {
      tbody += '<td>' + itemRender('', tp[head[j]], data[i][head[j]]) + '</td>'
    }
    tbody += '</tr>';
  }
  tbody += '</tbody>';
  return '<div class="table-responsive"><table class="table table-striped table-bordered table-condensed">' + '<caption>' + (data.title || '') + '</caption>' + thead + tbody + '</table></div>';
}

//字符串
function stringRender(title, data, suffix) {
  if (!title) {
    return '<div class="item-card">'
      + '<div class="content">' + data + suffix + '</div>'
      + '</div>'
  }
  return '<div class="item-card">'
    + '<div class="title">' + title + ': ' + '</div>'
    + '<div class="content">' + data + suffix + '</div>'
    + '</div>'
}

//表格、容器、生成器
function panelRender(tp, title, data, content_type) {
  var id = $.getUniqueId();
  title = title || gettext('Item');

  var panel_body = '';
  if (content_type === 'table') {
    panel_body = '<div class="panel-body">' + tableRender(tp, data) + '</div>';
  } else if (content_type === 'container') {
    panel_body = '<div class="panel-body">' + ContainerRender(tp, data) + '</div>';
  } else if (content_type === 'generator') {
    panel_body = '<div class="panel-body">' + DataGeneratorRender(tp, data) + '</div>';
  }

  var content = '<div class="panel panel-default">'
    + '  <div class="panel-heading">'
    + '    <h4 class="panel-title">'
    + '      <a data-toggle="collapse" href="#' + id + '">' + title + '</a>'
    + '    </h4>'
    + '  </div>'
    + '  <div id="' + id + '" class="panel-collapse collapse in" content_type="' + content_type + '">'
    + panel_body
    + '  </div>'
    + '</div>';
  //$.asyncUpdateList.push(id)
  return content;
}

//图片
function picturesRender(title, tp, data) {
  if (data == null) return '';
  if (data.length === 0) return '';
  var id = guid();
  var imgs = '';
  if (tp.multi) {
    // 多张
    for (var i = 0; i < data.length; ++i) {
      var url = data[i];
      imgs += '<img class="img-responsive" src="' + url + '" alt="">';
    }
  } else {
    // 单张
    imgs = '<img class="img-responsive" src="' + data + '" alt="">'
  }

  return '<div class="panel panel-default">'
    + '  <div class="panel-heading">'
    + '    <h4 class="panel-title">'
    + '      <a data-toggle="collapse" href="#' + id + '">' + title + '</a>'
    + '    </h4>'
    + '  </div>'
    + '  <div id="' + id + '" class="panel-collapse collapse in">' + imgs
    + '  </div>'
    + '</div>';
}

//文件
function filesRender(title, tp, data) {
  if (data == null) return '';
  if (data.length === 0) return '';
  if (title.length === 0) title = gettext('File');

  if (tp.multi) {
    var id = guid();
    var files = '';
    for (var i = 0; i < data.length; ++i) {
      var url = data[i];
      files += '<a href="' + url + '">file' + i + '</a>&nbsp;';
    }

    
    return '<div class="panel panel-default">'
      + '  <div class="panel-heading">'
      + '    <h4 class="panel-title">'
      + '      <a data-toggle="collapse" href="#' + id + '">' + title + '</a>'
      + '    </h4>'
      + '  </div>'
      + '  <div id="' + id + '" class="panel-collapse collapse in">'
      + '    <div class="panel-body">' + files + '</div>'
      + '  </div>'
      + '</div>';
  } else {
    return '<div class="panel panel-default">'
      + '  <div class="panel-body"><a href="' + data + '">' + title + '</a></div>'
      + '</div>';
  }
}

// 数组
function arrayRender(title, tp, data) {
  if (!data) return '';
  var content = '';
  for (var i = 0; i < data.length; ++i) {
    content += itemRender('# ' + (i + 1), tp, data[i]);
  }

  var id = $.getUniqueId();
  return '<div class="panel panel-default">'
    + '  <div class="panel-heading">'
    + '    <h4 class="panel-title">'
    + '      <a data-toggle="collapse" href="#' + id + '">' + title + '</a>'
    + '    </h4>'
    + '  </div>'
    + '  <div id="' + id + '" class="panel-collapse collapse in">'
    + '    <div class="panel-body">' + content + '</div>'
    + '  </div>'
    + '</div>';
}

function itemRender(name, tp, data) {
  if (data == null) return '';
  tp.misc = tp.misc || {};
  // 字符串和选项
  if (tp.t === 1 || tp.t === 6) return stringRender(name, data, '');
  // 数值
  if (tp.t === 2) return stringRender(name, data, (tp.misc.unit == null ? '' : tp.misc.unit));
  // 范围
  if (tp.t === 3) {
    if (tp.misc.type === 0) {
      // 范围型
      var ub = (data.ub == null ? '?' : data.ub);
      var lb = (data.lb == null ? '?' : data.lb);
      if (ub === lb) {
        return stringRender(name, ub, (tp.misc.unit == null ? '' : tp.misc.unit));
      }
      else{
        return stringRender(name, lb + '~' + ub, (tp.misc.unit == null ? '' : tp.misc.unit));
      }
    } else if (tp.misc.type === 1) {
      // 误差型
      var val = (data.val == null ? '?' : data.val);
      var err = (data.err == null ? '?' : data.err);
      return stringRender(name, val + '±' + err, (tp.misc.unit == null ? '' : tp.misc.unit));
    } else return ''; // error type
  }
  // 图片
  if (tp.t === 4) return picturesRender(name, tp.misc, data);
  // 文件
  if (tp.t === 5) return filesRender(name, tp.misc, data);
  // 数组
  if (tp.t === 7) return arrayRender(name, tp.misc, data);
  // 表格
  if (tp.t === 8) {
    //$.savedTp[data] = tp.misc;
    return panelRender(tp.misc, name, data, 'table');
  }
  // 容器
  if (tp.t === 9) {
    //$.savedTp[data] = tp.misc;
    return panelRender(tp.misc, name, data, 'container')
  }
  // 生成器
  if (tp.t === 10) {
    return panelRender(tp.misc, name, data, 'generator')
  }
}

// template包含_ord和必要的键值。
//容器
function ContainerRender(template, data) {
  var result = '';
  for (var i = 0; i < template._ord.length; ++i) {
    var field = template._ord[i];
    result += itemRender(field, template[field], data[field]);
  }
  return result;
}

//生成器
function DataGeneratorRender(template, data) {
  var result = '';
  for (var i = 0; i < template._opt.length; ++i) {
    var field = template._opt[i];
    result += itemRender(field, template[field], data[field]);
  }
  return result;
}


function approveData(meta_id) {
  $.requestJSON({
    method: 'PATCH',
    url: Urls.resolve('api_v2_storage:review_data', {meta_id: meta_id}),
    data: {approved: true},
    onSuccess: function (json) {
      $.showModal({
        title: gettext("Success"),
        message: gettext("You have approved this data."),
        onOk: function () {
          window.location.reload();
        }
      })
    },
    onError: function () {
      window._jqHandled = true;
    }
  });
}

function disapproveData(meta_id) {
  var reasons = [];
  var cloned = $("#reason-div").clone();
  cloned.attr('id', 'real-reason-div');
  cloned.children().attr('id', 'real-reason-form');
  $.showModal({
    title: gettext("Please choose reasons of disapproval:"),
    message: cloned.html(),
    onOk: function (e) {
      $("#real-reason-form").find('input').each(function () {
        if ($(this).prop('checked')) {
          reasons.push(parseInt($(this).data('reasonId')));
        }
      });
      if (reasons.length === 0) {
        alert(gettext("Please choose at least one reason."));
        e.stopImmediatePropagation();
        return;
      }
      $.requestJSON({
        url: Urls.resolve('api_v2_storage:review_data', {meta_id: meta_id}),
        data: {approved: false, reasons: reasons},
        method: "PATCH",
        onSuccess: function () {
          $.showModal({
            title: gettext("Success"),
            message: gettext("Data disapproved."),
            onHide: function () {
              window.location.reload();
            }
          })
        },
        onHide: function () {
          window.location.reload();
        },
      })
    }
  });
}

//获取数据，输出
$(function () {
  $.requestJSON({
    method: 'GET',
    url: Urls.resolve('api_v2_storage:get_data', {oid: window.location.href.split('/').pop()}),
    onSuccess: function (json) {
      console.log(json);
      $('#data-content-inner').append(ContainerRender(json.data.template.content, json.data.content));
      $('#d-src').text(json.data.source || '');
      console.log(json.data.source);
      if (json.data.methods === undefined) json.data.methods = [];
      $('#d-methods').text(json.data.methods.join(','));
      var hl = new Highlighter();
      hl.highlight(document.getElementById('data-content-inner'), kw.join(' '));
    },
    onError: function () {
      window._jqHandled = true;
    }
  });

  $("#approve-btn").on('click', function () {
    approveData($(this).data('id'))
  });
  $("#disapprove-btn").on('click', function () {
    disapproveData($(this).data('id'))
  });
});
