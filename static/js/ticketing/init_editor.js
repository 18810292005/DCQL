function uploadFile(files, upload_to, onDone, onFail) {
  var formData = new FormData(),
      fLength = 0;  // 为辣鸡 safari/ie/edge 设置的flag
  $.each(files, function (i, file) {
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
  $.ajax({
    url: upload_to,
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
    onDone(resp.data);   // data.data 中保存各个文件的 id 和 url
  }).fail(function (resp) {
    if (onFail) {
      onFail(resp);
    } else {
      window._jqHandled = true;
    }
  }).always(function () {
    $('body').preloader('remove');
  });
}

// 自定义上传文件的 summernote 插件
(function (factory) {
  /* global define */
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(window.jQuery);
  }
}(function ($) {
  $.extend($.summernote.plugins, {
    /**
     * @param {Object} context - context object has status of editor.
     */
    'file': function (context) {
      var self = this;

      // ui has renders to build ui elements.
      //  - you can create a button with `ui.button`
      var ui = $.summernote.ui;

      var $editor = context.layoutInfo.editor;
      var options = context.options;

      // add context menu button
      context.memo('button.file', function () {
        return ui.button({
          contents: '<i class="fa fa-file"></i>',
          tooltip: gettext('File'),
          click: context.createInvokeHandler('file.showDialog')
        }).render();
      });

      // This method will be called when editor is initialized by $('..').summernote();
      // You can create elements for plugin
      self.initialize = function () {
        var $container = options.dialogsInBody ? $(document.body) : $editor;

        var body = '<div class="form-group note-form-group note-group-select-from-files">' +
            '<label class="note-form-label">' + gettext('Select your files') + '</label>' +
            '<input class="note-file-input note-form-control note-input" type="file" name="files" multiple="multiple">' +
            '</div>';
        var footer = '<button href="#" class="btn btn-primary ext-file-btn">' + gettext('Insert File') + '</button>';

        self.$dialog = ui.dialog({
          title: gettext('Insert File'),
          fade: options.dialogsFade,
          body: body,
          footer: footer
        }).render().appendTo($container);

      };

      // This methods will be called when editor is destroyed by $('..').summernote('destroy');
      // You should remove elements on `initialize`.
      self.destroy = function () {
        self.$dialog.remove();
        self.$dialog = null;
      };

      self.showDialog = function () {
        self.openDialog().then(function (dialogData) {
          // [workaround] hide dialog before restore range for IE range focus
          ui.hideDialog(self.$dialog);
          context.invoke('editor.restoreRange');

          // do something with dialogData
          console.log("dialog returned: ", dialogData)
          // ...
        }).fail(function () {
          context.invoke('editor.restoreRange');
        });
      };

      self.openDialog = function () {
        return $.Deferred(function (deferred) {
          var $dialogBtn = self.$dialog.find('.ext-file-btn'),
              $dialogFile = self.$dialog.find('.note-file-input');

          ui.onDialogShown(self.$dialog, function () {
            context.triggerEvent('dialog.shown');

            $dialogBtn.click(function (e) {
              e.preventDefault();
              // deferred.resolve({action: 'mini dialog OK clicked...'});
              $dialogFile.change();
            });

            $dialogFile.change(function (e) {
              e.preventDefault();
              if (this.files.length > 0 && options.callbacks.onFileUpload) {
                options.callbacks.onFileUpload($dialogFile.prop('files'));
              }
            });
          });

          ui.onDialogHidden(self.$dialog, function () {
            $dialogBtn.off('click');
            $dialogFile.off('change');
            $dialogFile.val('');

            if (deferred.state() === 'pending') {
              deferred.reject();
            }
          });
          ui.showDialog(self.$dialog);
        });
      };
    }
  });
}));

$(function () {
  var myEditor = $('#my-editor');
  myEditor.summernote({
    lang: $('html').attr('lang').toLowerCase().startsWith('zh') ? 'zh-CN' : 'en-US',
    minHeight: 250,
    placeholder: gettext('Write text here...'),
    toolbar: [
      ["style", ["style"]],
      ["font", ["fontname", 'fontsize']],
      ["color", ["color"]],
      ["para", ["ul", "ol", 'hr']],
      ["table", ["table"]],
      ["insert", ["link", "picture", "file", "video"]],
      ['misc', ['undo', 'redo']],
      ["view", ["fullscreen", "help"]]
    ],
    fontNames: ['Arial', 'Georgia', 'SimSun', 'Microsoft YaHei'],
    callbacks: {
      onImageUpload: function (files) {
        uploadFile(files, Urls.resolve('api_v1_ticketing:upload_image'), function (imgs) {
          imgs.forEach(function (img) {
            myEditor.summernote('insertNode', $('<img class="img-responsive" src="' + img.url + '" data-id="' + img.id + '" alt="' + img.name + '"/>')[0]);
            window._editorFiles.images.push(img.id);   // 添加 img id
          });
        });
      },
      onFileUpload: function (files) {
        uploadFile(files, Urls.resolve('api_v1_ticketing:upload_file'), function (fs) {
          fs.forEach(function (f) {
            myEditor.summernote('insertNode', $('<a href="' + f.url + '" data-id="' + f.id + '">' + f.name + '</a>')[0]);
            window._editorFiles.files.push(f.id);
          });
          $('.modal.in').modal('hide');   // 看不懂源码的我只好这样来关闭了（
        });
      }
    }
  });

  // 设置 image 和 file id 的记录
  window._editorFiles = {
    images: [],
    files: []
  };
});
