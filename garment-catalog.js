// Display-only catalog. Labels, applicability, selection and persistence use the existing part slots.
(function (C) {
  'use strict';
  const E = C.ui.el;
  const slots = new Set(['neckline','collar','cutout','sleeves','cuffs','top_structure','bottom_structure','straps','waist','garter']);
  const hints = {
    point_collar:'細長い襟先が下を向く', spread_collar:'襟先が肩の方へ開く', button_down_collar:'左右の襟先をボタンで留める',
    band_collar:'低い帯を前で重ねて留める', mandarin_collar:'首に沿って立ち、前端が丸く離れる',
    wing_collar:'立ち襟の先だけを前に折る', high_standing_collar:'首を高く囲む', stand_collar:'低い筒形が首に沿う',
    detachable_standing_collar:'台襟から外せる襟と留め鋲', peter_pan_collar:'丸い二枚の襟が肩に寝る',
    rounded_collar:'シャツ襟の先端に丸み', shawl_collar:'丸い折り返しが首を包む',
    narrow_lapels:'細幅の折り返し', wide_lapel:'肩まで届く幅広の折り返し',
    notched_lapels:'上襟との間に三角の刻み', peak_lapels:'下襟の先が肩へ突き上がる',
    shawl_lapels:'刻みのない曲線が胸まで続く', ruffled_collar:'首の周囲に細かいひだ', sailor_collar:'肩を広く覆う帯が胸でV字に合う',
    small_keyhole:'襟のすぐ下に小さな涙形', chest_keyhole:'胸の中央へ縦に長く開く',
    shoulder_cutouts:'鎖骨の外側に左右の小窓', cold_shoulder_cutouts:'肩先が見え、その下に袖が残る',
    upper_back_cutout:'肩甲骨の高さに横長の窓', open_back:'首の後ろを残して背中を大きく開く',
    low_back:'背の襟ぐりが腰近くまで下がる', backless:'腰を残して背全体が出る',
    side_cutouts:'肋骨の横に弧状の開き', deep_side_openings:'袖ぐりから脇腹まで深く開く',
    underarm_cutouts:'袖の付け根の下を開ける', waist_cutouts:'腰の両側に三角の開き',
    midriff_cutout:'お腹の中央を横に開ける', side_open_panels:'前後の布を細い帯でつなぐ',
    open_sides:'脇の布がなく側面が広く開く', layered_cutout_panels:'ずらして重ねた布の間に開き',
    mesh_inset_cutout:'開口部を網地でつなぐ',
    v_neck:'鎖骨の下で交わるV字', deep_v_neck:'胸の中央まで下がるV字', plunging_neckline:'胸の下まで切れ込むV字',
    high_neckline:'首の付け根まで覆う', keyhole_neckline:'襟ぐりの下に小さな開き', illusion_neckline:'胸の上を透ける布で覆う',
    crew_neck:'首に沿う細い襟帯', round_neck:'浅い円弧', scoop_neck:'胸まで下がる深い円弧',
    puff_sleeves:'肩先で短く膨らむ', balloon_sleeves:'腕全体が丸く膨らむ', bishop_sleeves:'手首の上に布がたまる',
    lantern_sleeves:'肘の切り替えで膨らむ', leg_of_mutton_sleeves:'肩で膨らみ、肘から細くなる',
    halter_strap:'首の後ろで支える', halter_neckline:'肩を出して首を囲む', one_shoulder_neckline:'片方の肩だけで支える',
    thin_straps:'左右の肩に細い紐', cross_back_straps:'背面で紐が交差', french_cuffs:'二重に折り、リンクで留める',
    folded_cuffs:'布を外側に折る', rolled_cuffs:'布を巻いて厚みを出す',
    plain_cuffs:'飾りのない布帯', ornate_cuffs:'帯の中央に飾り模様', lace_cuffs:'透かし模様と波形の縁',
    buckled_cuffs:'細い帯を金具に通す', buttoned_cuffs:'重なった端をボタンで留める',
    bralette:'三角の布を細い帯で支える', underwire_bra:'カップの下辺を弧状に支える',
    bandeau:'肩紐のない一枚の帯', bustier:'縦の切り替えが胴まで続く',
    briefs:'腰骨から脚ぐりへカーブ', high_waisted_briefs:'胴の高い位置まで覆う',
    boyshorts:'短い裾が腿を囲む', lace_shorts:'短い裾に透かしの縁',
    garter_belt:'腰帯から留め紐を垂らす', garter_details:'腿の帯に飾りを付ける', no_garter:'留め紐と飾りを省く'
  };

  function field(slot) {
    const key = 'part:'+slot.id;
    const items = slot.options.filter(o=>C.partOptionAllowed(C.state.outfit,slot.id,o));
    const current = () => C.state.outfit.parts[slot.id];
    function selectedIds() {
      const value = current();
      if (!value) return [];
      return slot.multi ? value.map(item=>item.id) : [value];
    }
    const shell = C.foldShell({
      key, path:'parts.'+slot.id, labelJa:slot.labelJa, noteJa:slot.noteJa,
      badgeJa:slot.multi ? '複数可' : null,
      status:()=>{
        const labels = selectedIds().map(id=>C.util.labelOf(slot.options,id));
        return {filled:labels.length>0,summaryJa:C.summarizeLabels(labels)};
      },
      onClear:()=>{
        C.state.setPart(slot.id,slot.multi ? [] : null);
        syncSelection();
      }
    });
    const body = shell.content;
    const groups = [...new Set(items.map(o=>o.groupJa).filter(Boolean))];
    const controls = E('div',{class:'garment-controls'});
    const search = E('input',{type:'search',placeholder:'形・名前で検索','aria-label':slot.labelJa+'を形・名前で検索'});
    const filter = E('select',{'aria-label':slot.labelJa+'の分類'},[E('option',{value:'',text:'すべての分類'})]);
    groups.forEach(g=>filter.append(E('option',{value:g,text:g})));
    const textMode = E('button',{type:'button',class:'garment-mode','aria-pressed':'false',text:'文字一覧'});
    if (items.length >= 12) controls.append(search,filter);
    controls.append(textMode);
    const list = E('div',{class:'garment-list'});
    const count = E('span',{class:'garment-count',role:'status'});
    body.append(controls,count,list);
    const layers = slot.multi ? E('div') : null;
    if (layers) body.append(layers);
    function drawLayers() {
      if (!layers) return;
      layers.replaceChildren();
      C.layeredParts.renderLayers(layers,slot,drawLayers);
    }
    function toggle(id) {
      if (slot.multi) C.layeredParts.toggle(slot,id);
      else C.state.setPart(slot.id,current()===id ? null : id);
      syncSelection();
    }
    function syncSelection() {
      const ids = selectedIds();
      list.querySelectorAll('[data-option]').forEach(b=>b.setAttribute('aria-pressed',String(ids.includes(b.dataset.option))));
      drawLayers();
      shell.refresh();
    }
    function card(o) {
      const image = E('img',{width:160,height:100,alt:'',loading:'lazy',decoding:'async'});
      const plate = E('span',{class:'garment-plate'},[image]);
      image.addEventListener('error',()=>plate.replaceChildren(E('span',{class:'garment-unavailable',text:'画像なし'})),{once:true});
      image.src = 'assets/garment-parts/'+slot.id+'/'+o.id+'.svg';
      const hintId = 'garment-hint-'+slot.id+'-'+o.id;
      const name = E('strong',{text:o.labelJa});
      const button = E('button',{type:'button',class:'garment-card','data-fkey':key+':'+o.id,'data-option':o.id,
        'aria-label':o.labelJa,'aria-describedby':hints[o.id] ? hintId : null,
        'aria-pressed':String(selectedIds().includes(o.id)),onclick:()=>toggle(o.id)},[
        plate,name,hints[o.id] ? E('small',{id:hintId,text:hints[o.id]}) : null
      ]);
      return button;
    }
    function draw() {
      const query = C.presetCatalog.normalizeSearch(search.value);
      const matches = items.filter(o=>(!filter.value || o.groupJa===filter.value) &&
        C.presetCatalog.normalizeSearch([o.labelJa,o.groupJa,hints[o.id],o.shortPrompt].join(' ')).includes(query));
      list.replaceChildren();
      count.textContent = matches.length ? matches.length+'件' : '一致する項目がありません';
      for (const group of new Set(matches.map(o=>o.groupJa))) {
        if (group) list.append(E('h4',{class:'garment-group',text:group}));
        const grid = E('div',{class:'garment-grid',role:'group','aria-label':slot.labelJa+(group?'・'+group:'')});
        matches.filter(o=>o.groupJa===group).forEach(o=>grid.append(card(o)));
        list.append(grid);
      }
    }
    drawLayers();
    textMode.onclick = () => {
      const active = list.classList.toggle('garment-text');
      textMode.setAttribute('aria-pressed',String(active));
    };
    filter.onchange = draw;
    search.oninput = draw;
    if (shell.head.getAttribute('aria-expanded')==='true') draw();
    else shell.head.addEventListener('click',draw,{once:true});
    shell.refresh();
    return shell.el;
  }
  function quickSection() {
    const category = C.util.byId(C.data.garmentCategories,C.state.outfit.garment.category);
    const ids = category ? category.slots.filter(id=>slots.has(id)) : [];
    const section = E('section',{class:'garment-section',hidden:ids.length ? null : 'hidden'});
    section.append(E('h2',{text:'衣装パーツ図鑑'}));
    ids.forEach(id=>section.append(field(C.util.byId(C.data.partSlots,id))));
    return section;
  }
  C.garmentCatalog = {slots,field,quickSection};
})(window.CPW);
