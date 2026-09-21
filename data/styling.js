/* Phase 5C: wearing choices, independent of garment construction and condition. */
(function (global) {
  'use strict';
  var CPW = global.CPW;
  CPW.data.styling = [
    {"id":"sleeves_rolled_up","labelJa":"袖をまくる","shortPrompt":"sleeves rolled up","detailFragment":"the sleeves rolled up","requiresFeature":"sleeves","exclusiveGroup":"sleeve_wear","groupJa":"袖"},
    {"id":"sleeves_pushed_up","labelJa":"袖をたくし上げる","shortPrompt":"sleeves pushed up","detailFragment":"the sleeves pushed up","requiresFeature":"sleeves","exclusiveGroup":"sleeve_wear","groupJa":"袖"},
    {"id":"cuffs_folded_back","labelJa":"袖口を折り返す","shortPrompt":"cuffs folded back","detailFragment":"the cuffs folded back","requiresFeature":"cuffs","exclusiveGroup":"sleeve_wear","groupJa":"袖"},
    {"id":"fully_tucked","labelJa":"全て裾を入れる","shortPrompt":"top fully tucked in","detailFragment":"the top fully tucked in","requiresFeature":"tuckable","exclusiveGroup":"tucking","groupJa":"トップス"},
    {"id":"half_tucked","labelJa":"片側だけ裾を入れる","shortPrompt":"shirt half-tucked","detailFragment":"the shirt half-tucked","requiresFeature":"shirt_tuckable","exclusiveGroup":"tucking","groupJa":"トップス"},
    {"id":"loosely_tucked","labelJa":"ゆるく裾を入れる","shortPrompt":"top loosely tucked","detailFragment":"the top loosely tucked","requiresFeature":"tuckable","exclusiveGroup":"tucking","groupJa":"トップス"},
    {"id":"untucked","labelJa":"裾を出す","shortPrompt":"top untucked","detailFragment":"the top untucked","requiresFeature":"tuckable","exclusiveGroup":"tucking","groupJa":"トップス"},
    {"id":"partially_unbuttoned","labelJa":"ボタンを一部外す","shortPrompt":"partially unbuttoned","detailFragment":"some buttons left undone","requiresFeature":"buttons","exclusiveGroup":"buttoning","groupJa":"トップス"},
    {"id":"fully_buttoned","labelJa":"ボタンを全て留める","shortPrompt":"fully buttoned","detailFragment":"all buttons fastened","requiresFeature":"buttons","exclusiveGroup":"buttoning","groupJa":"トップス"},
    {"id":"top_button_undone","labelJa":"一番上のボタンを外す","shortPrompt":"top button undone","detailFragment":"the top button undone","requiresFeature":"buttons","exclusiveGroup":"buttoning","groupJa":"トップス"},
    {"id":"collar_loosened","labelJa":"襟元をゆるめる","shortPrompt":"collar loosened","detailFragment":"the collar loosened","requiresFeature":"collar","exclusiveGroup":"collar_wear","groupJa":"襟・ネクタイ"},
    {"id":"collar_turned_up","labelJa":"襟を立てる","shortPrompt":"collar turned up","detailFragment":"the collar turned up","requiresFeature":"collar","exclusiveGroup":"collar_wear","groupJa":"襟・ネクタイ"},
    {"id":"tie_loosened","labelJa":"ネクタイをゆるめる","shortPrompt":"tie loosened","detailFragment":"the tie loosened","requiresFeature":"tie","exclusiveGroup":"tie_wear","groupJa":"襟・ネクタイ"},
    {"id":"tie_neatly_fastened","labelJa":"ネクタイを整える","shortPrompt":"tie neatly fastened","detailFragment":"the tie neatly fastened","requiresFeature":"tie","exclusiveGroup":"tie_wear","groupJa":"襟・ネクタイ"},
    {"id":"jacket_worn_open","labelJa":"ジャケットを開ける","shortPrompt":"jacket worn open","detailFragment":"the jacket worn open","requiresFeature":"jacket","exclusiveGroup":"outer_wear","groupJa":"アウター"},
    {"id":"coat_worn_open","labelJa":"コートを開ける","shortPrompt":"coat worn open","detailFragment":"the coat worn open","requiresFeature":"coat","exclusiveGroup":"outer_wear","groupJa":"アウター"},
    {"id":"cardigan_worn_open","labelJa":"カーディガンを開ける","shortPrompt":"cardigan worn open","detailFragment":"the cardigan worn open","requiresFeature":"cardigan","exclusiveGroup":"outer_wear","groupJa":"アウター"},
    {"id":"jacket_draped","labelJa":"ジャケットを肩掛け","shortPrompt":"jacket draped over the shoulders","detailFragment":"the jacket draped over the shoulders","requiresFeature":"jacket","exclusiveGroup":"outer_wear","groupJa":"アウター"},
    {"id":"coat_draped","labelJa":"コートを肩掛け","shortPrompt":"coat draped over the shoulders","detailFragment":"the coat draped over the shoulders","requiresFeature":"coat","exclusiveGroup":"outer_wear","groupJa":"アウター"},
    {"id":"jacket_tied_at_waist","labelJa":"ジャケットを腰に結ぶ","shortPrompt":"jacket tied around the waist","detailFragment":"the jacket tied around the waist","requiresFeature":"jacket","exclusiveGroup":"outer_wear","groupJa":"アウター"},
    {"id":"casually_layered","labelJa":"気軽に重ね着","shortPrompt":"casually layered","detailFragment":"casually arranged layers","requiresFeature":"layers","exclusiveGroup":"layer_wear","groupJa":"レイヤー"},
    {"id":"visible_underlayer","labelJa":"下の衣服を見せる","shortPrompt":"visible underlayer","detailFragment":"a visible underlayer","requiresFeature":"layers","exclusiveGroup":"layer_wear","groupJa":"レイヤー"},
    {"id":"loosely_layered","labelJa":"ゆるく重ね着","shortPrompt":"loosely layered","detailFragment":"loosely arranged layers","requiresFeature":"layers","exclusiveGroup":"layer_wear","groupJa":"レイヤー"},
    {"id":"layer_hanging_open","labelJa":"一枚を開いたまま","shortPrompt":"one layer hanging open","detailFragment":"one layer hanging open","requiresFeature":"open_layer","exclusiveGroup":"layer_wear","groupJa":"レイヤー"},
    {"id":"scarf_loosely_wrapped","labelJa":"スカーフをゆるく巻く","shortPrompt":"scarf loosely wrapped","detailFragment":"the scarf loosely wrapped","requiresFeature":"scarf","exclusiveGroup":"scarf_wear","groupJa":"スカーフ・フード"},
    {"id":"scarf_draped","labelJa":"スカーフを首に垂らす","shortPrompt":"scarf draped around the neck","detailFragment":"the scarf draped around the neck","requiresFeature":"scarf","exclusiveGroup":"scarf_wear","groupJa":"スカーフ・フード"},
    {"id":"hood_up","labelJa":"フードをかぶる","shortPrompt":"hood worn up","detailFragment":"the hood worn up","requiresFeature":"hood","exclusiveGroup":"hood_wear","groupJa":"スカーフ・フード"},
    {"id":"hood_down","labelJa":"フードを下ろす","shortPrompt":"hood worn down","detailFragment":"the hood worn down","requiresFeature":"hood","exclusiveGroup":"hood_wear","groupJa":"スカーフ・フード"},
    {"id":"belt_loose","labelJa":"ベルトをゆるく留める","shortPrompt":"belt loosely fastened","detailFragment":"the belt loosely fastened","requiresFeature":"belt","exclusiveGroup":"belt_wear","groupJa":"その他"},
    {"id":"sash_loose","labelJa":"帯をゆるく結ぶ","shortPrompt":"sash loosely tied","detailFragment":"the sash loosely tied","requiresFeature":"sash","exclusiveGroup":"sash_wear","groupJa":"その他"},
    {"id":"asymmetrically_worn","labelJa":"左右をずらして着る","shortPrompt":"asymmetrically worn","detailFragment":"an asymmetrically arranged outfit","requiresFeature":"","exclusiveGroup":"arrangement","groupJa":"その他"},
    {"id":"disheveled","labelJa":"意図的に着崩す","shortPrompt":"deliberately disheveled styling","detailFragment":"deliberately disheveled styling","requiresFeature":"","exclusiveGroup":"arrangement","groupJa":"その他"},
    {"id":"neatly_arranged","labelJa":"きちんと整えて着る","shortPrompt":"neatly arranged styling","detailFragment":"neatly arranged styling","requiresFeature":"","exclusiveGroup":"arrangement","groupJa":"その他"},
    {"id":"casually_worn","labelJa":"気軽に着る","shortPrompt":"casually worn","detailFragment":"casually arranged clothing","requiresFeature":"","exclusiveGroup":"arrangement","groupJa":"その他"}
  ];
  // Active garment/slot evidence is shared by UI, gacha, advisor and generator.
  function features(o) {
    var U=CPW.util, D=CPW.data, g=U.byId(D.garments,o.garment.subtype);
    var cat=U.byId(D.garmentCategories,o.garment.category);
    if (!cat) return {};
    if (g && g.category!==cat.id) g=null;
    function part(id) {
      if (cat.slots.indexOf(id)<0) return '';
      var slot=U.byId(D.partSlots,id), opt=slot && U.byId(slot.options,o.parts[id]);
      return opt ? opt.shortPrompt || '' : '';
    }
    var core=g ? (g.shortPrompt+' '+g.detailedPrompt).toLowerCase() : '';
    var cover=part('cover_up'), shirt=part('inner_shirt'), text=core+' '+cover+' '+shirt;
    var sleeve=part('sleeves'), collar=part('collar'), f={garment:true};
    f.shirt=/\bshirt\b/.test(text) && !/\bt-shirt\b/.test(text);
    f.jacket=/\bjacket\b|business suit|tailored suit|pinstripe suit|tailcoat/.test(text);
    f.coat=/\bcoat\b/.test(text); f.cardigan=/cardigan/.test(text);
    f.sleeves=sleeve ? sleeve!=='sleeveless' : !/sleeveless|strapless/.test(text) &&
      (!!g && (g.tags||[]).indexOf('no_sleeve')<0 && /shirt|sweater|hoodie|cardigan|coat|robe|kimono|blouse|knit/.test(text) || f.jacket);
    f.cuffs=f.sleeves && (!!part('cuffs') || f.shirt || f.jacket || f.coat);
    f.collar=collar ? collar!=='collarless' : f.shirt || f.jacket || f.coat || /collar/.test(text);
    f.tie=/^(business_suit|school_uniform|mafia_style_suit|stage_magician_outfit)$/.test(g ? g.id : '') || /\b(?:neck)?tie\b/.test(text);
    f.hood=/\bhood\b|hoodie/.test(text+' '+part('headwear'));
    f.scarf=/scarf/.test(text);
    f.belt=/belt/.test(part('waist')+' '+core); f.sash=/sash|obi/.test(part('waist'));
    f.tuckable=cat.id!=='merfolk' && cat.id!=='dress' && /shirt|blouse|sweater|knit top|\btop\b/.test(text);
    f.shirt_tuckable=f.shirt && f.tuckable;
    f.buttons=/button/.test(part('closure')) || (!part('closure') && (f.shirt || f.jacket || f.cardigan));
    f.layers=!!cover || !!shirt || /layer|worn over|worn under/.test(text+' '+o.garment.wearRole);
    f.open_layer=f.layers && (f.jacket || f.coat || f.cardigan);
    return f;
  }
  function reason(o,opt) {
    if (!opt) return '着こなしが見つかりません。';
    var f=features(o);
    if (!f.garment) return '基本衣装を選んでください。';
    return opt.requiresFeature && !f[opt.requiresFeature] ? '対応する部位がありません。選択は保持し、英文への出力を休止します。' : '';
  }
  function compatible(opt,ids) {
    return !(ids||[]).some(function(id) {
      var other=CPW.util.byId(CPW.data.styling,id);
      return other && other.id!==opt.id && other.exclusiveGroup===opt.exclusiveGroup;
    });
  }
  CPW.styling={features:features,reason:reason,compatible:compatible,
    applicable:function(o,opt) { return !reason(o,opt); },
    available:function(o) { return CPW.data.styling.filter(function(opt) { return !reason(o,opt); }); },
    active:function(o) {
      var used=[],out=[];
      ((o.styling && o.styling.items)||[]).forEach(function(id) {
        var opt=CPW.util.byId(CPW.data.styling,id);
        if(opt && !reason(o,opt) && compatible(opt,used)) {out.push(opt);used.push(id);}
      }); return out;
    }
  };
})(window);
