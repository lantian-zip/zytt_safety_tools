// ==UserScript==
// @name         争锋相对 · zytt 调试面板
// @namespace    https://zfxd-control.local/
// @version      1.2.0
// @description  针对所提供 v2.00.2 作品适配：锁血、武器伤害与弹药修改、呼吸、移速、稳定准星；拖动及最小化。
// @author       zytt 蓝天_zip
// @match        https://ccw.site/*
// @match        https://*.ccw.site/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(() => {
  'use strict';
  const KEY = '__ZYTT_ZFXD_CONTROL_V1__';
  const ACCESS_KEY = 'lantian_nb666';
  let authorized = false;
  window[KEY]?.dispose?.();
  // 只处理本作品的本地 VM；不调用联网管理、云存档或付费授权接口。
  const settings = { hp: false, breath: false, ammo: false,
    steady: false, speed: false, speedValue: 1.25 };
  let vm = null, stage = null, runtime = null, vars = new Map(), lists = new Map();
  let disposed = false, minimized = false, busy = false;
  const patches = new Map();
  const weaponEdits = new Map();
  const ac = new AbortController();
  const host = document.createElement('div');
  host.id = 'zytt-zfxd-panel';
  host.style.cssText = 'position:fixed;top:90px;left:24px;z-index:2147483647;';
  const shadow = host.attachShadow({ mode: 'open' });
  shadow.innerHTML = `
    <style>
      :host{font:13px/1.5 system-ui,sans-serif;color:#e8edf7;color-scheme:dark}
      *{box-sizing:border-box} .box{width:306px;background:#121a2a;border:1px solid #35445f;border-radius:15px;box-shadow:0 12px 48px #0007;overflow:hidden}
      header{padding:13px 14px;background:#1c2940;display:flex;align-items:center;gap:8px;cursor:move;touch-action:none;user-select:none}
      strong{font-size:15px;flex:1}button{font:inherit;cursor:pointer;border:1px solid #415372;border-radius:8px;background:#263751;color:#edf3ff;padding:6px 10px}
      header button{padding:2px 8px}main{padding:13px;max-height:75vh;overflow:auto}p{margin:0 0 10px;color:#a5b5cf;font-size:12px;overflow-wrap:anywhere}
      .stats{padding:9px;background:#0b1220;border-radius:9px;white-space:pre-line;color:#a9d8ff;margin-bottom:9px;font-size:12px}
      label{display:flex;align-items:center;justify-content:space-between;padding:8px 2px;border-bottom:1px solid #263248;gap:8px}
      input[type=checkbox]{accent-color:#64b3ff;width:17px;height:17px}input[type=range]{width:145px;accent-color:#64b3ff}
      input[type=number]{width:85px;background:#0b1220;color:#edf3ff;border:1px solid #415372;border-radius:6px;padding:5px}
      .edit{margin-top:12px;padding:10px;background:#18243a;border-radius:10px}.edit button{width:100%;margin-top:8px}
      .buttons{display:flex;gap:8px;margin-top:12px}.buttons button{flex:1}footer{color:#8194b4;text-align:center;padding:0 12px 12px;font-size:11px}
      .box.mini{width:210px}.mini main,.mini footer{display:none}
      fieldset{border:0;padding:0;margin:0;min-width:0}[hidden]{display:none!important}
      .auth{padding:10px;margin-bottom:10px;background:#18243a;border-radius:10px}
      .auth input{width:100%;padding:8px;border:1px solid #415372;border-radius:6px;background:#0b1220;color:#edf3ff}
      .auth button{width:100%;margin-top:8px}
    </style>
    <div class="box">
      <header><strong>争锋相对 · zytt</strong><button id="mini" title="最小化 / 展开">−</button><button id="close" title="关闭并停用">×</button></header>
      <main><p id="status">正在查找作品运行环境…</p><div class="stats" id="stats">等待作品加载</div>
        <div class="auth"><p id="authStatus">请输入密钥解锁功能；每次刷新需重新验证。</p>
          <input id="accessKey" type="password" placeholder="输入密钥" autocomplete="off" aria-label="解锁密钥">
          <button id="unlock">验证并解锁</button>
        </div>
        <fieldset id="controls" disabled hidden>
        <label>锁血（生命指数至少100）<input type="checkbox" data-key="hp"></label>
        <label>呼吸值保持100<input type="checkbox" data-key="breath"></label>
        <label>弹药保持满载<input type="checkbox" data-key="ammo"></label>
        <label>稳定准星与武器<input type="checkbox" data-key="steady"></label>
        <label>自定义移速<input type="checkbox" data-key="speed"></label>
        <label><span id="speedText">倍率 1.25×</span><input id="speedValue" type="range" min="0.5" max="2" step="0.05" value="1.25"></label>
        <div class="edit">
          <p>修改当前手持武器，切枪后可分别设置</p>
          <label>基础伤害<input id="damageValue" type="number" min="0" max="100000" step="0.5" value="100"></label>
          <button id="applyDamage">应用当前武器伤害</button>
          <label>当前子弹数<input id="ammoCount" type="number" min="0" max="10000" step="1" value="100"></label>
          <label>弹匣容量<input id="ammoCapacity" type="number" min="1" max="10000" step="1" value="100"></label>
          <button id="applyAmmo">应用当前武器弹药</button>
          <button id="restoreWeapons">恢复全部武器修改</button>
          <p id="editStatus" style="margin-top:8px;margin-bottom:0">伤害表由同类型人机共用，修改后其伤害也可能变化。</p>
        </div>
        <div class="buttons"><button id="scan">重新连接</button><button id="reset">全部停用</button></div>
        <p style="margin-top:12px;margin-bottom:0">所有开关默认关闭。弹药保持按修改后的容量补齐，投掷物不处理。“全部停用”或关闭面板会恢复武器参数。</p>
        </fieldset>
      </main><footer>zytt 蓝天_zip · v1.2.0</footer>
    </div>`;
  document.documentElement.appendChild(host);
  const $ = s => shadow.querySelector(s);
  const listen = (el, event, fn) => el.addEventListener(event, fn, { signal: ac.signal });
  function read(name) { return vars.get(name)?.value; }
  function eligible() { return !!stage && String(read('观战')) === '0' && Number(read('指数')) > 0; }
  function enforce(name, value) {
    const variable = vars.get(name);
    if (!variable) return;
    // 通过可撤销的访问器约束本地变量，避免定时器与游戏同帧扣血竞争。
    if (patches.has(variable)) { patches.get(variable).transform = value; return; }
    const descriptor = Object.getOwnPropertyDescriptor(variable, 'value');
    if (!descriptor || !('value' in descriptor) || !descriptor.configurable || !descriptor.writable) return;
    const rec = { descriptor, raw: descriptor.value, transform: value, last: descriptor.value };
    const getter = () => {
      const result = eligible() ? rec.transform(rec.raw) : rec.raw;
      rec.last = result;
      return result;
    };
    // 指数的 getter 本身不调用 eligible，避免循环读取自身。
    const safeGetter = name === '指数' ? () => {
      const result = String(read('观战')) === '0' && Number(rec.raw) > 0 ? rec.transform(rec.raw) : rec.raw;
      rec.last = result; return result;
    } : getter;
    const setter = next => {
      // 存活时保留生命下限；观战或场景初始化时接受游戏原值。
      if (name === '指数' && String(read('观战')) === '0' && Number(rec.raw) > 0) rec.raw = rec.transform(next);
      else rec.raw = next;
    };
    rec.getter = safeGetter;
    Object.defineProperty(variable, 'value', { configurable: true, enumerable: descriptor.enumerable, get: safeGetter, set: setter });
    patches.set(variable, rec);
  }
  function release(variable) {
    const rec = patches.get(variable);
    if (!rec) return;
    if (Object.getOwnPropertyDescriptor(variable, 'value')?.get === rec.getter) {
      // 恢复游戏最近写入的值，静态参数未被覆盖为调试值。
      Object.defineProperty(variable, 'value', { ...rec.descriptor, value: rec.raw });
    }
    patches.delete(variable);
  }
  function sync() {
    const wanted = new Set();
    if (!authorized) { for (const v of [...patches.keys()]) release(v); return; }
    const add = (name, transform) => { const v = vars.get(name); if (v) { wanted.add(v); enforce(name, transform); } };
    if (settings.hp) add('指数', n => Math.max(100, Number.isFinite(Number(n)) ? Number(n) : 100));
    if (settings.breath) add('呼吸', () => 100);
    if (settings.steady) for (const n of ['鼠标准信偏移', '武器颤抖', '武器旋转偏移']) add(n, () => 0);
    if (settings.speed) add('超级额外移速', () => settings.speedValue);
    for (const v of patches.keys()) if (!wanted.has(v)) release(v);
  }
  function currentWeapon() {
    if (!stage) throw new Error('请先连接作品');
    const i = Number(read('武器序号')) - 1;
    const names = lists.get('武器名称')?.value;
    if (!Number.isInteger(i) || i < 0 || !Array.isArray(names) || !names[i]) throw new Error('未识别当前武器');
    return { i, name: String(names[i]) };
  }
  function editCell(listName, i, value) {
    const list = lists.get(listName);
    if (!Array.isArray(list?.value) || i >= list.value.length) return false;
    const key = `${listName}:${i}`;
    let rec = weaponEdits.get(key);
    if (!rec || rec.array !== list.value) {
      rec = { list, array: list.value, i, name: listName, original: list.value[i], last: value };
      weaponEdits.set(key, rec);
    }
    rec.last = value; list.value[i] = value; list._monitorUpToDate = false;
    return true;
  }
  function restoreWeapons() {
    for (const rec of weaponEdits.values()) {
      if (rec.list.value !== rec.array) continue;
      if (rec.name === '子弹详情') {
        const old = /^(\d+)\/\/(\d+)$/.exec(String(rec.original));
        const now = /^(\d+)\/\/(\d+)$/.exec(String(rec.array[rec.i]));
        // 保留已消耗的子弹，只恢复容量并约束剩余数量。
        if (old && now) rec.array[rec.i] = `${Math.min(Number(now[1]), Number(old[2]))}//${old[2]}`;
      } else if (rec.array[rec.i] === rec.last) rec.array[rec.i] = rec.original;
      rec.list._monitorUpToDate = false;
    }
    weaponEdits.clear();
    const i = Number(read('武器序号')) - 1, ammo = lists.get('子弹详情')?.value?.[i];
    if (ammo != null && vars.has('子弹')) vars.get('子弹').value = ammo;
  }
  function applyDamage() {
    if (!authorized) throw new Error('请先输入正确密钥');
    const { i, name } = currentWeapon();
    const raw = $('#damageValue').value.trim(), value = Number(raw);
    if (!raw || !Number.isFinite(value) || value < 0 || value > 100000) throw new Error('伤害请输入0～100000');
    // 项目实际射击逻辑读取“邮箱”，并非显示用的“武器伤害”列表。
    const actual = lists.get('邮箱')?.value;
    if (!Array.isArray(actual) || actual[i] === '' || !Number.isFinite(Number(actual[i]))) throw new Error('该物品没有可修改的基础伤害');
    editCell('邮箱', i, String(value)); editCell('武器伤害', i, String(value));
    return `${name} 基础伤害已设为 ${value}（命中仍有原作浮动和判定）`;
  }
  function applyAmmo() {
    if (!authorized) throw new Error('请先输入正确密钥');
    const { i, name } = currentWeapon();
    if (/手雷|烟雾|闪光|燃烧|肾上腺素|匕首/.test(name)) throw new Error('此面板只修改枪械弹药');
    const a = $('#ammoCount').value.trim(), b = $('#ammoCapacity').value.trim();
    const count = Number(a), capacity = Number(b);
    if (!a || !b || !Number.isInteger(count) || !Number.isInteger(capacity) || count < 0 || capacity < 1 || capacity > 10000 || count > capacity) throw new Error('请输入整数：0≤子弹数≤容量，容量1～10000');
    if (!/^(\d+)\/\/(\d+)$/.test(String(lists.get('子弹详情')?.value?.[i]))) throw new Error('当前武器弹药格式不支持');
    const value = `${count}//${capacity}`;
    if (!editCell('子弹详情', i, value)) throw new Error('未找到弹药数据');
    if (vars.has('子弹')) vars.get('子弹').value = value;
    return `${name} 弹药已设为 ${value}${settings.ammo ? '；弹药保持已开启，会补满容量' : ''}`;
  }
  function fillAmmo() {
    if (!authorized || !settings.ammo || !eligible()) return;
    const i = Number(read('武器序号')) - 1;
    const names = lists.get('武器名称')?.value, ammo = lists.get('子弹详情');
    if (!Number.isInteger(i) || i < 0 || !Array.isArray(ammo?.value) || !Array.isArray(names)) return;
    if (/手雷|烟雾|闪光|燃烧|肾上腺素|匕首/.test(String(names[i]))) return;
    const m = /^(\d+)\/\/(\d+)$/.exec(String(ammo.value[i]));
    if (!m || Number(m[2]) <= 0 || Number(m[2]) > 10000) return;
    const full = `${m[2]}//${m[2]}`;
    if (ammo.value[i] !== full) { ammo.value[i] = full; ammo._monitorUpToDate = false; }
    const shown = vars.get('子弹');
    if (shown && /^(\d+)\/\/(\d+)$/.test(String(shown.value))) shown.value = full;
  }
  function isVM(x) {
    try { return x && typeof x === 'object' && Array.isArray(x.runtime?.targets) && typeof x.runtime?.getTargetForStage === 'function'; }
    catch { return false; }
  }
  function correctVM(x) {
    if (!isVM(x)) return false;
    const ts = x.runtime.targets;
    const st = x.runtime.getTargetForStage();
    const names = new Set(Object.values(st?.variables || {}).map(v => v.name));
    return ts.some(t => t.getName?.() === 'player//碰撞箱' || t.sprite?.name === 'player//碰撞箱') &&
      ['指数', '呼吸', '武器序号', '当前武器'].every(n => names.has(n));
  }
  function findVM() {
    const queue = [], seen = new WeakSet();
    for (const key of ['vm', 'scratchVM', '__scratchVM', 'Scratch', 'ReduxStore', 'store']) {
      try { if (window[key]) queue.push([window[key], 0]); } catch {}
    }
    // React Fiber / Redux 常见入口，只读数据描述符，不执行未知 getter。
    const nodes = document.querySelectorAll('canvas, #root, #app, [class*="stage"], [class*="player"]');
    for (const node of [...nodes].slice(0, 100)) {
      for (let el = node, level = 0; el && level < 6; el = el.parentElement, level++) {
        for (const key of Object.keys(el)) if (/^(__reactFiber|__reactInternalInstance|__reactProps|__reactContainer)/.test(key)) queue.push([el[key], 0]);
      }
    }
    let count = 0;
    for (let i = 0; i < queue.length && count < 4000; i++) {
      const [obj, depth] = queue[i];
      if (!obj || (typeof obj !== 'object' && typeof obj !== 'function') || seen.has(obj)) continue;
      seen.add(obj); count++;
      if (correctVM(obj)) return obj;
      if (depth >= 13 || obj === window || obj === document || obj instanceof Element) continue;
      try {
        if (typeof obj.getState === 'function') queue.push([obj.getState(), depth + 1]);
        const descs = Object.getOwnPropertyDescriptors(obj);
        const keys = Object.keys(descs).filter(k => !['alternate', 'previous', 'ownerDocument', '_debugOwner'].includes(k));
        keys.sort((a, b) => Number(/vm|runtime|scratch|state|props|child|return|store/i.test(b)) - Number(/vm|runtime|scratch|state|props|child|return|store/i.test(a)));
        for (const key of keys.slice(0, 90)) if ('value' in descs[key]) {
          const v = descs[key].value;
          if (v && (typeof v === 'object' || typeof v === 'function')) queue.push([v, depth + 1]);
        }
      } catch {}
    }
    return null;
  }
  function detach() {
    restoreWeapons();
    for (const v of [...patches.keys()]) release(v);
    runtime?.removeListener?.('BEFORE_EXECUTE', fillAmmo);
    vm = stage = runtime = null; vars.clear(); lists.clear();
  }
  function connect(candidate) {
    detach(); vm = candidate; runtime = vm.runtime; stage = runtime.getTargetForStage();
    for (const v of Object.values(stage.variables || {})) (v.type === 'list' ? lists : vars).set(v.name, v);
    runtime.on?.('BEFORE_EXECUTE', fillAmmo);
    sync();
  }
  function reset() {
    for (const key of Object.keys(settings)) if (typeof settings[key] === 'boolean') settings[key] = false;
    for (const input of shadow.querySelectorAll('[data-key]')) input.checked = false;
    sync();
    restoreWeapons();
  }
  function update() {
    if (!vm) { $('#status').textContent = '未连接：请打开作品并运行，再点“重新连接”'; $('#stats').textContent = '仅识别《争锋相对》的变量与角色结构'; return; }
    $('#status').textContent = `已连接 · ${read('&当前版本') || '版本未知'} · ${eligible() ? '存活' : '等待进入 / 复活 / 观战'}`;
    const damage = lists.get('邮箱')?.value?.[Number(read('武器序号')) - 1];
    $('#stats').textContent = `生命指数：${read('指数')}　呼吸：${read('呼吸')}\n武器：${read('当前武器') || '—'}\n弹药：${read('子弹') || '—'}　基础伤害：${damage ?? '—'}`;
  }
  function scan() {
    if (disposed || busy) return;
    busy = true;
    try {
      if (vm && (!correctVM(vm) || runtime.getTargetForStage() !== stage)) { reset(); detach(); }
      if (!vm) { const found = findVM(); if (found) connect(found); }
      update();
    } catch (e) { $('#status').textContent = `连接失败：${e.message}`; }
    finally { busy = false; }
  }
  listen(shadow, 'change', event => {
    const key = event.target.dataset.key;
    if (!key || !(key in settings)) return;
    if (!authorized) { event.target.checked = false; return; }
    settings[key] = event.target.checked;
    sync(); fillAmmo(); update();
  });
  listen($('#speedValue'), 'input', event => {
    if (!authorized) return;
    settings.speedValue = Math.min(2, Math.max(0.5, Number(event.target.value) || 1));
    $('#speedText').textContent = `倍率 ${settings.speedValue.toFixed(2)}×`;
  });
  function unlock() {
    if (authorized) {
      reset(); authorized = false;
      $('#controls').disabled = true; $('#controls').hidden = true;
      $('#accessKey').disabled = false; $('#accessKey').value = '';
      $('#unlock').textContent = '验证并解锁';
      $('#authStatus').textContent = '已重新锁定，功能已停用，武器参数已恢复。';
      update(); return;
    }
    if ($('#accessKey').value !== ACCESS_KEY) {
      $('#authStatus').textContent = '密钥错误，请重新输入。'; $('#accessKey').value = ''; return;
    }
    authorized = true;
    $('#controls').disabled = false; $('#controls').hidden = false;
    $('#accessKey').value = ''; $('#accessKey').disabled = true;
    $('#unlock').textContent = '重新锁定并停用';
    $('#authStatus').textContent = '验证成功，功能已解锁。';
  }
  listen($('#unlock'), 'click', unlock);
  listen($('#accessKey'), 'keydown', event => {
    if (event.key === 'Enter' && !event.isComposing) { event.preventDefault(); unlock(); }
  });
  for (const [id, action] of [['#applyDamage', applyDamage], ['#applyAmmo', applyAmmo]]) {
    listen($(id), 'click', () => {
      try { $('#editStatus').textContent = action(); fillAmmo(); update(); }
      catch (e) { $('#editStatus').textContent = e.message; }
    });
  }
  listen($('#restoreWeapons'), 'click', () => {
    restoreWeapons(); $('#editStatus').textContent = '武器伤害与弹匣容量已恢复'; update();
  });
  listen($('#reset'), 'click', () => { reset(); update(); });
  listen($('#scan'), 'click', () => { reset(); detach(); scan(); });
  listen($('#mini'), 'click', () => { minimized = !minimized; $('.box').classList.toggle('mini', minimized); $('#mini').textContent = minimized ? '+' : '−'; clamp(); });
  let drag = null;
  function clamp() {
    const r = host.getBoundingClientRect();
    host.style.left = `${Math.max(0, Math.min(r.left, innerWidth - r.width))}px`;
    host.style.top = `${Math.max(0, Math.min(r.top, innerHeight - Math.min(r.height, 48)))}px`;
  }
  listen($('header'), 'pointerdown', event => {
    if (event.target.closest('button')) return;
    const r = host.getBoundingClientRect();
    drag = { id: event.pointerId, x: event.clientX - r.left, y: event.clientY - r.top };
    $('header').setPointerCapture(event.pointerId); event.preventDefault();
  });
  listen($('header'), 'pointermove', event => {
    if (!drag || drag.id !== event.pointerId) return;
    host.style.left = `${event.clientX - drag.x}px`; host.style.top = `${event.clientY - drag.y}px`; clamp();
  });
  for (const ev of ['pointerup', 'pointercancel', 'lostpointercapture']) listen($('header'), ev, () => { drag = null; });
  listen(window, 'resize', clamp);
  function dispose() {
    if (disposed) return;
    disposed = true; reset(); detach(); clearInterval(timer); clearInterval(scanner);
    ac.abort(); host.remove(); delete window[KEY];
  }
  listen($('#close'), 'click', dispose);
  listen(window, 'pagehide', dispose);
  const timer = setInterval(() => {
    if (vm && runtime.getTargetForStage() !== stage) { reset(); detach(); }
    try { fillAmmo(); update(); } catch (e) { $('#status').textContent = `运行异常：${e.message}`; reset(); }
  }, 150);
  const scanner = setInterval(scan, 3500);
  window[KEY] = { dispose };
  scan();
})();
