"""Redraw the original jointed tailoring figures in assets/poses. Uses only the standard library.

Each study is drawn in its own camera plane (160 × 120). Arms run elbow → wrist,
legs knee → ankle → toe. The shoulder and hip axes orient the torso, not the page.
"""
import math
from pathlib import Path

DEST = Path(__file__).resolve().parents[1] / "assets" / "poses"
INK, DARK, LINEN, BRASS = "#364e46", "#698278", "#d6c8ac", "#ac8047"

def coords(points):
    return [tuple(map(float, pair.split(','))) for pair in points.split()]

def fmt(point):
    return ' '.join(f'{n:.1f}'.rstrip('0').rstrip('.') for n in point)

def plus(a,b,k=1):
    return (a[0]+k*b[0], a[1]+k*b[1])

def direction(a,b):
    dx,dy=b[0]-a[0],b[1]-a[1]
    length=math.hypot(dx,dy) or 1
    return dx/length,dy/length

def path(d,fill="none",stroke=INK,width=1.3):
    return f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{width}"/>'

def line(points,color,width):
    return path("M"+" L".join(fmt(p) for p in points),"none",color,width)

def dot(point,r,fill,stroke=INK):
    return f'<circle cx="{point[0]:.1f}" cy="{point[1]:.1f}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width=".85"/>'

def segment(a,b,r1,r2,color):
    axis=direction(a,b)
    normal=(-axis[1],axis[0])
    # Rounded, tapered wooden segments with visible hinges between them.
    p,q=plus(a,axis,r1*.28),plus(b,axis,-r2*.38)
    left,tip,right,end=[fmt(x) for x in (plus(p,normal,r1),plus(q,normal,r2),plus(q,normal,-r2),plus(p,normal,-r1))]
    return path(f'M{left} L{tip} Q{fmt(plus(q,axis,r2*1.5))} {right} L{end} Q{fmt(plus(p,axis,-r1*1.45))} {left}Z',color,INK,1)

def arm(start,points,far):
    elbow,wrist=points
    finger=plus(wrist,direction(elbow,wrist),3.1)
    return ''.join([segment(start,elbow,3.6,2.65,DARK if far else '#98a89b'),
                    dot(elbow,2.6,BRASS),segment(elbow,wrist,2.9,1.65,'#bbad93' if far else LINEN),
                    segment(wrist,finger,2.2,1.8,LINEN)])

def leg(start,points,far):
    knee,ankle,toe=points
    return ''.join([segment(start,knee,4.9,3.3,DARK if far else '#90a394'),dot(knee,3,BRASS),
                    segment(knee,ankle,3.6,2.15,'#abada0' if far else '#c7c6b3'),
                    segment(ankle,toe,2.7,1.65,INK)])

def chair(x,y,kind):
    # x and y mark the supporting seat; the front of the chair faces right.
    gold='#bc9e72'
    if kind=='stool':
        return path(f'M{x-15} {y+2}h30m-25 2-4 25m23-25 4 25',stroke=gold,width=3)
    if kind=='bench':
        return path(f'M{x-29} {y}h58v4h-58z M{x-24} {y+5}v21m47-21v21','#e4d7b9',gold,2)
    if kind=='sofa':
        return path(f'M{x-23} {y+3}q-8-2-8-14v-16q0-6 6-6h4l6 24h43q6 0 6 5v11h-56z','#d4c7a8',gold,2)+path(f'M{x-21} {y+7}v8m43-8v8',stroke=gold,width=3)
    if kind=='bed':
        return path(f'M{x-36} {y}l10-12h66l-10 12z M{x-36} {y}h66v7h-66z','#dfd4b9',gold,1.8)+path(f'M{x-32} {y+8}v15m57-15v15',stroke=gold,width=3)
    if kind=='chaise':
        return path('M16 51q2-4 6 0l24 28 89 0q8 0 8 6v4H44L15 56z','#d2c6a8',gold,2)+path('M41 88l-5 10m93-8 4 8',stroke=gold,width=3)
    return path(f'M{x-19} {y-28}l3 28h36v4h-38z','#e7d6ad',gold,2)+path(f'M{x-13} {y+5}l-3 26m30-26 4 26',stroke=gold,width=2.8)

