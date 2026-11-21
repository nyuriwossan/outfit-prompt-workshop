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
    ['主役の色', '合わせる色', '差し色'].forEach(function (label, i) {
      select('palette.' + ['primary', 'secondary', 'accent'][i], label, D.colors);
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
