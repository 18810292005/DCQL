var my_cv = null;   //原图画布
var my_ctx = null;

// ajax loading 加载信息
var opts = {
  lines: 13, // 花瓣数目
  length: 20, // 花瓣长度
  width: 10, // 花瓣宽度
  radius: 30, // 花瓣距中心半径
  corners: 1, // 花瓣圆滑度 (0-1)
  rotate: 0, // 花瓣旋转角度
  direction: 1, // 花瓣旋转方向 1: 顺时针, -1: 逆时针
  color: '#5882FA', // 花瓣颜色
  speed: 1, // 花瓣旋转速度
  trail: 60, // 花瓣旋转时的拖影(百分比)
  shadow: false, // 花瓣是否显示阴影
  hwaccel: false, //spinner 是否启用硬件加速及高速旋转
  className: 'spinner', // spinner css 样式名称
  zIndex: 2e9, // spinner的z轴 (默认是2000000000)
  top: 'auto', // spinner 相对父容器Top定位 单位 px
  left: 'auto'// spinner 相对父容器Left定位 单位 px
};
var spinner = new Spinner(opts);


// xrd 和 com输入数据的存放地址
var xrd_input = null;
var com_input = null;

// 算法运行结果存放地址
var prediction_path = null;
var label_path = null;
var result_path = null;

//load
$(document).ready(function () {

  my_cv = document.getElementById("resultCanvas");
  my_ctx = my_cv.getContext("2d");

  $('.btn').button();

  // 上传XRD数据，同时在文本框中显示上传文件的名称
  $('input[id=xrdfile]').change(function () {
    $.showLoading(true);
    var address = $(this).val().split("\\")[2];  // 只获取名称，获取真实的地址出现问题
    console.log(address);
    $('#addressXRD').val(address);

    var form_data = new FormData();
    var file_info = $('#xrdfile')[0].files[0];
    form_data.append('file', file_info);
    // 提交ajax的请求
    $.ajax({
      url: Urls.resolve('gphase:index'),
      type: 'POST',
      data: form_data,
      processData: false,  // tell jquery not to process the data
      contentType: false, // tell jquery not to set contentType
      success: function (result) {
        xrd_input = result.input_path;
        console.log("upload xrd data success " + result + " " + xrd_input);
      },
      complete: function () {
        $.showLoading(false);
      }
    }); // end ajax
  });

  // 上传composition数据，同时在文本框中显示上传文件的名称
  $('input[id=comfile]').change(function () {
    $.showLoading(true);
    var address = $(this).val().split("\\")[2];  // 只获取名称，获取真实的地址出现问题
    console.log(address);
    $('#addressCOM').val(address);

    var form_data = new FormData();
    var file_info = $('#comfile')[0].files[0];
    form_data.append('file', file_info);
    // 提交ajax的请求
    $.ajax({
      url: Urls.resolve('gphase:index'),
      type: 'POST',
      data: form_data,
      processData: false,  // tell jquery not to process the data
      contentType: false, // tell jquery not to set contentType
      success: function (result) {
        com_input = result.input_path;
        console.log("upload com data success " + com_input)
      },
      complete: function () {
        $.showLoading(false);
      }
    }); // end ajax
  });

  //点击下载按钮，下载算法生成结果
  $('.btn_download').on('click', function () {
    console.info("btn_download onclick...");
    var pr_path = prediction_path;
    var la_path = label_path;
    var re_path = result_path;
    console.log("presiction = " + pr_path + " label = " + la_path + " result = " + result_path);
    if (pr_path == null || la_path == null || re_path == null) {
      Alert(gettext("You must run the algorithm first!"), "warning")
    }
    else {
      var url = Urls.resolve('gphase:download_result');
      window.location.href = url + '?prediction=' + pr_path + "&label=" + la_path + "&result=" + re_path;
    }
  });

  //点击开始分析按钮，获取阈值（K）和去除背景（b）两个参数的值，后台运行分析算法
  $('.btn_calculate').on('click', function () {
    console.info("btn_calculate onclick...");
    var k = document.getElementById("k_value").value;
    var b = document.getElementById("b_value").value;
    var xrd = xrd_input;
    var com = com_input;

    console.log("K = " + k + ", b = " + b + ", xrd = " + xrd + ", com = " + com);

    if (!xrd || !com) {
      Alert(gettext("XRD data and its composition must be uploaded!"), "warning")
    }
    else {
      if (b == 0 || b == 1) {
        var url = Urls.resolve('gphase:calculate');
        var data = {
          "k": k,
          "b": b,
          "xrd": xrd,
          "com": com
        };
        postAjax(url, data, "cal");
      }
      else {
        Alert(gettext("The BG_Sub parameter must equal to 0 or 1!"), "warning")
      }
    }
  });

  // 点击entry system按钮，获取到弹窗输入的额外数据，将获取到输入数据、输出数据的地址以及参数，将其传送至后端以供后端找寻到相应文件按模板存储至mge系统中
  $('.btn_entry').on('click', function () {
    console.info("btn_entry onclick...");
    var system_name = document.getElementById("data_name").value;
    var title = document.getElementById("data_title").value;
    var doi = document.getElementById("data_doi").value;
    var abstract = document.getElementById("data_abstract").value;
    var keywords = document.getElementById("data_keywords").value;
    var source = document.getElementById("data_source").value;
    var reference = document.getElementById("data_reference").value;

    var k = document.getElementById("k_value").value;
    var b = document.getElementById("b_value").value;
    var xrd = xrd_input;
    var com = com_input;
    var prediction = prediction_path;
    var label = label_path;
    var result = result_path;
    console.log("system_name = " + system_name + ", K = " + k + ", b = " + b + ", xrd = " + xrd + ", com = " + com + ", result = " + result + ", prediction = " + prediction + ", label = " + label);

    if (system_name == "") {
      Alert(gettext("You need to enter the system name!"), "error")
    }
    else if (title == "") {
      Alert(gettext("You need to enter the title!"), "error")
    }
    else if (xrd == "" || com == "") {
      Alert(gettext("XRD data and its composition must be uploaded!"), "warning")
    }
    else {
      if (b == 0 || b == 1) {
        var url = Urls.resolve('gphase:entry_system');
        var data = {
          "system_name": system_name,
          "title": title,
          "doi": doi,
          "abstract": abstract,
          "keywords": keywords,
          "source": source,
          "reference": reference,
          "k": k,
          "b": b,
          "xrd": xrd,
          "com": com,
          "result": result,
          "prediction": prediction,
          "label": label
        };
        postAjax(url, data, "entry");
      }
      else {
        Alert(gettext("The BG_Sub parameter must equal to 0 or 1!"), "warning")
      }
    }
  });

});