def fabric(d, folds=''):
    return path(d,'#b7cabd','#4e6b5d',1.6)+(path(folds,stroke='#738e7d',width=1) if folds else '')

# Props, cloth and seams are placed in the figure's image plane so contact is visible.
details={
 'fan': fabric('M71 65Q64 70 48 65L36 61Q46 89 64 93Q81 89 95 93Q111 84 122 61L110 66Q96 70 87 65Z','M71 69Q66 79 57 87M77 71L72 88M87 69Q98 82 106 82'),
 'pinch': fabric('M69 64L87 64Q87 70 104 61L109 57Q109 83 88 90L62 84Z','M83 82Q94 75 106 63M71 69L68 81'),
 'train': fabric('M66 41Q46 48 35 40Q24 34 12 40Q26 42 38 60Q48 71 70 65Z','M23 42Q40 47 52 57M45 46L66 53'),
 'cape': fabric('M67 38Q86 47 114 43L121 37Q115 69 99 78Q80 66 68 55Z','M75 45Q94 54 115 43M84 55L102 66'),
 'coat': fabric('M69 37L77 45L71 77L57 84L65 59Z M86 38L80 45L87 77L101 83L92 57Z','M69 39L69 47L74 46M86 40L88 47L83 48'),
 'skirtfloor': fabric('M68 72L88 72Q103 86 125 90Q114 97 83 97Q55 99 35 90Q56 86 68 72Z','M73 78L52 91M82 80L77 92M89 78L109 90'),
 'collar':path('M66 38L73 34L79 41L74 49Z M79 41L83 34L91 40L84 48Z','#f4e2b6','#977749',1.4),
 'cuff':path('M91 53L96 58L90 65L85 60Z','#f6e6bc','#9c7949',1.5),
 'ornament':path('M76 43Q82 45 83 50Q79 49 76 46Q74 53 69 54Q69 47 76 43Z','#cfaa60','#886839',1.1)+path('M75 48q-1 7 2 9',stroke=BRASS),
}
props={
 'wall':path('M104 17v91m5-89v88',stroke='#beab86',width=2)+path('M104 32l10-10m-10 29 10-10m-10 29 10-10m-10 29 10-10',stroke='#d9c9a9'),
 'stairs':path('M13 111h44V96h27V80h28V64h36',stroke='#af9165',width=2.6),
 'mat':path('M33 103L98 15l28 9-67 86Z','#eae1c9','#ccbb99',1.4),
 'sheet':path('M56 8Q80 6 101 11l3 99q-23 5-51-1Z','#eee4cf','#c5b49a',1.4)+path('M60 12q19-3 34 1l1 16q-15-4-35-1z','#fbf0da','#d6c6a8'),
 'pillow':path('M16 65q11-5 23 0l-3 12q-12-2-23 0Z','#ede0c3','#c3b28e'),
 'floor':path('M22 98Q79 97 138 98',stroke='#bdab87',width=1.3),
 'backrest':path('M74 61h28v5H74z M77 66v23m21-23v23','#ddc69c','#aa8c62',2),
}

