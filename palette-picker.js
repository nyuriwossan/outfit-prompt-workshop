/* HSV controls and visualViewport handling adapted from the appearance workshop. */
(function (root, C) {
  'use strict';
  var H = C.hex,
    E = C.ui.el;
  var $ = function (id) {
    return document.getElementById(id);
  };
  var pick = {},
    commit;
  var dialog = $('hex-dialog');

  function control(role, redraw) {
    var palette = C.state.outfit.palette;
    var name = C.util.byId(C.data.colors, palette[role]);
    var hex = palette.hexColors && palette.hexColors[role];
    var button = E('button', {
      type: 'button',
      class: 'btn hex-open',
      'data-hex-open': role,
      onclick: function () {
        openPicker(role, name, hex, function (value) {
          var colors = Object.assign({}, C.state.outfit.palette.hexColors);
          if (value) colors[role] = value;
          else delete colors[role];
          C.state.set('palette.hexColors', colors);
          redraw();
          document.querySelector('[data-hex-open="' + role + '"]').focus({ preventScroll: true });
        });
      }
    });
    if (hex) {
      var swatch = E('i', { class: 'hex-chip', 'aria-hidden': 'true' });
      swatch.style.background = hex;
      button.appendChild(swatch);
    }
    button.appendChild(document.createTextNode('自由に色を調整' + (hex ? ' · ' + hex : '')));
    return E('div', { class: 'hex-control' }, [
      button,
      name && H.mismatch(hex, name.hex)
        ? E('p', { class: 'field-note', text: '設定したHEXは色名の見本と大きく異なります。' })
        : null
    ]);
  }
  function pickHex() {
    return H.fromHsv(pick);
  }
  function paint(source) {
    var hex = pickHex(),
      hue = 'hsl(' + Math.round(pick.h) + ',100%,50%)',
      thumb = $('hex-sv-thumb');
    $('hex-sv').style.background =
      'linear-gradient(to top,#000,rgba(0,0,0,0)),linear-gradient(to right,#fff,' + hue + ')';
    thumb.style.left = 'calc(14px + (100% - 28px) * ' + pick.s + ')';
    thumb.style.top = 'calc(14px + (100% - 28px) * ' + (1 - pick.v) + ')';
    thumb.style.background = hex;
    $('hex-h').value = Math.round(pick.h);
    $('hex-s').value = Math.round(pick.s * 100);
    $('hex-v').value = Math.round(pick.v * 100);
    $('hex-h-val').textContent = Math.round(pick.h) + '°';
    $('hex-s-val').textContent = Math.round(pick.s * 100) + '%';
    $('hex-v-val').textContent = Math.round(pick.v * 100) + '%';
    $('hex-s').style.setProperty(
      '--track',
      'linear-gradient(to right,' +
        H.fromHsv({ h: pick.h, s: 0, v: pick.v }) +
        ',' +
        H.fromHsv({ h: pick.h, s: 1, v: pick.v }) +
        ')'
    );
    $('hex-v').style.setProperty(
      '--track',
      'linear-gradient(to right,#000,' + H.fromHsv({ h: pick.h, s: pick.s, v: 1 }) + ')'
    );
    if (source !== 'input') {
      $('hex-dialog-input').value = hex;
      dialogError(false);
    }
    $('hex-native').value = hex.toLowerCase();
    $('hex-preview-swatch').style.background = hex;
    $('hex-preview-code').textContent = hex;
  }
  // 入力途中や無彩色でつまみが飛ばないよう、色相・彩度は必要なときだけ更新する。
  function loadHex(hex, source) {
    var c = H.toHsv(hex);
    if (!c) return;
    if (c.s > 0 && c.v > 0) pick.h = c.h;
    if (c.v > 0) pick.s = c.s;
    pick.v = c.v;
    paint(source);
  }
  function dialogError(on) {
    var el = $('hex-dialog-message');
    el.hidden = !on;
    el.textContent = on ? '#RRGGBB（例：#C8CCD6）の形で入力してください。' : '';
    $('hex-dialog-input').setAttribute('aria-invalid', String(on));
  }

  function openPicker(role, color, hex, onCommit) {
    var reference = color && color.hex;
    commit = onCommit;
    pick = { h: 0, s: 0, v: 0.5 };
    $('hex-dialog-title').textContent = C.util.labelOf(C.data.colorRoles, role) + 'の色を調整';
    $('hex-preview-name').textContent = color ? '色名：' + color.labelJa : '色名：未指定';
    $('hex-reference').hidden = !reference;
    $('hex-reference').onclick = function () {
      loadHex(reference);
    };
    $('hex-reference-swatch').style.background = reference || 'transparent';
    $('hex-unset').hidden = !hex;
    loadHex(hex || reference || '#808080');
    dialog.showModal();
    $('hex-dialog-body').scrollTop = 0;
    document.body.classList.add('hex-modal-open');
    watchViewport(true);
    fitPicker();
  }
  // iPhone Safari では vh／dvh がツールバーやキーボードを差し引いた「見えている範囲」と一致しないことがある。
  // 開いている間は visualViewport（実際に見えている範囲）に合わせて、ダイアログの高さと位置を決める。
  // 中身（.hex-dialog-body）だけがスクロールし、ヘッダーと下部ボタンは常にこの範囲内に残る。
  var PAD = 10,
    fitting = false;
  function fitPicker() {
    var dlg = $('hex-dialog');
    if (!dlg.open) return;
    var vv = root.visualViewport,
      h = vv ? vv.height : root.innerHeight,
      top = vv ? vv.offsetTop : 0;
    dlg.style.setProperty('--hex-vv-h', Math.max(0, Math.floor(h - PAD * 2)) + 'px');
    dlg.classList.add('vv-fit');
    dlg.style.top = Math.round(top + Math.max(PAD, (h - dlg.offsetHeight) / 2)) + 'px';
    // キーボード表示中は、入力中の欄がスクロール領域内で見えるようにする（ページ全体は動かさない）。
    var el = document.activeElement,
      body = $('hex-dialog-body');
    if (el && body.contains(el) && /^(INPUT|TEXTAREA)$/.test(el.tagName) && el.type !== 'range') {
      var r = el.getBoundingClientRect(),
        b = body.getBoundingClientRect();
      if (r.bottom > b.bottom - 4) body.scrollTop += r.bottom - b.bottom + 12;
      else if (r.top < b.top + 4) body.scrollTop -= b.top - r.top + 12;
    }
  }
  function scheduleFit() {
    if (fitting) return;
    fitting = true;
    root.requestAnimationFrame(function () {
      fitting = false;
      fitPicker();
    });
  }
  function watchViewport(on) {
    var vv = root.visualViewport,
      m = on ? 'addEventListener' : 'removeEventListener';
    if (vv) {
      vv[m]('resize', scheduleFit);
      vv[m]('scroll', scheduleFit);
    }
    root[m]('resize', scheduleFit);
    root[m]('orientationchange', scheduleFit);
  }
  function initArea() {
    var area = $('hex-sv');
    function at(e) {
      var r = area.getBoundingClientRect(),
        w = r.width - 28,
        h = r.height - 28;
      pick.s = Math.min(1, Math.max(0, w > 0 ? (e.clientX - r.left - 14) / w : 0));
      pick.v = 1 - Math.min(1, Math.max(0, h > 0 ? (e.clientY - r.top - 14) / h : 0));
      paint();
    }
    area.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      e.preventDefault();
      pick.dragging = true;
      try {
        area.setPointerCapture(e.pointerId);
      } catch (err) {}
      area.focus({ preventScroll: true });
      at(e);
    });
    area.addEventListener('pointermove', function (e) {
      if (pick.dragging) at(e);
    });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (n) {
      area.addEventListener(n, function () {
        pick.dragging = false;
      });
    });
    area.addEventListener('keydown', function (e) {
      var d = {
        ArrowLeft: [-0.02, 0],
        ArrowRight: [0.02, 0],
        ArrowUp: [0, 0.02],
        ArrowDown: [0, -0.02]
      }[e.key];
      if (!d) return;
      e.preventDefault();
      pick.s = Math.min(1, Math.max(0, pick.s + d[0]));
      pick.v = Math.min(1, Math.max(0, pick.v + d[1]));
      paint();
    });
  }

  initArea();
  ['h', 's', 'v'].forEach(function (axis) {
    var slider = $('hex-' + axis);
    slider.oninput = function () {
      pick[axis] = Number(slider.value) / (axis === 'h' ? 1 : 100);
      paint();
    };
  });
  var input = $('hex-dialog-input');
  input.oninput = function () {
    var hex = H.normalize(input.value);
    dialogError(false);
    if (hex) loadHex(hex, 'input');
  };
  input.onkeydown = function (event) {
    if (event.key === 'Enter' && !event.isComposing) {
      event.preventDefault();
      var hex = H.normalize(input.value);
      if (hex) {
        loadHex(hex);
        input.blur();
      } else dialogError(true);
    }
  };
  input.onfocus = scheduleFit;
  $('hex-native').oninput = function () {
    loadHex(this.value);
  };
  dialog.querySelector('[data-hex-cancel]').onclick = function () {
    dialog.close();
  };
  $('hex-unset').onclick = function () {
    dialog.close();
    commit(null);
  };
  $('hex-apply').onclick = function () {
    var hex = H.normalize(input.value);
    if (!hex) {
      dialogError(true);
      input.focus();
      return;
    }
    dialog.close();
    commit(hex);
  };
  dialog.addEventListener('close', function () {
    document.body.classList.remove('hex-modal-open');
    watchViewport(false);
  });
  C.palettePicker = { control: control };
})(window, window.CPW);
