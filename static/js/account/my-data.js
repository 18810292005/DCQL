/**
 * @file my-data.js
 * @author Yuvv
 * @date 2018/1/5
 */

function getPaginationNav(current, total, navCount, callback) {
  function getLi(num, txt, active, click) {
    active = active || false;
    txt = txt || num;
    var li = $('<li></li>');
    if (active) {
      li.addClass('active');
    }
    var a = $('<a href="account/me/data#' + num + '">' + txt + '</a>');
    a.click(function () {
      click(num);
    });
    li.append(a);
    return li;
  }

  function aroundCurrent(current, total, navCount) {
    var pages = [current];
    var halfNavCount = Math.ceil(navCount / 2);
    var minPage = Math.max(0, current - halfNavCount);
    var maxPage = Math.min(total + 1, current + halfNavCount);
    for (var i = current - 1; i > minPage; i--) {
      pages.unshift(i);
    }
    for (var j = current + 1; j < maxPage; j++) {
      pages.push(j);
    }

    if (pages.length < Math.min(navCount, total)) {
      if (maxPage - current < halfNavCount) {
        minPage = Math.max(0, maxPage - navCount - 1);
        for (i = pages[0] - 1; i > minPage; i--) {
          pages.unshift(i);
        }
      } else if (current - minPage < halfNavCount) {
        maxPage = Math.min(total + 1, minPage + navCount + 1);
        for (j = pages[pages.length - 1] + 1; j < maxPage; j++) {
          pages.push(j);
        }
      }
    }

    return pages;
  }

  navCount = navCount || 5;
  var nav = $('<nav></nav>'),
    ul = $('<ul class="pagination"></ul>');
  var pages = aroundCurrent(current, total, navCount);
  pages.forEach(function (value) {
    ul.append(getLi(value, value, value === current, callback));
  });
  if (current > 1) {
    ul.prepend(getLi(current - 1, '<i class="fa fa-angle-double-left"></i>', false, callback));
  }
  if (current < total) {
    ul.append(getLi(current + 1, '<i class="fa fa-angle-double-right"></i>', false, callback))
  }
  nav.append(ul);

  return nav;
}

function getDataMetaPanel(dm) {
  dm.quantity = dm.quantity || 'N/A';
  dm.abstract = dm.abstract || 'N/A';
  dm.category = dm.category || 'N/A';
  dm.doi = dm.doi || 'N/A';
  dm.purpose = dm.purpose || 'N/A';
  var register_doi = "";
  if (dm.doi === 'N/A') {
    register_doi = '<a target="_blank" class="add-to-doi" data-id="' + dm.id + '" role = "button" title="' + gettext('registerdoi') + '">' + '<i class="fa fa-registered"></i></a>'
    // register_doi = '<a target="_blank" class="add-to-doi" data-id="'+ dm.id +'" href="' + Urls.resolve('storage:register_doi') + '" role = "button" title="' +gettext('registerdoi') +  '">' + '<i class="fa fa-registered"></i></a>'
  }
  return '<div class="panel panel-default">' +
    '  <div class="panel-heading">' +
    '    <a target="_blank" href="' + Urls.resolve('storage:show_data', {did: dm.id}) + '" title="' + gettext('View') + '">' + dm.title + '</a>' +
    '    <div class="pull-right">' +
    register_doi +
    '      <a target="_blank" href="' + Urls.resolve('storage:add_data') + '?action=modify&did=' + dm.id + '" role="button" title="' + gettext('Edit') + '"><i class="fa fa-pencil"></i></a>' +
    '      <a role="button" onclick="deleteData(\'' + dm.id + '\',this)" title="' + gettext('Delete') + '"><i class="fa fa-trash"></i></a>' +
    '      <a target="_blank" href="' + Urls.resolve('storage:show_data', {did: dm.id}) + '" title="' + gettext('View') + '"><i class="fa fa-external-link"></i></a>' +
    '    </div>' +
    '  </div>' +
    '  <div class="panel-body">' +
    '    <div class="row">' +
    '      <div class="col-sm-12">' +
    '        <p><span class="dt">' + gettext('Add Time') + '</span><span class="dd">' + dm.add_time + '</span></p>' +
    '      </div>' +
    '    </div>' +
    '    <div class="row">' +
    '      <div class="col-sm-3">' +
    '        <p><span class="dt">' + gettext('Views') + '</span><span class="dd">' + dm.views + '</span></p>' +
    '      </div>' +
    '      <div class="col-sm-3">' +
    '        <p><span class="dt">' + gettext('Downloads') + '</span><span class="dd">' + dm.downloads + '</span></p>' +
    '      </div>' +
    '      <div class="col-sm-3">' +
    '        <p><span class="dt">' + gettext('Score') + '</span><span class="dd">' + dm.score + '</span></p>' +
    '      </div>' +
    '    </div>' +
    '    <div class="row">' +
    '      <div class="col-sm-3">' +
    '        <p><span class="dt">' + gettext('Material Class') + '</span><span class="dd">' + dm.category + '</span></p>' +
    '      </div>' +
    '      <div class="col-sm-3">' +
    '        <p><span class="dt">' + gettext('Abstract') + '</span><span class="dd">' + dm.abstract + '</span></p>' +
    '      </div>' +
    '      <div class="col-sm-3">' +
    '        <p><span class="dt">DOI</span><span class="dd doi">' + dm.doi + '</span></p>' +
    '      </div>' +
    '      <div class="col-sm-3">' +
    '        <p><span class="dt">' + gettext('Purpose') + '</span><span class="dd">' + dm.purpose + '</span></p>' +
    '      </div>' +
    '    </div>' +
    '  </div>' +
    '</div>';

}