def study(key,shoulder,hip,left_arm,right_arm,left_leg,right_leg,*,head=0,face='front',width=10,
          support='',cloth='',front='',tilt=0):
    s,h=coords(shoulder+' '+hip)
    axis=direction(s,h)
    across=(axis[1],-axis[0])
    def local(point, offset, depth=0):
        return plus(plus(point,across,offset),axis,depth)
    a,b=local(s,-width),local(s,width)
    l,r=local(h,-6),local(h,6)
    parts=['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" stroke-linecap="round" stroke-linejoin="round">',
           '<ellipse cx="80" cy="109" rx="44" ry="2.6" fill="#9b8760" opacity=".13"/>']
    if support:
        args=support.split()
        parts.append(props[support] if support in props else chair(int(args[1]),int(args[2]),args[0]))
    parts += [leg(l,coords(left_leg),True),leg(r,coords(right_leg),False)]
    if cloth: parts.append(details[cloth])
    torso=f'M{fmt(a)} Q{fmt(local(s,0,-5))} {fmt(b)} Q{fmt(local(s,width+1,7))} {fmt(local(h,4.6,-6))} L{fmt(r)} Q{fmt(local(h,0,5))} {fmt(l)} L{fmt(local(h,-4.6,-6))} Q{fmt(local(s,-width-1,7))} {fmt(a)}Z'
    parts += [path(torso,'#92a79b',INK,1.6),line([local(s,0,1),local(h,0,-2)],'#627c6c',.9),
              line([local(h,-4.7,-5),local(h,4.7,-5)],'#e0cb9c',1.4)]
    if face == 'back' or key in ('turning','turning_legs','walk_turn'):
        parts.append(line([local(s,-width+1,4),local(s,0,9),local(s,width-1,4)],'#556e60',1.25))
    if key == 'arms_chair_back': parts.append(props['backrest'])
    if front in ('coat','collar','ornament'): parts.append(details[front])
    parts += [arm(a,coords(left_arm),True),arm(b,coords(right_arm),False)]
    if key == 'offer_hand':
        parts.append(path('M112 46q3 2 7-1l6-2q1 1-2 3l-6 3-4-1Z',LINEN,INK,1))
    if front=='cuff': parts.append(details[front])
    neck=local(s,0,-6)
    parts.append(segment(s,neck,3.9,3.4,LINEN))
    center=local(s,tilt,-13)
    rotation=math.degrees(math.atan2(axis[1],axis[0]))-90+head
    parts.append(f'<g transform="translate({fmt(center)}) rotate({rotation:.1f})">')
    parts.append('<path d="M-7-2Q-7-10 0-10Q7-10 7-3Q7 4 3 8Q0 10-3 7Q-7 4-7-2Z" fill="#ddcfb4" stroke="#42584d" stroke-width="1.4"/>')
    if face=='back': parts.append(path('M0-9Q-3-1 0 7M-6 3Q-1 5 5 4',stroke='#ab987b',width=.95))
    elif face in ('left','right'):
        flip=-1 if face=='left' else 1
        parts.append(f'<g transform="scale({flip} 1)">'+path('M3-8Q8-4 6-1l2 3-2 1-2 3','#ddcfb4',INK,1)+path('M-4-1Q0-3 5-2',stroke='#ad9979',width=.8)+'</g>')
    else: parts.append(path('M1-8Q4 0 1 7M-5-1Q0 1 6-1',stroke='#ac997b',width=.9))
    parts.append('</g></svg>')
    (DEST/(key+'.svg')).write_text('\n'.join(parts)+'\n')

DEST.mkdir(parents=True,exist_ok=True)

# Upright figures. The second arm/leg is nearer to the observer.
study('standing','80,36','80,62','68,52 66,65','92,52 94,66','72,83 70,104 64,106','87,83 89,104 96,106')
study('turning','79,36','84,62','75,53 84,61','92,48 83,58','82,85 79,105 72,107','92,82 98,102 104,102',face='left',head=-23,width=7)
study('looking_up','81,36','81,63','69,52 74,66','92,52 97,63','78,85 75,104 69,106','86,85 91,103 98,104',head=-48,face='right',width=7,tilt=-3)
study('turning_legs','81,35','77,60','68,47 67,62','89,48 76,56','68,82 55,100 48,101','84,83 94,105 101,106',face='right',head=31,width=7)
study('runway','79,34','83,61','65,49 62,63','94,48 99,59','91,81 97,97 104,98','75,84 72,106 64,108',face='left',width=9)
study('editorial','82,34','76,62','65,29 74,21','97,51 85,57','64,81 68,100 62,103','83,82 82,105 91,106',head=13)
study('stage','78,37','82,62','53,39 34,34','104,31 119,19','70,83 59,104 52,105','90,81 101,100 110,101',head=13,face='right')
study('hand_hip','81,35','79,62','68,51 66,65','103,48 89,58','73,84 68,104 61,106','88,84 92,104 100,105',head=4)
study('hands_behind','78,35','80,62','64,50 76,57','93,48 79,57','73,84 73,104 66,106','86,84 89,103 97,105',face='back')
study('shoulder_wall','94,37','83,63','79,48 79,61','99,54 93,64','72,82 60,101 53,103','86,84 85,105 94,105',support='wall',face='left')
study('weight_one_leg','78,35','85,61','66,51 70,64','92,48 96,59','67,80 77,99 70,102','88,83 88,105 97,106',head=-8)
study('hand_chest','79,35','79,62','66,52 65,66','99,49 82,40','72,84 71,104 64,106','85,83 90,104 97,106',head=7)

