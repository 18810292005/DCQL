$(document).ready(function () {

  // 获取用户使用协议，默认为中文
  var lang = $('html').attr('lang').toLowerCase() || 'zh';
  $.get()

  function disableRegisterButton(on) {
    $('#register-form').data('formValidation').disableSubmitButtons(on);
  }


  $('#register-form').formValidation({
        message: 'This value is not valid',
        icon: {
          valid: 'glyphicon glyphicon-ok',
          invalid: 'glyphicon glyphicon-remove',
          validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
          username: {
            message: 'The username is not valid',
            validators: {
              notEmpty: {
                message: gettext('The username is required and can\'t be empty')
              }
            }
          },
          password: {
            validators: {
              notEmpty: {
                message: gettext('The password is required and can\'t be empty')
              }
            }
          },
          password_again: {
            validators: {
              notEmpty: {
                message: gettext('The password is required and can\'t be empty')
              },
              identical: {
                field: 'password',
                message: gettext('The password and its confirm are not the same')
              }
            }

          },
          email: {
            validators: {
              notEmpty: {
                message: gettext('Your email address is required and can\'t be empty')
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
        if (data.fv.getInvalidFields().length > 0) {
          $("#form-title").css("margin-top", (30 - data.fv.getInvalidFields().length * 6 + 'px'));
          disableRegisterButton(true);
        }
        else {
          disableRegisterButton(false);
          $("#form-title").css("margin-top", '30px');
        }
      })
      .on('success.form.fv', function (e) {
        e.preventDefault();
        $("#form-title").css("margin-top", '30px');
        if (!$("#agreed").prop('checked')) {
          $.showModal({
            message: gettext('Please read and agree to the user instructions')
          });
          disableRegisterButton(false);
          return;
        }
        $.requestJSON({
          url: Urls.resolve('api_v1_account:user_list'),
          data: {
            username: $("#username").val(),
            password: $("#password").val(),
            email: $("#email").val(),
            real_name: $("#real_name").val(),
            institution: $("#institution").val()
          },
          onSuccess: function () {
            var jump = function() {
              window.location = Urls.resolve('account:login');
              disableRegisterButton(false);
            }
            $.ajax({
              type: 'POST',
              url: '/matcloud/api/account/user/api-signup?_=' + (new Date()).valueOf(),
              data: {
                'email': $("#email").val(),
                'name': $("#username").val(),
                'pwd': $("#password").val()
              },
              success: function(res) {
                if(res.error) {
                  console.log(res)
                }
              },
              global: false
            }).always(function() {
              jump();
            });
          },
          onError: function (json) {
            console.error(json);
            disableRegisterButton(true);
          },
          onHide: function () {
            disableRegisterButton(false);
          }
        })
      })
      .on('err.field.fv', function (e) {
        $("#form-title").css("margin-top", (30 - $('#register-form').data('formValidation').getInvalidFields().length * 6) + 'px');
      });
});
