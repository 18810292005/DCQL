var dot_Templates = {
    temp_string: '<div id="temp-item-{{=it.id}}" class="form-inline t-item" data-stamp="{{=it.stamp}}" data-type="{{=it.type}}">' +
    '  <div class="td-title">{{=it.title}}</div>' +
    '  <div class="td-container"></div>' +
    '  <div class="input-group">' +
    // '    <span class="input-group-addon" hidden>{{=it.title}}</span>' +
    '    <select class="form-control td-str-sel">' +
    '      <option value="eq">'+gettext('equals')+'</option>' +
    '      <option value="ne">'+gettext('not equals')+'</option>' +
    '      <option value="contain">'+gettext('contains')+'</option>' +
    '      <option value="not_contain">'+gettext('not contains')+'</option>' +
    '    </select>' +
    '  </div>' +
    '  <input class="form-control td-str-text" type="text" placeholder="' + gettext('Press Enter to add a keyword.') + '">' +
    '  <button class="btn btn-danger" onclick="destroy_item(\'temp-item-container\', \'temp-item-{{=it.id}}\')">' +
    '    <span class="glyphicon glyphicon-remove"></span>' +
    '  </button>' +
    '</div>'

    ,

    temp_string_d:
    '<span class="td-str-one form-control">' +
    ' <label>{{=it.val}}</label>' +
    ' <button><span class="glyphicon glyphicon-remove"></span></button>' +
    '</span>'

    ,

    temp_number: '<div id="temp-item-{{=it.id}}" class="form-inline t-item" data-stamp="{{=it.stamp}}" data-type="{{=it.type}}">' +
    '  <div class="td-title">{{=it.title}}</div>' +
    '  <div class="td-container"></div>' +
    '  <div class="input-group select-sec">' +
    // '    <span class="input-group-addon" hidden>{{=it.title}}</span>' +
    '    <select class="form-control">' +
    '      <option value="equ">=</option>' +
    '      <option value="lte">&le;</option>' +
    '      <option value="gte">&ge;</option>' +
    '      <option value="ne">&ne;</option>' +
    '    </select>' +
    '  </div>' +
    '  <div class="input-group input-sec">' +
    '    <input class="form-control" type="number">' +
    '    <span class="input-group-addon">{{=it.unit}}</span>' +
    '  </div>' +
    '  <button class="btn btn-danger" onclick="destroy_item(\'temp-item-container\', \'temp-item-{{=it.id}}\')">' +
    '    <span class="glyphicon glyphicon-remove"></span>' +
    '  </button>' +
    '</div>',

    temp_range_i: '<div id="temp-item-{{=it.id}}" class="form-inline t-item" data-stamp="{{=it.stamp}}" data-type="{{=it.type}}">' +
    '  <label>{{=it.title}}</label>' +
    '  <select class="form-control">\n' +
    '    <option value="contain">' + gettext("contains") + '</option>\n' +
    '    <option value="in">' + gettext("in") + '</option>\n' +
    '  </select>\n' +
    '  <input class="form-control" type="number">' +
    '  <span>~</span>\n' +
    '  <input class="form-control" type="number"> ' +
    '  <span>{{=it.unit}}</span>' +
    '  <button class="btn btn-danger" onclick="destroy_item(\'temp-item-container\', \'temp-item-{{=it.id}}\')">' +
    '    <span class="glyphicon glyphicon-remove"></span>' +
    '  </button>' +
    '</div>'

    ,

    // td - template data
    temp_range_c: '<div id="temp-item-{{=it.id}}" class="form-inline t-item" data-stamp="{{=it.stamp}}" data-type="{{=it.type}}">' +
      '  <label>{{=it.title}}</label>' +
      '  <button class="btn btn-danger" onclick="destroy_item(\'temp-item-container\', \'temp-item-{{=it.id}}\')">' +
      '    <span class="glyphicon glyphicon-remove"></span>' +
      '  </button>' +
      '  <div class="td-val">' +
      '    <span>value in range:</span>' +
      '    <input class="td-val-lb form-control" type="number" />' +
      '    <span>~</span>' +
      '    <input class="td-val-ub form-control" type="number" />' +
      '  </div>' +
      '  <div class="td-err">' +
      '    <span>max error:</span>' +
      '    <input class="td-err-ub form-control" type="number" />' +
      '    <span>{{=it.unit}}</span>' +
      '  </div>' +
      '</div>'

      ,

    temp_choice: '<div id="temp-item-{{=it.id}}" class="form-inline t-item" data-stamp="{{=it.stamp}}" data-type="{{=it.type}}">' +
    '  <div class="td-title">{{=it.title}}</div>' +
    '  <div class="input-group select-ctr">' +
    // '    <span class="input-group-addon" hidden>{{=it.title}}</span>' +
    '    <select class="form-control">' +
    '      <option value="in">' + gettext('in') + '</option>' +
    '      <option value="nin">' + gettext('not in') + '</option>' +
    '    </select>' +
    '  </div>' +
    '  <div class="input-group select-main">' +
    '    <select class="selectpicker" multiple>' +
    '    {{for (var op in it.choices["opt"]) { }}' +
    '      <option value={{=it.choices["opt"][op]}}>{{=it.choices["opt"][op]}}</option>' +
    '    {{ } }}' +
    '    {{for (var gp in it.choices["grp"]) { }}' +
    '      <optgroup label = {{=it.choices["grp"][gp]["name"]}}>' +
    '      {{for (var op in it.choices["grp"][gp]["items"]) { }}' +
    '        <option value="{{=it.choices["grp"][gp]["items"][op]}}">{{=it.choices["grp"][gp]["items"][op]}}</option>' +
    '      {{ } }}' +
    '      </optgroup>' +
    '    {{ } }}' +
    '    </select>' +
    '  </div>' +
    '  <button class="btn btn-danger" onclick="destroy_item(\'temp-item-container\', \'temp-item-{{=it.id}}\')">' +
    '    <span class="glyphicon glyphicon-remove"></span>' +
    '  </button>' +
    '</div>'
};