# Supported poses. Seat location, weight and feet vary with the action.
study('seated','79,44','79,71','63,60 67,72','96,59 91,73','58,75 58,101 51,103','99,76 101,100 109,102',support='stool 79 76')
study('chair_sit','76,42','76,70','72,59 83,71','86,60 99,69','84,73 82,97 89,99','101,74 101,100 111,101',support='chair 76 74',width=7,face='right')
study('sofa_sit','68,47','82,71','54,58 61,67','91,57 102,62','95,72 100,93 108,95','104,75 115,92 124,92',support='sofa 73 75',face='right')
study('floor_sit','78,48','78,76','60,63 52,79','97,66 105,81','54,83 64,89 73,89','98,84 89,91 78,91',support='floor',cloth='skirtfloor')
study('bed','77,43','78,70','66,59 63,74','88,59 94,70','88,78 83,97 77,98','100,75 103,93 110,95',support='bed 78 74',face='left')
study('crossed_legs','78,44','79,69','65,58 74,69','94,59 86,68','93,76 95,101 104,101','87,75 68,90 59,88',support='chair 78 74',head=8)
study('chair_edge','88,44','85,69','77,60 88,71','97,60 108,68','97,76 89,98 96,101','111,72 113,99 121,100',support='chair 69 73',width=8,face='right')
study('knees_diagonal','73,42','74,70','61,60 75,69','92,56 83,69','90,78 100,98 108,98','98,76 108,96 116,96',support='stool 74 74',head=-8)
study('arms_chair_back','83,53','77,80','71,61 91,60','99,61 82,60','60,83 57,103 49,104','98,81 99,101 107,104',support='bench 77 84',face='right',head=-7)
study('seated_chin','76,44','75,70','69,59 82,72','95,65 84,40','85,74 80,98 87,100','98,73 103,97 112,98',support='stool 75 75',head=20,face='right')
study('seated_forward','91,48','77,72','81,65 88,78','105,65 101,78','88,76 85,98 93,100','104,76 107,98 116,98',support='chair 74 76',face='right')

# Kneeling, floor and crouching studies.
study('one_knee','78,42','79,67','65,59 70,71','96,54 102,64','69,91 50,93 44,90','102,70 105,92 114,93',support='floor',face='right')
study('upright_kneel','80,40','80,69','68,54 68,68','93,54 92,69','70,90 61,94 54,93','91,89 84,95 77,95',support='floor')
study('seiza_hands','80,51','77,76','67,65 72,80','95,63 94,78','69,88 59,90 54,87','94,85 77,92 68,91',support='floor',face='right')
study('side_sit_hand','78,53','69,77','57,68 48,92','92,70 82,78','89,87 105,94 113,94','84,84 103,87 112,83',support='floor',head=-6)
study('crouch_arm','88,52','75,76','71,66 77,76','101,63 86,63','64,65 69,94 61,96','102,65 91,94 101,96',support='floor',face='right')
study('floor_knee_up','71,52','71,78','56,71 47,90','85,61 96,58','55,87 75,92 84,91','96,61 107,91 116,92',support='floor',face='right')

