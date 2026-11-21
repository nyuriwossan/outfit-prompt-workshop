const {path, seam, light, form, cropped} = require('./templates.cjs');
const forearm = form('M41 -4 H75 L72 42 L74 50 Q81 60 78 64 Q75 68 70 58 L71 73 Q70 81 66 75 Q64 83 61 77 Q56 82 54 75 Q51 78 50 71 L45 53 Z')+
  light('M37 -5 H79 L75 39 Q59 44 42 39 Z');
const cuff = (top,bottom,width=18) => path(`M41 ${top} Q59 ${top+5} 77 ${top} L${59+width} ${bottom} Q59 ${bottom+5} ${59-width} ${bottom} Z`);
const cuffBand = cuff(29,46);
const ribs = (x,y,n,dx,h) => seam(Array.from({length:n},(_,i)=>`M${x+dx*i} ${y} l1 ${h}`).join(' '));
const cuffs = {
  plain_cuffs:cuffBand, ornate_cuffs:cuffBand+seam('M43 36 Q49 29 54 38 T67 36 T75 36 M54 39 l5 -6 5 6 -5 5 Z'),
  lace_cuffs:cuff(30,41)+light('M41 39 Q59 45 77 39 V46 q-3 9 -7 3 q-4 9 -8 2 q-4 8 -8 0 q-5 7 -8 -3 q-5 5 -5 -2 Z')+seam('M45 44 l3 2 3 -1 m4 2 l4 2 4 -2 m4 -1 l3 1 3 -3'),
  buckled_cuffs:cuffBand+light('M41 34 L76 37 V42 L41 39 Z')+light('M54 33 L65 34 L64 43 L53 42 Z')+seam('M58 38 h7'),
  narrow_cuffs:cuff(38,43,16), wide_cuffs:cuff(20,49,22),
  folded_cuffs:cuff(25,46,20)+light('M39 24 L79 26 L75 38 L43 35 Z'),
  rolled_cuffs:cuff(32,45)+light('M40 31 Q59 36 77 31 Q83 34 77 39 Q58 44 40 39 Q36 35 40 31 Z'),
  buttoned_cuffs:cuffBand+seam('M67 31 L66 45')+path('M71 35 a2.6 2.6 0 1 0 .1 0 Z','#f4e2b0'),
  french_cuffs:cuff(21,46,20)+light('M39 25 L78 22 L82 42 L63 46 L60 33 Z')+path('M67 36 l4 -4 4 4 -4 4 Z','#d8bb82'),
  ruffled_cuffs:cuff(27,36)+path('M43 36 Q59 40 75 36 L84 50 Q79 47 75 52 T65 52 T55 53 T45 52 T34 50 Z')+seam('M48 39 l-5 9 m13 -8 l-1 10 m11 -11 l4 10'),
  elastic_cuffs:cuff(32,40,14)+ribs(45,34,7,4,4)+seam('M46 32 l-5 -11 m12 12 l-2 -10 m16 10 l6 -11'),
  ribbed_cuffs:cuff(28,47,16)+ribs(45,32,8,4,13),
  flared_cuffs:cuff(29,51,27),
  split_cuffs:path('M41 28 Q59 34 77 28 L80 49 L64 52 L61 36 L58 52 L39 49 Z')
};
const dress = light('M28 -3 H92 Q81 21 82 39 Q84 53 95 79 H25 Q36 53 38 39 Q39 21 28 -3 Z');
const belt = (y,h) => path(`M37 ${y} Q60 ${y+5} 83 ${y} v${h} Q60 ${y+h+5} 37 ${y+h} Z`);
const buckle = light('M54 33 H65 V43 H54 Z')+seam('M59 38 h7');
const bow = light('M60 38 Q44 23 45 32 L45 44 Q49 48 60 39 Q74 49 76 43 L75 31 Q74 27 60 38 Z')+path('M57 35 H63 V41 H57 Z');
const tails = path('M58 39 L53 58 L48 53 L44 55 L54 38 Z M62 39 L76 54 L70 54 L69 59 L58 40 Z');
const waist = {
  royal_sash:path('M36 28 Q60 38 83 34 L85 45 Q60 53 36 40 Z')+path('M73 40 L80 69 L86 65 L81 39 Z')+light('M72 39 l6 -6 6 6 -6 6 Z'),
  leather_belt:belt(32,11)+buckle+seam('M69 39 h2 m4 -1 h2'),
  corset_waist:path('M32 18 Q60 31 88 18 Q80 35 86 48 L60 59 L34 48 Q40 35 32 18 Z')+seam('M43 25 Q47 38 42 48 M77 25 Q73 38 78 48 M55 27 L65 35 L55 42 L65 50 M65 27 L55 35 L65 42 L55 50'),
  ribbon_tie:belt(35,3)+tails+bow, obi:belt(23,23)+seam('M37 33 Q60 39 83 33 M37 36 Q60 42 83 36'),
  narrow_belt:belt(35,5)+light('M56 35 h8 v7 h-8 Z'), wide_belt:belt(26,21)+light('M53 30 h14 v15 H53 Z'),
  double_belt:belt(28,6)+belt(40,6), utility_belt:belt(30,11)+path('M39 33 h13 v16 H39 Z M68 34 h12 v16 H68 Z')+seam('M39 37 l7 4 6 -4 M68 38 l6 4 6 -4'),
  chain_belt:Array.from({length:9},(_,i)=>{const x=35+i*5.5,y=33+8*Math.sin(i*Math.PI/8);return seam(`M${x} ${y} q4 -4 7 0 q1 5 -4 5 q-5 0 -3 -5 Z`);}).join(''),
  sash:belt(28,15)+seam('M37 40 Q59 39 80 30')+path('M75 34 L84 34 L91 58 L80 54 Z'),
  bow_belt:belt(30,14)+bow, waist_harness:belt(38,7)+path('M36 3 L41 3 L68 40 L62 41 Z M80 3 L85 3 L58 40 L52 40 Z'),
  drawstring_waist:belt(32,9)+seam('M56 37 Q68 49 59 56 M65 37 Q54 49 53 54 M57 37 q-9 -8 -8 -2 q1 6 10 3 q13 -9 12 -3 q-1 5 -10 4'),
  elastic_waistband:belt(31,12)+ribs(40,34,11,4,8),
  waist_panel:belt(32,8)+path('M45 28 Q60 34 75 28 L71 47 L60 58 L49 47 Z')+seam('M51 34 L54 46 L60 51 L66 46 L69 34'),
  peplum_waist:belt(29,7)+path('M37 36 Q60 42 83 36 L96 59 Q87 55 79 62 T61 61 T43 62 T24 59 Z')+seam('M44 40 l-8 16 m19 -14 l-3 15 m17 -15 l5 15 m5 -17 l7 14')
};
module.exports = {
  cuffs:cropped(forearm,cuffs,'8 -1 103 77'),
  waist:cropped(dress,waist,'7 2 106 71')
};