function getData(page, perPage) {
  page = page || 1;
  perPage = perPage || PER_PAGE;
  $.get(Urls.resolve('api_v1_storage:data_metas'), {
    page: page,
    per_page: perPage,
    private: true
  }).done(function (resp) {
    var dmScope = $('#dm-scope');
    dmScope.empty();
    resp.data.results.forEach(function (it) {
      dmScope.append(getDataMetaPanel(it));
    });
    window.doi.initial();
    CURRENT_PAGE = page;
    TOTAL_PAGE = Math.ceil(resp.data.total / perPage);
    if (TOTAL_PAGE > 1) {
      var $pScope = $('#dm-pagination-scope');
      $pScope.empty();
      $pScope.append(getPaginationNav(CURRENT_PAGE, TOTAL_PAGE, 5, function (pageNo) {
        getData(pageNo, perPage);
      }));
    }
  }).fail(function () {
    window._jqHandled = true;
  });
}

function deleteData(did, that) {
  var panel = $(that).parents('.panel:first');
  var doi = panel.find('.doi:first').text();
  if (doi != 'N/A') {
    $.showModal({
      title: gettext('Warning'),
      message: gettext("This data's doi is not null, and we can't be deleted")
    });
  } else {
    $.showModal({
      title: gettext('Warning'),
      message: interpolate(gettext('Are you sure to delete "%s"'), [panel.find('.panel-heading').text()]),
      onOk: function () {
        $.ajax(Urls.resolve('api_v1_storage:data_meta_one', {mid: did}), {
          method: 'DELETE'
        }).done(function () {
          panel.hide(500, function () {
            panel.remove();
          });
        });
      }
    });
  }

}

function getTemplatePanel(t) {
  t.category = t.category || 'N/A';
  return '<div class="panel panel-' + (t.published ? 'default' : 'warning') + '">' +
    '  <div class="panel-heading">' +
    '    <a target="_blank" href="' + Urls.resolve('storage:add_template') + '?action=view&tid=' + t.id + '" title="' + gettext('View') + '">' + t.title + '</a>' +
    '    <div class="pull-right">' +
    '      <a target="_blank" href="' + Urls.resolve('storage:add_template') + '?action=modify&tid=' + t.id + '" role="button" title="' + gettext('Edit') + '"><i class="fa fa-pencil"></i></a>' +
    '      <a role="button" onclick="deleteTemplate(\'' + t.id + '\',this)" title="' + gettext('Delete') + '"><i class="fa fa-trash"></i></a>' +
    '      <a target="_blank" href="' + Urls.resolve('storage:add_template') + '?action=view&tid=' + t.id + '" title="' + gettext('View') + '"><i class="fa fa-external-link"></i></a>' +
    '    </div>' +
    '  </div>' +
    '  <div class="panel-body">' +
    '    <div class="row">' +
    '         <div class="col-sm-4">' +
    '           <p><span class="dt">' + gettext('Material Category') + '</span><span class="dd">' + t.category + '</span></p>' +
    '         </div>' +
    '      <div class="col-sm-4">' +
    '        <p><span class="dt">' + (t.published ? gettext('Publish Date') : gettext('Publish State')) + '</span>' +
    '           <span class="dd">' + (t.published ? t.pub_date : gettext('Unpublished')) + '</span></p>' +
    '      </div>' +
    '      <div class="col-sm-4">' +
    '        <p><span class="dt">' + gettext('Data Count') + '</span><span class="dd">' + t.ref_count + '</span></p>' +
    '      </div>' +
    '    </div>' +
    '    <div class="row">' +
    '      <div class="col-sm-12">' +
    '        <p><span class="dt">' + gettext('Abstract') + '</span><span class="dd">' + t.abstract + '</span></p>' +
    '      </div>' +
    '    </div>' +
    '    <div class="row">' +
    '      <div class="col-sm-12">' +
    '        <p><span class="dt">' + gettext('Author') + '</span><span class="dd">' + t.author + '</span></p>' +
    '      </div>' +
    '    </div>' +
    '  </div>' +
    '</div>';
}

function getTemplate(page, perPage) {
  page = page || 1;
  perPage = perPage || PER_PAGE;
  $.get(Urls.resolve('api_v1_storage:templates'), {
    page: page,
    per_page: perPage,
    private: true,
    meta_only: true,
    pub_only: false
  }).done(function (resp) {
    var tScope = $('#t-scope');
    tScope.empty();
    resp.data.forEach(function (it) {
      tScope.append(getTemplatePanel(it));
    });
    CURRENT_PAGE = page;
    TOTAL_PAGE = Math.ceil(resp.extra.total / perPage);
    if (TOTAL_PAGE > 1) {
      var $tScope = $('#t-pagination-scope');
      $tScope.empty();
      $tScope.append(getPaginationNav(CURRENT_PAGE, TOTAL_PAGE, 5, function (pageNo) {
        getTemplate(pageNo, perPage);
      }));
    }
  }).fail(function () {
    window._jqHandled = true;
  });
}

function deleteTemplate(tid, that) {
  var panel = $(that).parents('.panel:first');
  $.showModal({
    title: gettext('Warning'),
    message: interpolate(gettext('Are you sure to delete "%s"'), [panel.find('.panel-heading').text()]),
    onOk: function () {
      $.requestJSON({
        url: Urls.resolve('api_v1_storage:template_one', {tid: tid}),
        method: "DELETE",
        onHide: function () {
          window.location.reload();
        }
      });
    }
  });
}

$(function () {
  var data = $('#data'),
    templates = $('#templates');
  getData(1, 10);
  if (templates.length > 0) {
    getTemplate(1, 10);
  }
});
