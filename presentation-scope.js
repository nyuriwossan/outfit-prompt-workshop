// STEP 3 interprets the existing 0.6 flags. The generator and storage consume them directly.
(function (C) {
  'use strict';
  var labels = {includePresentation: 'ポーズ・構図', includeBackground: '背景', includeRendering: '画風'};

  function namedRange(output) {
    if (output.includePresentation && output.includeBackground && output.includeRendering) return 'all';
    if (!output.includeBackground && !output.includeRendering) return output.includePresentation ? 'pose' : 'outfit';
    return null;
  }

  function scopeOf(output) {
    // A legacy null can route plain_bg differently even if its three flags match a named range.
    return output.scope || (namedRange(output) === 'outfit' ? 'outfit' : 'custom');
  }

  function plainVisible(outfit, output) {
    var blocks = C.presentation.blocks(Object.assign({}, outfit, {output:output}));
    return blocks.presentation.short.includes('plain background') || blocks.background.short.includes('plain background');
  }

  function setFlags(outfit, patch, acceptPlainChange, individual) {
    var output = outfit.output;
    var next = Object.assign({}, output, patch);
    next.scope = !individual && output.scope ? namedRange(next) : null;
    if (!acceptPlainChange && outfit.presentation.compositionAssist === 'plain_bg') {
      var visible = plainVisible(outfit, next);
      if (visible !== plainVisible(outfit, output) && visible !== patch.includeBackground) {
        return 'この組み合わせでは、保存済みの無地背景も' + (visible ? '英文に入ります。' : '出力対象外になります。');
      }
    }
    Object.assign(output, patch, {scope:next.scope});
    return '';
  }

  C.presentationScope = {labels:labels, scopeOf:scopeOf, setFlags:setFlags};
})(window.CPW);