# Recumbent studies use a horizontal, diagonal or overhead plane. Cross-seams
# distinguish the front and back of the head and bodice in the overhead views.
study('sleeping','90,41','74,64','68,43 63,55','96,57 87,68','58,74 47,87 42,87','74,84 65,99 57,102',head=-9,support='mat')
study('dakimakura','80,37','80,63','65,54 68,70','96,51 94,66','73,83 74,102 71,105','86,83 86,104 89,106',support='sheet')
study('reclining','51,72','79,79','56,82 44,84','68,64 72,77','99,78 119,83 126,81','98,90 121,91 128,89',support='floor',width=5,face='left',head=15)
study('prone','56,51','80,66','53,69 38,74','78,46 86,33','96,72 119,78 125,75','93,88 111,98 120,98',face='back',support='floor')
study('supine','60,53','86,65','57,75 46,84','80,40 91,31','101,83 119,95 126,95','110,66 131,70 136,75',face='front',support='floor')
study('side_elbow','50,51','77,72','41,78 24,80','74,52 79,67','98,76 122,80 130,77','98,85 123,88 130,85',support='floor',face='right',width=6)
study('supine_arm','62,59','88,64','43,70 23,67','81,45 88,32','105,80 130,88 135,87','108,65 129,65 137,63',support='floor')
study('prone_elbows','55,63','82,77','39,79 24,78','59,82 39,83','105,75 127,80 135,76','101,86 124,92 132,90',face='left',support='floor',head=-28,width=7)
study('chaise_upright','46,47','65,73','40,67 53,73','73,56 83,66','89,67 112,75 122,74','92,76 120,78 130,78',support='chaise 0 0',face='right')
study('recline_cheek','48,66','76,73','46,81 34,68','63,70 73,77','95,66 119,76 127,74','97,84 122,84 130,81',support='pillow',head=10,width=6,face='left')

# Movement.
study('gentle_bow','92,47','76,65','86,64 81,76','102,62 91,76','70,83 69,104 76,106','84,84 87,104 95,106',face='right',head=24,width=7)
study('dance_arm','76,36','84,58','52,33 34,24','98,25 103,13','72,80 60,99 50,101','96,76 114,65 120,59',face='left',head=-17)
study('offer_hand','74,38','75,62','63,54 63,68','98,54 115,45','64,82 57,104 49,105','84,83 92,102 101,103',face='right')
study('climb_stairs','85,33','78,57','66,44 59,58','100,43 109,32','68,76 64,93 73,95','97,59 100,77 110,79',face='right',support='stairs')
study('walk_turn','83,36','77,59','65,46 56,42','93,51 98,44','59,79 42,91 34,90','92,80 109,99 119,101',face='left',head=-28)

# Garment interaction studies include the garment edge, fabric tension or trim.
study('spread_dress','80,36','79,63','55,49 39,61','104,49 119,61','68,83 65,102 57,105','88,83 94,103 103,104',cloth='fan')
study('pinch_outfit','77,36','78,63','64,51 61,66','99,48 107,57','69,83 67,103 60,105','85,83 90,103 99,105',cloth='pinch',head=9)
study('wind_swept','75,39','81,63','63,53 55,57','93,51 100,61','71,83 60,102 51,104','89,83 99,102 107,103',cloth='train',face='left')
study('adjust_collar','79,36','80,62','62,49 73,40','95,52 98,65','73,84 71,104 64,105','87,83 91,104 100,105',front='collar',head=-8)
study('adjust_cuff','78,36','79,63','68,53 89,59','99,50 92,57','72,83 71,104 64,106','86,83 90,103 98,104',front='cuff',head=15)
study('lift_cape','76,37','77,63','61,51 59,66','102,42 119,37','68,84 63,103 55,105','84,82 93,102 102,103',cloth='cape',face='right')
study('hold_coat','79,36','79,62','60,53 69,58','99,52 89,58','71,84 66,104 59,106','87,84 93,104 102,105',front='coat')
study('back_ornament','77,37','81,63','66,53 69,67','96,47 73,39','75,85 73,103 67,104','89,82 96,101 103,102',front='ornament',head=-25,face='back')