Object.freeze(dot_Templates);
var compiled_template_temp_string = doT.template(dot_Templates.temp_string);
var compiled_template_temp_string_d = doT.template(dot_Templates.temp_string_d);
var compiled_template_temp_number = doT.template(dot_Templates.temp_number);
var compiled_template_temp_range_i = doT.template(dot_Templates.temp_range_i);
var compiled_template_temp_range_c = doT.template(dot_Templates.temp_range_c);
var compiled_template_temp_choice = doT.template(dot_Templates.temp_choice);

/*
表示当前动态创建的 dom 元素的 序号
 */
var temp_item_id;

/**
 * 在 father_id 指定的容器下，新建 用 data 渲染 的 compileTemplate 模板的 dom 元素；
 * @param father_id           容器的id
 * @param compiledTemplate    doT模板
 * @param data                渲染数据
 * @returns temp_item_id      新建的dom元素的id的序号部分
 */
function create_item(father_id, compiledTemplate, data) {
    $('#temp-clear-all').removeAttr('disabled');

    data["id"] = temp_item_id.toString();
    // alert(JSON.stringify(data, null, 4));
    var obj = compiledTemplate(data);
    $('#' + father_id).append(obj);
    if (compiledTemplate == compiled_template_temp_string) {
      $('#' + father_id).find('>div:last>input.td-str-text')
        .keypress(function(e){
          var eCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
          if (eCode == 13){
            var obj = e.target;
            var value = $(obj).val();
            var op = $(obj).parent().find('>div.input-group>select').val();
            if (value != '' && op != 'contain' && op != 'not_contain') {
              $(obj).val('');
              $(obj).parent().find('>div.td-container').append(compiled_template_temp_string_d({"val":value}));
              $(obj).parent().find('>div.td-container>span:last>button').click(function(e){
                $(e.target).parents('span').remove();
              })
            }
          }
        })
        .blur(function(e){
          var obj = e.target;
          var value = $(obj).val();
          var op = $(obj).parent().find('>div.input-group>select').val();
          if (value != '' && op != 'contain' && op != 'not_contain') {
            $(obj).val('');
            $(obj).parent().find('>div.td-container').append(compiled_template_temp_string_d({"val":value}));
            $(obj).parent().find('>div.td-container>span:last>button').click(function(e){
              $(e.target).parents('span').remove();
            })
          }
        });
      $('#' + father_id).find('>div:last>div.input-group>select.td-str-sel').change(function(e){
        var obj = e.target;
        $(obj).parent().parent().find('>div.td-container').empty();
      })
    } else if (compiledTemplate == compiled_template_temp_number) {
      $('#' + father_id).find('>div:last>div.input-sec>input')
        .keypress(function(e){
          var eCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
          if (eCode == 13){
            var obj = e.target;
            var value = $(obj).val();
            var op = $(obj).parent().parent().find('>div.select-sec>select').val();
            if (value != '' && op != 'lte' && op != 'gte') {
              $(obj).val('');
              $(obj).parent().parent().find('>div.td-container').append(compiled_template_temp_string_d({"val":value}));
              $(obj).parent().parent().find('>div.td-container>span:last>button').click(function(e){
                $(e.target).parents('span').remove();
              })
            }
          }
        })
        .blur(function(e){
          var obj = e.target;
          var value = $(obj).val();
          var op = $(obj).parent().parent().find('>div.select-sec>select').val();
          if (value != '' && op != 'lte' && op != 'gte') {
            $(obj).val('');
            $(obj).parent().parent().find('>div.td-container').append(compiled_template_temp_string_d({"val":value}));
            $(obj).parent().parent().find('>div.td-container>span:last>button').click(function(e){
              $(e.target).parents('span').remove();
            })
          }
        });
      $('#' + father_id).find('>div:last>div.select-sec>select').change(function(e){
        var obj = e.target;
        $(obj).parent().parent().find('>div.td-container').empty();
      });
    } else if (compiledTemplate == compiled_template_temp_choice) {
      $('#' + father_id).find('>div:last>div.select-main>select.selectpicker').selectpicker({
        style: 'multi-select-btn',
      });
    }

    temp_item_id++;
    return temp_item_id;
}

