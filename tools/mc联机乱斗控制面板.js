
// ==UserScript==
// @name         炸鱼天团-MC联机乱斗控制面板
// @namespace    https://www.ccw.site/
// @version      3.0.1
// @author       蓝天_zip
// @description  MC联机乱斗控制面板
// @match        https://www.ccw.site/detail/6a23c33ab71453192f74500d*
// @run-at       document-idle
// @grant        unsafeWindow
// ==/UserScript==

(function () {
    'use strict';

    const page = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

    const CONFIG = {
        variables: [
            '#无敌时间🛡️',
            '⚔️攻击力',
            '❤️血量',
            '盔甲值'
        ],
        watermark: '炸鱼天团-蓝天_zip'
    };

    const STATE = {
        vm: null,
        runtime: null,
        panel: null,
        status: null,
        list: null,
        locks: new Map(),
        initialized: false,
        dragging: false,
        offsetX: 0,
        offsetY: 0
    };

    function isVM(obj) {
        return !!(
            obj &&
            obj.runtime &&
            Array.isArray(obj.runtime.targets)
        );
    }

    function findVM() {
        const candidates = [
            page.eureka?.vm,
            page.vm,
            page.Scratch?.vm,
            page.Scratch?.runtime?.extensionManager?.vm,
            page.__scratchVM
        ];

        for (const candidate of candidates) {
            if (isVM(candidate)) return candidate;
            if (candidate && Array.isArray(candidate.targets)) {
                return { runtime: candidate };
            }
        }

        return null;
    }

    function findVariable(name) {
        if (!STATE.runtime) return [];

        const result = [];

        for (const target of STATE.runtime.targets) {
            if (!target || !target.variables) continue;

            for (const [id, variable] of Object.entries(target.variables)) {
                if (variable && variable.name === name) {
                    result.push({
                        target,
                        id,
                        variable
                    });
                }
            }
        }

        return result;
    }

    function readValue(name) {
        const matches = findVariable(name);
        return matches.length ? matches[0].variable.value : undefined;
    }

    function parseValue(input, original) {
        const text = input.trim();

        if (text === '') return '';

        if (typeof original === 'number') {
            const number = Number(text);
            return Number.isFinite(number) ? number : original;
        }

        if (typeof original === 'boolean') {
            return text === 'true' || text === '1';
        }

        try {
            return JSON.parse(text);
        } catch (_) {
            return text;
        }
    }

    function formatValue(value) {
        if (typeof value === 'string') return value;

        try {
            return JSON.stringify(value, null, 2);
        } catch (_) {
            return String(value);
        }
    }

    function writeValue(name, value) {
        const matches = findVariable(name);

        if (!matches.length) {
            setStatus('未找到变量：' + name);
            return false;
        }

        let success = 0;

        for (const item of matches) {
            try {
                item.variable.value = parseValue(
                    String(value),
                    item.variable.value
                );
                success++;
            } catch (_) {}
        }

        return success > 0;
    }

    function setStatus(message) {
        if (STATE.status) {
            STATE.status.textContent = message;
        }
    }

    function createElement(tag, className, text) {
        const element = document.createElement(tag);

        if (className) element.className = className;
        if (text !== undefined) element.textContent = text;

        return element;
    }

    function addStyle() {
        if (document.getElementById('zayutuan-blue-style')) return;

        const style = document.createElement('style');
        style.id = 'zayutuan-blue-style';

        style.textContent = `
            #zy-panel {
                position: fixed;
                top: 100px;
                right: 30px;
                width: 340px;
                max-height: 82vh;
                overflow-y: auto;
                z-index: 2147483647;
                color: #e4edff;
                background: #101b2d;
                border: 1px solid #304969;
                border-radius: 13px;
                box-shadow: 0 12px 40px rgba(0, 8, 25, .75);
                font-family: Arial, "Microsoft YaHei", sans-serif;
                font-size: 13px;
                scrollbar-width: thin;
                scrollbar-color: #42648d #142239;
            }

            #zy-panel * {
                box-sizing: border-box;
            }

            #zy-panel .zy-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 14px;
                color: #f0f6ff;
                background: linear-gradient(135deg, #1c3557, #142944);
                border-bottom: 1px solid #304969;
                border-radius: 12px 12px 0 0;
                cursor: move;
                font-size: 15px;
                font-weight: bold;
            }

            #zy-panel .zy-title {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            #zy-panel .zy-title-icon {
                color: #65b5ff;
                font-size: 17px;
            }

            #zy-panel .zy-close {
                width: 27px;
                height: 27px;
                color: #b9d4f5;
                background: #263e5d;
                border: 1px solid #3b587c;
                border-radius: 6px;
                cursor: pointer;
                font-size: 19px;
                line-height: 20px;
            }

            #zy-panel .zy-close:hover {
                color: white;
                background: #365a83;
            }

            #zy-panel .zy-content {
                padding: 12px;
            }

            #zy-panel .zy-status {
                padding: 10px;
                margin-bottom: 12px;
                color: #9ecbff;
                background: #192b44;
                border: 1px solid #2c4769;
                border-radius: 7px;
                line-height: 1.5;
                word-break: break-all;
            }

            #zy-panel .zy-section {
                padding: 11px;
                margin-bottom: 10px;
                background: #19283e;
                border: 1px solid #2b4260;
                border-radius: 9px;
            }

            #zy-panel .zy-heading {
                margin-bottom: 9px;
                color: #c9e1ff;
                font-weight: bold;
            }

            #zy-panel .zy-variable-name {
                margin-bottom: 8px;
                color: #d8e9ff;
                font-size: 13px;
                font-weight: bold;
            }

            #zy-panel .zy-input {
                display: block;
                width: 100%;
                min-height: 34px;
                padding: 8px 10px;
                color: #d9ebff;
                background: #0e192a;
                border: 1px solid #344f70;
                border-radius: 6px;
                outline: none;
                font-family: Consolas, monospace;
                font-size: 12px;
            }

            #zy-panel .zy-input:focus {
                border-color: #58a6ff;
                box-shadow: 0 0 0 2px rgba(66, 153, 225, .15);
            }

            #zy-panel .zy-input::placeholder {
                color: #657d9c;
            }

            #zy-panel .zy-controls {
                display: flex;
                gap: 7px;
                margin-top: 8px;
            }

            #zy-panel .zy-button {
                min-height: 31px;
                padding: 6px 11px;
                color: #edf6ff;
                background: #28568a;
                border: 1px solid #3c74ad;
                border-radius: 6px;
                cursor: pointer;
                transition: .15s;
            }

            #zy-panel .zy-button:hover {
                background: #3675b5;
                border-color: #65a8e9;
            }

            #zy-panel .zy-button:active {
                transform: scale(.97);
            }

            #zy-panel .zy-button:disabled {
                opacity: .4;
                cursor: not-allowed;
            }

            #zy-panel .zy-lock {
                min-width: 85px;
                background: #34465e;
                border-color: #506984;
            }

            #zy-panel .zy-lock.active {
                color: #d9f0ff;
                background: #176b83;
                border-color: #269bb7;
            }

            #zy-panel .zy-lock.active:hover {
                background: #218ba6;
            }

            #zy-panel .zy-footer {
                padding: 11px 5px 3px;
                color: #7893b5;
                text-align: center;
                font-size: 11px;
                letter-spacing: 1px;
            }

            #zy-panel .zy-unlock-all {
                width: 100%;
                min-height: 34px;
                color: #d8eaff;
                background: #263d5a;
                border: 1px solid #3e5c80;
                border-radius: 7px;
                cursor: pointer;
            }

            #zy-panel .zy-unlock-all:hover {
                background: #345477;
            }

            #zy-panel .zy-empty {
                padding: 18px 5px;
                color: #7893b5;
                text-align: center;
            }

            #zy-panel .zy-count {
                float: right;
                color: #7fa9d8;
                font-size: 11px;
                font-weight: normal;
            }

            #zy-opener {
                position: fixed;
                right: 22px;
                bottom: 25px;
                z-index: 2147483646;
                width: 54px;
                height: 54px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #dcecff;
                background: linear-gradient(145deg, #244b77, #10233d);
                border: 2px solid #5c8bbd;
                border-radius: 50%;
                box-shadow: 0 5px 20px rgba(0, 10, 30, .6);
                cursor: pointer;
                font-size: 23px;
            }

            #zy-opener:hover {
                transform: scale(1.08);
                background: #2b5b8e;
            }
        `;

        document.head.appendChild(style);
    }

    function createAttributeEditor(name) {
        const section = createElement('div', 'zy-section');
        const heading = createElement('div', 'zy-variable-name');
        const count = createElement('span', 'zy-count');

        heading.textContent = name;

        const matches = findVariable(name);
        count.textContent = matches.length
            ? '匹配 ' + matches.length + ' 项'
            : '未找到';

        heading.appendChild(count);

        const input = createElement('input', 'zy-input');
        input.type = 'text';
        input.spellcheck = false;
        input.dataset.name = name;

        const value = readValue(name);

        input.value = value === undefined ? '' : formatValue(value);
        input.placeholder = matches.length ? '输入要修改的值' : '未找到该变量';
        input.disabled = !matches.length;

        const controls = createElement('div', 'zy-controls');

        const apply = createElement('button', 'zy-button', '应用修改');
        apply.disabled = !matches.length;

        apply.onclick = () => {
            if (!matches.length) {
                setStatus('没有找到变量：' + name);
                return;
            }

            if (writeValue(name, input.value)) {
                if (STATE.locks.has(name)) {
                    STATE.locks.set(name, input.value);
                }

                setStatus(name + '：修改成功');
                refreshAll();
            }
        };

        const lock = createElement('button', 'zy-button zy-lock');
        lock.dataset.name = name;

        updateLockButton(lock);

        lock.disabled = !matches.length;

        lock.onclick = () => {
            if (STATE.locks.has(name)) {
                STATE.locks.delete(name);
                setStatus(name + '：已解除锁定');
            } else {
                if (!matches.length) return;

                STATE.locks.set(name, input.value);
                writeValue(name, input.value);
                setStatus(name + '：已开启锁定');
            }

            updateAllLockButtons();
        };

        controls.append(apply, lock);
        section.append(heading, input, controls);

        return section;
    }

    function updateLockButton(button) {
        const name = button.dataset.name;
        const active = STATE.locks.has(name);

        button.textContent = active ? '锁定中' : '未锁定';
        button.classList.toggle('active', active);
    }

    function updateAllLockButtons() {
        if (!STATE.panel) return;

        STATE.panel.querySelectorAll('.zy-lock').forEach(updateLockButton);
    }

    function refreshAll() {
        if (!STATE.panel || !STATE.runtime) return;

        STATE.panel.querySelectorAll('.zy-input').forEach(input => {
            if (document.activeElement === input) return;

            const value = readValue(input.dataset.name);

            if (value !== undefined) {
                input.value = formatValue(value);
            }
        });

        STATE.panel.querySelectorAll('.zy-count').forEach(count => {
            const heading = count.parentElement;
            const name = heading.firstChild.textContent;
            const matches = findVariable(name);

            count.textContent = matches.length
                ? '匹配 ' + matches.length + ' 项'
                : '未找到';
        });

        updateAllLockButtons();
    }

    function unlockAll() {
        STATE.locks.clear();
        updateAllLockButtons();
        setStatus('所有属性锁定已解除');
    }

    function refresh() {
        const found = findVM();

        if (!found) {
            STATE.vm = null;
            STATE.runtime = null;
            setStatus('尚未连接游戏 VM，等待作品加载...');
            return false;
        }

        STATE.vm = found;
        STATE.runtime = found.runtime;

        setStatus('已连接游戏 VM');

        refreshAll();
        return true;
    }

    function lockLoop() {
        if (STATE.locks.size && STATE.runtime) {
            for (const [name, value] of STATE.locks.entries()) {
                writeValue(name, value);
            }
        }

        requestAnimationFrame(lockLoop);
    }

    function makeDraggable(panel, handle) {
        handle.addEventListener('mousedown', event => {
            if (event.target.closest('button')) return;

            STATE.dragging = true;

            const rect = panel.getBoundingClientRect();

            STATE.offsetX = event.clientX - rect.left;
            STATE.offsetY = event.clientY - rect.top;

            event.preventDefault();
        });

        document.addEventListener('mousemove', event => {
            if (!STATE.dragging) return;

            panel.style.left = Math.max(
                0,
                event.clientX - STATE.offsetX
            ) + 'px';

            panel.style.top = Math.max(
                0,
                event.clientY - STATE.offsetY
            ) + 'px';

            panel.style.right = 'auto';
        });

        document.addEventListener('mouseup', () => {
            STATE.dragging = false;
        });
    }

    function createUI() {
        if (STATE.panel && STATE.panel.isConnected) return;

        addStyle();

        const panel = createElement('div');
        panel.id = 'zy-panel';

        const header = createElement('div', 'zy-header');
        const title = createElement('div', 'zy-title');
        const icon = createElement('span', 'zy-title-icon', '✦');
        const titleText = createElement('span', '', '角色属性控制面板');
        const close = createElement('button', 'zy-close', '×');

        title.append(icon, titleText);
        header.append(title, close);

        const content = createElement('div', 'zy-content');

        STATE.status = createElement(
            'div',
            'zy-status',
            '正在寻找游戏运行环境...'
        );

        STATE.list = createElement('div');

        for (const name of CONFIG.variables) {
            STATE.list.appendChild(createAttributeEditor(name));
        }

        const unlock = createElement(
            'button',
            'zy-unlock-all',
            '解除全部锁定'
        );

        unlock.onclick = unlockAll;

        const footer = createElement(
            'div',
            'zy-footer',
            CONFIG.watermark
        );

        content.append(
            STATE.status,
            STATE.list,
            unlock,
            footer
        );

        panel.append(header, content);
        document.body.appendChild(panel);

        STATE.panel = panel;

        const opener = createElement('button');
        opener.id = 'zy-opener';
        opener.textContent = '✦';
        opener.title = '打开角色属性控制面板';
        opener.style.display = 'none';

        document.body.appendChild(opener);

        close.onclick = () => {
            panel.style.display = 'none';
            opener.style.display = 'flex';
        };

        opener.onclick = () => {
            panel.style.display = 'block';
            opener.style.display = 'none';
        };

        makeDraggable(panel, header);

        STATE.opener = opener;
    }

    function initialize() {
        if (STATE.initialized) return;

        STATE.initialized = true;
        createUI();
        refresh();

        setInterval(() => {
            if (!STATE.runtime) {
                refresh();
            } else {
                refreshAll();
            }
        }, 1500);

        requestAnimationFrame(lockLoop);
    }

    function start() {
        createUI();

        let attempts = 0;

        const timer = setInterval(() => {
            attempts++;

            if (refresh()) {
                clearInterval(timer);
                initialize();
                return;
            }

            if (attempts >= 120) {
                clearInterval(timer);
                setStatus('连接超时，请确认游戏已经运行后刷新页面');
            }
        }, 500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
