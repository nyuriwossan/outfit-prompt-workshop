// The catalog, garment restrictions and English phrases come from the existing pose data.
(function (C) {
  'use strict';
  var E = C.ui.el;
  var pageSize = 6;
  var firstPage = ['standing', 'seated', 'spread_dress', 'runway', 'side_elbow', 'hand_chest'];

  function gallery(outfit, view, selectedId, onChoose) {
    var catalog = C.data.presentation.poseChoices;
    var poses = firstPage.map(function(id) { return C.util.byId(catalog, id); })
      .concat(catalog.filter(function(pose) { return !firstPage.includes(pose.id); }));
    var section = E('section', {class:'pose-gallery', 'aria-labelledby':'pose-gallery-title'});
    section.appendChild(E('h3', {id:'pose-gallery-title', text:'ポーズ見本帳'}));
    var filters = E('div', {class:'pose-filters'});
    var category = E('select', {class:'cf-select', id:'pose-category'});
    category.appendChild(E('option', {value:'', text:'すべて'}));
    C.data.poseCategories.forEach(function(row) {
      category.appendChild(E('option', {value:row.id, text:row.labelJa}));
    });
    category.value = view.category || '';
    var search = E('input', {type:'search', class:'cf-select', id:'pose-search',
      value:view.query || '', placeholder:'例：胸元、袖'});
    filters.appendChild(E('label', {for:'pose-category'}, [document.createTextNode('動作の分類'), category]));
    filters.appendChild(E('label', {for:'pose-search'}, [document.createTextNode('名前・動作で検索'), search]));
    section.appendChild(filters);

    var count = E('p', {id:'pose-count', class:'pose-count', role:'status'});
    var cards = E('div', {id:'pose-cards', class:'pose-cards', role:'group', 'aria-label':'ポーズの候補'});
    var previous = E('button', {id:'pose-previous', type:'button', class:'btn', text:'前の見本'});
    var next = E('button', {id:'pose-next', type:'button', class:'btn', text:'次の見本'});
    var nav = E('div', {class:'pose-paging'}, [previous, next]);
    section.append(count, cards, nav);

    function draw() {
      var query = C.presetCatalog.normalizeSearch(view.query || '');
      var matches = poses.filter(function(pose) {
        var words = [pose.labelJa, pose.noteJa].concat(pose.searchAliases || []).join(' ');
        return (!view.category || pose.categoryId === view.category) &&
          C.presetCatalog.normalizeSearch(words).includes(query);
      });
      if (view.posePage == null) {
        var index = matches.findIndex(function(pose) { return pose.id === selectedId; });
        view.posePage = Math.floor(Math.max(0,index) / pageSize);
      }
      var pages = Math.ceil(matches.length / pageSize);
      view.posePage = Math.min(view.posePage, Math.max(0,pages - 1));
      var start = view.posePage * pageSize;
      var page = matches.slice(start, start + pageSize);
      count.textContent = matches.length ? matches.length + '件中 ' + (start + 1) + '〜' +
        (start + page.length) + '件' : '一致するポーズがありません。分類や検索の言葉を変えてください。';
      cards.replaceChildren();
      page.forEach(function(pose) {
        var selected = selectedId === pose.id;
        var reason = C.presentationChoices.reason(outfit, pose);
        var id = 'pose-card-' + pose.id;
        var button = E('button', {type:'button', id:id, class:'pose-card', disabled:!!reason,
          'aria-pressed':String(selected), 'aria-labelledby':id+'-name', 'aria-describedby':id+'-description'+(selected ? ' '+id+'-state' : ''),
          onclick:function() { onChoose(pose.id); }
        });
        var image = E('img', {src:'assets/poses/'+pose.id+'.svg', alt:'', width:160, height:120,
          loading:'lazy', decoding:'async'});
        var plate = E('span', {class:'pose-plate'}, [image]);
        image.addEventListener('error', function() {
          image.hidden = true;
          plate.appendChild(E('span', {class:'pose-no-image',text:'画像を表示できません'}));
        });
        if (selected) {
          var active = outfit.output.includePresentation && !reason;
          plate.appendChild(E('span', {id:id+'-state', class:'pose-picked', text:active ? '✓ 選択中' : '選択中 · 出力対象外'}));
        }
        var description = E('span', {id:id+'-description',class:'pose-description'}, [
          document.createTextNode(pose.noteJa)
        ]);
        if (reason) description.appendChild(E('span', {class:'pose-restriction', text:'選択不可 · '+reason}));
        button.append(plate, E('strong', {id:id+'-name', text:pose.labelJa}), description);
        cards.appendChild(button);
      });
      previous.disabled = view.posePage === 0;
      next.disabled = view.posePage + 1 >= pages;
      nav.hidden = pages <= 1;
    }

    function turnPage(delta) {
      view.posePage += delta;
      draw();
      // Start the new page at the first illustration, including when paging by keyboard.
      var target = cards.querySelector('button:enabled') || count;
      if (target === count) count.tabIndex = -1;
      target.focus({preventScroll:true});
      cards.scrollIntoView({block:'start'});
    }
    previous.onclick = function() { turnPage(-1); };
    next.onclick = function() { turnPage(1); };
    function filter() {
      view.category = category.value;
      view.query = search.value;
      view.posePage = 0;
      draw();
    }
    category.addEventListener('change', filter);
    search.addEventListener('input', filter);
    draw();
    return section;
  }
  C.poseCards = {gallery:gallery};
})(window.CPW);