/**
 * 删除 father_id 指定的容器下，id 为 child_id 的 dom 的元素；
 * @param father_id
 * @param child_id
 */
function destroy_item(father_id, child_id) {
    // alert(child_id);
    // alert(document.getElementById(child_id));
    document.getElementById(father_id).removeChild(document.getElementById(child_id));
    if (father_id == 'temp-item-container') {
      if ($('#temp-item-container').children().length == 0) {
        $('#temp-clear-all').attr('disabled', true);
      }
    }
}

/**
 * 对于模板的各个字段创建搜索筛选项
 * @param type              字段的类型 (1~9...)
 * @param title             字段名
 * @param stamp             在对模板树深度优先搜索过程的时间戳，用于收集整理用户在前端填写的搜索表单数据
 * @param unit              数值类型或者范围类型的单位
 * @param choices           候选类型的候选项
 */
function create_temp_filter(type, title, stamp, unit, choices, path) {
    var temp_data = {
        "title": path.join('.'),
        "stamp": stamp,
        "type": type
    };
    if (type == 1) {
        create_item("temp-item-container", compiled_template_temp_string, temp_data);
    } else if (type == 2) {
        temp_data['unit'] = unit || '';
        if (path[path.length - 1] != title) {
          temp_data['title'] += '.' + title;
        }
        create_item("temp-item-container", compiled_template_temp_number, temp_data);
    } else if (type == 300) {
        temp_data['unit'] = unit || '';
        create_item("temp-item-container", compiled_template_temp_range_i, temp_data);
    } else if (type == 301) {
        temp_data['unit'] = unit || '';
        create_item("temp-item-container", compiled_template_temp_range_c, temp_data);
    } else if (type == 6) {
        temp_data['choices'] = choices || [];
        // alert(JSON.stringify(temp_data, null, 4));
        create_item("temp-item-container", compiled_template_temp_choice, temp_data);
    }
}