/**
 * 公用ajax模板    用点击计算按钮时使用，不仅通知后台进行计算，同时将两个输入文件上传至后端
 * @param url  地址
 * @param data  数据
 */
function postAjax(url, data, flag) {
  var disableLoading = true;
  $.ajax({
    type: "POST",
    url: url,
    data: data,
    // processData: false,  // tell jquery not to process the data
    // contentType: false, // tell jquery not to set contentType
    dataType: "json",
    beforeSend: function () {   // ajax 发送前
      $.showLoading(true);
    },
    success: function (result) {
      if (flag == "cal") {
        if (result.code == 1) {
          disableLoading = false;
          console.log(result.data);
          var url = Urls.resolve('api_v1_task:one_task', {task_id: result.data});
          query_task(url);
        }
        else if (result.code == 0) {
          Alert(result.err_msg, "error");
        }
      }
      else if (flag == "entry") {
        if (result.code == 1) {
          console.log("entry system success");
          Alert(gettext("XRD data item entry system success!"), "success");
        }
        else if (result.code == 0) {
          Alert(result.err_msg, "error");
        }
      }
      else {
        console.log("postAjax success");
      }
    },
    error: function (e) {
      $.showLoading(false);
      Alert(gettext("Network error, please try again!"), "error");
    },
    complete: function () {
      if (disableLoading) {
        $.showLoading(false);
      }

    }
  });
}

function query_task(url) {
  console.log("query task ...");
  $.get(url, function (result) {
    console.log(result);
    var state = result.data.state;
    if (state === 'SUCCESS' && result.data.result != null) {
      prediction_path = result.data.result.prediction_url;
      label_path = result.data.result.label_url;
      result_path = result.data.result.result_url;
      console.log("calculate success " + prediction_path + " " + label_path + " " + result_path);
      var image = new Image();
      image.src = prediction_path;

      image.onload = function () {
        console.log("onload images");
        my_ctx.drawImage(image, 0, 0, 400, 300);
      };
      $.showLoading(false);
    }
    else if (state === 'FAILURE') {
      $.showLoading(false);
      Alert(gettext("The algorithm is running wrong. Please check the input data and parameter settings."), "error");
    }
    else {
      setTimeout("query_task('" + url + "')", 3000);
    }
  });
}

//jquery-confirm alert  提示框
function Alert(content, type) {
  if (type == "success") {
    $.alert({
      type: 'green',
      icon: 'fa fa-check',
      title: gettext("Prompt"),
      content: content
    });
  }
  else if (type == "error") {
    $.alert({
      type: 'red',
      icon: 'fa fa-times-circle',
      title: gettext("Prompt"),
      content: content
    });
  }
  else if (type == "warning") {
    $.alert({
      type: 'red',
      icon: 'fa fa-warning',
      title: gettext("Prompt"),
      content: content
    });
  }


}
