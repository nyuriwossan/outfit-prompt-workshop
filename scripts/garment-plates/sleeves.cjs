const {path, seam, light, form, cropped} = require('./templates.cjs');
// The shoulder sits at (0,0), elbow at y=33, wrist at y=59.
// Both arms use the same pattern, reflected about the dress form's center line.
function arm(shape, right) {
  const rotated = '<g transform="translate(53 17) rotate(19)">'+shape+'</g>';
  return right ? '<g transform="translate(160 0) scale(-1 1)">'+rotated+'</g>' : rotated;
}
const limb = form('M1 0 Q-9 -1 -9 11 L-8 32 L-6 56 L-6 65 Q-5 70 -2 68 L1 65 Q4 67 5 62 L4 55 L9 31 L9 10 Z');
const base = arm(limb,false)+arm(limb,true)+form('M72 -4 H88 V7 L106 17 L101 41 L96 67 L100 82 H60 L64 67 L59 41 L54 17 L72 7 Z') +
  light('M54 16 L69 10 Q80 27 91 10 L106 16 Q96 24 101 40 L96 67 L99 79 Q80 83 61 79 L64 67 L59 40 Q64 26 54 16 Z');
function sleeve(edge, detail = '') {
  return path('M1 0 '+edge+' Q8 0 1 0 Z')+detail;
}
function tube(length, outer, inner) {
  return sleeve(`Q-9 -1 -10 10 L${outer} ${length} Q0 ${length+3} ${inner} ${length} L9 13`);
}
const short = tube(19,-11,10), long = tube(58,-9,8);
const band = (y,w) => light(`M${-w} ${y} Q0 ${y+3} ${w} ${y} v5 Q0 ${y+8} ${-w} ${y+5} Z`);
const outlines = {
  sleeveless: '', short_sleeves: short, fitted_long_sleeves: tube(58,-6,4),
  bell_sleeves: sleeve('Q-9 -1 -10 12 Q-8 37 -22 58 Q-2 69 20 58 Q9 37 9 13'),
  wide_sleeves: sleeve('Q-12 -2 -14 12 L-18 58 Q0 63 16 58 L14 14'),
  cap_sleeves: sleeve('Q-10 -1 -12 12 Q-5 7 7 14 L8 12'),
  elbow_sleeves: tube(32,-11,10), three_quarter_sleeves: tube(45,-10,9), long_sleeves: long,
  extra_long_sleeves: tube(74,-11,9)+seam('M-8 57 l8 4 -9 2 M7 66 l-9 3'),
  hand_covering_sleeves: sleeve('Q-9 -1 -10 11 L-8 67 Q-5 73 0 68 L5 63 L7 59 L9 14'),
  fitted_sleeves: tube(41,-7,6), straight_sleeves: tube(56,-10,10),
  tapered_sleeves: sleeve('Q-13 -2 -14 12 L-5 58 Q0 60 4 58 L13 14'),
  puff_sleeves: sleeve('C-17 -7 -23 14 -10 22 Q0 28 10 22 C19 14 15 3 9 2',band(20,9)),
  balloon_sleeves: sleeve('C-18 -4 -24 23 -20 40 Q-19 52 -8 57 Q0 61 8 57 Q22 48 21 31 Q20 7 8 2',band(55,7)),
  bishop_sleeves: sleeve('Q-9 -1 -10 12 Q-10 29 -16 43 Q-19 52 -8 55 Q1 61 12 53 Q19 46 13 30 L9 12',band(54,7)+seam('M-10 44 q0 7 4 10 M9 43 q2 6 -3 11')),
  lantern_sleeves: sleeve('Q-9 -1 -11 12 L-17 35 Q-18 45 -7 58 Q0 62 7 58 Q18 48 18 35 L9 12',seam('M-17 35 Q0 41 18 35')),
  leg_of_mutton_sleeves: sleeve('C-20 -10 -22 13 -13 25 L-6 34 L-5 58 H5 L7 31 Q19 14 11 3'),
  trumpet_sleeves: sleeve('Q-9 -1 -9 12 L-7 34 Q-7 49 -22 60 Q0 68 21 60 Q7 49 7 34 L9 12',seam('M-7 34 Q0 37 7 34')),
  flared_sleeves: sleeve('Q-9 -1 -10 12 L-18 47 Q0 56 16 47 L9 12'),
  kimono_sleeves: sleeve('L-11 4 L-15 47 L15 48 L23 17 L12 9'),
  raglan_sleeves: long+light('M0 0 L14 -11 Q18 -3 12 19 L9 27 Q7 11 0 0 Z'),
  dolman_sleeves: sleeve('Q-9 -1 -9 12 L-7 50 H7 Q8 35 23 29 L15 8'),
  batwing_sleeves: sleeve('Q-9 -1 -9 12 L-7 57 H6 Q13 45 30 45 L18 10'),
  slit_sleeves: long+form('M0 19 Q-5 30 0 44 Q3 31 0 19 Z'),
  split_sleeves: sleeve('Q-9 -1 -10 12 L-15 59 L-6 57 L0 19 L5 57 L15 60 L9 12'),
  layered_sleeves: long+short+tube(12,-13,12),
  detached_sleeves: path('M-9 22 Q0 18 9 22 L5 58 Q0 61 -6 58 Z'),
  one_sleeve: long, asymmetric_sleeves: long,
  overlay_sleeves: short+'<g opacity=".68">'+light('M1 0 Q-12 -1 -13 13 L-14 54 Q1 62 14 54 L11 12 Q8 0 1 0 Z')+'</g>'
};
const drawings = {};
for (const [id,shape] of Object.entries(outlines)) {
  const other = id==='one_sleeve' ? '' : id==='asymmetric_sleeves' ? short : shape;
  drawings[id] = arm(shape,false)+arm(other,true);
}
module.exports = cropped(base,drawings,'0 -3 160 101');