/*
cur_temp_id 表示当前选择的模板的 id，页面刚加载完时该变量未赋值；
cur_temp_data 表示描述当前选择模板的数据，页面刚加载完时该变量未赋值；
dfs_stamp 临时变量，用于标记对模板树深度优先搜素时的 时间戳
 */
var cur_temp_id;
var cur_temp_data;
var dfs_stamp;

/**
 * 搜索模板树，将模板转化为 bootstrap-treeview 支持的 树形数据类型
 * @param data                    深度优先搜索时的当前子树表示的数据
 * @param title                   当前子树的数据的字段名
 * @returns ret                   bootstrap-treeview 支持的数据类型
 */
var cur_path;
function template_to_tree(data, title) {
    var ret;
    dfs_stamp++;
    var tpath = [];
    for (var i = 0; i < cur_path.length; i++) {
      tpath.push(cur_path[i]);
    }
    if (data["t"] === 1) {
        ret = {
            text: title,
            path: tpath,
            tags: [gettext('text')],
            t: 1,
            stamp: dfs_stamp
        };
    } else if (data["t"] === 2) {
        var unit = '';
        if ("misc" in data && "unit" in data["misc"]) unit = data["misc"]["unit"];
        ret = {
            text: title,
            path: tpath,
            t: 2,
            stamp: dfs_stamp,
            unit: unit
        };
    } else if (data["t"] === 3) {
        var unit = '';
        if ("misc" in data && "unit" in data["misc"]) unit = data["misc"]["unit"];
        var ty = 300 + ((data["misc"]["type"]) ? 1 : 0);
        if (ty == 300) {
          ret = {
              text: title,
              t: ty,
              stamp: dfs_stamp,
              selectable: false,
              unit: unit,
              nodes: [
                {
                  text: gettext('lower bound'),
                  path: tpath,
                  t: 2,
                  stamp: dfs_stamp,
                  unit: unit
                },
                {
                  text: gettext('upper bound'),
                  path: tpath,
                  t: 2,
                  stamp: dfs_stamp,
                  unit: unit
                }
              ]
          };
        } else if (ty == 301) {
          ret = {
              text: title,
              t: ty,
              stamp: dfs_stamp,
              selectable: false,
              unit: unit,
              nodes: [
                {
                  text: gettext('value'),
                  path: tpath,
                  t: 2,
                  stamp: dfs_stamp,
                  unit: unit
                },
                {
                  text: gettext('deviation'),
                  path: tpath,
                  t: 2,
                  stamp: dfs_stamp,
                  unit: unit
                }
              ]
          };
        }
    } else if (data["t"] === 4) {
        ret = {
            text: title,
            path: tpath,
            t: 4,
            selectable: false,
            stamp: dfs_stamp
        };
    } else if (data["t"] === 5) {
        ret = {
            text: title,
            path: tpath,
            t: 5,
            selectable: false,
            stamp: dfs_stamp
        };
    } else if (data["t"] === 6) {
        ret = {
            text: title,
            path: tpath,
            t: 6,
            stamp: dfs_stamp,
            choices: data["misc"]
        };
    } else if (data["t"] === 7) {
        return template_to_tree(data["misc"], title)
    } else if (data["t"] === 8) {
        var heads = data["misc"]["_head"];
        var node_data = []
        for (var i in heads) {
          var field = heads[i];
          cur_path.push(field);
          node_data.push(template_to_tree(data["misc"][field], field));
          cur_path.pop();
        }
        ret = {
          text: title,
          path: tpath,
          t: 8,
          selectable: false,
          nodes: node_data,
          stamp: dfs_stamp
        };
    } else if (data["t"] === 9) {
        var container_fields_ord = data["misc"]["_ord"];
        var node_data = [];
        for (var i in container_fields_ord) {
            var field = container_fields_ord[i];
            cur_path.push(field);
            node_data.push(template_to_tree(data["misc"][field], field));
            cur_path.pop();
        }
        ret = {
            text: title,
            path: tpath,
            nodes: node_data,
            selectable: false,
            t: 9,
            stamp: dfs_stamp
        };
    } else if (data["t"] === 10) {
        var node_data = [];
        var generator_fields_ord = data["misc"]["_opt"];
        for (var i in generator_fields_ord) {
            var field = generator_fields_ord[i];
            cur_path.push(field);
            node_data.push(template_to_tree(data["misc"][field], field));
            cur_path.pop();
        }
        ret = {
            t: 10,
            text: title,
            path: tpath,
            selectable: false,
            nodes: node_data,
            stamp: dfs_stamp
        };
    } else {
    }
    // alert(JSON.stringify(ret, null, 4));
    return ret;
}


