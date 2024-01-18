$(function () {

  function getCaptcha() {
    $("#captcha").attr("src", Urls.resolve('api_v1_account:get_captcha') + '?r=' + Math.random());
  }

  $("#captcha").click(function () {
    getCaptcha();
  });

  function disableLoginButton(on) {
    $('#login-form').data('formValidation').disableSubmitButtons(on);
  }

  $('#login-form').formValidation({
    message: 'Invalid value',
    icon: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      user: {
        message: gettext('Invalid username'),
        validators: {
          notEmpty: {
            message: gettext('Username cannot be empty')
          }
        }
      },
      password: {
        validators: {
          notEmpty: {
            message: gettext('Password cannot be empty')
          }
        }
      }
    }
  })
    .on('success.field.fv', function (e, data) {
      disableLoginButton(data.fv.getInvalidFields().length > 0);
    })
    .on('success.form.fv', function (e) {
      e.preventDefault();
      var captcha = $("#captcha-response").val();
      if (!captcha) {
        $.showModal({
          message: gettext('Please fill in the verification code')
        });
        return;
      }

      $.requestJSON({
        url: Urls.resolve('api_v1_account:session_api'),
        data: {
          user: $("#user").val(),
          password: $("#password").val(),
          captcha_response: captcha,
          remember: $("#remember-me").prop("checked")
        },
        
        onSuccess: function (json) {
          disableLoginButton(true);

          var username = json.data.username;
          var email = json.data.email;
          var ToNext = function() {
            var next = $.getURLParam('next');
            if (next) {
              window.location = next;
            } else {
              window.location = Urls.resolve('site_index');
            }
          };
          $.ajax({
            type: 'POST', 
            url: '/matcloud/api/account/user/api-signin?_=' + (new Date()).valueOf(),
            data: {
              'email': email,
              'pwd': $('#password').val()
            },
            success: function(res) {
              if(res.error) {
                console.log(res);
              }
            },
            global: false
          }).always(function() {
            ToNext();
          });

          //$.post('/matcloud/api/account/user/api-signin?_=' + (new Date()).valueOf(), {
          //  'email': email,
          //  'pwd': $("#password").val()
          //}, function(res){
          //  if(!res.error){
          //    ToNext();
          //  }
          //  else{
          //    console.log(res);
          //  }
          //})
        },
        onError: function (json) {
          console.error(json);
          disableLoginButton(true);
          getCaptcha();
        },
        onHide: function () {
          disableLoginButton(false);
        }
      })
    })
});
