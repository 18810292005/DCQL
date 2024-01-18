$(function () {
  // information settings
  function disableSubmitButtons(on) {
    $('#me-form').data('formValidation').disableSubmitButtons(on);
  }

  $('#me-form')
      .formValidation({
        message: 'This value is not valid',
        icon: {
          valid: 'glyphicon glyphicon-ok',
          invalid: 'glyphicon glyphicon-remove',
          validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
          old_password: {
            enabled: false,
            validators: {
              notEmpty: {
                message: gettext('The password is required and can\'t be empty')
              }
            }
          },
          new_password: {
            enabled: false,
            validators: {
              notEmpty: {
                message: gettext('The password is required and can\'t be empty')
              }
            }
          },
          password_again: {
            enabled: false,
            validators: {
              notEmpty: {
                message: gettext('The password is required and can\'t be empty')
              },
              identical: {
                field: 'new_password',
                message: gettext('The password and its confirm are not the same')
              }
            }
          },
          institution: {
            validators: {
              notEmpty: {
                message: gettext('Your institution is required and can\'t be empty')
              }
            }
          },
          real_name: {
            validators: {
              notEmpty: {
                message: gettext('Your real name is required and can\'t be empty')
              }
            }
          }
        }
      })
      .on('success.field.fv', function (e, data) {
        disableSubmitButtons(data.fv.getInvalidFields().length > 0);
      })
      .on('success.form.fv', function (e) {
        e.preventDefault();
        var data = {
          'institution': $("#institution").val(),
          'email': $("#email").val(),
          'old_password': $("#old_password").val(),
          'new_password': $("#new_password").val(),
          'real_name': $("#real_name").val()
        };

        $.requestJSON({
          url: Urls.resolve('api_v1_account:user_resource', {username: $("#username").prop("placeholder")}),
          method: "PATCH",
          data: data,
          onSuccess: function () {
            window.location.reload();
            disableSubmitButtons(false);
          },
          onError: function () {
            disableSubmitButtons(false);
          }
        })
      });

  function enablePasswordValidators() {
    var old = $('#old_password').val();
    var new_pwd = $('#new_password').val();
    var again = $('#password_again').val();
    if (old || new_pwd || again) {
      $('#me-form').formValidation('enableFieldValidators', 'old_password', true)
          .formValidation('enableFieldValidators', 'new_password', true)
          .formValidation('enableFieldValidators', 'password_again', true);
    }
    else {
      $('#me-form').formValidation('enableFieldValidators', 'old_password', false)
          .formValidation('enableFieldValidators', 'new_password', false)
          .formValidation('enableFieldValidators', 'password_again', false);
    }
  }

  $('#old_password').bind('input propertychange', function () {
    enablePasswordValidators();
  });
  $('#new_password').bind('input propertychange', function () {
    enablePasswordValidators();
  });
  $('#password_again').bind('input propertychange', function () {
    enablePasswordValidators();
  });

  $(".verify-link").click(function () {
    $.requestJSON({
      url: Urls.resolve('api_v1_account:resend_verification_email'),
      data: {},
      onSuccess: function (j) {
        $.showModal({
          title: '',
          message: j.data
        });
      }
    });
  });


  // avatar settings
  var img_data;

  $('#choose-button').click(function () {
    $('#avatar-input').click();
  });

  (function createAvatarArea() {
    $('#avatar-wrapper').empty().append('<div id="avatar-area" style="height:300px;width:300px;"></div>');
    var basic = $('#avatar-area').croppie({
      viewport: {
        width: 200,
        height: 200
      },
      update: function () {
        this.result('base64').then(function (data) {
          $("#preview-area").empty().append('<img class="img-rounded" src=' + data + '>');
        });
        this.result('blob').then(function (data) {
          img_data = data;
        });
      }
    });
    $("#avatar-input").on('change', function () {
      if (this.files.length <= 0) {
        return;
      }
      $('#set-avatar').prop('disabled', false);
      var reader = new FileReader();
      reader.onload = function (e) {
        createAvatarArea().croppie('bind', {
          url: e.target.result
        }).then();
      };
      reader.readAsDataURL(this.files[0]);
    });
    return basic;
  })();

  $('#set-avatar').click(function () {
    var loading_timeout_id = setTimeout("$.showLoading(true)", 200);
    var formData = new FormData();
    formData.append("avatar", img_data);
    $.ajax({
      url: Urls.resolve('api_v1_account:user_avatar', {username: $(this).data('username')}),
      data: formData,
      method: "POST",
      cache: false,
      processData: false,
      contentType: false
    }).done(function () {
      $.showModal({
        title: '',
        message: gettext('Success'),
        onHide: function () {
          window.location.reload();
        }
      })
    }).fail(function (jqXHR, textStatus, errorThrown) {
      if (errorThrown.name === "SyntaxError") {
        console.error("Server returned 200 but the response is not json.");
      }
      else if (jqXHR.status === 0) {
        $.showModal({
          title: gettext("Network Error"),
          message: gettext("Connection Timeout")
        })
      }
      else if (jqXHR.responseJSON === undefined) {
        // 服务器返回的错误数据不是JSON
        $.showModal({
          title: gettext("Internal Server Error"),
          message: gettext("Please try again later or contact admin.")
        });
        console.error(gettext("Response is not json. Maybe there is an internal server error."));
      }
      else {
        $.showModal({
          message: jqXHR.responseJSON.msg
        })
      }
    }).always(function () {
      clearTimeout(loading_timeout_id);
      $.showLoading(false);
    })
  });

});