/**
 * 调用 template_to_tree 将将模板转化为 bootstrap-treeview 支持的 树形数据类型
 * @param data                      template 数据
 * @returns {Array}                 bootstrap-treeview 支持的数据类型
 */
function construct_temp_tree(data) {
    dfs_stamp = 0;
    cur_path = [];
    var template_data = data['data'];
    cur_temp_data = template_data;
    var data = [];
    var content_field_ord = template_data["content"]["_ord"];
    for (var i in content_field_ord) {
      cur_path.push(content_field_ord[i]);
      data.push(template_to_tree(template_data["content"][content_field_ord[i]], content_field_ord[i]));
      cur_path.pop();
    }
    // alert(JSON.stringify(data, null));
    return data;
}


/**
 * 初始化 bootstrap-treeview
 * @param data template 数据
 */
function init_tree_view(data) {
    // alert(JSON.stringify(data["data"], null));
    $("#temp-item-container").empty();
    $("#temp-tree").treeview({
        data: construct_temp_tree(data),
        onNodeSelected: function (event, node) {
            // alert(event);
            create_temp_filter(node.t, node.text, node.stamp, node.unit, node.choices, node.path);
            $("#temp-tree").treeview('toggleNodeSelected', node.nodeId);
        }
    });
    $("#temp-tree").treeview('collapseAll', {
        silent: true
    });
}

/**
 * GET 方法向服务器请求 template 数据
 * @param id                  tempalte 数据的 id
 */
function update_temp_id(id) {
    cur_temp_id = id;

    if (id > 0) {
      $('#temp-filter-sec').show();
      $.requestJSON({
          method: "GET",
          url: Urls.resolve('api_v1_storage:template_one', {
              tid: id
          }),
          onSuccess: init_tree_view
      })
    } else {
      $('#temp-filter-sec').hide();
    }
    //init_tree_view();
}

// 构造元数据搜索参数字符串
function constructMetaParam(){
  return "";
}

// 收集表单数据

