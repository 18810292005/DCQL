$(function(){
  if(!window.MGE) window.MGE = {};

  if(!window.MGE.uitls) window.MGE.apis = {};

  // 对应api：DELETE /api/v1/storage/file/data/content
  // 位于：apps.storage.apis.v1_0.file.uploaded_data_content_file
  // 正常返回值：code: 204；data: null
  // 错误返回值：错误码和message
  window.MGE.apis.deleteDataContentFile = function(file_url, callback, error_callback) {
    if(!Array.isArray(file_url)){
      file_url = [file_url];
    }
    $.ajax({
      url: Urls.resolve('api_v1_storage:data_content_file'),
      method: 'DELETE',
      data: JSON.stringify(urls),
      dataType: 'json',
      contentType: 'application/json'
    }).done(function(rep){
      if(callback) callback();
    }).fail(function(rep){
      // 错误时传递code和msg
      if(error_callback) error_callback(rep.code, rep.msg);
    });
  };

  // 对应api：DELETE /api/v1/storage/file/data/content
  // 位于：apps.storage.apis.v1_0.file.uploaded_data_content_file
  // files：来自于input type=file的files属性
  // on_progress_update参数：进度值（0~100）
  // callback参数：url的列表
  window.MGE.apis.uploadDataContentFile = function(files, file_type, on_progress_update, callback, error_callback) {
    if(!files || files.length == 0){
      console.warn('No file selected.');
      return;
    }
    var form_data = new FormData();
    var form_len = 0;
    $.each(files, function(i, file){
      if(file.size > 100 * 1024 * 1024){
        error_callback(0, gettext('Your file is large than 100MB, it will be ignored.'));
        return;
      }
      form_data.append('files[]', file);
      form_len += 1;
    });
    if(form_len < 1){
      conosle.warn('No file selected');
      return;
    }
    form_data.append('type', file_type);
    if(on_progress_update) on_progress_update(0);

    $.ajax({
      url: Urls.resolve('api_v1_storage:data_content_file'),
      data: form_data,
      processData: false,
      contentType: false,
      type: 'POST',
      xhr: function(){
        var my_xhr = $.ajaxSettings.xhr();
        if(my_xhr.upload) {
          my_xhr.upload.addEventListener('progress', function(e){
            if(e.lengthComputable) {
              var percent = (e.loaded / e.total * 100 | 0);
              on_progress_update(percent);
            }
          }, false);
        }
        return my_xhr;
      }
    }).done(function(rep){
      if(callback) callback(rep.data);
    }).fail(function(rep){
      if(error_callback) error_callback(rep.code, rep.msg);
    })
  };

  window.MGE.filePickerView = {
    Event: {
      INFORM_UPDATE: 'mge-file-picker-evnet-update' // 提示顶层view更新一下url列表
    },
    createCard: function($parent, is_image, url) {
      var media_prefix=$('meta[name=media-url-prefix]').attr('content');
      var $content_view = null;
      var $remove_button_view = null;
      var file_name = url.slice(url.lastIndexOf('/')+1);
      if(is_image) {
        $content_view = $('<img class="img-thumbnail mge-thumbnail"src="'+ media_prefix + url + '"></img>');
        $remove_button_view = $('<button class="image-remove"><i class="material-icons">close</i></button>');
      }
      else {
        var file_name = url.slice(url.lastIndexOf('/')+1);
        $content_view = $('<a target="_blank" href="'+media_prefix + url + '">'+file_name+'</a>');
        $remove_button_view = $('<button class="file-remove"><i class="material-icons">close</i></button>')
      }
      var $view = $(
          '<div class="mge-file-picker-card">' + '</div>'
      );
      $view.append($remove_button_view, $content_view);
      $view.data('url', url);

      $remove_button_view.click(function(){
        $parent.find('input[type=file]').val('');
        $view.remove();
        $parent.trigger(window.MGE.filePickerView.Event.INFORM_UPDATE);
      });
      return $view;
    },

    _createRootView: function(is_multi, is_image, is_required){
      var $view = $('<div class="mge-file-picker"></div>');
      $view.on(window.MGE.filePickerView.Event.INFORM_UPDATE, function() {
        var urls = []
        $view.data('urls', []);
        $view.find('.mge-file-picker-card').each(function(i){
          urls.push($(this).data('url'));
          $view.data('urls', urls);
        });
      });
      if(is_required) $view.attr('required', true);
      return $view;
    },

    createPicker: function(is_multi, is_image, is_required, urls) {
      var acc_type = (is_image ? 'image/*' : '');
      var file_type = (is_image ? 'image' : '');
      var multi = (is_multi ? 'multiple' : '');
      var $view = this._createRootView(is_multi, is_image, is_required);
      
      var $input_view = $('<input type="file" style="display:none" '+ multi +' accept="'+acc_type + '"></input>');
      $input_view.change(function(){
        if(this.files.length == 0){
          return;
        }
        $('body').preloader({
          text: gettext('Uploading...'),
          percent: '0'
        });
        // 先上传，然后创建新的view，最后提示rootView更新
        window.MGE.apis.uploadDataContentFile($input_view.get(0).files, file_type, 
          // progress  
          function(percent){
            $('body').preloader('update', {
              percent: percent.toString(),
              text: gettext('Uploading...')
            });
          },
          function(urls){
            $('body').preloader('remove');
            // 先创建对应的所有view，然后提示rootView更新
            if(!is_multi) $view.find('.mge-file-picker-card').remove();
            $.each(urls, function(i, url){
              $card = window.MGE.filePickerView.createCard($view, is_image, url);
              $view.append($card);
            });
            $view.trigger(window.MGE.filePickerView.Event.INFORM_UPDATE);
          },
          function(code, msg){
            $('body').preloader('remove');
            $.notify({
              type: 'danger',
              message: msg + '<br/>' + gettext('Upload failed, please reselect files.')
            });
          }
        );
      });

      var button_string = (is_image ? gettext('添加图片'): gettext('添加文件'));
      var $button_view = $('<button><i class="material-icons">folder</i>&nbsp;'+ button_string +'</button>');
      $button_view.click(function(){
        $input_view.trigger('click');
      });

      $action_view = $('<div class="action-buttons"></div>');
      $action_view.append($input_view, $button_view);
      if(is_multi){
        $clear_button_view = $('<button class="warn"><i class="material-icons">delete</i>&nbsp;'+ gettext('清空') +'</button>');
        $clear_button_view.click(function(){
          $view.find('.mge-file-picker-card').remove();
          $view.find('input[type=file]').val('');
          $view.trigger(window.MGE.filePickerView.Event.INFORM_UPDATE);
        })
        $action_view.append($clear_button_view);
      }

      $view.append($action_view);

      $.each(urls, function(i, url){
        $card = window.MGE.filePickerView.createCard($view, is_image, url);
        $view.append($card);
      });
      $view.trigger(window.MGE.filePickerView.Event.INFORM_UPDATE);
      return $view;
    },
  };
});
