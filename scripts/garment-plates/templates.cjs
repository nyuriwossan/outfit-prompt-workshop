// Each plate uses a neutral dress form, a sage fabric face and a darker construction line.
// Coordinates are in drawing units. vector-effect preserves line weight across detail crops.
const fabric = '#a8c8b8', paper = '#f3eade', facing = '#dce9df', ink = '#275247';
function path(d, fill = fabric, stroke = ink) {
  return `<path d="${d}" fill="${fill}" stroke="${stroke}" vector-effect="non-scaling-stroke"/>`;
}
const seam = d => path(d, 'none');
const form = d => path(d, paper, '#ad9e88');
const light = d => path(d, facing);
const torso = form('M49 -5 H71 V13 Q72 18 83 21 L96 25 Q102 27 105 40 L112 70 L101 75 L90 51 Q84 70 87 83 L94 108 H26 L33 83 Q36 69 30 51 L19 75 L8 70 L15 40 Q18 28 24 25 L37 21 Q48 18 49 13 Z');
const hips = form('M38 -4 Q42 10 36 22 Q23 43 24 58 L28 90 H52 L60 55 L68 90 H92 L96 58 Q97 43 84 22 Q78 10 82 -4 Z');
const cropped = (base, drawings, viewBox) => ({base, drawings, viewBox});
module.exports = {path, seam, light, form, torso, hips, cropped};
