/* The three-step UI edits the same outfit used by the detailed pattern editor. */
(function (C) {
  'use strict';
  var E = C.ui.el, D = C.data;

  function progress(step) {
    var list = E('ol', {class: 'steps', 'aria-label': '制作の流れ'});
    ['衣装を選ぶ', 'アレンジ', '完成'].forEach(function (label, i) {
      list.appendChild(E('li', {'aria-current': step === i + 1 ? 'step' : null}, [
        E('span', {text: String(i + 1)}), document.createTextNode(label)
      ]));
    });
    return list;
  }

  function home(start) {
    var draft = C.store.loadDraft() || (C.state.dirty && C.state.outfit);
    var entries = E('div', {class: 'entry-cards'});
    [
      ['見本から', '仕立て済みの衣装を試着する', '#/presets'],
      ['テーマから', '好きな題材で3着を見比べる', '#/concept_fashion'],
      ['ゼロから', '服の形から自分で選ぶ']
    ].forEach(function (entry, i) {
      var attrs = entry[2] ? {href: entry[2]} : {type: 'button', onclick: start};
      attrs.class = 'entry-card';
      entries.appendChild(E(entry[2] ? 'a' : 'button', attrs, [
        E('span', {class: 'textile textile-' + i, 'aria-hidden': 'true'}),
        E('span', {}, [E('strong', {text: entry[0]}), E('small', {text: entry[1]})]),
        E('span', {class: 'entry-arrow', text: '›', 'aria-hidden': 'true'})
      ]));
    });
    return E('section', {class: 'screen atelier-home'}, [
      E('header', {class: 'atelier-cover'}, [
        E('img', {src: 'icons/icon-512.png', alt: '', width: '512', height: '512'}),
        E('div', {}, [E('h1', {text: '衣装プロンプト工房'}),
          E('p', {text: '好きな形と色を選んで、一着の英語プロンプトを仕立てましょう。'})])
      ]),
      E('h2', {class: 'page-title', text: '衣装を選ぶ'}), entries,
      E('div', {class: 'home-library'}, [
        draft ? E('a', {href: '#/workshop', class: 'btn', text: '作業を再開' + (draft.name ? ' · ' + draft.name : '')}) : null,
        E('a', {href: '#/library', class: 'link-btn', text: '保存した衣装（' + C.store.listOutfits().length + '）'})
      ]),
      E('p', {class: 'p p--note', text: C.store.available()
        ? '下書きはこのブラウザに自動保存されます。大切な衣装はJSONでも保管できます。'
        : 'このブラウザでは端末内保存が無効です。完成画面でJSONを書き出してください。'})
    ]);
  }

  function quickEditor() {
    var o = C.state.outfit;
    var fields = E('div', {class: 'quick-fields'});
    function select(path, label, list, onChange) {
      var input = E('select', {class: 'cf-select', id: 'quick-' + path.replace('.', '-')});
      input.appendChild(E('option', {value: '', text: '選んでください'}));
      list.forEach(function (item) { input.appendChild(E('option', {value: item.id, text: item.labelJa})); });
      input.value = C.util.getPath(o, path) || '';
      input.addEventListener('change', function () {
        if (onChange) onChange(input.value || null);
        else C.state.set(path, input.value || null);
      });
      fields.appendChild(E('label', {class: 'quick-label'}, [document.createTextNode(label), input]));
      return input;
    }

    // A swatch-based quick picker; the selected value stays in the existing outfit schema.
    function colorPicker(role, label) {
      var path = 'palette.' + role;
      var holder = E('div', {class: 'quick-color', 'data-color-picker': role});
      var details = E('details', {class: 'quick-color-picker'});
      var summary = E('summary', {class: 'quick-color-summary'});
      var panel = E('div', {class: 'quick-color-panel'});
      var query = E('input', {type: 'search', class: 'quick-color-search',
        placeholder: '色名・英語名・HEXで検索', 'aria-label': label + 'の色を検索'});
      var family = E('select', {class: 'cf-select', 'aria-label': label + 'の色系統'});
      family.appendChild(E('option', {value: 'popular', text: 'よく使う色'}));
      family.appendChild(E('option', {value: 'all', text: 'すべての色'}));
      D.colorFamilies.forEach(function (f) {
        family.appendChild(E('option', {value: f.id, text: f.labelJa}));
      });
      var grid = E('div', {class: 'quick-color-grid', role: 'group', 'aria-label': label + 'の候補'});
      var popular = ['pure_white','warm_ivory','jet_black','charcoal_gray',
        'deep_crimson','rose_red','blush_pink','antique_gold',
        'forest_green','sage_green','teal','sky_blue','deep_navy',
        'royal_purple','dusty_lavender','warm_brown','sand_beige','polished_silver'];
      function current() { return C.util.byId(D.colors, C.util.getPath(C.state.outfit, path)); }
      function updateSummary() {
        var color = current();
        var dot = E('i', {class: 'quick-color-dot', 'aria-hidden': 'true'});
        if (color) dot.style.backgroundColor = color.hex;
        summary.replaceChildren(dot, E('span', {text: color ? color.labelJa + ' (' + color.hex + ')' : '色見本から選ぶ'}));
      }
      function redraw() {
        var search = query.value.trim().toLowerCase(), active = current();
        grid.replaceChildren();
        var matches = D.colors.filter(function (c) {
          if (search) return [c.labelJa, c.promptEn, c.hex].some(function (v) {
            return String(v || '').toLowerCase().includes(search);
          });
          if (family.value === 'all') return true;
          if (family.value === 'popular') return popular.indexOf(c.id) >= 0 || !!active && active.id === c.id;
          return c.family === family.value;
        });
        if (!matches.length) grid.appendChild(E('p', {class: 'p p--note', text: '該当する色がありません'}));
        matches.forEach(function (c) {
          var tile = E('i', {class: 'quick-color-tile', 'aria-hidden': 'true'});
          tile.style.backgroundColor = c.hex;
          var on = !!active && active.id === c.id;
          var b = E('button', {type: 'button', class: 'quick-color-option' + (on ? ' is-selected' : ''),
            'data-color-option': role + ':' + c.id,
            'aria-label': c.labelJa + ' (' + c.hex + ')', 'aria-pressed': String(on)},
            [tile, E('span', {text: c.labelJa})]);
          b.addEventListener('click', function () {
            C.state.set(path, c.id);
            updateSummary();
            details.open = false;
            summary.focus({preventScroll: true});
          });
          grid.appendChild(b);
        });
      }
      query.addEventListener('input', redraw);
      family.addEventListener('change', redraw);
      var clear = E('button', {type: 'button', class: 'btn btn--sm', text: '色の指定を解除'});
      clear.addEventListener('click', function () {
        C.state.set(path, null);
        updateSummary();
        details.open = false;
        summary.focus({preventScroll: true});
      });
      details.addEventListener('toggle', function () { if (details.open) redraw(); });
      panel.appendChild(query);
      panel.appendChild(family);
      panel.appendChild(grid);
      panel.appendChild(clear);
      details.appendChild(summary);
      details.appendChild(panel);
      holder.appendChild(E('span', {class: 'quick-color-title', text: label}));
      holder.appendChild(details);
      fields.appendChild(holder);
      updateSummary();
      redraw();
    }

    function garments() { return D.garments.filter(function (g) { return g.category === o.garment.category; }); }
    select('garment.category', '服の種類', D.garmentCategories, function (category) {
      C.state.applyPatch({garment: {category: category, subtype: null}});
      shape.replaceChildren(E('option', {value: '', text: '選んでください'}));
      D.garments.filter(function (g) { return g.category === category; }).forEach(function (g) {
        shape.appendChild(E('option', {value: g.id, text: g.labelJa}));
      });
      shape.disabled = !category;
    });
    var shape = select('garment.subtype', '基本の形', garments());
    shape.disabled = !o.garment.category;
    select('silhouette.fit', '全体の沿い方', D.silhouette.fit);
    [['primary','主役の色'],['secondary','合わせる色'],['accent','差し色']].forEach(function (pair) {
      colorPicker(pair[0], pair[1]);
    });
    select('materials.primary', '生地', D.materials.filter(function (m) { return m.category === 'material'; }));
    select('decorations.focalMotif', '主役の装飾', D.decorations);
    return fields;
  }

  function sample() {
    var o = C.state.outfit;
    var title = C.util.labelOf(D.garments, o.garment.subtype) || C.util.labelOf(D.garmentCategories, o.garment.category);
    var colors = E('div', {class: 'sample-colors'});
    ['primary', 'secondary', 'accent'].forEach(function (key) {
      var color = C.util.byId(D.colors, o.palette[key]);
      if (!color) return;
      var dot = E('i', {'aria-hidden': 'true'});
      dot.style.backgroundColor = color.hex;
      colors.appendChild(E('span', {}, [dot, document.createTextNode(color.labelJa)]));
    });
    var dormant = C.dormantParts(o);
    var theme = o.concept.inspiration;
    return E('aside', {id: 'outfit-sample', 'aria-label': '編集中の衣装', 'aria-live': 'polite'}, [
      E('strong', {text: title || o.name || '服の種類を選びましょう'}),
      colors,
      theme && (theme.motifId || theme.customMotif || theme.traditional.attireId) ?
        E('span', {class: 'sample-theme', text: 'テーマ · ' + C.conceptFashion.label(theme)}) : null,
      dormant.length ? E('small', {text: '現在の形では使わない部位（保持中）：' + dormant.map(function (s) { return s.labelJa; }).join('・')}) : null
    ]);
  }

  C.atelier = {progress: progress, home: home, quickEditor: quickEditor, sample: sample};
})(window.CPW);
