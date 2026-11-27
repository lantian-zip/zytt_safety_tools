(() => {
  "use strict";

  const categories = {
    js: "JS 脚本",
    scratch: "Scratch 作品源码 / 外挂角色",
    tutorial: "教程 / 其他"
  };

  const resources = [
    {
        "category": "js",
        "name": "MC联机乱斗控制面板",
        "version": "JS",
        "type": "游戏辅助",
        "date": "2026.11.15",
        "description": "MC联机乱斗相关控制面板脚本。",
        "icon": "🎮",
        "url": "https://lantian-zip.github.io/zytt_safety_tools/tools/mc联机乱斗控制面板.js",
        "action": "复制链接",
        "copyLink": true
    },
    {
        "category": "js",
        "name": "Void Apex mc联机乱斗外挂",
        "version": "JS",
        "type": "游戏辅助",
        "date": "2026.11.15",
        "description": "mc联机乱斗，卡密：VIP-POKI-888",
        "icon": "⚙",
        "url": "https://lantian-zip.github.io/zytt_safety_tools/tools/Void Apex mc联机乱斗外挂.js",
        "action": "复制链接",
        "copyLink": true
    },
    {
        "category": "js",
        "name": "拾荒控制面板",
        "version": "JS",
        "type": "游戏辅助",
        "date": "2026.11.15",
        "description": "蓝天的拾荒相关控制面板工具。",
        "icon": "⚙",
        "url": "https://lantian-zip.github.io/zytt_safety_tools/tools/zytt拾荒者.js",
        "action": "复制链接",
        "copyLink": true
    },
    {
        "category": "js",
        "name": "拾荒者一键清场.js",
        "version": "JS",
        "type": "清图辅助",
        "date": "2026.11.15",
        "description": "蓝天的拾荒清图工具。",
        "icon": "⚙",
        "url": "https://lantian-zip.github.io/zytt_safety_tools/tools/拾荒者一键清场.js",
        "action": "复制链接",
        "copyLink": true,
        "added": true
    },
    {
        "category": "js",
        "name": "cave精简版.min.js",
        "version": "JS",
        "type": "游戏辅助",
        "date": "2026.11.15",
        "description": "cave相关控制面板工具。",
        "icon": "⚙",
        "url": "https://lantian-zip.github.io/zytt_safety_tools/tools/cave精简版.min.js",
        "action": "复制链接",
        "copyLink": true
    },
    {
        "category": "js",
        "name": "cave新版.",
        "version": "JS",
        "type": "游戏辅助",
        "date": "2026.11.16",
        "description": "cave相关控制面板工具。",
        "icon": "⚙",
        "url": "https://lantian-zip.github.io/zytt_safety_tools/tools/cave新版.js",
        "action": "复制链接",
        "copyLink": true
    },
    {
        "category": "js",
        "name": "CSense4.1",
        "version": "JS",
        "type": "全面工具合集",
        "date": "2026.11.15",
        "description": "一个集修改变量，云数据，成就，列表等于一身的工具",
        "icon": "⚙",
        "url": "https://ccwtools.dpdns.org/User-Script/files/CSense%E9%98%B2%E6%A3%80%E6%B5%8B4.1.user.js",
        "action": "复制链接",
        "copyLink": true
    },
    {
        "category": "js",
        "name": "z.BridgeOfCracks(butterAny).0.2.0.js",
        "version": "JS",
        "type": "全面工具合集",
        "date": "2026.11.16",
        "description": "by 会飞的黄油",
        "icon": "♾️",
        "url": "https://lantian-zip.github.io/zytt_safety_tools/tools/z.BridgeOfCracks(butterAny).0.2.0.js",
        "action": "复制链接",
        "copyLink": true
    },
    {
        "category": "js",
        "name": "角色插入器",
        "version": "JS",
        "type": "bxsx的杰作",
        "date": "2026.11.16",
        "description": "搭配外挂角色使用",
        "icon": "⚙",
        "url": "https://ccwtools.dpdns.org/User-Script/files/%E8%A7%92%E8%89%B2%E6%8F%92%E5%85%A5%E5%99%A8.min.user.js",
        "action": "复制链接",
        "copyLink": true
    },
    {
        "category": "js",
        "name": "cave飞雷神",
        "version": "JS",
        "type": "by 盛夏",
        "date": "2026.11.16",
        "description": "nb的js脚本",
        "icon": "⚙",
        "url": "https://lantian-zip.github.io/zytt_safety_tools/tools/cave飞雷神.user.js",
        "action": "复制链接",
        "copyLink": true
    },
    {
        "category": "js",
        "name": "争锋控制面板",
        "version": "JS",
        "type": "游戏辅助",
        "date": "2026.11.16",
        "description": "蓝天的争锋面板",
        "icon": "⚙",
        "url": "https://lantian-zip.github.io/zytt_safety_tools/tools/zfxd.js",
        "action": "复制链接",
        "copyLink": true
    },
    {
        "category": "js",
        "name": "散王控制面板",
        "version": "JS",
        "type": "游戏辅助",
        "date": "2026.11.19",
        "description": "蓝天的散王面板",
        "icon": "⚙",
        "url": "https://lantian-zip.github.io/zytt_safety_tools/tools/sanwang.js",
        "action": "复制链接",
        "copyLink": true,
        "added": true
    },
    {
        "category": "js",
        "name": "云种田控制面板",
        "version": "JS",
        "type": "游戏辅助",
        "date": "2026.11.19",
        "description": "蓝天的云种田面板",
        "icon": "🤪",
        "url": "https://lantian-zip.github.io/zytt_safety_tools/tools/云种田v1.js",
        "action": "复制链接",
        "copyLink": true,
        "added": true
    },
    {
        "category": "js",
        "name": "云号池",
        "version": "JS",
        "type": "账号列表",
        "date": "2026.11.28",
        "description": "蓝天的号池",
        "icon": "⨀",
        "url": "https://lantian-zip.github.io/zytt_safety_tools/tools/号池.txt",
        "action": "复制链接",
        "copyLink": true,
        "added": true
    },
    {
        "category": "scratch",
        "name": "Cave.io V1.7.114723",
        "version": "V1.7.114723",
        "type": "Scratch 作品",
        "date": "2026.11.15",
        "description": "Cave.io 对应的 SB3 项目源码。",
        "icon": "🧩",
        "url": "/zytt_safety_tools/tools/cave.io V1.7.114723 破解版.sb3",
        "action": "下载源码",
        "download": true
    },
    {
        "category": "scratch",
        "name": "拾荒者审计工具",
        "version": "V???",
        "type": "Scratch 作品",
        "date": "2026.11.16",
        "description": "by ycy 请搭配角色插入器使用",
        "icon": "😊",
        "url": "/zytt_safety_tools/tools/拾荒者外挂系统（ycy） (1).sprite3",
        "action": "下载资源",
        "download": true
    },
    {
        "category": "tutorial",
        "name": "暴力猴下载教程",
        "version": "HTML",
        "type": "使用教程",
        "date": "2026.11.15",
        "description": "暴力猴浏览器扩展的下载及安装教程。",
        "icon": "📖",
        "url": "/zytt_safety_tools/tools/暴力猴下载教程.html",
        "action": "阅读教程"
    },
    {
        "category": "tutorial",
        "name": "通缉令",
        "version": "HTML",
        "type": "敌对势力榜单",
        "date": "2026.11.16",
        "description": "曾经那些惹过我们的，我会让你们付出代价",
        "icon": "📖",
        "url": "/zytt_safety_tools/black.html",
        "action": "阅读教程"
    }
];

  const categoryTabs = [...document.querySelectorAll(".category-tab")];
  const resourceGrid = document.getElementById("resourceGrid");
  const searchInput = document.getElementById("searchInput");
  const currentCategory = document.getElementById("currentCategory");
  const resultCount = document.getElementById("resultCount");
  const toast = document.getElementById("toast");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let activeCategory = "js";
  let toastTimer = 0;

  const countByCategory = () => Object.fromEntries(
    Object.keys(categories).map(category => [category, resources.filter(item => item.category === category).length])
  );

  function updateStats() {
    const counts = countByCategory();
    Object.entries(counts).forEach(([category, count]) => {
      const stat = document.querySelector(`[data-stat="${category}"]`);
      const tabCount = document.getElementById(`${category}TabCount`);
      if (stat) stat.dataset.target = String(count);
      if (tabCount) tabCount.textContent = String(count).padStart(2, "0");
    });
    const total = document.getElementById("totalResourceCount");
    if (total) total.textContent = String(resources.length).padStart(2, "0");
  }

  function animateStat(element) {
    if (element.dataset.counted === "true") return;
    element.dataset.counted = "true";
    const target = Number(element.dataset.target || 0);
    if (reducedMotion) {
      element.textContent = String(target).padStart(2, "0");
      return;
    }
    const duration = 850;
    const start = performance.now();
    const tick = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = String(Math.round(target * eased)).padStart(2, "0");
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  function showToast(message, isError = false) {
    toast.textContent = message;
    toast.classList.toggle("toast-error", isError);
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2200);
  }

  function createResourceCard(item, index) {
    const card = document.createElement("article");
    card.className = "resource-card";
    card.style.animationDelay = `${Math.min(index * 45, 270)}ms`;

    const top = document.createElement("div");
    top.className = "resource-card-top";
    const icon = document.createElement("div");
    icon.className = "resource-icon";
    icon.textContent = item.icon;
    const number = document.createElement("span");
    number.className = "resource-number";
    number.textContent = `RESOURCE / ${String(index + 1).padStart(2, "0")}`;
    top.append(icon, number);

    const title = document.createElement("h4");
    title.textContent = item.name;

    const meta = document.createElement("div");
    meta.className = "resource-meta";
    const tag = document.createElement("span");
    tag.className = "resource-tag";
    tag.textContent = item.type;
    const version = document.createElement("span");
    version.textContent = item.version;
    const date = document.createElement("span");
    date.textContent = item.date;
    meta.append(tag, version, date);
    if (item.added) {
      const added = document.createElement("span");
      added.className = "resource-tag new-tag";
      added.textContent = "NEW";
      meta.append(added);
    }

    const description = document.createElement("p");
    description.textContent = item.description;

    let action;
    if (item.copyLink) {
      action = document.createElement("button");
      action.type = "button";
      action.dataset.copyUrl = item.url;
      action.textContent = item.action;
    } else {
      action = document.createElement("a");
      action.href = item.url;
      action.textContent = item.action;
      if (item.download) action.setAttribute("download", "");
      action.addEventListener("click", event => {
        if (item.url.startsWith("./")) {
          const fileName = decodeURIComponent(item.url.split("/").pop());
          action.setAttribute("aria-label", `${item.action}：${fileName}`);
        }
      });
    }
    action.className = "resource-action";
    const arrow = document.createElement("span");
    arrow.textContent = item.copyLink ? "⧉" : "↗";
    action.appendChild(arrow);
    card.append(top, title, meta, description, action);

    card.addEventListener("pointermove", event => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      card.style.setProperty("--my", `${event.clientY - rect.top}px`);
    });
    return card;
  }

  function renderResources() {
    const keyword = (searchInput?.value || "").trim().toLocaleLowerCase("zh-CN");
    const filtered = resources.filter(item => {
      if (item.category !== activeCategory) return false;
      const searchable = [item.name, item.version, item.type, item.description, item.date].join(" ").toLocaleLowerCase("zh-CN");
      return searchable.includes(keyword);
    });

    currentCategory.textContent = categories[activeCategory];
    resultCount.textContent = `共 ${filtered.length} 个资源`;
    resourceGrid.replaceChildren();

    if (!filtered.length) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      const title = document.createElement("strong");
      title.textContent = "没有找到相关资源";
      const hint = document.createElement("span");
      hint.textContent = "试试更短的关键词，或切换其他资源分类。";
      empty.append(title, hint);
      resourceGrid.appendChild(empty);
      return;
    }

    const fragment = document.createDocumentFragment();
    filtered.forEach((item, index) => fragment.appendChild(createResourceCard(item, index)));
    resourceGrid.appendChild(fragment);
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return;
      } catch (_) {
        // Clipboard API 被权限策略拦截时，继续尝试兼容方案。
      }
    }
    const temporaryInput = document.createElement("textarea");
    temporaryInput.value = text;
    temporaryInput.setAttribute("readonly", "");
    temporaryInput.style.position = "fixed";
    temporaryInput.style.opacity = "0";
    document.body.appendChild(temporaryInput);
    temporaryInput.select();
    const success = document.execCommand("copy");
    temporaryInput.remove();
    if (!success) throw new Error("浏览器拒绝了复制操作");
  }

  categoryTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      activeCategory = tab.dataset.category;
      categoryTabs.forEach(item => {
        const selected = item === tab;
        item.classList.toggle("active", selected);
        item.setAttribute("aria-selected", String(selected));
      });
      renderResources();
    });
  });

  if (searchInput) searchInput.addEventListener("input", renderResources);
  resourceGrid.addEventListener("click", async event => {
    const button = event.target.closest("[data-copy-url]");
    if (!button) return;
    const originalText = button.childNodes[0]?.textContent || "复制脚本链接";
    try {
      await copyText(button.dataset.copyUrl);
      button.childNodes[0].textContent = "已复制链接";
      button.classList.add("copy-success");
      showToast("脚本链接已复制到剪贴板");
      window.setTimeout(() => {
        if (!button.isConnected) return;
        button.childNodes[0].textContent = originalText;
        button.classList.remove("copy-success");
      }, 1800);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "复制失败，请手动复制链接", true);
    }
  });

  if (menuToggle && navLinks) menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    menuToggle.setAttribute("aria-label", expanded ? "打开导航菜单" : "关闭导航菜单");
    navLinks.classList.toggle("open", !expanded);
  });

  if (navLinks) navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "打开导航菜单");
    });
  });

  document.addEventListener("keydown", event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      if (searchInput) { searchInput.focus(); searchInput.select(); }
    }
    if (event.key === "Escape" && navLinks.classList.contains("open")) {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "打开导航菜单");
    }
  });

  function setupRevealAndStats() {
    const revealElements = document.querySelectorAll(".reveal");
    if (reducedMotion || !("IntersectionObserver" in window)) {
      revealElements.forEach(element => element.classList.add("is-visible"));
      document.querySelectorAll("[data-stat]").forEach(animateStat);
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        entry.target.querySelectorAll("[data-stat]").forEach(animateStat);
        if (entry.target.matches("[data-stat]")) animateStat(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: .16 });
    revealElements.forEach(element => observer.observe(element));
    document.querySelectorAll("[data-stat]").forEach(element => {
      if (!element.closest(".reveal")) observer.observe(element);
    });
  }

  function setupScrollProgress() {
    const bar = document.getElementById("scrollProgress");
    let ticking = false;
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      bar.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
      ticking = false;
    };
    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });
    update();
  }

  function setupParticles() {
    if (reducedMotion) return;
    const canvas = document.getElementById("particleCanvas");
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;
    let width = 0;
    let height = 0;
    let particles = [];
    let frame = 0;
    const pointer = { x: -1000, y: -1000 };

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const amount = Math.min(58, Math.max(22, Math.floor(width / 24)));
      particles = Array.from({ length: amount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - .5) * .22,
        vy: (Math.random() - .5) * .22,
        radius: Math.random() * 1.4 + .45
      }));
    }

    function draw() {
      context.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < -5 || particle.x > width + 5) particle.vx *= -1;
        if (particle.y < -5 || particle.y > height + 5) particle.vy *= -1;
        const dx = particle.x - pointer.x;
        const dy = particle.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 115 && distance > 0) {
          particle.x += dx / distance * .12;
          particle.y += dy / distance * .12;
        }
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = "rgba(135, 190, 255, .58)";
        context.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j];
          const lineDistance = Math.hypot(particle.x - other.x, particle.y - other.y);
          if (lineDistance < 105) {
            context.beginPath();
            context.moveTo(particle.x, particle.y);
            context.lineTo(other.x, other.y);
            context.strokeStyle = `rgba(105, 163, 231, ${.105 * (1 - lineDistance / 105)})`;
            context.lineWidth = .7;
            context.stroke();
          }
        }
      }
      frame = requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", event => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    }, { passive: true });
    window.addEventListener("pointerleave", () => {
      pointer.x = -1000;
      pointer.y = -1000;
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(frame);
      else if (frame) frame = requestAnimationFrame(draw);
    });
    resize();
    frame = requestAnimationFrame(draw);
  }

  updateStats();
  renderResources();
  setupRevealAndStats();
  setupScrollProgress();
  setupParticles();
})();