function collect_filter_data() {
  var dic = {};
  var filters = $("#temp-item-container").children("div");
  for (var i = 0; i < filters.length; i++) {
      var arr = $(filters[i]).find('>div.td-title').text().split('.');
      var key = arr[arr.length - 1];
      var type = filters[i].getAttribute('data-type');
      var stamp = filters[i].getAttribute('data-stamp');
      if (!(stamp in dic)) dic[stamp] = [];

      if (type === '1') {
          var text = [];
          var op = $(filters[i]).find('>div.input-group>select').val();
          var objs = $(filters[i]).find('>div.td-container').children('span').find('>label');

          if (objs.length > 0) {
            if (objs.length > 1) {
              for (var j = 0; j < objs.length; j++) {
                text.push(objs.eq(j).text());
              }
              if (op == 'ne') {
                op = 'nin';
              } else if (op == 'eq') {
                op = 'in';
              }
            } else {
              text = objs.eq(0).text();
              if (op == 'ne') {
                op = 'neq';
              } else if (op == 'eq') {
                op = 'eq';
              }
            }
          } else {
            text = $(filters[i]).find('>input').val();
            if (op == 'contain') {
              op = 'contains';
            } else if (op == 'not_contain') {
              op = 'ncontains';
            }
          }

          dic[stamp].push({
              "type": type,
              "field": key,
              "text": {
                "word": text,
                "op": op
              }
          });
      } else if (type === '2') {
          var objs = $(filters[i]).find('>div.td-container').children('span').find('>label')
          var text = $(filters[i]).find('>div.input-sec>input').val();
          var op = $(filters[i]).find('>div.select-sec>select').val();
          var tmp = {};
          if (objs.length > 0) {
            var nums = [];
            for (var j = 0; j < objs.length; j++) {
              nums.push(parseFloat(objs.eq(j).text()));
            }
            if (objs.length == 1) {
              if (op == 'equ') {
                tmp['eq'] = nums[0];
              } else if (op == 'ne') {
                tmp['neq'] = nums[0];
              }
            } else {
              if (op == 'equ') {
                tmp['in'] = nums;
              } else if (op == 'ne') {
                tmp['nin'] = nums;
              }
            }
          } else {
            if (op == 'equ') {
              tmp['eq'] = parseFloat(text);
            } else if (op == 'lte') {
              tmp['lte'] = parseFloat(text);
            } else if (op == 'gte') {
              tmp['gte'] = parseFloat(text);
            } else if (op == 'ne') {
              tmp['neq'] = parseFloat(text);
            }
          }
          if (key == gettext('lower bound')) {
            key = 'lb';
          } else if (key == gettext('upper bound')) {
            key = 'ub'
          } else if (key == gettext('value')) {
            key = 'val';
          } else if (key == gettext('deviation')) {
            key = 'err';
          }

          dic[stamp].push({
            "type": type,
            "field": key,
            "text": tmp
          })
      } else if (type === '300') {
          var op = $(filters[i]).find('>select').val();
          var text = $(filters[i]).find('>input').val();
          var tmp = {};
          if (op == 'equ') {
            tmp['eq'] = parseFloat(text);
          } else if (op == 'lte') {
            tmp['lte'] = parseFloat(text);
          } else if (op == 'gte') {
            tmp['gte'] = parseFloat(text);
          } else if (op == 'ne') {
            tmp['neq'] = parseFloat(text);
          }
          dic[stamp].push({
            "type": type,
            "field": key,
            "text": tmp
          })
      } else if (type == '301') {
          var op = $(filters[i]).find('>select').val();
          var text = $(filters[i]).find('>input').val();
          var tmp = {};
          if (op == 'equ') {
            tmp['eq'] = parseFloat(text);
          } else if (op == 'lte') {
            tmp['lte'] = parseFloat(text);
          } else if (op == 'gte') {
            tmp['gte'] = parseFloat(text);
          } else if (op == 'ne') {
            tmp['neq'] = parseFloat(text);
          }
          dic[stamp].push({
            "type": type,
            "field": key,
            "text": tmp
          })
      } else if (type === '6') {
          var op = $(filters[i]).find('>div.select-ctr>select').val();
          var opts = $(filters[i]).find('>div.select-main>div>select.selectpicker').val();
          dic[stamp].push({
              "type": type,
              "field": key,
              "text": {
                "op": op,
                "opts": opts
              }
          });
      }
  }
  return dic;
}

