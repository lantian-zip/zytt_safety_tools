// ==UserScript==
// @name 云种田精简工具
// @version 1.0.0
// @description 自动发现Scratch VM，仅提供金币和经验数值锁定
// @match http://*/*
// @match https://*/*
// @grant unsafeWindow
// @run-at document-start
// ==/UserScript==
(() => {
  'use strict';
  const page=typeof unsafeWindow==='undefined'?window:unsafeWindow;
  if(page.__YZT_LITE__)return;
  const ids={gold:['kl9a3]M/MgfaM#%e,K[u','XX*]zgT[eNp0LcEw8TFh'],exp:['lUyqzW:eLaf6.7se*?,:']};
  const records=new Map();let machine=null,stage=null,host=null,root=null;
  const $=id=>root.getElementById(id);
  const variable=(target,id)=>typeof target?.variables?.get==='function'?target.variables.get(id):target?.variables?.[id];
  const getStage=vm=>vm?.runtime?.getTargetForStage?.()||vm?.runtime?.targets?.find(t=>t.isStage);
  function message(s){if(root)$('status').textContent=s;}
  function release(kind){
    for(const[cell,r]of records){if(r.kind!==kind)continue;
      const now=Object.getOwnPropertyDescriptor(cell,'value');
      if(now?.get===r.getter){
        Object.defineProperty(cell,'value',r.descriptor);
        try{Reflect.set(cell,'value',r.value);}catch{}
      }
      records.delete(cell);
    }
  }
  function clear(){release('gold');release('exp');if(root){$('goldLock').checked=false;$('expLock').checked=false;}}
  function lock(kind){
    if(!stage||getStage(machine)!==stage)throw Error('请等待游戏数据加载');
    const value=Number($(kind).value);
    if(!$(kind).value.trim()||!Number.isFinite(value)||value<0||value>Number.MAX_SAFE_INTEGER)throw Error('请输入安全范围内的非负数字');
    const cells=ids[kind].map(id=>variable(stage,id));
    if(cells.some(c=>!c||typeof c.value!=='number'))throw Error('字段未就绪或游戏版本不匹配');
    for(const cell of cells){const d=Object.getOwnPropertyDescriptor(cell,'value');if(!d?.configurable)throw Error('此变量无法锁定');}
    release(kind);
    try{
      for(const cell of cells){
        const descriptor=Object.getOwnPropertyDescriptor(cell,'value');
        const r={kind,value,descriptor,getter:()=>r.value};
        Object.defineProperty(cell,'value',{configurable:true,enumerable:descriptor.enumerable,get:r.getter,set(){}});
        records.set(cell,r);cell._monitorUpToDate=false;
      }
    }catch(e){release(kind);throw e;}
    message((kind==='gold'?'金币（含缓存）':'经验')+'已锁定为 '+value);
  }
  function writeOnce(kind){
    if(!stage||getStage(machine)!==stage)throw Error('请先连接作品');
    const value=Number($(kind).value);
    if(!$(kind).value.trim()||!Number.isFinite(value)||value<0||value>Number.MAX_SAFE_INTEGER)throw Error('请输入安全范围内的非负数字');
    const cells=ids[kind].map(id=>variable(stage,id));
    if(cells.some(c=>!c||typeof c.value!=='number'))throw Error('字段未就绪或版本不匹配');
    release(kind);$(kind+'Lock').checked=false;
    const before=cells.map(c=>c.value);
    try{for(const cell of cells){if(!Reflect.set(cell,'value',value)||cell.value!==value)throw Error('变量拒绝写入');cell._monitorUpToDate=false;}}
    catch(e){cells.forEach((c,i)=>{try{Reflect.set(c,'value',before[i]);}catch{}});throw e;}
    const owner=machine,oldStage=stage;
    message('已写入一次，游戏可以继续更新该数值');
    setTimeout(()=>{if(disposed||machine!==owner||stage!==oldStage)return;if(cells.some(c=>c.value!==value))message('单次写入后数值已被游戏更新；未启用锁定');},650);
  }
  function addItem(){
    if(!stage||getStage(machine)!==stage)throw Error('请先连接作品');
    const name=$('item').value.trim(),count=Number($('count').value);
    const catalog=variable(stage,'**Y(v@-[W)wg-eu217K#')?.value;
    if(!Array.isArray(catalog)||!catalog.includes(name)||['空气','鼠标'].includes(name))throw Error('请选择目录中有效物品');
    if(!Number.isInteger(count)||count<1||count>99)throw Error('数量须为1至99的整数');
    const cells=['@=^0)IXcR(EDDcXc0mti','(RoUl*bBFBVjjkUGO0Ch','if_/agO6taO2_ainW?_c'].map(id=>variable(stage,id));
    if(cells.some(c=>!Array.isArray(c?.value))||cells.some(c=>c.value.length!==cells[0].value.length))throw Error('背包结构不匹配');
    const [names,counts,attrs]=cells.map(c=>c.value);
    const i=names.findIndex((n,j)=>n==='空气'&&Number(counts[j])===0);
    if(i<0)throw Error('没有空背包格，请先腾出空间');
    const before=[names[i],counts[i],attrs[i]];
    try{
      names[i]=name;counts[i]=count;attrs[i]='{}';
      if(names[i]!==name||Number(counts[i])!==count||attrs[i]!=='{}')throw Error('背包写入被拒绝');
    }catch(e){try{names[i]=before[0];counts[i]=before[1];attrs[i]=before[2];}catch{}throw e;}
    cells.forEach(c=>{c._monitorUpToDate=false;});machine.runtime.requestRedraw?.();
    message('已向第'+(i+1)+'格添加 '+name+' × '+count+'；重新打开背包查看');
  }
  let disposed=false;
  function isVM(v){try{return v&&Array.isArray(v.runtime?.targets);}catch{return false;}}
  function accept(v){if(disposed||!isVM(v))return false;if(machine!==v){clear();machine=v;stage=getStage(v);fill();}message(stage?'已连接 VM；请等待存档加载后操作':'已获取 VM，等待作品加载');return true;}
  function referenceVM(){
    for(const win of [page,window]){
      for(const read of [()=>win.eureka?.vm,()=>win.vm,()=>win.Scratch?.vm,()=>win.Scratch?.runtime?.extensionManager?.vm]){
        try{const candidate=read();if(isVM(candidate))return candidate;}catch{}
      }
    }
    function search(obj,depth,seen,budget){
      if(!obj||typeof obj!=='object'||depth>6||seen.has(obj)||budget.count++>4000)return null;
      seen.add(obj);
      try{if(typeof obj.getState==='function'){const candidate=obj.getState()?.scratchGui?.vm;if(isVM(candidate))return candidate;}}catch{}
      let keys;try{keys=Object.keys(obj);}catch{return null;}
      for(const key of keys.slice(0,40)){
        try{const child=obj[key];if(child&&typeof child==='object'){const result=search(child,depth+1,seen,budget);if(result)return result;}}catch{}
      }
      return null;
    }
    for(const doc of new Set([document,page.document].filter(Boolean))){
      const containers=[];
      try{containers.push(doc.getElementById('app'),doc.getElementById('root'),doc.querySelector('[class*="gui"]'),doc.body);}catch{}
      for(const el of containers){if(!el)continue;try{for(const key of Object.keys(el)){if(!key.includes('__reactContainer'))continue;const candidate=search(el[key],0,new Set(),{count:0});if(candidate)return candidate;}}catch{}}
    }
    return null;
  }
  function detect(){
    const direct=referenceVM();if(direct)return direct;
    const queue = [], seen = new WeakSet();
    function seed(v, depth = 0) { if (v && ['object', 'function'].includes(typeof v)) queue.push([v, depth]); }
    for (const win of [page, window]) {
      try {
        for (const key of ['vm','scratchVM','__scratchVM','Scratch','eureka','store','ReduxStore','__REDUX_STORE__']) seed(win[key]);
        seed(win.eureka?.vm); seed(win.Scratch?.vm);
        for (const key of Object.getOwnPropertyNames(win).filter(k => /vm|scratch|eureka|gandi|redux|penguin|store/i.test(k)).slice(0, 100)) {
          const descriptor = Object.getOwnPropertyDescriptor(win, key); if (descriptor && 'value' in descriptor) seed(descriptor.value);
        }
      } catch {}
    }
    try {
      const nodes = [...document.querySelectorAll('canvas,#app,#root,[class*="gui"],[class*="stage"],[class*="player"]')].slice(0, 100);
      if (document.body) nodes.push(document.body);
      for (const node of nodes) for (let el = node, n = 0; el && n < 6; el = el.parentElement, n++) {
        for (const key of Object.keys(el)) if (/^(__reactFiber|__reactContainer|__reactInternalInstance|__reactProps)/.test(key)) seed(el[key]);
      }
    } catch {}
    for (let i = 0, count = 0; i < queue.length && count < 6000; i++) {
      const [obj, depth] = queue[i]; if (!obj || seen.has(obj)) continue;
      seen.add(obj); count++;
      if (isVM(obj)) return obj;
      if (depth >= 14 || obj === page || obj === window || obj === document || obj instanceof Element) continue;
      try {
        if (typeof obj.getState === 'function') seed(obj.getState(), depth + 1);
        const descriptors = Object.getOwnPropertyDescriptors(obj);
        const keys = Object.keys(descriptors).filter(k => !['alternate','_debugOwner','ownerDocument','renderer','storage','gl','window','document'].includes(k));
        keys.sort((a,b) => Number(/vm|runtime|state|props|child|return|store|current/i.test(b)) - Number(/vm|runtime|state|props|child|return|store|current/i.test(a)));
        for (const key of keys.slice(0, 80)) if ('value' in descriptors[key]) seed(descriptors[key].value, depth + 1);
      } catch {}
    }
    return null;
  }
  function mount(){
    if(host||!document.documentElement)return;
    host=document.createElement('div');host.style.cssText='position:fixed;right:18px;top:70px;z-index:2147483647';root=host.attachShadow({mode:'open'});
    root.innerHTML=`<style>
:host{font:13px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;color:#eaf6ff;color-scheme:dark}*{box-sizing:border-box}[hidden]{display:none!important}
.box{position:relative;width:min(285px,calc(100vw - 16px));padding:16px;background:linear-gradient(155deg,rgba(23,38,61,.98),rgba(10,19,34,.98));border:1px solid #6edcfa40;border-radius:20px;max-height:85vh;overflow:auto;box-shadow:0 18px 65px #0007,0 0 25px #40cfff12,inset 0 1px 0 #ffffff12;scrollbar-width:thin;scrollbar-color:#41647d transparent;backdrop-filter:blur(18px)}
header{display:flex;align-items:center;gap:7px;margin:-16px -16px 15px;padding:15px 16px;background:linear-gradient(110deg,#46d9e819,#7867f51c);border-bottom:1px solid #9edaff20;cursor:move;touch-action:none;user-select:none}header b{flex:1;font-size:17px;letter-spacing:2px;color:#ecfaff}header b:before{content:"";display:inline-block;width:7px;height:7px;border-radius:50%;background:#65e6d0;box-shadow:0 0 12px #65e6d0;margin-right:9px}
button,input{font:inherit;border:1px solid #87c9ef30;border-radius:10px;padding:9px 11px;outline:none}button{background:#284661;color:#e8f8ff;cursor:pointer;transition:background .18s,border-color .18s,box-shadow .18s}button:hover{background:#335975;border-color:#79d7e988}button:focus-visible,input:focus-visible{outline:2px solid #71dfe7;outline-offset:2px}header button{width:29px;height:29px;padding:0;background:#ffffff08;border-color:#ffffff15;font-size:18px}#close:hover{background:#a8435655;border-color:#f2869866}
input:not([type=checkbox]){width:100%;background:#081321b0;color:#eaf7ff;box-shadow:inset 0 2px 6px #0002;transition:border-color .18s}input::placeholder{color:#8199b3}input:focus{border-color:#6bd3dfaa}input[type=checkbox]{width:16px;height:16px;accent-color:#66ddd9;cursor:pointer}label{display:flex;align-items:center;gap:8px;margin:14px 0 7px;font-weight:600;color:#cbe6f5}p{font-size:11px;color:#91acc3;margin:10px 0 0;line-height:1.7;overflow-wrap:anywhere}
#addItem{background:linear-gradient(110deg,#267c89,#4b66a9);border-color:#8ce6ed55;font-weight:600;box-shadow:0 5px 18px #28a6b51c}#addItem:hover{background:linear-gradient(110deg,#3194a0,#5b79bc);box-shadow:0 5px 23px #28a6b538}#rescan{background:transparent;color:#96cddd;font-size:12px}#status{padding:9px 10px;border-radius:10px;background:#72d6ed08;border:1px solid #72d6ed18;min-height:37px}
.watermark{text-align:center;margin-top:12px;font-size:10px;font-weight:700;letter-spacing:5px;color:#b4d9f05c;user-select:none;pointer-events:none}
#bubble{position:relative;width:54px;height:54px;padding:0;border-radius:50%;border:1px solid #a4f4ff9c;background:radial-gradient(circle at 28% 20%,#407c9b,#153650 58%,#151d39);color:#e2fcff;font-size:11px;font-weight:800;letter-spacing:1px;text-shadow:0 0 9px #a2f4ff;touch-action:none;cursor:move;user-select:none;box-shadow:0 0 12px #5be7ed88,0 0 29px #6b7ff44d,inset 0 0 12px #92f3ff25;animation:glow 2.8s ease-in-out infinite}
#bubble:before{content:"";position:absolute;inset:-5px;border-radius:50%;border:1px solid #7eefff35;pointer-events:none}#bubble:hover{border-color:#e1ffff;filter:brightness(1.13)}@keyframes glow{0%,100%{box-shadow:0 0 10px #5be7ed70,0 0 25px #6b7ff43d,inset 0 0 12px #92f3ff25}50%{box-shadow:0 0 18px #5be7edb0,0 0 40px #6b7ff470,inset 0 0 15px #92f3ff40}}@media(prefers-reduced-motion:reduce){#bubble{animation:none}button,input{transition:none}}
</style>
      <button id="bubble" hidden title="拖动移动，点击展开">ZYTT</button><div class="box" id="panel"><header id="titlebar"><b>云种田</b><button id="minimize" title="最小化">−</button><button id="close" title="关闭并解除锁定">×</button></header>
      <div id="tools"><label><input id="goldLock" type="checkbox">金币</label><input id="gold" type="number" min="0" step="any" placeholder="金币数值"><button id="writeGold" style="width:100%;margin-top:7px">仅写入金币，不锁定</button><label><input id="expLock" type="checkbox">经验</label><input id="exp" type="number" min="0" step="any" placeholder="经验数值"><button id="writeExp" style="width:100%;margin-top:7px">仅写入经验，不锁定</button><p>勾选锁定；修改数值后按回车或移开焦点生效。取消勾选解除。</p><label>添加背包物品</label><input id="item" list="items" placeholder="输入或选择物品名" style="width:100%"><datalist id="items"></datalist><input id="count" type="number" min="1" max="99" value="1" style="margin-top:8px"><button id="addItem" style="width:100%;margin-top:8px">添加至空背包格</button></div><button id="rescan" style="width:100%;margin-top:10px">重新检测 VM</button><p id="status">正在检测 VM，请运行作品…</p><div class="watermark">ZYTT</div></div>`;
    document.documentElement.appendChild(host);
    for(const kind of ['gold','exp']){
      const apply=()=>{try{if($(kind+'Lock').checked)lock(kind);else{release(kind);message('已解除'+(kind==='gold'?'金币':'经验')+'锁定');}}catch(e){release(kind);$(kind+'Lock').checked=false;message(e.message);}};
      $(kind+'Lock').onchange=apply;$(kind).onchange=()=>{if($(kind+'Lock').checked)apply();};
      $(kind).onkeydown=e=>{if(e.key==='Enter'){if(!$(kind+'Lock').checked)$(kind+'Lock').checked=true;apply();}};
    }
    for(const [id,kind]of [['writeGold','gold'],['writeExp','exp']])$(id).onclick=()=>{try{writeOnce(kind);}catch(e){message(e.message);}};
    $('rescan').onclick=()=>{const found=detect();if(found)accept(found);else message('暂未找到 VM。请等待作品加载；后台会继续检测。');};
    $('addItem').onclick=()=>{try{addItem();}catch(e){message(e.message);}};
    $('minimize').onclick=()=>{host.classList.add('mini');$('panel').hidden=true;$('bubble').hidden=false;};
    let drag=null;
    $('bubble').onpointerdown=e=>{const r=host.getBoundingClientRect();drag={id:e.pointerId,x:e.clientX,y:e.clientY,left:r.left,top:r.top,moved:false};$('bubble').setPointerCapture(e.pointerId);e.preventDefault();};
    $('bubble').onpointermove=e=>{if(!drag||drag.id!==e.pointerId)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.hypot(dx,dy)>5)drag.moved=true;host.style.right='auto';host.style.left=Math.max(0,Math.min(innerWidth-54,drag.left+dx))+'px';host.style.top=Math.max(0,Math.min(innerHeight-54,drag.top+dy))+'px';};
    $('bubble').onpointerup=e=>{if(!drag||drag.id!==e.pointerId)return;const moved=drag.moved;drag=null;if(!moved){host.classList.remove('mini');$('panel').hidden=false;$('bubble').hidden=true;const r=host.getBoundingClientRect();host.style.right='auto';host.style.left=Math.max(0,Math.min(r.left,innerWidth-285))+'px';host.style.top=Math.max(0,Math.min(r.top,innerHeight-80))+'px';}};
    $('bubble').onpointercancel=()=>{drag=null;};
    let panelDrag=null;
    $('titlebar').onpointerdown=e=>{
      if(e.button!==0||e.target.closest('button'))return;
      const r=host.getBoundingClientRect();panelDrag={id:e.pointerId,x:e.clientX,y:e.clientY,left:r.left,top:r.top};
      $('titlebar').setPointerCapture(e.pointerId);e.preventDefault();
    };
    $('titlebar').onpointermove=e=>{
      if(!panelDrag||panelDrag.id!==e.pointerId)return;
      const r=host.getBoundingClientRect();host.style.right='auto';
      host.style.left=Math.max(0,Math.min(innerWidth-r.width,panelDrag.left+e.clientX-panelDrag.x))+'px';
      host.style.top=Math.max(0,Math.min(innerHeight-Math.min(r.height,50),panelDrag.top+e.clientY-panelDrag.y))+'px';
    };
    for(const event of ['pointerup','pointercancel','lostpointercapture'])$('titlebar').addEventListener(event,()=>{panelDrag=null;});
    $('close').onclick=dispose;
  }
  function fill(){if(!root||!stage)return;const catalog=variable(stage,'**Y(v@-[W)wg-eu217K#')?.value;$('items').replaceChildren();if(Array.isArray(catalog))for(const name of new Set(catalog)){if(['空气','鼠标'].includes(name))continue;const option=document.createElement('option');option.value=String(name);$('items').appendChild(option);}for(const k of ['gold','exp']){const v=variable(stage,ids[k][0])?.value;if(typeof v==='number')$(k).value=String(v);}}
  function tick(){
    mount();
    if(machine&&getStage(machine)!==stage){clear();stage=getStage(machine);fill();message('项目已变化，锁定已解除');}
    if(!machine){const found=detect();if(found)accept(found);}
  }
  function dispose(){disposed=true;clear();clearInterval(timer);host?.remove();delete page.__YZT_LITE__;window.removeEventListener('pagehide',dispose);}
  page.__YZT_LITE__={dispose};window.addEventListener('pagehide',dispose);
  const timer=setInterval(()=>{try{tick();}catch(e){message('检测异常：'+e.message);}},1500);try{tick();}catch(e){message('检测异常：'+e.message);}
})();
