const categoryNames = {
    js: "JS 脚本",
    scratch: "作品源码/外挂角色",
    tutorial: "其他"
};

const resources = [
//tools/Void Apex mc联机乱斗外挂.js
//tools/sanwang.js
    {
        category: "js",
        name: "MC联机乱斗控制面板",
        version: "JS",
        type: "游戏辅助",
        date: "2026.11.15",
        description: "MC联机乱斗相关控制面板脚本。",
        icon: "🎮",
        url: "https://lantian-zip.github.io/zytt_safety_tools/tools/mc联机乱斗控制面板.js",
        action: "复制链接",
        copyLink: true
    },

    {
        category: "js",
        name: "Void Apex mc联机乱斗外挂",
        version: "JS",
        type: "游戏辅助",
        date: "2026.11.15",
        description: "mc联机乱斗，卡密：VIP-POKI-888",
        icon: "⚙",
        url: "https://lantian-zip.github.io/zytt_safety_tools/tools/Void Apex mc联机乱斗外挂.js",
        action: "复制链接",
        copyLink: true
    },

    {
        category: "js",
        name: "拾荒控制面板",
        version: "JS",
        type: "游戏辅助",
        date: "2026.11.15",
        description: "蓝天的拾荒相关控制面板工具。",//SHZ-2026-VIP-7K9M
        icon: "⚙",
        url: "https://lantian-zip.github.io/zytt_safety_tools/tools/zytt拾荒者.js",
        action: "复制链接",
        copyLink: true
    },

    {
        category: "js",
        name: "拾荒者一键清场.js",
        version: "JS",
        type: "清图辅助",
        date: "2026.11.15",
        description: "蓝天的拾荒清图工具。",
        icon: "⚙",
        url: "https://lantian-zip.github.io/zytt_safety_tools/tools/拾荒者一键清场.js",
        action: "复制链接",
        copyLink: true
    },

    {
        category: "js",
        name: "cave精简版.min.js",
        version: "JS",
        type: "游戏辅助",
        date: "2026.11.15",
        description: "cave相关控制面板工具。",
        icon: "⚙",
        url: "https://lantian-zip.github.io/zytt_safety_tools/tools/cave精简版.min.js",
        action: "复制链接",
        copyLink: true
    },

    {
        category: "js",
        name: "cave新版.",
        version: "JS",
        type: "游戏辅助",
        date: "2026.11.16",
        description: "cave相关控制面板工具。",
        icon: "⚙",
        url: "https://lantian-zip.github.io/zytt_safety_tools/tools/cave新版.js",
        action: "复制链接",
        copyLink: true
    },

    {
        category: "js",
        name: "CSense4.1",
        version: "JS",
        type: "全面工具合集",
        date: "2026.11.15",
        description: "一个集修改变量，云数据，成就，列表等于一身的工具",
        icon: "⚙",
        url: "https://ccwtools.dpdns.org/User-Script/files/CSense%E9%98%B2%E6%A3%80%E6%B5%8B4.1.user.js",
        action: "复制链接",
        copyLink: true
    },

    {
        category: "js",
        name: "z.BridgeOfCracks(butterAny).0.2.0.js",
        version: "JS",
        type: "全面工具合集",
        date: "2026.11.16",
        description: "by 会飞的黄油",
        icon: "♾️",
        url: "https://lantian-zip.github.io/zytt_safety_tools/tools/z.BridgeOfCracks(butterAny).0.2.0.js",
        action: "复制链接",
        copyLink: true
    },

    {
        category: "js",
        name: "角色插入器",
        version: "JS",
        type: "bxsx的杰作",
        date: "2026.11.16",
        description: "搭配外挂角色使用",
        icon: "⚙",
        url: "https://ccwtools.dpdns.org/User-Script/files/%E8%A7%92%E8%89%B2%E6%8F%92%E5%85%A5%E5%99%A8.min.user.js",
        action: "复制链接",
        copyLink: true
    },

    {
        category: "js",
        name: "cave飞雷神",
        version: "JS",
        type: "by 盛夏",
        date: "2026.11.16",
        description: "nb的js脚本",
        icon: "⚙",
        url: "https://lantian-zip.github.io/zytt_safety_tools/tools/cave飞雷神.user.js",
        action: "复制链接",
        copyLink: true
    },
    {
        category: "js",
        name: "争锋控制面板",
        version: "JS",
        type: "游戏辅助",
        date: "2026.11.16",
        description: "蓝天的争锋面板",
        icon: "⚙",
        url: "https://lantian-zip.github.io/zytt_safety_tools/tools/zfxd.js",//lantian_nb666
        action: "复制链接",
        copyLink: true
    },
    {
        category: "js",
        name: "散王控制面板",
        version: "JS",
        type: "游戏辅助",
        date: "2026.11.19",
        description: "蓝天的散王面板",
        icon: "⚙",
        url: "https://lantian-zip.github.io/zytt_safety_tools/tools/sanwang.js",//lantian_nb666
        action: "复制链接",
        copyLink: true
    },
    {
        category: "js",
        name: "云种田控制面板",
        version: "JS",
        type: "游戏辅助",
        date: "2026.11.19",
        description: "蓝天的云种田面板",
        icon: "🤪",
        url: "https://lantian-zip.github.io/zytt_safety_tools/tools/云种田v1.js",
        action: "复制链接",
        copyLink: true
    },
    {
        category: "js",
        name: "云号池",
        version: "JS",
        type: "账号列表",
        date: "2026.11.28",
        description: "蓝天的号池",
        icon: "⨀",
        url: "https://lantian-zip.github.io/zytt_safety_tools/tools/号池.txt",
        action: "复制链接",
        copyLink: true
    },
//scratch源码
    {
        category: "scratch",
        name: "Cave.io V1.7.114723",
        version: "V1.7.114723",
        type: "Scratch 作品",
        date: "2026.11.15",
        description: "Cave.io 对应的 SB3 项目源码。",
        icon: "🧩",
        url: "/zytt_safety_tools/tools/cave.io V1.7.114723 破解版.sb3",
        action: "下载源码"
    },

    {
        category: "scratch",
        name: "拾荒者审计工具",
        version: "V???",
        type: "Scratch 作品",
        date: "2026.11.16",
        description: "by ycy 请搭配角色插入器使用",
        icon: "😊",
        url: "/zytt_safety_tools/tools/拾荒者外挂系统（ycy） (1).sprite3",
        action: "下载资源"
    },

//其它 
    {
        category: "tutorial",
        name: "暴力猴下载教程",
        version: "HTML",
        type: "使用教程",
        date: "2026.11.15",
        description: "暴力猴浏览器扩展的下载及安装教程。",
        icon: "📖",
        url: "/zytt_safety_tools/tools/暴力猴下载教程.html",
        action: "阅读教程"
    },
    
    {
        category: "tutorial",
        name: "通缉令",
        version: "HTML",
        type: "敌对势力榜单",
        date: "2026.11.16",
        description: "曾经那些惹过我们的，我会让你们付出代价",
        icon: "📖",
        url: "/zytt_safety_tools/black.html",
        action: "阅读教程"
    }

];

