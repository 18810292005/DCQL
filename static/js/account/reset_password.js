$(function () {
  function disableSubmitButtons(on) {
    $('#form').data('formValidation').disableSubmitButtons(on);
  }


  $('#form')
      .formValidation({
        message: 'This value is not valid',
        icon: {
          valid: 'glyphicon glyphicon-ok',
          invalid: 'glyphicon glyphicon-remove',
          validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
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
          }
        }
      })
      .on('success.field.fv', function (e, data) {
        disableSubmitButtons(data.fv.getInvalidFields().length > 0);
      })
      .on('success.form.fv', function (e) {
        e.preventDefault();
        if ($("#form").prop("name") === "password-reset-request-form") {
          $.requestJSON({
            url: Urls.resolve('api_v1_account:reset_password_request'),
            method: "POST",
            data: {'email': $("#email").val()},
            onSuccess: function (j) {
              $.showModal({
                title: ' ',
                message: j.data,
                onHide: function () {
                  window.location = Urls.resolve('site_index');
                }
              });
            },
            onError: function () {
              disableSubmitButtons(false);
            }
          });
        }
        else {
          $.requestJSON({
            url: Urls.resolve('api_v1_account:reset_password'),
            method: "PATCH",
            data: {'token': $.getURLParam('token'), 'new_password': $("#password").val()},
            onSuccess: function (j) {
              $.showModal({
                title: '',
                message: j.data,
                onHide: function () {
                 // window.location = '/account/login/';
                }
              });
            },
            onError: function () {
              disableSubmitButtons(false);
            }
          });
        }
      });
});