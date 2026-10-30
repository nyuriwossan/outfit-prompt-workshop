/* 衣装プロンプト工房 / costume-checks.js
 * data/costume-rules.js の check を advisor の CHECKS へ登録する。判定エンジン本体は advisor.js のまま。 */
(function (global) {
  'use strict';
  var CPW = global.CPW, D = CPW.data, U = CPW.util, S = CPW.schema;
  var CH = CPW.advisor.CHECKS;
  var MASCOT_REPLACED = ['headwear', 'handwear', 'footwear', 'legwear', 'animal_hood', 'mermaid_tail_form', 'kigurumi_hands', 'kigurumi_feet', 'kigurumi_padding'];
  var FACE_WORDS = /\b(visible face|face visible|showing (?:her|his|their) face|open[- ]face|face[- ]revealing|face[- ]out|face exposed|exposed face|unmasked)\b/i;

  function filled(o, id) { var s = U.byId(D.partSlots, id); return !!s && S.isSlotFilled(s, o.parts[id]); }
  function opt(o, id) { var s = U.byId(D.partSlots, id); return s ? U.byId(s.options || [], o.parts[id]) : null; }
  function mascot(o) { return o.garment.category === 'full_mascot'; }
  function kigurumi(o) { return o.garment.category === 'kigurumi'; }

  CH.mascotFaceInTags = function (o) {
    if (!mascot(o) || !FACE_WORDS.test(o.output.customTags || '')) return null;
    return { involvedPaths: ['garment.category'], extraJa: '追加タグ：' + (o.output.customTags.match(FACE_WORDS) || [''])[0] };
  };
  CH.mascotDormantParts = function (o) {
    if (!mascot(o)) return null;
    var list = MASCOT_REPLACED.filter(function (id) { var x = opt(o, id); return filled(o, id) && !(id === 'headwear' && x && x.id === 'no_headwear'); });
    if (!list.length) return null;
    return {
      involvedPaths: list.map(function (id) { return 'parts.' + id; }),
      extraJa: '保持中：' + list.map(function (id) { return U.byId(D.partSlots, id).labelJa; }).join('・'),
      resolutions: list.map(function (id) { return { labelJa: U.byId(D.partSlots, id).labelJa + 'を外す', action: 'setPath:parts.' + id + '=' }; }).concat([{ labelJa: '保持したままにする', action: 'ignore' }])
    };
  };
  CH.mascotFacePresentation = function (o) {
    if (!mascot(o) || !o.output.includePresentation) return null;
    var p = o.presentation || {}, face = p.distanceId === 'face' || p.focus === 'detail', gaze = p.poseMood === 'inviting';
    if (!face && !gaze) return null;
    var res = [];
    if (face) res.push({ labelJa: '距離を上半身にする', action: 'setPath:presentation.distanceId=upper' });
    if (gaze) res.push({ labelJa: '雰囲気を解除する', action: 'setPath:presentation.poseMood=' });
    res.push({ labelJa: 'このまま維持する', action: 'ignore' });
    return { involvedPaths: ['garment.category'], extraJa: face ? '顔寄りの距離' : '視線の指定', resolutions: res };
  };
  CH.mascotSpecialParts = function (o) {
    if (!mascot(o)) return null;
    var act = S.activeSpecialParts(o);
    return act.length ? { involvedPaths: act.map(function (x) { return 'specialParts.' + x.slot.id + '.type'; }), extraJa: act.map(function (x) { return x.slot.labelJa; }).join('・') } : null;
  };
  CH.kigurumiHandsVsHandwear = function (o) {
    var h = opt(o, 'kigurumi_hands');
    return kigurumi(o) && h && (h.tags || []).indexOf('mitts') >= 0 && filled(o, 'handwear') ? { involvedPaths: ['parts.kigurumi_hands', 'parts.handwear'] } : null;
  };
  CH.kigurumiFeetVsFootwear = function (o) {
    var f = opt(o, 'kigurumi_feet'), shoe = opt(o, 'footwear');
    return kigurumi(o) && f && (f.tags || []).indexOf('footed') >= 0 && shoe && !shoe.wearState ? { involvedPaths: ['parts.kigurumi_feet', 'parts.footwear'] } : null;
  };
  CH.kigurumiHoodVsHeadwear = function (o) {
    if (!kigurumi(o)) return null;
    var hood = opt(o, 'animal_hood'), g = U.byId(D.garments, o.garment.subtype), hw = opt(o, 'headwear');
    var hoodUp = hood ? (hood.tags || []).indexOf('hood') >= 0 : !!(g && g.hasHood);
    return hoodUp && hw && hw.id !== 'no_headwear' ? { involvedPaths: ['parts.animal_hood', 'parts.headwear'] } : null;
  };
  CH.faceCoveringHeadwear = function (o) {
    var cat = U.byId(D.garmentCategories, o.garment.category), hw = opt(o, 'headwear');
    return cat && cat.slots.indexOf('headwear') >= 0 && hw && (hw.tags || []).indexOf('face_covering') >= 0 ? { involvedPaths: ['parts.headwear'] } : null;
  };
})(typeof window !== 'undefined' ? window : global);
