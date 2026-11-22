const {path, light, seam, torso, cropped} = require('./templates.cjs');

// The neck base is at (60,19). Draft one leaf and reflect it to keep spread and roll comparable.
function pair(leaf) {
  return leaf + '<g transform="translate(120) scale(-1 1)">'+leaf+'</g>';
}
const shirt = light('M48 16 Q60 25 72 16 L95 24 Q103 27 106 44 L109 64 H11 L14 44 Q17 27 25 24 Z');
const placket = seam('M59 21 V64 M63 21 V64');
const stud = (x,y,r=1.65) => path(`M${x-r} ${y} a${r} ${r} 0 1 0 ${2*r} 0 a${r} ${r} 0 1 0 ${-2*r} 0 Z`,'#f5efd9');
const shirtFront = placket+stud(61,44,1.2)+stud(61,56,1.2);
const points = pair(path('M48 14 Q50 19 60 22 L46 36 L41 21 Z'));
const lowStand = path('M47 13 Q60 19 73 13 V20 Q60 28 47 20 Z');
const stand = path('M47 4 Q60 9 73 4 L74 19 Q60 27 46 19 Z')+seam('M60 7 V23');
const opening = light('M48 16 Q60 25 72 16 L60 56 Z');
const tailored = leaf => opening+pair(path(leaf))+stud(60,59,1.4);
const drawings = {
  point_collar: shirtFront+points,
  spread_collar: shirtFront+pair(path('M48 14 Q51 20 60 22 L31 29 L40 20 Z')),
  button_down_collar: shirtFront+points+pair(stud(46.8,31.2,2.15)),
  band_collar: shirtFront+path('M47 15 Q60 21 73 15 V21 Q60 28 47 21 Z')+stud(61,21),
  mandarin_collar: shirtFront+pair(path('M46 9 Q53 11 56 13 Q60 16 57 22 Q52 22 46 18 Z')),
  stand_collar: lowStand+seam('M60 17 V24'),
  high_standing_collar: stand,
  detachable_standing_collar: lowStand+stud(60,20)+path('M46 1 Q60 6 74 1 V11 Q60 17 46 11 Z')+seam('M59 4 L58 14 M62 4 L63 14'),
  wing_collar: shirtFront+stand+pair(light('M49 6 L59 8 L44 18 Z')),
  open_collar: pair(path('M47 15 L60 39 L47 31 L38 33 L41 21 Z'))+seam('M60 39 V64'),
  peter_pan_collar: shirtFront+pair(path('M48 15 Q50 21 60 22 C61 40 40 43 32 30 Q30 23 40 19 Z')),
  rounded_collar: shirtFront+pair(path('M48 14 Q50 19 60 22 L49 32 Q45 36 43 31 L41 21 Z')),
  shawl_collar: pair(path('M48 14 Q40 18 37 26 C36 34 50 37 60 43 Q55 34 53 26 Z')),
  narrow_lapels: tailored('M48 15 L40 23 L45 25 L41 27 L60 56 Z'),
  wide_lapel: tailored('M48 15 L29 23 L38 27 L28 30 L60 56 Z'),
  notched_lapels: tailored('M48 15 L34 22 L44 28 L34 26 L35 34 L60 56 Z'),
  peak_lapels: tailored('M48 15 L39 23 L46 27 L28 17 L33 33 L60 56 Z'),
  shawl_lapels: tailored('M48 15 Q36 20 39 32 Q42 42 60 56 Z'),
  ruffled_collar: path('M46 14 Q60 20 74 14 L83 19 Q88 26 80 26 Q83 34 75 31 Q75 39 68 34 Q63 43 59 35 Q52 41 49 34 Q40 39 42 31 Q33 34 36 27 Q27 26 35 20 Z')+
    pair(seam('M46 19 L38 25 M50 22 L45 30 M55 24 L53 33'))+lowStand,
  sailor_collar: path('M47 15 L60 38 L73 15 L92 23 L85 33 L60 47 L35 33 L28 23 Z')+
    seam('M31 23 L37 30 L60 43 L83 30 L89 23'),
  no_collar: seam('M45 18 Q60 31 75 18'),
  oversized_collar: shirtFront+pair(path('M48 15 Q52 21 60 23 L39 45 L23 28 L36 20 Z')),
  lace_collar: pair(path('M48 15 Q51 21 60 22 Q62 33 57 32 Q53 40 49 35 Q42 39 40 32 Q32 34 33 26 Q31 22 39 19 Z')+
    seam('M39 23 l3 3 -4 2 Z M46 27 l3 3 -4 2 Z M53 25 l3 3 -4 2 Z')),
  fur_trimmed_collar: pair(path('M47 13 Q52 18 60 21 L56 31 L54 29 L51 36 L48 32 L42 36 L42 31 L35 33 L36 28 L30 28 L34 24 L29 23 L39 19 L36 17 Z')+
    seam('M38 23 l4 -2 M44 28 l3 -5 M51 29 l2 -4')),
  split_collar: shirtFront+pair(path('M48 15 Q53 20 60 22 L52 36 L47 27 L44 37 L37 23 Z'))
};
module.exports = cropped(torso+shirt,drawings,'12 0 96 60');
