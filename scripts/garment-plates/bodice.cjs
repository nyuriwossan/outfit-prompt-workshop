const {path, seam, light, torso, hips, cropped} = require('./templates.cjs');
// Edge runs from the left shoulder to the right. All edges share the same shoulder slope.
const bodice = (edge, detail = '') => path('M24 25 L'+edge+' L96 25 Q87 39 89 48 L84 79 H36 L31 48 Q33 39 24 25 Z') + detail;
const band = path('M32 40 Q60 46 88 40 L85 63 Q60 69 35 63 Z');
const straps = (d) => light(d);
const neckline = {
  high_neckline: bodice('48 16 Q60 23 72 16'),
  keyhole_neckline: bodice('48 16 Q60 24 72 16', path('M60 25 Q47 42 60 44 Q73 42 60 25 Z','#f3eade')),
  illusion_neckline: bodice('48 16 Q60 28 72 16') + light('M24 25 L48 16 Q60 28 72 16 L96 25 L89 44 Q74 30 60 44 Q46 30 31 44 Z') + seam('M44 24 l2 2 m9 4 l2 2 m10 -3 l2 2 m8 -7 l2 2'),
  plunging_neckline: bodice('44 19 L60 72 L76 19'),
  sweetheart_neckline: path('M31 42 Q43 23 60 42 Q77 23 89 42 L84 79 H36 Z'),
  square_neckline: bodice('40 20 V43 H80 V20'),
  crew_neck: bodice('46 17 Q60 39 74 17',seam('M43 19 Q60 45 77 19')),
  round_neck: bodice('42 20 Q60 53 78 20'),
  v_neck: bodice('43 19 L60 40 L77 19'),
  deep_v_neck: bodice('40 20 L60 58 L80 20'),
  scoop_neck: bodice('39 20 C40 65 80 65 81 20'),
  boat_neck: bodice('28 24 Q60 37 92 24'),
  mock_neck: bodice('49 16 V9 Q60 13 71 9 V16',seam('M49 16 Q60 21 71 16')),
  funnel_neck: bodice('46 17 L42 4 Q60 -1 78 4 L74 17',seam('M42 4 Q60 12 78 4')),
  wide_neckline: bodice('29 24 Q60 55 91 24'),
  off_center_neckline: bodice('44 19 Q49 40 70 44 Q76 38 80 20'),
  halter_neckline: path('M31 48 Q44 35 49 15 Q60 20 71 15 Q76 35 89 48 L84 79 H36 Z'),
  one_shoulder_neckline: path('M24 25 L39 20 Q61 39 89 44 L84 79 H36 L31 48 Q33 38 24 25 Z'),
  asymmetric_neckline: bodice('40 20 L54 40 L70 35 L80 20'),
  wrap_neckline: bodice('43 19 L63 42 L77 19',seam('M77 19 Q62 50 35 68 M35 68 l10 3 -8 6 M35 68 l-6 9')),
  surplice_neckline: bodice('41 20 L60 42 L79 20',seam('M41 20 L84 70 M60 42 L35 69')),
  cowl_neckline: bodice('34 22 Q60 50 86 22',seam('M34 23 Q55 66 85 24 M39 35 Q61 63 78 37')),
  split_neckline: bodice('44 18 Q50 27 58 27 L60 49 L62 27 Q70 27 76 18'),
  notch_neckline: bodice('44 18 Q49 26 55 26 L60 34 L65 26 Q72 25 76 18'),
  open_neckline: bodice('46 18 L60 46 L74 18',light('M46 18 L60 46 L43 32 L35 35 L38 23 Z M74 18 L60 46 L77 32 L85 35 L82 23 Z') + seam('M60 46 V79'))
};
const thin = straps('M34 44 L33 23 L36 22 L38 45 Z M82 45 L84 22 L87 23 L86 44 Z');
const shoulder = {
  halter_strap: straps('M34 44 L48 14 Q60 19 72 14 L86 44 H81 L69 19 Q60 23 51 19 L39 44 Z')+band,
  thin_straps: thin+band, strapless: band,
  cross_back_straps: straps('M33 23 L37 21 L85 44 L82 48 Z M83 21 L87 23 L38 48 L35 44 Z')+band
};
const top = {
  bralette: thin+path('M32 51 L36 33 Q49 33 59 51 H61 Q71 33 84 33 L88 51 L85 57 H35 Z'),
  underwire_bra: thin+path('M32 40 Q43 48 57 39 L60 45 L63 39 Q77 48 88 40 L86 51 Q76 64 61 51 H59 Q44 64 34 51 Z')+seam('M34 43 Q36 65 58 49 M62 49 Q84 65 86 43'),
  bandeau: band, bustier: path('M31 43 Q44 32 60 43 Q76 32 89 43 L84 73 Q60 83 36 73 Z') + seam('M39 43 Q40 56 57 49 M63 49 Q80 56 81 43 M42 53 L45 72 M78 53 L75 72 M60 47 V75')
};
const shorts = 'M30 31 Q60 37 90 31 L95 59 Q81 65 63 60 L60 53 L57 60 Q39 65 25 59 Z';
const bottom = {
  briefs: path('M30 32 Q60 39 90 32 L93 42 Q76 40 64 58 H56 Q42 41 27 42 Z'),
  high_waisted_briefs: path('M38 12 Q60 17 82 12 L93 41 Q75 40 64 58 H56 Q42 40 27 41 Z'),
  boyshorts: path(shorts)+seam('M30 36 Q60 42 90 36 M60 40 V53'),
  lace_shorts: path(shorts)+seam('M27 53 q4 11 8 1 q4 11 8 1 q4 11 9 0 M68 55 q4 10 8 0 q4 9 8 -1 q4 8 9 -2')+seam('M29 49 l6 5 6 -4 6 5 6 -4 M68 51 l6 4 6 -5 6 4 6 -5')
};
const stocking = light('M25 57 Q40 62 55 59 L52 84 H28 Z M65 59 Q80 62 95 57 L92 84 H68 Z');
const suspenders = path('M37 25 L43 27 L37 60 H33 Z M77 27 L83 25 L87 60 H83 Z');
const garter = {
  garter_belt: stocking+suspenders+path('M37 15 Q60 21 83 15 L87 30 L79 35 Q60 23 41 35 L33 30 Z'),
  garter_details: stocking+path('M25 54 Q40 59 56 56 L55 61 Q40 65 25 60 Z M64 56 Q80 59 95 54 V60 Q80 65 65 61 Z')+light('M33 51 L40 56 L47 52 L45 61 L40 57 L34 60 Z M73 52 L80 56 L87 51 L86 60 L80 57 L75 61 Z'),
  no_garter: stocking
};
module.exports = {
  neckline: cropped(torso,neckline,'0 -2 120 79'),
  straps: cropped(torso,shoulder,'0 0 120 78'),
  top_structure: cropped(torso,top,'0 4 120 78'),
  bottom_structure: cropped(hips,bottom,'5 0 110 72'),
  garter: cropped(hips,garter,'0 2 120 78')
};
