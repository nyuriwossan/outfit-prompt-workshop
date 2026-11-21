// Output controls only. Reading an outfit never upgrades its saved presentation.
(function(C) {
  'use strict';
  var E = C.ui.el,
    U = C.util,
    D = C.data,
    P = D.presentation,
    choices = C.presentationChoices;
  var recipes = [
    {
      id: 'silhouette',
      label: '衣装全体を見せる',
      distance: 'full',
      angle: 'front'
    },
    {
      id: 'portrait',
      label: '上半身を中心に',
      pose: 'hand_chest',
      distance: 'upper',
      angle: 'three_quarter'
    },
    {
      id: 'editorial',
      label: 'ファッション誌風',
      pose: 'runway',
      distance: 'knees',
      angle: 'three_quarter',
      mood: 'model',
      background: 'light'
    },
    {
      id: 'dramatic',
      label: 'ドラマティックに',
      pose: 'stage',
      distance: 'full',
      angle: 'low',
      mood: 'commanding',
      background: 'illustration'
    },
    {
      id: 'catalog',
      label: '商品紹介風',
      distance: 'full',
      angle: 'front',
      plain: true
    }
  ];
  var sections = [
    ['pose', 'ポーズ', '身体の姿勢や衣装を見せる動作'],
    ['camera', '構図・カメラ', 'どこまで写すか、どこから見るか'],
    ['scene', '背景・シーン', '衣装のまわりの光や風景'],
    ['mood', '雰囲気・エフェクト', '表情を引き立てる雰囲気や属性の演出'],
    ['art', '画風・仕上げ', 'イラストの塗り、線、質感']
  ];

  function name(list, id) {
    return U.labelOf(list, id) || '';
  }

  function poseFor(id) {
    return U.byId(P.poseChoices, id);
  }

  function scopeOf(out) {
    if (out.includePresentation && out.includeBackground && out.includeRendering) return 'all';
    if (!out.includeBackground && !out.includeRendering) return out.includePresentation ? 'pose' : 'outfit';
    return 'custom';
  }
  // A null scope is a valid legacy representation, including independently enabled blocks.
  // Preserve its plain-background semantics as well as unrelated flags on a single-field edit.
  function include(o, flag) {
    if (o.output[flag]) return;
    if (o.output.scope) {
      C.presentation.setScope(o, flag === 'includePresentation' && scopeOf(o.output) === 'outfit' ? 'pose' :
        'all');
    } else o.output[flag] = true;
  }

  function includePlainBackground(o) {
    if (o.output.scope || (o.presentation.layoutVersion !== 1 && o.presentation.preset)) {
      C.presentation.setScope(o, 'all');
    } else {
      // Without a named scope, the generator emits plain_bg in the pose block.
      // Enable those two blocks independently, retaining the saved art setting.
      o.output.includePresentation = true;
      o.output.includeBackground = true;
    }
  }

  function applyRecipe(o, recipe) {
    var reason = choices.reason(o, poseFor(recipe.pose));
    if (reason) return reason;
    // Recipes replace the shooting direction. Subject, rendering and independent effects survive.
    var p = choices.editable(o.presentation);
    p.poseId = recipe.pose || null;
    p.distanceId = recipe.distance;
    p.angleId = recipe.angle;
    p.poseMood = recipe.mood || null;
    p.background = recipe.background || null;
    p.compositionAssist = recipe.plain ? 'plain_bg' : null;
    if (!choices.seats(poseFor(p.poseId)).includes(p.seat)) p.seat = null;
    o.presentation = C.presentation.normalize(p);
    include(o, 'includePresentation');
    if (recipe.plain) includePlainBackground(o);
    else if (recipe.background) include(o, 'includeBackground');
    return '';
  }

  function describe(o, blocks) {
    var p = o.presentation,
      out = o.output,
      modern = p.layoutVersion === 1;
    var pose = poseFor(p.poseId),
      old = U.byId(P.presets, p.preset);
    var info = {};
    sections.forEach(function(s) {
      info[s[0]] = {
        items: [],
        reasons: [],
        excluded: 0
      };
    });

    function record(group, value, reason) {
      if (!value) return;
      info[group].items.push(value);
      if (reason) info[group].excluded++;
      if (reason && !info[group].reasons.includes(reason)) info[group].reasons.push(reason);
    }
    var off = out.includePresentation ? '' : 'ポーズ・構図が出力範囲外です。';
    var noScene = out.includeBackground ? '' : '背景が出力範囲外です。';
    var bad = modern && choices.reason(o, pose);
    var mapping = !modern && old && U.byId(D.presentationLegacyMap, old.id);
    record(mapping && mapping.kind === 'composition' ? 'camera' : 'pose',
      modern ? pose && pose.labelJa : old ? old.labelJa : name(D.poseAssist, p.poseAssist), bad || off);
    if (mapping && mapping.kind !== 'composition') record('camera',
      [name(P.distances, mapping.distanceId), name(P.angles, mapping.angleId)].filter(Boolean).join(' · '), off);
    if (!modern && blocks.presentation.short.some(function(word) {
        return /aquatic fashion pose/.test(word);
      }))
      info.pose.items.push('人魚の尾に合わせた姿勢で出力');
    record('pose', name(P.subjects, p.subject), off);
    var activeSeat = modern ? choices.seats(pose).includes(p.seat) : old && old.seated;
    record('pose', name(P.seats, p.seat), !activeSeat ? 'この姿勢は選択した支持面を使いません。' : bad || off);
    if (modern) {
      record('camera', name(P.distances, p.distanceId), off);
      record('camera', name(P.angles, p.angleId), off);
    } else {
      if (p.focus !== 'full_outfit' || out.includePresentation && !old)
        record('camera', name(D.presentationFocus, p.focus), old ? '旧セットの構図が優先されます。' : off);
      if (old && p.poseAssist) record('pose', name(D.poseAssist, p.poseAssist), '旧セットの姿勢が優先されます。');
    }
    if (p.compositionAssist === 'plain_bg')
      record('scene', !out.scope && blocks.presentation.short.includes('plain background') ? '無地背景（ポーズと一緒に出力）' : '無地背景', out.scope ? noScene : !modern && old ? '旧撮影セットの無地背景は「全部」で出力できます。' : off);
    else if (p.compositionAssist)
      record('camera', name(D.compositionAssist, p.compositionAssist), modern || old ? '個別構図または旧セットが優先されます。' :
        off);
    record('scene', name(P.backgrounds, p.background), p.background === 'none' ? '背景を描写しない指定です。' : noScene);
    var inspiration = o.concept.inspiration,
      motif = U.byId(D.conceptFashion.motifs, inspiration.motifId);
    if (motif && motif.category === 'food') {
      if (inspiration.foodApplications.includes('background')) record('scene', motif.labelJa + 'の背景', noScene);
      if (inspiration.foodApplications.some(function(id) {
          return id === 'literal' || id === 'prop';
        }))
        record('pose', motif.labelJa + 'の小物', off);
    }
    record('mood', name(P.poseMoods, p.poseMood), off);
    if (out.includeEffects) record('mood', '属性演出', blocks.effects.short.length ? '' :
      '「衣装と共通の属性」で効果のある属性を選んでください。');
    else if (o.concept.attribute.applyTo.effects) record('mood', '属性演出',
      '旧設定に属性演出が保存されています。出力するには属性エフェクトをオンにしてください。');
    var attribute = U.byId(D.attributes, o.concept.attribute.id);
    if (out.includeNarrative) record('mood', '物語的演出', blocks.optionalNarrative.short.length || attribute &&
      attribute.moods.some(function(mood) {
        return blocks.theme.short.includes(mood);
      }) ? '' : '物語に使う配色・装飾などが未設定です。');
    if (!out.includeNarrative && o.specialParts.restraintChains.length) {
      var chains = o.specialParts.restraintChains.map(function(id) {
        return name(D.specialParts.restraintChains, id);
      });
      record('mood', chains.join('・'), '保存したチェーンを演出に含めるには、物語的演出をオンにしてください。');
    }
    var styleOff = !out.includeRendering ? '画風が出力範囲外です。' : !p.rendering.enabled ? '画風の出力がオフです。' : '';
    [[P.paints, 'paint'], [P.lines, 'line'], [P.finishes, 'finish']].forEach(function(x) {
      record('art', name(x[0], p.rendering[x[1]]), styleOff);
    });
    if (!info.art.items.length && p.rendering.enabled) record('art', '画風オン', '塗り・線・仕上げを選んでください。');
    return info;
  }

  function editor(o, redraw, view, showResult) {
    var p = o.presentation,
      out = o.output,
      blocks = C.generator.blocks(o),
      info = describe(o, blocks);
    var host = E('section', {
      class: 'studio',
      'aria-labelledby': 'studio-title'
    });

    function changed(message) {
      view.confirmRecipe = null;
      view.message = message || '';
      C.state.touch();
      redraw();
    }

    function select(parent, id, label, rows, value, onChange, placeholder, reason, groupBy) {
      var field = E('div', {
          class: 'studio-field'
        }),
        node = E('select', {
          id: id,
          class: 'cf-select'
        });
      if (placeholder !== false) node.appendChild(E('option', {
        value: '',
        text: placeholder || '指定しない'
      }));
      var groups = new Map();
      rows.forEach(function(row) {
        var why = reason && reason(row);
        var parent = node;
        if (groupBy) {
          var group = groupBy(row);
          if (!groups.has(group)) groups.set(group, node.appendChild(E('optgroup', {
            label: group
          })));
          parent = groups.get(group);
        }
        parent.appendChild(E('option', {
          value: row.id,
          disabled: !!why,
          text: row.labelJa + (why ? ' — ' + why : '')
        }));
      });
      node.value = value || '';
      node.addEventListener('change', function() {
        onChange(node.value || null);
      });
      field.appendChild(E('label', {
        for: id,
        text: label
      }));
      field.appendChild(node);
      parent.appendChild(field);
      return node;
    }

    function toggle(parent, id, label, on, fn) {
      parent.appendChild(E('button', {
        id: id,
        type: 'button',
        class: 'studio-toggle',
        'aria-pressed': String(!!on),
        text: label + ' · ' + (on ? 'オン' : 'オフ'),
        onclick: function() {
          fn(!on);
          changed();
        }
      }));
    }

    function simple(parent, label, list, key, flag) {
      select(parent, 'pr-presentation-' + key.replace(/\./g, '-'), label, list, U.getPath(p, key), function(v) {
        U.setPath(p, key, v);
        if (v && !(key === 'background' && v === 'none')) {
          if (flag === 'includeRendering') p.rendering.enabled = true;
          if (key === 'compositionAssist' && v === 'plain_bg') includePlainBackground(o);
          else include(o, flag);
        }
        changed();
      });
    }

    function adjust(parent, id, label, list, key) {
      select(parent, id, label, list, choices.editable(p)[key], function(v) {
        var msg = choices.update(o, key, v);
        if (v) include(o, 'includePresentation');
        changed(msg);
      });
    }

    function disclosure(parent, key, title) {
      var item = E('details', {
        class: 'studio-detail',
        'data-studio-detail': key,
        open: view.open[key]
      });
      item.appendChild(E('summary', {
        text: title
      }));
      parent.appendChild(item);
      return item;
    }

    host.appendChild(E('h2', {
      id: 'studio-title',
      text: '見せ方を追加する'
    }));
    var recipeBox = disclosure(host, 'recipes', '目的から見せ方を選ぶ');
    recipeBox.appendChild(E('p', {
      class: 'p',
      text: '姿勢・構図・背景・ポーズの雰囲気をまとめて選びます。あとから各項目を変えられます。'
    }));
    var grid = E('div', {
      class: 'recipe-grid'
    });
    recipes.forEach(function(r) {
      var why = choices.reason(o, poseFor(r.pose));
      grid.appendChild(E('button', {
        type: 'button',
        id: 'recipe-' + r.id,
        class: 'recipe',
        disabled: !!why,
        onclick: function() {
          if (p.preset || p.poseId || p.distanceId || p.angleId || p.poseMood || p.seat || p
            .background ||
            p.poseAssist || p.compositionAssist || p.focus && p.focus !== 'full_outfit') {
            view.confirmRecipe = r.id;
            redraw();
            document.getElementById('confirm-recipe').focus();
          } else changed(applyRecipe(o, r) || '「' + r.label + '」を反映しました。');
        }
      }, [E('strong', {
        text: r.label
      }), E('small', {
        text: why || [name(P.poseChoices, r.pose), name(P.distances, r.distance), name(P.angles, r
          .angle), r.plain ? '無地背景' : name(P.backgrounds, r.background)].filter(Boolean).join(
          ' · ')
      })]));
    });
    recipeBox.appendChild(grid);
    var pending = recipes.find(function(r) {
      return r.id === view.confirmRecipe;
    });
    if (pending) {
      var confirm = E('div', {
        class: 'recipe-confirm'
      });
      confirm.appendChild(E('p', {
        text: '「' + pending.label + '」で現在の姿勢・構図・背景・ポーズの雰囲気を置き換えます。人物・属性・画風は引き継ぎます。'
      }));
      confirm.appendChild(E('button', {
        type: 'button',
        id: 'confirm-recipe',
        class: 'btn btn--primary',
        text: 'この見せ方にする',
        onclick: function() {
          changed(applyRecipe(o, pending) || '「' + pending.label + '」を反映しました。');
          document.getElementById('recipe-' + pending.id).focus({
            preventScroll: true
          });
        }
      }));
      confirm.appendChild(E('button', {
        type: 'button',
        class: 'btn',
        text: 'キャンセル',
        onclick: function() {
          view.confirmRecipe = null;
          redraw();
          document.getElementById('recipe-' + pending.id).focus();
        }
      }));
      recipeBox.appendChild(confirm);
    }
    var scope = scopeOf(out);
    var scopes = [{
      id: 'outfit',
      labelJa: '衣装だけ'
    }, {
      id: 'pose',
      labelJa: '衣装＋ポーズ・構図'
    }, {
      id: 'all',
      labelJa: '全部（背景・画風まで）'
    }];
    if (scope === 'custom') {
      var included = [out.includePresentation && 'ポーズ・構図', out.includeBackground && '背景', out.includeRendering &&
        '画風'].filter(Boolean);
      scopes.push({
        id: 'custom',
        labelJa: '個別指定（' + included.join('、') + '）'
      });
    }
    select(host, 'output-scope', '撮影の出力範囲', scopes, scope, function(v) {
      C.presentation.setScope(o, v);
      changed();
    }, false);
    host.appendChild(E('p', {
      class: 'studio-note',
      text: '見せ方を選ぶと必要な出力範囲も有効になります。属性・物語・品質タグは個別に切り替えます。'
    }));
    if (view.message) host.appendChild(E('p', {
      id: 'studio-message',
      class: 'p',
      role: 'status',
      text: view.message
    }));

    sections.forEach(function(s) {
      var id = s[0],
        group = info[id],
        expanded = view.section === id;
      var status = !group.items.length ? '未設定' : group.excluded === group.items.length ? '出力対象外' : group
        .excluded ? '一部対象外' : '設定済み';
      var card = E('div', {
        class: 'studio-group'
      });
      card.appendChild(E('button', {
        id: 'open-' + id,
        type: 'button',
        class: 'studio-head',
        'aria-expanded': String(expanded),
        'aria-controls': 'studio-' + id,
        onclick: function() {
          view.section = expanded ? '' : id;
          view.message = '';
          redraw();
        }
      }, [
        E('span', {
          class: 'studio-heading'
        }, [E('strong', {
          text: s[1]
        }), E('small', {
          text: status,
          class: group.reasons.length ? 'is-off' : !group.items.length ? 'is-empty' : ''
        })]),
        E('span', {
          class: 'studio-summary',
          text: group.items.join(' · ') || s[2]
        }),
        group.reasons.length ? E('span', {
          class: 'studio-reason',
          text: group.reasons.join(' ')
        }) : null
      ]));
      var panel = E('div', {
        id: 'studio-' + id,
        class: 'studio-body',
        hidden: !expanded
      });
      card.appendChild(panel);
      host.appendChild(card);
      if (!expanded) return;
      if ((id === 'camera' || id === 'pose') && p.layoutVersion !== 1 && (p.preset || p.poseAssist || p
          .compositionAssist || p.focus && p.focus !== 'full_outfit')) {
        panel.appendChild(E('p', {
          class: 'studio-note',
          text: '従来の撮影設定を使用中です。個別のポーズ・距離・角度を選ぶと、対応する個別設定に切り替わります。'
        }));
      }
      if (id === 'pose') posePanel(panel);
      if (id === 'camera') {
        adjust(panel, 'camera-distance', '写す範囲', P.distances, 'distanceId');
        adjust(panel, 'camera-angle', 'カメラの角度', P.angles, 'angleId');
      }
      if (id === 'scene') {
        simple(panel, '背景・光の演出', P.backgrounds, 'background', 'includeBackground');
        toggle(panel, 'plain-backdrop', '無地背景', p.compositionAssist === 'plain_bg', function(on) {
          p.compositionAssist = on ? 'plain_bg' : null;
          if (on) includePlainBackground(o);
        });
      }
      if (id === 'mood') {
        simple(panel, 'ポーズの雰囲気', P.poseMoods, 'poseMood', 'includePresentation');
        toggle(panel, 'scene-effects', '属性エフェクト', out.includeEffects, function(on) {
          out.includeEffects = on;
          o.concept.attribute.applyTo.effects = on;
        });
        toggle(panel, 'scene-story', '配色・装飾に合わせた物語的演出', out.includeNarrative, function(on) {
          out.includeNarrative = on;
        });
        var attr = disclosure(panel, 'attribute', '衣装と共通の属性 · ' + (name(D.attributes, o.concept.attribute
          .id) || '未設定'));
        attr.appendChild(E('p', {
          class: 'studio-note',
          text: 'ここで選ぶ属性は、アレンジ画面の配色や装飾にも使われます。'
        }));
        select(attr, 'studio-attribute', '属性', D.attributes, o.concept.attribute.id, function(v) {
          o.concept.attribute.id = v;
          if (v) {
            out.includeEffects = true;
            o.concept.attribute.applyTo.effects = true;
          }
          changed();
        });
        select(attr, 'studio-intensity', '属性の強さ', D.attributeIntensities, o.concept.attribute.intensity,
          function(v) {
            o.concept.attribute.intensity = v;
            changed();
          }, false);
      }
      if (id === 'art') {
        simple(panel, '塗り', P.paints, 'rendering.paint', 'includeRendering');
        simple(panel, '線', P.lines, 'rendering.line', 'includeRendering');
        simple(panel, '仕上げ', P.finishes, 'rendering.finish', 'includeRendering');
        toggle(panel, 'rendering-enabled', '画風を出力', p.rendering.enabled, function(on) {
          p.rendering.enabled = on;
          if (on) include(o, 'includeRendering');
        });
      }
      if (group.reasons.length) {
        var flag = {
          pose: 'includePresentation',
          camera: 'includePresentation',
          scene: 'includeBackground',
          mood: 'includePresentation',
          art: 'includeRendering'
        }[id];
        var canEnable = !out[flag] && (id !== 'mood' || p.poseMood) &&
          (id !== 'scene' || p.background !== 'none' || group.items.length > 1);
        var needsPlainScope = id === 'scene' && p.compositionAssist === 'plain_bg' && !out.scope &&
          !blocks.presentation.short.includes('plain background');
        if (canEnable || id === 'art' && !p.rendering.enabled || needsPlainScope) panel.appendChild(E(
          'button', {
            class: 'btn',
            type: 'button',
            id: 'enable-' + id,
            text: '保存した設定を出力に含める',
            onclick: function() {
              if (id === 'art') p.rendering.enabled = true;
              if (id === 'scene' && p.compositionAssist === 'plain_bg') includePlainBackground(o);
              else include(o, flag);
              changed();
            }
          }));
      }
      var fragments = ['presentation', 'background', 'effects', 'optionalNarrative', 'rendering'].flatMap(
        function(k) {
          return blocks[k].short;
        });
      if (out.includeNarrative && o.concept.attribute.applyTo.decorations) {
        var attribute = U.byId(D.attributes, o.concept.attribute.id);
        if (attribute) fragments = blocks.theme.short.filter(function(word) {
          return attribute.moods.includes(word);
        }).concat(fragments);
      }
      panel.appendChild(E('aside', {
        class: 'studio-proof',
        'aria-label': '見せ方の英文'
      }, [
        E('strong', {
          text: '見せ方の英文'
        }), E('p', {
          lang: fragments.length ? 'en' : 'ja',
          text: fragments.join(', ') || '現在、追加される英文はありません。'
        }),
        E('button', {
          id: 'studio-result',
          type: 'button',
          class: 'btn',
          text: '完成したプロンプトを確認',
          onclick: showResult
        })
      ]));
    });

    function posePanel(panel) {
      var editable = choices.editable(p),
        selected = poseFor(editable.poseId);
      var picker = E('div', {});
      panel.appendChild(picker);
      var search = E('input', {
        type: 'search',
        id: 'pose-search',
        class: 'cf-select',
        value: view.query
      });
      var searchBox = disclosure(panel, 'search', 'ポーズを検索・分類');
      searchBox.appendChild(E('label', {
        for: 'pose-search',
        text: '名前や動作で検索'
      }));
      searchBox.appendChild(search);
      select(searchBox, 'pose-category', '動作の種類', D.poseCategories, view.category, function(v) {
        view.category = v;
        drawPoses();
      }, 'すべて');
      search.addEventListener('input', function() {
        view.query = search.value;
        drawPoses();
      });

      function drawPoses() {
        picker.replaceChildren();
        var query = C.presetCatalog.normalizeSearch(view.query);
        var list = P.poseChoices.filter(function(x) {
          return (!view.category || x.categoryId === view.category) &&
            C.presetCatalog.normalizeSearch([x.labelJa, x.noteJa].concat(x.searchAliases || []).join(' '))
            .includes(query);
        });
        if (selected && !list.includes(selected)) list.unshift(selected);
        select(picker, 'pose-choice', 'ポーズ', list, editable.poseId, function(v) {
          var msg = choices.update(o, 'poseId', v);
          if (v) include(o, 'includePresentation');
          changed(msg);
        }, '指定しない', function(x) {
          return choices.reason(o, x);
        }, function(x) {
          return name(D.poseCategories, x.categoryId);
        });
        if (!list.length) picker.appendChild(E('p', {
          class: 'studio-note',
          text: '一致するポーズがありません。検索条件を変えてください。'
        }));
      }
      drawPoses();
      var legacy = p.layoutVersion !== 1,
        old = U.byId(P.presets, p.preset);
      var allowed = legacy && old && old.seated ? P.seats : choices.seats(selected).map(function(k) {
        return U.byId(P.seats, k);
      });
      if (allowed.length) select(panel, 'pose-seat', '身体を支える場所', allowed, p.seat, function(v) {
        p.seat = v;
        if (v) include(o, 'includePresentation');
        changed();
      }, '姿勢に合わせる');
      else if (p.seat) panel.appendChild(E('button', {
        type: 'button',
        class: 'btn',
        text: '使われていない支持面を解除',
        onclick: function() {
          p.seat = null;
          changed();
        }
      }));
      var extra = disclosure(panel, 'details', '人物・従来の撮影セット');
      simple(extra, '人物指定', P.subjects, 'subject', 'includePresentation');
      var sets = P.presets.concat([{
        id: 'helpers',
        labelJa: '従来の補助を個別に編集'
      }]);
      select(extra, 'pr-presentation-preset', '従来の撮影セット', sets, p.preset, function(v) {
        ['layoutVersion', 'poseId', 'angleId', 'distanceId'].forEach(function(k) {
          delete p[k];
        });
        p.preset = v === 'helpers' ? null : v;
        if (p.preset) include(o, 'includePresentation');
        changed();
      }, legacy ? '指定しない' : '個別のポーズ・構図を使用中', function(x) {
        var mapping = U.byId(D.presentationLegacyMap, x.id);
        return choices.reason(o, poseFor(mapping && mapping.poseId));
      });
      extra.appendChild(E('p', {
        class: 'studio-note',
        text: '従来のセットを選ぶと、個別のポーズと構図を置き換えます。'
      }));
      if (legacy) {
        simple(extra, '従来の注目範囲', D.presentationFocus, 'focus', 'includePresentation');
        simple(extra, '従来のポーズ補助', D.poseAssist, 'poseAssist', 'includePresentation');
        simple(extra, '従来の構図補助', D.compositionAssist, 'compositionAssist', 'includePresentation');
      }
    }
    return host;
  }
  C.presentationStudio = {
    editor: editor
  };
})(window.CPW);
