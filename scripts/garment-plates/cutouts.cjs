const {path, seam, torso, cropped} = require('./templates.cjs');

// Cut the opening out of the garment. The dress form underneath supplies the exposed
// surface even when an opening crosses a shoulder, armhole, side seam or neckline.
const frontNeck = 'Q60 30 73 16';
const backNeck = 'Q60 21 73 16';
const shouldersAndBody = 'L96 25 Q103 27 106 42 L95 46 L90 39 Q87 46 89 54 Q84 73 87 83 L90 96 Q60 101 30 96 L33 83 Q36 73 31 54 Q33 46 30 39 L25 46 L14 42 Q17 27 24 25 Z';
const shape = neck => 'M47 16 '+neck+' '+shouldersAndBody;
const frontLandmarks = seam('M49 17 Q51 22 57 23 M71 17 Q69 22 63 23');
const backLandmarks = '<g opacity=".42">'+seam('M60 15 V20 M60 29 Q59 44 60 65 M41 36 Q45 38 46 45 M79 36 Q75 38 74 45')+'</g>';
function plate(hole, {back=false, detail=''}={}) {
  const cloth = shape(back ? backNeck : frontNeck);
  const defs = `<defs><mask id="open" maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="104"><rect width="120" height="104" fill="white"/><path d="${hole}" fill="black"/></mask><clipPath id="cloth"><path d="${cloth}"/></clipPath></defs>`;
  const body = '<g mask="url(#open)">'+path(cloth)+'</g>';
  const edges = '<g clip-path="url(#cloth)">'+seam(hole)+detail+'</g>';
  const view = `<text x="-8" y="19" font-family="sans-serif" font-size="11" fill="#405d52">${back?'背面':'前面'}</text>`;
  return defs+(back ? backLandmarks : frontLandmarks)+body+edges+view;
}
function sides(left) {
  // Mirror the left-hand aperture at the body's center, using absolute path geometry for the mask.
  return left.map(([x,y],i)=>(i?'L':'M')+x+' '+y).join(' ')+' Z '+
    left.map(([x,y],i)=>(i?'L':'M')+(120-x)+' '+y).join(' ')+' Z';
}
const mesh = 'M60 39 Q85 48 67 64 L60 70 L53 64 Q35 48 60 39 Z';
const drawings = {
  small_keyhole: plate('M60 26 C53 33 55 37 60 37 C65 37 67 33 60 26 Z'),
  chest_keyhole: plate('M60 27 C49 40 51 54 60 57 C69 54 71 40 60 27 Z'),
  shoulder_cutouts: plate('M30 26 Q36 20 44 20 Q43 28 34 31 Q27 33 30 26 Z M90 26 Q84 20 76 20 Q77 28 86 31 Q93 33 90 26 Z'),
  cold_shoulder_cutouts: plate('M12 19 H37 Q34 33 27 34 L15 38 Z M108 19 H83 Q86 33 93 34 L105 38 Z'),
  upper_back_cutout: plate('M40 27 Q60 23 80 27 Q74 44 60 44 Q46 44 40 27 Z',{back:true}),
  open_back: plate('M60 25 C84 24 87 44 76 62 Q68 74 60 78 Q52 74 44 62 C33 44 36 24 60 25 Z',{back:true}),
  low_back: plate('M37 8 H83 Q83 46 71 72 Q65 82 60 85 Q55 82 49 72 Q37 46 37 8 Z',{back:true}),
  backless: plate('M3 7 H117 V41 L98 49 L90 45 Q84 61 85 81 Q60 88 35 81 Q36 61 30 45 L22 49 L3 41 Z',{back:true}),
  side_cutouts: plate('M29 48 Q52 55 36 68 L26 72 Z M91 48 Q68 55 84 68 L94 72 Z'),
  deep_side_openings: plate('M26 38 L35 32 Q53 45 38 70 L27 79 Z M94 38 L85 32 Q67 45 82 70 L93 79 Z'),
  underarm_cutouts: plate('M18 41 Q23 32 31 33 Q36 38 33 44 L25 49 Z M102 41 Q97 32 89 33 Q84 38 87 44 L95 49 Z'),
  waist_cutouts: plate(sides([[29,73],[49,81],[30,89]])),
  midriff_cutout: plate('M39 65 Q60 69 81 65 L78 79 Q60 84 42 79 Z'),
  geometric_cutouts: plate('M42 42 L56 36 L49 51 Z M56 52 L65 37 L75 49 L63 56 Z M56 58 L69 58 L61 69 Z'),
  diamond_cutout: plate('M60 37 L74 54 L60 71 L46 54 Z'),
  circular_cutout: plate('M60 40 a14 14 0 1 1 0 28 a14 14 0 1 1 0 -28 Z'),
  asymmetric_cutout: plate('M77 34 Q85 47 77 57 L48 69 Q57 60 61 51 Z'),
  side_open_panels: plate(sides([[27,46],[44,48],[40,87],[27,90]]),{
    detail:path('M32 55 L44 57 L43 61 L33 59 Z M34 75 L41 74 L41 78 L34 79 Z M88 55 L76 57 L77 61 L87 59 Z M86 75 L79 74 L79 78 L86 79 Z')}),
  open_sides: plate(sides([[22,39],[39,35],[48,50],[43,86],[31,96],[27,72]])),
  layered_cutout_panels: plate('M40 45 L79 40 L72 59 L43 69 Z',{
    detail:path('M37 38 L79 40 L49 55 L38 58 Z')+seam('M43 69 L80 53')}),
  mesh_inset_cutout: plate(mesh,{detail:`<defs><pattern id="net" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M0 0 L8 8 M8 0 L0 8" fill="none" stroke="#54776b" stroke-width=".8"/></pattern></defs>`+path(mesh,'url(#net)')})
};
module.exports = cropped(torso,drawings,'-11 7 142 94');