const categoryTabs = document.querySelectorAll(".category-tab");
const resourceGrid = document.getElementById("resourceGrid");
const searchInput = document.getElementById("searchInput");
const currentCategory = document.getElementById("currentCategory");
const resultCount = document.getElementById("resultCount");

let activeCategory = "js";

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function updateStats() {

    const counts = {
        js: resources.filter(item => item.category === "js").length,
        scratch: resources.filter(item => item.category === "scratch").length,
        tutorial: resources.filter(item => item.category === "tutorial").length
    };

    document.getElementById("jsCount").textContent = counts.js;
    document.getElementById("scratchCount").textContent = counts.scratch;
    document.getElementById("tutorialCount").textContent = counts.tutorial;

    document.getElementById("jsTabCount").textContent = counts.js + " 个资源";
    document.getElementById("scratchTabCount").textContent = counts.scratch + " 个资源";
    document.getElementById("tutorialTabCount").textContent = counts.tutorial + " 个资源";
}

function renderResources() {

    const keyword = searchInput.value.trim().toLowerCase();

    const filtered = resources.filter(item => {

        const matchesCategory = item.category === activeCategory;

        const content = [
            item.name,
            item.version,
            item.type,
            item.description
        ].join(" ").toLowerCase();

        return matchesCategory && content.includes(keyword);

    });

    currentCategory.textContent = categoryNames[activeCategory];
    resultCount.textContent = "共 " + filtered.length + " 个资源";

    if (filtered.length === 0) {

        resourceGrid.innerHTML = `
            <div class="empty">
                没有找到相关资源，试试其他关键词吧。
            </div>
        `;

        return;
    }

    resourceGrid.innerHTML = filtered.map(item => {

        const isTutorial = item.category === "tutorial";

        return `
            <article class="resource-card">

                <div class="resource-icon">
                    ${escapeHTML(item.icon)}
                </div>

                <h4>${escapeHTML(item.name)}</h4>

                <div class="resource-meta">
                    <span class="tag">
                        ${escapeHTML(item.type)}
                    </span>

                    <span>
                        ${escapeHTML(item.version)}
                    </span>

                    <span>
                        ${escapeHTML(item.date)}
                    </span>
                </div>

                <p>
                    ${escapeHTML(item.description)}
                </p>

                ${
                    item.copyLink
                    ? `<button class="resource-btn" type="button" data-copy-url="${escapeHTML(item.url)}">${escapeHTML(item.action)}　→</button>`
                    : `<a class="resource-btn" href="${escapeHTML(item.url)}" ${isTutorial ? "" : "download"}>${escapeHTML(item.action)}　→</a>`
                }

            </article>
        `;

    }).join("");

}

categoryTabs.forEach(tab => {

    tab.addEventListener("click", () => {

        activeCategory = tab.dataset.category;

        categoryTabs.forEach(item => {
            item.classList.toggle("active", item === tab);
        });

        renderResources();

    });

});

searchInput.addEventListener("input", renderResources);

resourceGrid.addEventListener("click", async event => {

    const button = event.target.closest("[data-copy-url]");

    if (!button) return;

    const url = button.dataset.copyUrl;

    try {
        await navigator.clipboard.writeText(url);
    } catch {
        const input = document.createElement("textarea");
        input.value = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        input.remove();
    }

    button.textContent = "已复制　✓";

    setTimeout(() => {
        button.textContent = "复制链接　→";
    }, 1600);

});

updateStats();
renderResources();
