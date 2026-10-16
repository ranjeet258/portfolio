/**
 * Site behaviour: sidebar + theme, scroll-driven UI, vendor widgets,
 * the projects grid, the contact assistants and the hero AI chat.
 * Every block checks for its own elements, so the same file serves all pages.
 */
(function() {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  /**
   * Preloader. fx.js (loaded first) plays the animated intro when it's available.
   * Started as soon as the DOM is ready rather than on window load, so it never
   * waits on images or fonts.
   */
  const preloader = $('#preloader');
  if (preloader) {
    if (typeof window.fxIntro === 'function') window.fxIntro(preloader);
    else preloader.remove();
  }

  /**
   * Header toggle (mobile sidebar)
   */
  const header = $('#header');
  const headerToggleBtn = $('.header-toggle');

  function headerToggle() {
    header.classList.toggle('header-show');
    headerToggleBtn.classList.toggle('bi-list');
    headerToggleBtn.classList.toggle('bi-x');
  }
  if (header && headerToggleBtn) {
    headerToggleBtn.addEventListener('click', headerToggle);
  }

  /**
   * Theme toggle (dark/light). The saved theme is applied by an inline script
   * in <body> before first paint; this only syncs the icon and handles clicks.
   */
  const themeToggleBtn = $('#theme-toggle');
  const themeToggleIcon = $('#theme-toggle i');

  function syncThemeIcon(isLight) {
    if (!themeToggleIcon) return;
    themeToggleIcon.classList.toggle('bi-sun-fill', isLight);
    themeToggleIcon.classList.toggle('bi-moon-fill', !isLight);
  }
  syncThemeIcon(document.body.classList.contains('light-theme'));

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isLight = document.body.classList.toggle('light-theme');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
      syncThemeIcon(isLight);
    });
  }

  /**
   * Sidebar navigation
   */
  const navLinks = $$('#navmenu a');

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Close the mobile sidebar
      if (header && header.classList.contains('header-show')) headerToggle();

      // The hero chat hides the rest of the page; bring it back
      $$('main > section:not(#hero)').forEach(s => s.classList.remove('hidden'));
      const footer = $('#footer');
      if (footer) footer.classList.remove('hidden');
      document.body.style.overflow = '';
    });
  });

  /**
   * Navmenu scrollspy. Sections are looked up once and the check runs at most
   * once per frame, instead of querying the DOM on every scroll event.
   */
  const spied = navLinks
    .filter(link => link.hash)
    .map(link => ({ link, section: $(link.hash) }))
    .filter(item => item.section);

  function navmenuScrollspy() {
    const position = window.scrollY + 200;
    spied.forEach(({ link, section }) => {
      const inView = position >= section.offsetTop && position <= section.offsetTop + section.offsetHeight;
      link.classList.toggle('active', inView);
    });
  }

  if (spied.length) {
    let scrollQueued = false;
    document.addEventListener('scroll', () => {
      if (scrollQueued) return;
      scrollQueued = true;
      requestAnimationFrame(() => {
        scrollQueued = false;
        navmenuScrollspy();
      });
    }, { passive: true });
    window.addEventListener('load', navmenuScrollspy);
  }

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', () => {
    if (!window.location.hash) return;
    const section = $(window.location.hash);
    if (!section) return;
    setTimeout(() => {
      window.scrollTo({
        top: section.offsetTop - parseInt(getComputedStyle(section).scrollMarginTop),
        behavior: 'smooth'
      });
    }, 100);
  });

  /**
   * Animation on scroll
   */
  function aosInit() {
    if (!window.AOS) return;
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  aosInit();

  /**
   * Typed.js (hero role)
   */
  const typedEl = $('.typed');
  if (typedEl && window.Typed) {
    new Typed('.typed', {
      strings: typedEl.getAttribute('data-typed-items').split(','),
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * GLightbox (project image previews)
   */
  if (window.GLightbox) {
    GLightbox({ selector: '.glightbox' });
  }

  /**
   * Projects grid: Isotope layout, category filters and pagination.
   * "All" shows one page at a time; a category shows all of its projects.
   */
  $$('.isotope-layout').forEach(grid => {
    if (!window.Isotope) return;

    const filters = $$('.isotope-filters li', grid);
    const pageBtns = $$('.page-btn', grid);
    const pagination = $('#portfolio-pagination', grid);
    const isPageFilter = filter => /^\.page-\d+$/.test(filter);

    // Card images have a fixed height, so the layout doesn't need to wait for them
    const iso = new Isotope($('.isotope-container', grid), {
      itemSelector: '.isotope-item',
      layoutMode: grid.getAttribute('data-layout') ?? 'masonry',
      filter: grid.getAttribute('data-default-filter') ?? '*',
      sortBy: grid.getAttribute('data-sort') ?? 'original-order'
    });
    // Web fonts change how the card text wraps; lay out again once they are in
    window.addEventListener('load', () => iso.layout());
    if (document.fonts) document.fonts.ready.then(() => iso.layout());

    function highlightPage(page) {
      pageBtns.forEach(btn => {
        const current = btn.getAttribute('data-page') === page;
        btn.classList.toggle('bg-violet-600', current);
        btn.classList.toggle('text-white', current);
        btn.classList.toggle('text-zinc-400', !current);
      });
    }

    filters.forEach(filterBtn => {
      filterBtn.addEventListener('click', () => {
        const filter = filterBtn.getAttribute('data-filter');
        filters.forEach(f => f.classList.toggle('filter-active', f === filterBtn));
        iso.arrange({ filter });
        aosInit();

        if (!pagination) return;
        pagination.style.display = isPageFilter(filter) ? 'block' : 'none';
        if (isPageFilter(filter)) highlightPage(filter.replace('.page-', ''));
      });
    });

    pageBtns.forEach(pageBtn => {
      pageBtn.addEventListener('click', () => {
        const page = pageBtn.getAttribute('data-page');
        highlightPage(page);
        iso.arrange({ filter: '.page-' + page });

        // "All" now refers to the page being shown
        filters.forEach((f, i) => f.classList.toggle('filter-active', i === 0));
        if (filters[0]) filters[0].setAttribute('data-filter', '.page-' + page);
      });
    });
  });

  /**
   * Contact assistants. The floating widget and the Contact section run the
   * same four-step conversation (name, email, subject, message) and send the
   * result through Web3Forms.
   */
  const WEB3FORMS_URL = 'https://api.web3forms.com/submit';
  const WEB3FORMS_ACCESS_KEY = '2ef2f9d9-8993-488b-9f63-6d4745324ffc';
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const BOT_REPLY_DELAY = 400; // ms the typing indicator shows before a reply

  const CONTACT_STEPS = [
    {
      field: 'name',
      isValid: text => text.length >= 2,
      error: "Please enter a valid name (at least 2 characters).",
      nextPlaceholder: "Type your email...",
      reply: data => `Nice to meet you, ${data.name}! What is your email address so I can reply to you?`
    },
    {
      field: 'email',
      isValid: text => EMAIL_REGEX.test(text),
      error: "Please enter a valid email address (e.g. name@example.com).",
      nextPlaceholder: "Type subject...",
      reply: () => "Got it. What is the subject or purpose of your message?"
    },
    {
      field: 'subject',
      isValid: text => text.length >= 3,
      error: "Please enter a subject (at least 3 characters).",
      nextPlaceholder: "Type your message...",
      reply: () => "Perfect. Go ahead and type the message you'd like to send to me."
    },
    {
      field: 'message',
      isValid: () => true
    }
  ];

  function createContactFlow({ input, sendBtn, messages, typing, stepLabel, avatarClass, bubbleClass }) {
    if (!input || !messages) return;

    const data = {};
    let stepIndex = 0;

    // Messages are built from text nodes, never innerHTML: they echo what the visitor typed
    function append(sender, ...content) {
      const row = document.createElement('div');
      row.className = `chat-msg ${sender}-msg d-flex align-items-start gap-2`;
      const bubble = document.createElement('div');

      if (sender === 'user') {
        row.classList.add('justify-content-end');
        bubble.className = 'p-2.5 rounded-2xl bg-violet-600 text-white max-w-[80%] leading-relaxed';
      } else {
        const avatar = document.createElement('div');
        avatar.className = `w-7 h-7 rounded-full ${avatarClass} flex items-center justify-center text-[10px] text-violet-400 font-bold shrink-0`;
        avatar.textContent = 'AI';
        row.appendChild(avatar);
        bubble.className = `p-2.5 rounded-2xl ${bubbleClass} text-zinc-300 max-w-[80%] leading-relaxed`;
      }

      bubble.append(...content);
      row.appendChild(bubble);
      messages.appendChild(row);
      messages.scrollTop = messages.scrollHeight;
    }

    function setTyping(on) {
      if (!typing) return;
      typing.classList.toggle('hidden', !on);
      typing.classList.toggle('d-flex', on);
    }

    async function submit() {
      input.disabled = true;
      if (sendBtn) sendBtn.disabled = true;
      input.placeholder = "Sending message...";
      if (stepLabel) stepLabel.textContent = "Done";
      setTyping(true);

      try {
        const response = await fetch(WEB3FORMS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ access_key: WEB3FORMS_ACCESS_KEY, ...data })
        });
        const result = await response.json();
        if (result.success) {
          const email = document.createElement('strong');
          email.textContent = data.email;
          append('bot', "Thank you! Your message has been sent successfully. I will get in touch with you at ", email, ". Have a great day!");
        } else {
          append('bot', "Oops! Something went wrong while sending your message. Please try again later.");
        }
      } catch (err) {
        append('bot', "Oops! A network error occurred while sending your message. Please try again later.");
      }
      setTyping(false);
    }

    function handleSend() {
      const text = input.value.trim();
      if (!text) return;

      const step = CONTACT_STEPS[stepIndex];
      if (!step) return;
      if (!step.isValid(text)) {
        append('bot', step.error);
        return;
      }

      data[step.field] = text;
      append('user', text);
      input.value = '';
      stepIndex += 1;

      if (stepIndex === CONTACT_STEPS.length) {
        submit();
        return;
      }

      input.placeholder = step.nextPlaceholder;
      if (stepLabel) stepLabel.textContent = `Step ${stepIndex + 1} of ${CONTACT_STEPS.length}`;
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        append('bot', step.reply(data));
      }, BOT_REPLY_DELAY);
    }

    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.isComposing) handleSend();
    });
    if (sendBtn) sendBtn.addEventListener('click', handleSend);
  }

  // Floating widget
  createContactFlow({
    input: $('#chat-input'),
    sendBtn: $('#send-chat'),
    messages: $('#chat-messages'),
    typing: $('#typing-indicator'),
    avatarClass: 'bg-zinc-900/60 border border-zinc-800',
    bubbleClass: 'bg-zinc-900 border border-zinc-800/60'
  });

  // Contact section
  createContactFlow({
    input: $('#contact-chat-input'),
    sendBtn: $('#contact-chat-send'),
    messages: $('#contact-chat-messages'),
    typing: $('#contact-typing-indicator'),
    stepLabel: $('#contact-chat-step'),
    avatarClass: 'bg-zinc-800/80 border border-zinc-700',
    bubbleClass: 'bg-zinc-900/80 border border-zinc-800/60'
  });

  /**
   * Floating widget open/close
   */
  const chatLauncher = $('#chat-launcher');
  const chatLauncherIcon = $('#chat-launcher i');
  const chatWindow = $('#chat-window');
  const closeChatBtn = $('#close-chat-conv');

  function setChatWindowOpen(open) {
    chatWindow.classList.toggle('hidden', !open);
    chatWindow.classList.toggle('flex', open);
    if (chatLauncherIcon) {
      chatLauncherIcon.classList.toggle('bi-x-lg', open);
      chatLauncherIcon.classList.toggle('bi-chat-dots-fill', !open);
    }
  }

  if (chatLauncher && chatWindow) {
    chatLauncher.addEventListener('click', () => setChatWindowOpen(chatWindow.classList.contains('hidden')));
    if (closeChatBtn) closeChatBtn.addEventListener('click', () => setChatWindowOpen(false));
  }

  /**
   * Hero AI chat: answers stream from the chat backend (rag-backend/).
   */
  const heroSection = $('#hero');
  const heroIntro = $('#hero-intro');
  const heroInputContainer = $('#hero-input-container');
  const heroChatMessages = $('#hero-chat-messages');
  const heroChatInput = $('#hero-chat-input');
  const heroChatSend = $('#hero-chat-send');

  if (heroSection && heroChatMessages && heroChatInput) {
    // Uses the local server while developing
    const isLocal = ['localhost', '127.0.0.1', ''].includes(window.location.hostname);
    const CHAT_API_URL = isLocal ? 'http://localhost:7860' : 'https://portfolio-a8ne.onrender.com';
    const CHAT_FALLBACK = "Sorry, I couldn't reach the assistant right now. Please use the Contact section or email ranjeetgupta.work@gmail.com.";
    const CHAT_RATE_LIMITED = "You've sent a lot of messages in a short time. Please try again in a few minutes.";
    const CHAT_WAKING = "Waking up the assistant, one moment…";
    const SLOW_START_HINT_AFTER = 4000;   // ms without a first token before saying so
    const FIRST_TOKEN_TIMEOUT = 60000;    // ms before giving up (covers a cold-started host)

    const history = [];
    let chatOpen = false;
    let busy = false;

    // The backend host sleeps when idle. Wake it (and its model connection) as
    // the page loads, so it is ready by the time a question has been typed.
    const warmUp = () => fetch(`${CHAT_API_URL}/health`).catch(() => {});
    if ('requestIdleCallback' in window) requestIdleCallback(warmUp, { timeout: 2000 });
    else setTimeout(warmUp, 1);

    // Switch the hero into a full-screen chat
    function openChat() {
      chatOpen = true;

      $$('main > section:not(#hero)').forEach(s => s.classList.add('hidden'));
      const footer = $('#footer');
      if (footer) footer.classList.add('hidden');
      if (heroIntro) heroIntro.classList.add('hidden');

      // Lock the hero to the viewport so the input stays at the bottom
      heroSection.classList.remove('justify-center');
      heroSection.classList.add('h-screen', 'max-h-screen', 'overflow-hidden', 'justify-between');
      document.body.style.overflow = 'hidden';

      heroChatMessages.classList.remove('hidden');
      heroChatMessages.classList.add('flex');

      if (heroInputContainer) {
        heroInputContainer.classList.remove('mt-10');
        heroInputContainer.classList.add('mt-auto', 'mb-6', 'max-w-4xl');
      }

      setTimeout(() => heroChatInput.focus(), 100);
    }

    // Returns the text element so a reply can stream into it
    function appendMessage(sender, text = '') {
      const row = document.createElement('div');
      row.classList.add('flex', 'gap-4');
      const textEl = document.createElement('div');

      if (sender === 'user') {
        row.classList.add('flex-row-reverse');
        textEl.className = 'bg-[#1e1f20] px-5 py-3 rounded-3xl rounded-tr-sm text-zinc-200 text-base max-w-[85%] leading-relaxed whitespace-pre-wrap shadow-sm break-words';
      } else {
        textEl.className = 'flex-1 text-zinc-200 text-base leading-relaxed max-w-[100%] whitespace-pre-wrap pt-1 bot-text-content';
      }
      textEl.textContent = text;

      row.appendChild(textEl);
      heroChatMessages.appendChild(row);
      scrollToLatest();
      return textEl;
    }

    function scrollToLatest() {
      heroChatMessages.scrollTop = heroChatMessages.scrollHeight;
    }

    // Stream the answer into replyEl; resolves with the full text ('' on failure)
    async function fetchReply(question, replyEl) {
      const controller = new AbortController();
      const slowHint = setTimeout(() => { replyEl.textContent = CHAT_WAKING; }, SLOW_START_HINT_AFTER);
      const giveUp = setTimeout(() => controller.abort(), FIRST_TOKEN_TIMEOUT);
      const started = () => { clearTimeout(slowHint); clearTimeout(giveUp); };

      try {
        const res = await fetch(`${CHAT_API_URL}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: question.slice(0, 1000), history: history.slice(-12) }),
          signal: controller.signal
        });

        if (res.status === 429) return CHAT_RATE_LIMITED;
        if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let reply = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) return reply;
          started();
          reply += decoder.decode(value, { stream: true });
          replyEl.textContent = reply;
          scrollToLatest();
        }
      } catch (err) {
        console.error('Chat request failed:', err);
        return '';
      } finally {
        started();
      }
    }

    async function send(question) {
      const text = question.trim();
      if (!text || busy) return;

      appendMessage('user', text);
      const replyEl = appendMessage('bot', '…');
      busy = true;
      if (heroChatSend) heroChatSend.disabled = true;

      const answer = await fetchReply(text, replyEl);
      const reply = answer.trim() ? answer : CHAT_FALLBACK;
      replyEl.textContent = reply;
      scrollToLatest();

      if (reply !== CHAT_FALLBACK && reply !== CHAT_RATE_LIMITED) {
        history.push({ role: 'user', content: text }, { role: 'assistant', content: reply.slice(0, 2000) });
      }
      busy = false;
      if (heroChatSend) heroChatSend.disabled = false;
    }

    function submitInput() {
      const text = heroChatInput.value;
      heroChatInput.value = '';
      if (!chatOpen) openChat();
      send(text);
    }

    heroChatInput.addEventListener('keydown', e => {
      if (e.key !== 'Enter' || e.isComposing) return;
      e.preventDefault();
      submitInput();
    });
    if (heroChatSend) heroChatSend.addEventListener('click', submitInput);
  }

})();
