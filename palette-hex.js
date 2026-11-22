/* Outfit HEX values are explicit overrides, independent of dictionary swatches. */
(function (C) {
  'use strict';
  function normalizeHex(input) {
    if (typeof input !== 'string') return null;
    var s = input
      .trim()
      .replace(/[！-～]/g, function (c) {
        return String.fromCharCode(c.charCodeAt(0) - 0xfee0);
      })
      .replace(/^#/, '');
    if (/^[0-9a-fA-F]{3}$/.test(s))
      s = s
        .split('')
        .map(function (c) {
          return c + c;
        })
        .join('');
    return /^[0-9a-fA-F]{6}$/.test(s) ? '#' + s.toUpperCase() : null;
  }

  function normalizeMap(raw) {
    var colors = {};
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
      C.data.colorRoles.forEach(function (role) {
        var hex = normalizeHex(raw[role.id]);
        if (hex) colors[role.id] = hex;
      });
    }
    return colors;
  }
  function toRgb(hex) {
    var n = normalizeHex(hex);
    return n
      ? {
          r: parseInt(n.slice(1, 3), 16),
          g: parseInt(n.slice(3, 5), 16),
          b: parseInt(n.slice(5, 7), 16)
        }
      : null;
  }
  function fromRgb(c) {
    function p(x) {
      return ('0' + Math.min(255, Math.max(0, Math.round(x))).toString(16)).slice(-2);
    }
    return ('#' + p(c.r) + p(c.g) + p(c.b)).toUpperCase();
  }
  function toHsv(hex) {
    var c = toRgb(hex);
    if (!c) return null;
    var r = c.r / 255,
      g = c.g / 255,
      b = c.b / 255,
      max = Math.max(r, g, b),
      min = Math.min(r, g, b),
      d = max - min,
      h = 0;
    if (d !== 0) {
      if (max === r) h = ((g - b) / d) % 6;
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
      if (h < 0) h += 360;
    }
    return { h: h, s: max === 0 ? 0 : d / max, v: max };
  }
  function fromHsv(c) {
    var h = ((c.h % 360) + 360) % 360,
      s = Math.min(1, Math.max(0, c.s)),
      v = Math.min(1, Math.max(0, c.v)),
      k = v * s,
      x = k * (1 - Math.abs(((h / 60) % 2) - 1)),
      m = v - k,
      r = 0,
      g = 0,
      b = 0;
    if (h < 60) {
      r = k;
      g = x;
    } else if (h < 120) {
      r = x;
      g = k;
    } else if (h < 180) {
      g = k;
      b = x;
    } else if (h < 240) {
      g = x;
      b = k;
    } else if (h < 300) {
      r = x;
      b = k;
    } else {
      r = k;
      b = x;
    }
    return fromRgb({ r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 });
  }
  function mismatch(hex, ref) {
    if (!hex || !ref) return false;
    var a = toHsv(ref),
      b = toHsv(hex);
    var ca = a.s >= 0.25 && a.v >= 0.2,
      cb = b.s >= 0.25 && b.v >= 0.2;
    if (ca && cb) {
      var d = Math.abs(a.h - b.h);
      if (Math.min(d, 360 - d) > 75) return true;
    }
    if (Math.abs(a.v - b.v) > 0.6) return true;
    return ca !== cb && Math.abs(a.s - b.s) > 0.5;
  }

  function cleanPalette(palette) {
    var colors = normalizeMap(palette.hexColors);
    if (Object.keys(colors).length) palette.hexColors = colors;
    else delete palette.hexColors;
  }

  function swatch(palette, role) {
    var color = C.util.byId(C.data.colors, palette[role]);
    var hex = palette.hexColors && palette.hexColors[role];
    if (!hex && !color) return null;
    return { hex: hex || color.hex, labelJa: color ? color.labelJa : hex };
  }

  C.hex = {
    swatch: swatch,
    normalize: normalizeHex,
    cleanPalette: cleanPalette,
    toHsv: toHsv,
    fromHsv: fromHsv,
    mismatch: mismatch
  };
})(window.CPW);
