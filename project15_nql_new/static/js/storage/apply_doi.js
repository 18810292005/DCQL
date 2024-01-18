$(function () {
  var apply_doi = $('#apply-for-doi');
  // apply_doi.attr('disabled',true);
  var doi = {};
  // 获取到添加的 数据id的数组
  doi.getStorage = function () {
    var object = JSON.parse(sessionStorage.getItem('doi_list')) || [];
    return object;
  };
  doi.saveStorage = function (obj) {
    sessionStorage.setItem('doi_list',JSON.stringify(obj));
    return obj;
  };
  doi.update_apply_view = function () {
    var data_ids = this.getStorage();
    if (data_ids.length === 0){
      apply_doi.attr('disabled',true);
    }else {
      apply_doi.attr('disabled', false);
    }
  };
  doi.hasId = function (id) {
    var dataids = this.getStorage();
    if ($.inArray(id, dataids) == -1){
      return false;
    }else {
      return true;
    }
  }
  doi.addId = function (id) {
    var dataids = this.getStorage();
    if(!this.hasId(id)){
      dataids.push(id);
    }
    this.saveStorage(dataids);
    this.update_apply_view();
  }
  doi.removeId = function (id) {
    var dataids = this.getStorage();
    if (this.hasId(id)){
      // 如果要删除的数据id 在列表中 就将其删除
      var index = $.inArray(id,dataids);
      dataids.splice(index,1);
    }
    // if(dataids.length === 0){ // 在这里更新添加的按钮
    //   apply_doi.attr('disabled',true);
    // }
    this.saveStorage(dataids);
    this.update_apply_view();
  };
  // btn 要求是jQuery对象 将按钮状态设置为已申请注册状态
  doi.setButtonRegister = function (btn) {
      var icon = btn.find('i').first();
      icon.removeClass('fa-registered').addClass('fa-check-circle');
  };
  // btn 是 Jquery 对象 将按钮状态设置为 可注册状态
  doi.setButtonRemove  = function (btn) {
      var icon = btn.find('i').first();
      icon.removeClass('fa-check-circle').addClass('fa-registered');
  };
  doi.updateView = function (btn) {
    var id = $(btn).attr('data-id');
    if (this.hasId(id)){
      this.setButtonRegister($(btn));
    }else {
      this.setButtonRemove($(btn));
    }
  }
  doi.toggleId = function (id) {
    if (this.hasId(id)){
      this.removeId(id);
    }else {
      this.addId(id);
    }
    var btn = $('.add-to-doi[data-id="'+id +  '"]');
    this.updateView(btn);
  };

  doi.initial = function () {
    $('.add-to-doi').each(function (index) {
        $(this).click(function (event) {
        event.stopPropagation();
        var id = $(this).attr('data-id');
        doi.toggleId(id);
        $(this).blur();
      });
      doi.updateView(this);
    });
    doi.update_apply_view();
  };
  apply_doi.click(function (event) {
    // var dataids = doi.getStorage();
    if ($(this).attr('disabled') === 'disabled'){
      return false;
    }else {
      return true;
    }
  });
  window.doi = doi;
})