// 构造模板搜索参数数组
//0 表示fa是容器或者content，1 表示数组，2 表示表格，3是生成器
function template_ref_to_query_array(data, dic, title, fa_type, col) {
  dfs_stamp ++;
  var tpath = [];
  for (var i = 0; i < cur_path.length; i++) {
    tpath.push(cur_path[i]);
  }
  if (data["t"] == 1) {
    if (dfs_stamp in dic) {
      for (var i = 0; i < dic[dfs_stamp].length; i++) {
        var h_op = dic[dfs_stamp][i]["text"]["op"];
        col.push({
          'path': tpath,
          'op': h_op,
          'val': dic[dfs_stamp][i]["text"]["word"]
        });
      }
    }
  } else if (data["t"] == 2) {
    if (dfs_stamp in dic) {
      var value = {};
      for (var i = 0; i < dic[dfs_stamp].length; i++) {
        if ("lte" in dic[dfs_stamp][i]['text']) {
          col.push({
            'path': tpath,
            'op': 'lte',
            'val': dic[dfs_stamp][i]['text']['lte']
          });
        }
        if ("gte" in dic[dfs_stamp][i]['text']) {
          col.push({
            'path': tpath,
            'op': 'gte',
            'val': dic[dfs_stamp][i]['text']['gte']
          });
        }
        if ('eq' in dic[dfs_stamp][i]['text']) {
          col.push({
            'path': tpath,
            'op': 'eq',
            'val': dic[dfs_stamp][i]['text']['eq']
          });
        }
        if ('neq' in dic[dfs_stamp][i]['text']) {
          col.push({
            'path': tpath,
            'op': 'neq',
            'val': dic[dfs_stamp][i]['text']['neq']
          });
        }
        if ('in' in dic[dfs_stamp][i]['text']) {
          col.push({
            'path': tpath,
            'op': 'in',
            'val': dic[dfs_stamp][i]['text']['in']
          })
        }
        if ('nin' in dic[dfs_stamp][i]['text']) {
          col.push({
            'path': tpath,
            'op': 'nin',
            'val': dic[dfs_stamp][i]['text']['nin']
          })
        }
      }
    }
  } else if (data["t"] == 3) {
    if (dfs_stamp in dic) {
      for (var i = 0; i < dic[dfs_stamp].length; i++) {
        if ("lte" in dic[dfs_stamp][i]['text']) {
          col.push({
            'path': tpath,
            'op': 'lte',
            'range': dic[dfs_stamp][i]['field'],
            'val': dic[dfs_stamp][i]['text']['lte']
          });
        }
        if ("gte" in dic[dfs_stamp][i]['text']) {
          col.push({
            'path': tpath,
            'op': 'gte',
            'range': dic[dfs_stamp][i]['field'],
            'val': dic[dfs_stamp][i]['text']['gte']
          });
        }
        if ('eq' in dic[dfs_stamp][i]['text']) {
          col.push({
            'path': tpath,
            'op': 'eq',
            'range': dic[dfs_stamp][i]['field'],
            'val': dic[dfs_stamp][i]['text']['eq']
          });
        }
        if ('neq' in dic[dfs_stamp][i]['text']) {
          col.push({
            'path': tpath,
            'op': 'neq',
            'range': dic[dfs_stamp][i]['field'],
            'val': dic[dfs_stamp][i]['text']['neq']
          });
        }
        if ('in' in dic[dfs_stamp][i]['text']) {
          col.push({
            'path': tpath,
            'op': 'in',
            'range': dic[dfs_stamp][i]['field'],
            'val': dic[dfs_stamp][i]['text']['in']
          });
        }
        if ('nin' in dic[dfs_stamp][i]['text']) {
          col.push({
            'path': tpath,
            'op': 'nin',
            'range': dic[dfs_stamp][i]['field'],
            'val': dic[dfs_stamp][i]['text']['nin']
          });
        }
      }
    }
  } else if (data["t"] == 4) {
    // 图片
  } else if (data["t"] == 5) {
    // 文件
  } else if (data["t"] == 6) {
    if (dfs_stamp in dic) {
      for (var i = 0; i < dic[dfs_stamp].length; i++) {
        var tmp_lim = dic[dfs_stamp][i];
        col.push({
          'path': tpath,
          'op': dic[dfs_stamp][i]['text']['op'],
          'val': dic[dfs_stamp][i]['text']['opts']
        });
      }
    }
  } else if (data["t"] == 7) {
    template_ref_to_query_array(data["misc"], dic, title, 1, col);
  } else if (data["t"] == 8) {
    var heads = data["misc"]["_head"];
    for (var i = 0; i < heads.length; i++) {
      var head = heads[i];
      cur_path.push(head);
      template_ref_to_query_array(data["misc"][head], dic, head, 2, col);
      cur_path.pop();
    }
  } else if (data["t"] == 9) {
    var container_fields_ord = data["misc"]["_ord"];
    for (var i = 0; i < container_fields_ord.length; i++) {
      var field = container_fields_ord[i];
      cur_path.push(field);
      template_ref_to_query_array(data["misc"][field], dic, field, 0, col);
      cur_path.pop();
    }
  } else if (data["t"] == 10) {
    var generator_fields_ord = data["misc"]["_opt"];
    for (var i = 0; i < generator_fields_ord.length; i++) {
      var field = generator_fields_ord[i];
      cur_path.push(field);
      template_ref_to_query_array(data["misc"][field], dic, field, fa_type, col);
      cur_path.pop();
    }
  }
}

