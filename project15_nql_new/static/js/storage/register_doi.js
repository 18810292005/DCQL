$(function () {
  // var obj = JSON.parse(localStorage.getItem('cart')) || {};
  // for(var tid in obj){
  //   alert(tid);
  // }
  var registerbtn = $('#registerdoi-button');
  // data_id = $.getURLParam('ids');
  registerbtn.click(function (e) {
    var title = $('#doi-title').val();
    var contributor = $('#doi-contributor').val();
    var project = $('#doi-project-modify').val();
    if (title === '' || contributor === '' || project === ''){
      $.showModal({
        message:gettext('please fill in the full information'),
      })
    }
    else {
      // 这里获取到 localStorage 的data-ids
      var did_list = JSON.parse(sessionStorage.getItem('doi_list')) || [];
      var data = {
          title:title,
          contributor:contributor,
          project:project,
            };
      if (did_list.length === 0){ // 一条数据也没有
          $.showModal({
            message:gettext('no data selected'),
          });
      }else if (did_list.length === 1){ // 注册单条数据

          $.requestJSON({
          url:Urls.resolve('api_v1_storage:data_doi_single',{did:did_list[0]}),
          method:'PATCH',
          data:data,
          silentError: true,
          onSuccess:function (data) {
            sessionStorage.setItem('doi_list',JSON.stringify([])); // 将现在的清空
            $.showModal({
              title: gettext('Submit successfully'),
              message:gettext('your application for doi has been successfully submitted.'),
            });
          },
          onError:function (data) {
            $.showModal({
              title: gettext('ERROR') + ' ' + data.code + ':' + data.msg,
              message: gettext('Your operation has an encounter an error'),
            });
          }
        });
      }else { // 注册数据集
        data.datas = did_list;
        console.log(data.datas);
        $.requestJSON({
          url:Urls.resolve('api_v1_storage:data_dois'),
          method:'PATCH',
          data:data,
          silentError:true,
          onSuccess:function (data) {
            sessionStorage.setItem('doi_list',JSON.stringify([])); // 将现在的清空
            $.showModal({
              title: gettext('Submit successfully'),
              message:gettext('your application for doi has been successfully submitted.'),
            });
          },
          onError:function (data) {
             $.showModal({
              title: gettext('ERROR') + ' ' + data.code + ':' + data.msg,
              message: gettext('Your operation has an encounter an error'),
            });
          }
        });
      }

    }
    return false;
  })
})
