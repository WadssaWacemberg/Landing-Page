(() => {
  const savedTheme = localStorage.getItem("portfolio-theme");
  const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  document.documentElement.dataset.theme = savedTheme === "dark" || savedTheme === "light" ? savedTheme : preferredTheme;
})();

document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const year = document.getElementById("current-year");

  document.querySelectorAll("[data-language]").forEach((languageLink) => {
    languageLink.addEventListener("click", (event) => {
      const language = languageLink.dataset.language;
      if (!language) return;
      event.preventDefault();
      localStorage.setItem("portfolio-language", language);
      let target = new URL(languageLink.href, window.location.href);
      if (window.location.pathname.endsWith("portfolio.html")) target = new URL("portfolio.html", target);
      const sectionMap = {
        en: { "#inicio": "#home", "#competencias": "#skills", "#projetos": "#projects", "#experiencia": "#experience", "#contato": "#contact" },
        "pt-br": { "#home": "#inicio", "#skills": "#competencias", "#projects": "#projetos", "#experience": "#experiencia", "#contact": "#contato" }
      };
      target.hash = sectionMap[language]?.[window.location.hash] || window.location.hash;
      window.location.assign(target.href);
    });
  });

  if (year) year.textContent = String(new Date().getFullYear());

  const isPortuguese = document.documentElement.lang.toLowerCase().startsWith("pt");
  const languageSwitcher = document.querySelector(".language-switcher");
  if (languageSwitcher && !languageSwitcher.querySelector(".theme-toggle")) {
    const themeToggle = document.createElement("button");
    themeToggle.className = "theme-toggle";
    themeToggle.type = "button";
    const updateThemeToggle = () => {
      const isDark = document.documentElement.dataset.theme === "dark";
      themeToggle.textContent = isPortuguese ? (isDark ? "Claro" : "Escuro") : (isDark ? "Light" : "Dark");
      themeToggle.setAttribute("aria-label", isPortuguese ? (isDark ? "Ativar tema claro" : "Ativar tema escuro") : (isDark ? "Use light theme" : "Use dark theme"));
      themeToggle.setAttribute("aria-pressed", String(isDark));
    };
    themeToggle.addEventListener("click", () => {
      const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = nextTheme;
      localStorage.setItem("portfolio-theme", nextTheme);
      updateThemeToggle();
    });
    updateThemeToggle();
    languageSwitcher.append(themeToggle);
  }
  document.querySelectorAll(".section-index").forEach((label) => {
    label.textContent = label.textContent.replace(/^\s*\d+\s*\/\s*/, "");
  });
  document.querySelectorAll(".step-number, .project-id, .card-number, .learning-list small, .problem-book > section > span").forEach((number) => number.remove());
  document.querySelectorAll(".editorial-list a").forEach((link) => link.querySelector(":scope > small:first-child")?.remove());
  const resumeAside = document.querySelector(".resume-layout aside");
  const resumeBody = document.querySelector(".resume-body");
  if (resumeAside && resumeBody && !resumeBody.querySelector(".current-learning")) {
    const labels = [...resumeAside.querySelectorAll(".overline")];
    const learningLabel = labels.find((label) => /Aprendizado atual|Currently learning/i.test(label.textContent));
    const learningList = learningLabel?.nextElementSibling;
    if (learningLabel && learningList?.matches("ul")) {
      const section = document.createElement("section");
      section.className = "current-learning";
      const title = document.createElement("h2");
      title.textContent = "Currently Learning";
      section.append(title, learningList);
      learningLabel.remove();
      resumeBody.append(section);
    }
  }
  const mainContent = document.querySelector("main");
  if (mainContent && !document.querySelector(".skip-link")) {
    if (!mainContent.id) mainContent.id = "main-content";
    mainContent.setAttribute("tabindex", "-1");
    const skipLink = document.createElement("a");
    skipLink.className = "skip-link";
    skipLink.href = `#${mainContent.id}`;
    skipLink.textContent = isPortuguese ? "Ir para o conteúdo principal" : "Skip to main content";
    document.body.prepend(skipLink);
  }
  const path = window.location.pathname.toLowerCase().replaceAll("\\", "/");
  const menuTrigger = document.querySelector(".w-mark, .brand");

  if (menuTrigger) {
    menuTrigger.title = isPortuguese ? "Abrir índice completo do portfólio" : "Open the complete portfolio index";
    menuTrigger.setAttribute("aria-label", isPortuguese ? "Abrir índice completo do portfólio" : "Open the complete portfolio index");
    const languageRoot = new URL(menuTrigger.href, window.location.href);
    const menu = document.createElement("div");
    menu.className = "site-index";
    menu.hidden = true;
    menu.setAttribute("role", "dialog");
    menu.setAttribute("aria-modal", "true");
    menu.setAttribute("aria-label", isPortuguese ? "Índice do portfólio" : "Portfolio index");

    const items = isPortuguese
      ? [["Início", ""], ["Por que eu construo", "why-i-build/"], ["Inteligência Inclusiva", "inclusive-intelligence/"], ["Problemas que importam", "problems/"], ["Manifesto", "manifesto/"], ["Portfólio", "portfolio.html"], ["Currículo", "resume/"], ["Trabalhos", "work/"], ["Journal", "journal/"], ["Princípios", "principles/"], ["Aprendizado", "learning/"], ["Jornada", "journey/"]]
      : [["Home", ""], ["Why I Build", "why-i-build/"], ["Inclusive Intelligence", "inclusive-intelligence/"], ["Problems I Care About", "problems/"], ["Manifesto", "manifesto/"], ["Portfolio", "portfolio.html"], ["Résumé", "resume/"], ["Work", "work/"], ["Journal", "journal/"], ["Principles", "principles/"], ["Learning", "learning/"], ["Journey", "journey/"]];

    const panel = document.createElement("div");
    panel.className = "site-index-panel";
    const heading = document.createElement("p");
    heading.className = "site-index-heading";
    heading.textContent = isPortuguese ? "Índice" : "Index";
    const closeButton = document.createElement("button");
    closeButton.className = "site-index-close";
    closeButton.type = "button";
    closeButton.setAttribute("aria-label", isPortuguese ? "Fechar menu" : "Close menu");
    closeButton.textContent = "×";
    const navigation = document.createElement("nav");
    navigation.setAttribute("aria-label", isPortuguese ? "Capítulos" : "Chapters");
    items.forEach(([label, route], index) => {
      const link = document.createElement("a");
      link.href = new URL(route, languageRoot).href;
      link.innerHTML = `<span>${label}</span>`;
      navigation.append(link);
    });
    const socials = document.createElement("div");
    socials.className = "site-index-socials";
    const contact = document.createElement("a");
    contact.className = "site-index-contact";
    contact.href = "mailto:wadssa@gmail.com";
    contact.textContent = isPortuguese ? "E-mail ↗" : "Email ↗";
    const linkedIn = document.createElement("a");
    linkedIn.href = "https://www.linkedin.com/in/wadssa-wacemberg/";
    linkedIn.target = "_blank";
    linkedIn.rel = "noopener noreferrer";
    linkedIn.textContent = "LinkedIn ↗";
    const github = document.createElement("a");
    github.href = "https://github.com/WadssaWacemberg";
    github.target = "_blank";
    github.rel = "noopener noreferrer";
    github.textContent = "GitHub ↗";
    socials.append(contact, linkedIn, github);
    panel.append(heading, closeButton, navigation, socials);
    menu.append(panel);
    document.body.append(menu);

    const closeMenu = () => {
      menu.hidden = true;
      document.body.classList.remove("menu-open");
      menuTrigger.setAttribute("aria-expanded", "false");
      menuTrigger.focus();
    };
    const openMenu = () => {
      menu.hidden = false;
      document.body.classList.add("menu-open");
      menuTrigger.setAttribute("aria-expanded", "true");
      closeButton.focus();
    };
    menuTrigger.setAttribute("role", "button");
    menuTrigger.setAttribute("aria-haspopup", "dialog");
    menuTrigger.setAttribute("aria-expanded", "false");
    menuTrigger.addEventListener("click", (event) => { event.preventDefault(); openMenu(); });
    menuTrigger.addEventListener("keydown", (event) => {
      if (event.key === " ") { event.preventDefault(); openMenu(); }
    });
    closeButton.addEventListener("click", closeMenu);
    menu.addEventListener("click", (event) => { if (event.target === menu) closeMenu(); });
    document.addEventListener("keydown", (event) => {
      if (menu.hidden) return;
      if (event.key === "Escape") { closeMenu(); return; }
      if (event.key !== "Tab") return;
      const focusable = [...menu.querySelectorAll("a, button")];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });

    const header = menuTrigger.closest(".editorial-nav, .nav");
    const primaryItems = isPortuguese
      ? [["Início", ""], ["Por que eu construo", "why-i-build/"], ["Princípios", "principles/"], ["Journal", "journal/"], ["Trabalhos", "work/"], ["Currículo", "resume/"], ["Contato", "portfolio.html#contato"]]
      : [["Home", ""], ["Why I Build", "why-i-build/"], ["Principles", "principles/"], ["Journal", "journal/"], ["Work", "work/"], ["Resume", "resume/"], ["Contact", "portfolio.html#contact"]];
    if (header) {
      const existingNavigation = header.querySelector(":scope > nav");
      const globalLinks = existingNavigation || document.createElement("div");
      globalLinks.className = existingNavigation ? "primary-links" : "global-links";
      globalLinks.replaceChildren();
      primaryItems.forEach(([label, route]) => {
        const link = document.createElement("a");
        link.href = new URL(route, languageRoot).href;
        link.textContent = label;
        const routeName = route.replaceAll("/", "");
        if ((!route && path === languageRoot.pathname) || (routeName && path.includes(routeName))) link.setAttribute("aria-current", "page");
        globalLinks.append(link);
      });
      if (!existingNavigation) menuTrigger.insertAdjacentElement("afterend", globalLinks);
      header.classList.add("has-global-nav");

    }

    const pageSequence = isPortuguese
      ? [["Início", ""], ["Por que eu construo", "why-i-build/"], ["Inteligência Inclusiva", "inclusive-intelligence/"], ["Problemas que importam", "problems/"], ["Manifesto", "manifesto/"], ["Portfólio", "portfolio.html"], ["Currículo", "resume/"], ["Trabalhos", "work/"], ["Journal", "journal/"], ["Princípios", "principles/"], ["Aprendizado", "learning/"], ["Jornada", "journey/"]]
      : [["Home", ""], ["Why I Build", "why-i-build/"], ["Inclusive Intelligence", "inclusive-intelligence/"], ["Problems I Care About", "problems/"], ["Manifesto", "manifesto/"], ["Portfolio", "portfolio.html"], ["Resume", "resume/"], ["Work", "work/"], ["Journal", "journal/"], ["Principles", "principles/"], ["Learning", "learning/"], ["Journey", "journey/"]];
    const normalizedPath = path.endsWith("/index.html") ? path.slice(0, -10) : path;
    const currentPageIndex = pageSequence.findIndex(([, route]) => {
      const target = new URL(route, languageRoot).pathname.toLowerCase().replace(/index\.html$/, "");
      return normalizedPath === target;
    });
    if (currentPageIndex > 0 && !document.body.classList.contains("case-page")) {
      document.querySelectorAll(".book-next").forEach((navigation) => navigation.remove());
      const previous = pageSequence[currentPageIndex - 1];
      const next = pageSequence[(currentPageIndex + 1) % pageSequence.length];
      const pageNavigation = document.createElement("nav");
      pageNavigation.className = "page-turn container";
      pageNavigation.setAttribute("aria-label", isPortuguese ? "Navegação entre páginas" : "Page navigation");
      const createPageLink = (item, direction) => {
        const link = document.createElement("a");
        link.href = new URL(item[1], languageRoot).href;
        link.className = `page-turn-link page-turn-${direction}`;
        const label = document.createElement("span");
        label.textContent = direction === "previous"
          ? (isPortuguese ? "Página anterior" : "Previous page")
          : (isPortuguese ? "Próxima página" : "Next page");
        const arrow = document.createElement("strong");
        arrow.className = "page-turn-arrow";
        arrow.setAttribute("aria-hidden", "true");
        arrow.textContent = direction === "previous" ? "←" : "→";
        const title = document.createElement("b");
        title.textContent = item[0];
        link.append(label, arrow, title);
        return link;
      };
      pageNavigation.append(createPageLink(previous, "previous"), createPageLink(next, "next"));
      document.querySelector("main")?.insertAdjacentElement("afterend", pageNavigation);
    }
  }
  if (!document.querySelector(".site-footer")) {
    const trigger = document.querySelector(".w-mark, .brand");
    const root = trigger ? new URL(trigger.href, window.location.href) : new URL("./", window.location.href);
    const footer = document.createElement("footer");
    footer.className = "site-footer container";
    const signature = document.createElement("span");
    signature.textContent = "Wadssa Wacemberg";
    const links = document.createElement("nav");
    links.setAttribute("aria-label", isPortuguese ? "Contato e perfis" : "Contact and profiles");
    [["E-mail", "mailto:wadssa@gmail.com", false], ["LinkedIn", "https://www.linkedin.com/in/wadssa-wacemberg/", true], ["GitHub", "https://github.com/WadssaWacemberg", true], [isPortuguese ? "Currículo" : "Résumé", new URL("resume/", root).href, false]].forEach(([label, href, external]) => {
      const link = document.createElement("a");
      link.href = href;
      link.textContent = external ? `${label} ↗` : label;
      if (external) { link.target = "_blank"; link.rel = "noopener noreferrer"; }
      links.append(link);
    });
    footer.append(signature, links);
    document.body.append(footer);
  }
  const coverActions = null;
  const philosophyDefinition = document.querySelector(".philosophy-definition");
  if (philosophyDefinition && !philosophyDefinition.querySelector(".system-responsibility")) {
    const responsibility = document.createElement("p");
    responsibility.className = "system-responsibility";
    responsibility.textContent = isPortuguese
      ? "O problema não é a pessoa não entender o sistema. É o sistema que nunca foi feito para ela."
      : "The problem is not that a person cannot understand the system. It is that the system was never designed for them."
    philosophyDefinition.append(responsibility);
  }
  const humanitySection = document.querySelector(".home-humanity > div");
  if (humanitySection && !humanitySection.querySelector(".physical-data")) {
    const currentApplication = humanitySection.querySelector("p:nth-of-type(3)");
    const physicalData = document.createElement("p");
    physicalData.className = "physical-data";
    physicalData.innerHTML = isPortuguese
  ? '<span class="signature"> "𝐸𝑢 𝑒𝑛𝑡𝑒𝑛𝑑𝑜 𝑐𝑜𝑚𝑜 𝑜𝑠 𝑑𝑎𝑑𝑜𝑠 𝑣𝑖𝑎𝑗𝑎𝑚 𝑓í𝑠𝑖𝑐𝑎𝑚𝑒𝑛𝑡𝑒 𝑎𝑛𝑡𝑒𝑠 𝑑𝑒 𝑠𝑒 𝑡𝑜𝑟𝑛𝑎𝑟 𝑐ó𝑑𝑖𝑔𝑜."</span>'
  : '<span class="signature"> "𝐼 𝑢𝑛𝑑𝑒𝑟𝑠𝑡𝑎𝑛𝑑 ℎ𝑜𝑤 𝑑𝑎𝑡𝑎 𝑡𝑟𝑎𝑣𝑒𝑙𝑠 𝑝ℎ𝑦𝑠𝑖𝑐𝑎𝑙𝑙𝑦 𝑏𝑒𝑓𝑜𝑟𝑒 𝑖𝑡 𝑒𝑣𝑒𝑟 𝑏𝑒𝑐𝑜𝑚𝑒𝑠 𝑐𝑜𝑑𝑒." </span>';
    currentApplication?.insertAdjacentElement("beforebegin", physicalData);
  }
  if (coverActions && !coverActions.querySelector('[href*="why-i-build"]')) {
    const whyLink = document.createElement("a");
    whyLink.href = "./why-i-build/";
    whyLink.textContent = isPortuguese ? "Por que eu construo →" : "Why I Build →";
    coverActions.prepend(whyLink);
  }
  const documentIntro = document.querySelector(".text-home .document-intro");
  if (documentIntro) {
    const soulLinks = document.createElement("nav");
    soulLinks.className = "soul-links";
    soulLinks.setAttribute("aria-label", isPortuguese ? "Filosofia de engenharia" : "Engineering philosophy");
    const chapters = isPortuguese
      ? [["Por que eu construo", "why-i-build/"], ["Inteligência Inclusiva", "inclusive-intelligence/"], ["Problemas que importam", "problems/"], ["Manifesto", "manifesto/"]]
      : [["Why I Build", "why-i-build/"], ["Inclusive Intelligence", "inclusive-intelligence/"], ["Problems I Care About", "problems/"], ["Manifesto", "manifesto/"]];
    chapters.forEach(([label, route]) => {
      const link = document.createElement("a");
      link.href = new URL(route, new URL("./", window.location.href)).href;
      link.textContent = `${label} →`;
      soulLinks.append(link);
    });
    documentIntro.insertAdjacentElement("afterend", soulLinks);
  }
  const caseStudyRoutes = isPortuguese
    ? { ClientHub: "./projects/clienthub/", FreshFood: "./projects/freshfood/", "Blog Pessoal": "./projects/blog-pessoal/", "Pet Drive": "./projects/pet-drive/" }
    : { ClientHub: "./projects/clienthub/", FreshFood: "./projects/freshfood/", "Personal Blog": "./projects/personal-blog/", "Pet Drive": "./projects/pet-drive/" };

  document.querySelectorAll(".project").forEach((project) => {
    const title = project.querySelector("h3")?.textContent.trim();
    const links = project.querySelector(".project-links");
    const route = title ? caseStudyRoutes[title] : null;
    if (!links || !route) return;
    const caseLink = document.createElement("a");
    caseLink.href = route;
    caseLink.className = "case-link";
    caseLink.textContent = isPortuguese ? "Ver estudo de caso →" : "View case study →";
    links.prepend(caseLink);
  });

  const projectMedia = isPortuguese
    ? {
        ClientHub: { type: "video", src: "../assets/media/clienthub-presentation.mp4", label: "Prévia em vídeo do ClientHub" },
        FreshFood: { type: "image", src: "../assets/img/freshfood.jpg", alt: "Capa do projeto FreshFood com vegetais e tecnologias utilizadas" },
        "Blog Pessoal": { type: "image", src: "../assets/img/blog.png", alt: "Interface do projeto Blog Pessoal" },
        "Pet Drive": { type: "video", src: "../assets/media/pet-drive-presentation.mp4", label: "Prévia em vídeo do Pet Drive" }
      }
    : {
        ClientHub: { type: "video", src: "../assets/media/clienthub-presentation.mp4", label: "ClientHub video preview" },
        FreshFood: { type: "image", src: "../assets/img/freshfood.jpg", alt: "FreshFood project cover featuring vegetables and the technology stack" },
        "Personal Blog": { type: "image", src: "../assets/img/blog.png", alt: "Personal Blog project interface" },
        "Pet Drive": { type: "video", src: "../assets/media/pet-drive-presentation.mp4", label: "Pet Drive video preview" }
      };

  document.querySelectorAll(".project").forEach((project) => {
    const title = project.querySelector("h3")?.textContent.trim();
    const body = project.querySelector(".project-body");
    const media = title ? projectMedia[title] : null;
    if (!body || !media) return;
    const frame = document.createElement("div");
    frame.className = "project-media";
    if (media.type === "video") {
      const video = document.createElement("video");
      video.src = media.src;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.autoplay = !reduceMotion;
      video.preload = "metadata";
      video.controls = true;
      video.setAttribute("aria-label", media.label);
      frame.append(video);
    } else {
      const image = document.createElement("img");
      image.src = media.src;
      image.alt = media.alt;
      image.loading = "lazy";
      image.width = 1200;
      image.height = 675;
      frame.append(image);
    }
    body.prepend(frame);
  });

  const caseVideoData = path.includes("clienthub")
    ? { src: "../../../assets/media/clienthub-presentation.mp4", label: isPortuguese ? "Apresentação em vídeo do ClientHub" : "ClientHub video presentation" }
    : path.includes("pet-drive")
      ? { src: "../../../assets/media/pet-drive-presentation.mp4", label: isPortuguese ? "Apresentação em vídeo do Pet Drive" : "Pet Drive video presentation" }
      : null;

  if (caseVideoData && document.body.classList.contains("case-page")) {
    const lead = document.querySelector(".case-lead");
    if (lead) {
      const frame = document.createElement("div");
      frame.className = "case-video";
      const video = document.createElement("video");
      video.src = caseVideoData.src;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.autoplay = !reduceMotion;
      video.controls = true;
      video.preload = "metadata";
      video.setAttribute("aria-label", caseVideoData.label);
      frame.append(video);
      lead.insertAdjacentElement("afterend", frame);
    }
  }

  const resourceLinks = [
    { match: /clienthub/i, label: /pdf|full pdf/i, href: path.includes("/projects/") ? "../../../assets/documents/clienthub-case-study.pdf" : "../assets/documents/clienthub-case-study.pdf", download: true },
    { match: /clienthub/i, label: /v.deo|video|presentation video/i, href: path.includes("/projects/") ? "../../../assets/media/clienthub-presentation.mp4" : "../assets/media/clienthub-presentation.mp4" },
    { match: /freshfood/i, label: /aplica..o|live app|deploy/i, href: "https://fresh-food-front.vercel.app/", external: true },
    { match: /blog|personal-blog/i, label: /aplica..o|live app|deploy/i, href: "https://blog-pessoal-react-omega.vercel.app/", external: true },
    { match: /pet-drive|pet drive/i, label: /pdf/i, href: path.includes("/projects/") ? "../../../assets/documents/pet-drive-case-study.pdf" : "../assets/documents/pet-drive-case-study.pdf", download: true },
    { match: /pet-drive|pet drive/i, label: /v.deo|video/i, href: path.includes("/projects/") ? "../../../assets/media/pet-drive-presentation.mp4" : "../assets/media/pet-drive-presentation.mp4" },
    { match: /clienthub|freshfood|blog|personal-blog|pet-drive|pet drive/i, label: /linkedin/i, href: "https://www.linkedin.com/in/wadssa-wacemberg/", external: true }
  ];

  const pageContext = `${path} ${document.querySelector("h1")?.textContent || ""}`;
  document.querySelectorAll(".project-links span, .resource-grid span").forEach((placeholder) => {
    const projectTitle = placeholder.closest(".project")?.querySelector("h3")?.textContent || "";
    const resourceContext = projectTitle || pageContext;
    const resource = resourceLinks.find((item) => item.match.test(resourceContext) && item.label.test(placeholder.textContent));
    if (!resource) return;
    const link = document.createElement("a");
    link.href = resource.href;
    link.textContent = placeholder.textContent.replace(/\s*[—–-]\s*(adicionar link|link coming soon|when available).*$/i, " ↗");
    if (resource.download) link.download = "";
    if (resource.external) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    placeholder.replaceWith(link);
  });

  const repositorySets = {
    freshfood: [
      ["GitHub · Front-end", "https://github.com/WadssaWacemberg/FreshFood_Front"],
      ["GitHub · Back-end", "https://github.com/WadssaWacemberg/FreshFood_Back"]
    ],
    blog: [
      [isPortuguese ? "GitHub · Front-end React" : "GitHub · React front end", "https://github.com/WadssaWacemberg/Blog_Pessoal_React"],
      [isPortuguese ? "GitHub · API" : "GitHub · API", "https://github.com/WadssaWacemberg/blogpessoal"]
    ]
  };

  const addRepositoryLinks = (container, set) => {
    if (!container || !set) return;
    container.querySelectorAll("span, a").forEach((item) => {
      if (/github/i.test(item.textContent)) item.remove();
    });
    set.forEach(([label, href]) => {
      const link = document.createElement("a");
      link.href = href;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = `${label} ↗`;
      container.append(link);
    });
  };

  document.querySelectorAll(".project").forEach((project) => {
    const title = project.querySelector("h3")?.textContent.toLowerCase() || "";
    const set = title.includes("freshfood") ? repositorySets.freshfood : title.includes("blog") ? repositorySets.blog : null;
    addRepositoryLinks(project.querySelector(".project-links"), set);
  });

  if (document.body.classList.contains("case-page")) {
    const set = path.includes("freshfood") ? repositorySets.freshfood : /blog-pessoal|personal-blog/.test(path) ? repositorySets.blog : null;
    addRepositoryLinks(document.querySelector(".resource-grid"), set);
  }

  if (document.body.classList.contains("case-page")) {
    const projects = isPortuguese
      ? [["ClientHub", "clienthub/"], ["FreshFood", "freshfood/"], ["Blog Pessoal", "blog-pessoal/"], ["Pet Drive", "pet-drive/"]]
      : [["ClientHub", "clienthub/"], ["FreshFood", "freshfood/"], ["Personal Blog", "personal-blog/"], ["Pet Drive", "pet-drive/"]];
    const currentIndex = projects.findIndex(([, route]) => path.includes(`/projects/${route}`));
    if (currentIndex >= 0) {
      const projectRoot = new URL("projects/", languageRoot);
      const sequence = document.createElement("nav");
      sequence.className = "project-sequence";
      sequence.setAttribute("aria-label", isPortuguese ? "Navegação entre projetos" : "Project navigation");
      const previous = projects[currentIndex - 1];
      const next = projects[currentIndex + 1];
      if (previous) {
        const link = document.createElement("a");
        link.href = new URL(previous[1], projectRoot).href;
        link.innerHTML = `<small>${isPortuguese ? "Anterior" : "Previous"}</small><strong>← ${previous[0]}</strong>`;
        sequence.append(link);
      } else {
        const link = document.createElement("a");
        link.href = new URL("work/", languageRoot).href;
        link.innerHTML = `<small>${isPortuguese ? "Anterior" : "Previous"}</small><strong>← ${isPortuguese ? "Trabalhos" : "Work"}</strong>`;
        sequence.append(link);
      }
      const all = document.createElement("a");
      all.className = "all-work";
      all.href = new URL("work/", languageRoot).href;
      all.textContent = isPortuguese ? "Todos os trabalhos" : "All work";
      sequence.append(all);
      if (next) {
        const link = document.createElement("a");
        link.href = new URL(next[1], projectRoot).href;
        link.innerHTML = `<small>${isPortuguese ? "Próximo" : "Next"}</small><strong>${next[0]} →</strong>`;
        sequence.append(link);
      } else {
        const link = document.createElement("a");
        link.href = new URL("work/", languageRoot).href;
        link.innerHTML = `<small>${isPortuguese ? "Próximo" : "Next"}</small><strong>${isPortuguese ? "Trabalhos" : "Work"} →</strong>`;
        sequence.append(link);
      }
      document.querySelector(".case-main")?.append(sequence);
    }
  }

  if (path.includes("freshfood") && document.querySelector(".resource-grid")) {
    const grid = document.querySelector(".resource-grid");
    const pdf = document.createElement("a");
    pdf.href = "../../../assets/documents/freshfood-case-study.pdf";
    pdf.download = "";
    pdf.textContent = isPortuguese ? "PDF do projeto ↓" : "Project PDF ↓";
    grid.prepend(pdf);
  }

  const revealItems = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  }

  if (!reduceMotion && hasFinePointer) {
    const cards = document.querySelectorAll(".interactive-card");
    const ambientLight = document.querySelector(".ambient-light");
    let frameId = 0;
    let pointerX = 0;
    let pointerY = 0;
    let activeCard = null;

    cards.forEach((card) => {
      card.addEventListener("pointerenter", () => { activeCard = card; });
      card.addEventListener("pointerleave", () => { if (activeCard === card) activeCard = null; });
    });

    document.addEventListener("pointermove", (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (frameId) return;
      frameId = window.requestAnimationFrame(() => {
        if (ambientLight) {
          ambientLight.style.setProperty("--cursor-x", `${pointerX}px`);
          ambientLight.style.setProperty("--cursor-y", `${pointerY}px`);
        }
        if (activeCard) {
          const bounds = activeCard.getBoundingClientRect();
          activeCard.style.setProperty("--mouse-x", `${pointerX - bounds.left}px`);
          activeCard.style.setProperty("--mouse-y", `${pointerY - bounds.top}px`);
        }
        frameId = 0;
      });
    }, { passive: true });
  }
});