function constructTempParam(dic){
  var ret = [];
  cur_path = [];
  dfs_stamp = 0;
  if(cur_temp_data == null) return ret;
  var template_content = cur_temp_data["content"];
  var content_field_ord = template_content["_ord"];
  for (var i in content_field_ord) {
      var key = content_field_ord[i];
      cur_path.push(key);
      template_ref_to_query_array(template_content[key], dic, key, 0, ret);
      cur_path.pop();
  }
  // alert(JSON.stringify(ret, null, 4));
  return ret;
}

function advSearch2(){
  var q = {
    tid: cur_temp_id,
    meta: constructMetaParam(),
    template: constructTempParam(collect_filter_data())
  };
  var params = {
    type: 'mix',
    query: $.base64.btoa(JSON.stringify(q), true),
    page: 1
  };
  window.open(Urls.resolve('search:search') + '/?' + $.param(params));
}

$(function () {
    /**
     * 默认的搜索模式alert
     * @type {string}
     */
    search_mode_name = "both";

    /**
     * 标记是否有选择模板
     * @type {number}
     */
    cur_temp_id = 0;

    /**
     * 初始化筛选项 dom 元素的 id
     */
    temp_item_id = 10000;

    /**
     * 点击开始搜索，开始显示第一页的内容
     */
    $("#start").click(function () {
        advSearch2();
    });

    $('#temp-clear-all').click(function (e) {
      $('#temp-item-container').empty();
      $('#temp-clear-all').attr('disabled', true);
    });
    /**
     * 隐藏temp-filter-sec
     */
    $('#temp-clear-all').attr('disabled', true);

    $('#temp-filter-sec').hide();

    /**
     * 初始化 选择模板的控件
     * @type {*|jQuery|HTMLElement}
     */
    var mCategory = $('#m-category'),
        dTemplate = $('#d-template');

    /**
     * 获取数据库内部的模板数据，该函数定义在 storage.js 内
     */
    getMaterialClassTree(mCategory, function (data) {
        fillMaterialClassTree(data.data, mCategory, '');
    });

    /**
     * 选择模板
     */
    mCategory.change(function () {
        window._committed = false;
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
                $.each(resp.data, function (i, it) {
                    dTemplate.append('<option value="' + it.id + '">' + it.title + '</option>');
                });
            });
        }
    });
});
