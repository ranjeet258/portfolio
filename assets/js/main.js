
(function() {
  "use strict";

  /**
   * Header toggle
   */
  const headerToggleBtn = document.querySelector('.header-toggle');

  function headerToggle() {
    document.querySelector('#header').classList.toggle('header-show');
    headerToggleBtn.classList.toggle('bi-list');
    headerToggleBtn.classList.toggle('bi-x');
  }
  headerToggleBtn.addEventListener('click', headerToggle);

  /**
   * Theme Toggle (Dark/Light Mode)
   */
  const themeToggleBtn = document.querySelector('#theme-toggle');
  const themeToggleIcon = document.querySelector('#theme-toggle i');

  // Check saved theme and set correct icon state
  if (localStorage.getItem('theme') === 'light' && themeToggleIcon) {
    themeToggleIcon.classList.replace('bi-moon-fill', 'bi-sun-fill');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      const isLight = document.body.classList.contains('light-theme');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
      
      if (themeToggleIcon) {
        if (isLight) {
          themeToggleIcon.classList.replace('bi-moon-fill', 'bi-sun-fill');
        } else {
          themeToggleIcon.classList.replace('bi-sun-fill', 'bi-moon-fill');
        }
      }
    });
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.header-show')) {
        headerToggle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init typed.js
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function(direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  // Allow sidebar navigation to work even if chat has hidden sections
  document.querySelectorAll('.navmenu a').forEach(link => {
    link.addEventListener('click', () => {
      // If chat hid the sections, restore them
      document.querySelectorAll('main > section:not(#hero)').forEach(s => s.classList.remove('hidden'));
      const footer = document.querySelector('#footer');
      if (footer) footer.classList.remove('hidden');
      
      // Restore scrolling
      document.body.style.overflow = '';
    });
  });

  /**
   * Chatbot Widget Interactivity & Mock Response
   */
  const chatLauncher = document.querySelector('#chat-launcher');
  const chatLauncherIcon = document.querySelector('#chat-launcher i');
  const chatWindow = document.querySelector('#chat-window');
  
  // Views
  const chatHomeView = document.querySelector('#chat-home-view');
  const chatConvView = document.querySelector('#chat-conv-view');
  
  // View 1 (Home) Buttons
  const btnStartChat = document.querySelector('#btn-start-chat');
  const btnSendMsg = document.querySelector('#btn-send-msg');
  const btnViewSkills = document.querySelector('#btn-view-skills');
  const btnViewProjects = document.querySelector('#btn-view-projects');
  const closeChatHome = document.querySelector('#close-chat-home');
  
  // View 2 (Conversation) Buttons
  const chatBack = document.querySelector('#chat-back');
  const closeChatConv = document.querySelector('#close-chat-conv');
  
  // Chat inputs / messages
  const chatInput = document.querySelector('#chat-input');
  const sendChat = document.querySelector('#send-chat');
  const chatMessages = document.querySelector('#chat-messages');
  const typingIndicator = document.querySelector('#typing-indicator');

  // Utility to close the chatbot panel
  function closeChatbot() {
    if (chatWindow) {
      chatWindow.classList.remove('flex');
      chatWindow.classList.add('hidden');
    }
    if (chatLauncherIcon) {
      chatLauncherIcon.classList.replace('bi-x-lg', 'bi-chat-dots-fill');
    }
  }

  // Toggle chat window open/close
  if (chatLauncher && chatWindow) {
    chatLauncher.addEventListener('click', () => {
      const isHidden = chatWindow.classList.contains('hidden');
      if (isHidden) {
        chatWindow.classList.remove('hidden');
        chatWindow.classList.add('flex');
        chatLauncherIcon.classList.replace('bi-chat-dots-fill', 'bi-x-lg');
        
        // Always open to Support Home Screen initially
        if (chatHomeView && chatConvView) {
          chatHomeView.classList.remove('hidden');
          chatHomeView.classList.add('flex');
          chatConvView.classList.remove('flex');
          chatConvView.classList.add('hidden');
        }
      } else {
        closeChatbot();
      }
    });
  }

  // Close buttons bindings
  if (closeChatHome) {
    closeChatHome.addEventListener('click', closeChatbot);
  }
  if (closeChatConv) {
    closeChatConv.addEventListener('click', closeChatbot);
  }

  // Back button binding (Conv View -> Home View)
  if (chatBack && chatHomeView && chatConvView) {
    chatBack.addEventListener('click', () => {
      chatConvView.classList.remove('flex');
      chatConvView.classList.add('hidden');
      chatHomeView.classList.remove('hidden');
      chatHomeView.classList.add('flex');
    });
  }

  // Transition to Chat View
  if (btnStartChat && chatHomeView && chatConvView) {
    btnStartChat.addEventListener('click', () => {
      chatHomeView.classList.remove('flex');
      chatHomeView.classList.add('hidden');
      chatConvView.classList.remove('hidden');
      chatConvView.classList.add('flex');
      if (chatInput) {
        chatInput.focus();
      }
    });
  }

  // Helper for scroll shortcuts
  function scrollShortcut(selector) {
    closeChatbot();
    const target = document.querySelector(selector);
    if (target) {
      setTimeout(() => {
        const scrollMarginTop = getComputedStyle(target).scrollMarginTop;
        window.scrollTo({
          top: target.offsetTop - parseInt(scrollMarginTop || 0),
          behavior: 'smooth'
        });
      }, 150); // slight delay so the widget transition finishes smoothly
    }
  }

  // Bind scrolling shortcuts
  if (btnSendMsg) {
    btnSendMsg.addEventListener('click', () => scrollShortcut('#contact'));
  }
  if (btnViewSkills) {
    btnViewSkills.addEventListener('click', () => scrollShortcut('#skills'));
  }
  if (btnViewProjects) {
    btnViewProjects.addEventListener('click', () => scrollShortcut('#portfolio'));
  }

  // Handle message sending
  function appendMessage(sender, text) {
    if (!chatMessages) return;
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chat-msg', `${sender}-msg`, 'd-flex', 'align-items-start', 'gap-2');
    
    if (sender === 'user') {
      msgDiv.classList.add('justify-content-end');
      msgDiv.innerHTML = `
        <div class="p-2.5 rounded-2xl bg-violet-600 text-white max-w-[80%] leading-relaxed">
          ${text}
        </div>
      `;
    } else {
      msgDiv.innerHTML = `
        <div class="w-7 h-7 rounded-full bg-zinc-900/60 border border-zinc-800 flex items-center justify-center text-[10px] text-violet-400 font-bold shrink-0">AI</div>
        <div class="p-2.5 rounded-2xl bg-zinc-900 border border-zinc-800/60 text-zinc-300 max-w-[80%] leading-relaxed">
          ${text}
        </div>
      `;
    }
    
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function handleSend() {
    if (!chatInput) return;
    const text = chatInput.value.trim();
    if (!text) return;

    appendMessage('user', text);
    chatInput.value = '';

    // Show typing indicator
    if (typingIndicator) {
      typingIndicator.classList.remove('hidden');
      typingIndicator.classList.add('d-flex');
    }

    // Mock answer generation (simulate delay)
    setTimeout(() => {
      if (typingIndicator) {
        typingIndicator.classList.remove('d-flex');
        typingIndicator.classList.add('hidden');
      }

      // Generate context-aware mock responses based on keywords
      let reply = "That's a great question! Ranjeet has built the front-end layout for this chatbot. You can easily connect a RAG backend pipeline here to answer detailed queries from a custom knowledge base about him.";
      const query = text.toLowerCase();
      
      if (query.includes('project') || query.includes('patent')) {
        reply = "Ranjeet has worked on several advanced projects and patents. These include a Multimodal AI System (integrating computer vision and speech recognition), a Locomotion Control System, and a Cost Analytics Dashboard. You can see details of these under the 'Projects' section!";
      } else if (query.includes('skill') || query.includes('tech') || query.includes('language')) {
        reply = "Ranjeet is highly skilled in Python, SQL, PyTorch, TensorFlow, MLOps (Docker, Kubernetes), Generative AI (LangChain, LangGraph), and Data Engineering. Check out the 'Skills' section on the page to see them grouped in detail!";
      } else if (query.includes('education') || query.includes('college') || query.includes('study') || query.includes('nit')) {
        reply = "Ranjeet is currently pursuing a Bachelor of Technology in AI and Data Science at the National Institute of Technology, Jamshedpur (Graduation: June 2027). He also holds stellar academic marks in JAC Ranchi and JAC Barhi.";
      } else if (query.includes('experience') || query.includes('intern') || query.includes('work')) {
        reply = "Ranjeet has experience as a Research Intern at IIT Hyderabad (working on data-driven locomotion modeling) and as a Data Analyst Intern at Gargs Engineering Limited. He is also the Co-Founder of the AI and Automation Club at NIT JSR.";
      }

      appendMessage('bot', reply);
    }, 1200);
  }

  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        handleSend();
      }
    });
  }

  if (sendChat) {
    sendChat.addEventListener('click', handleSend);
  }

  /**
   * Conversational Contact Chat Interface Logic
   */
  const contactInput = document.querySelector('#contact-chat-input');
  const contactSend = document.querySelector('#contact-chat-send');
  const contactMessages = document.querySelector('#contact-chat-messages');
  const contactStep = document.querySelector('#contact-chat-step');
  const contactIndicator = document.querySelector('#contact-typing-indicator');

  let contactStepNum = 1;
  let contactData = { name: '', email: '', subject: '', message: '' };

  function appendContactMsg(sender, text) {
    if (!contactMessages) return;
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chat-msg', `${sender}-msg`, 'd-flex', 'align-items-start', 'gap-2');
    
    if (sender === 'user') {
      msgDiv.classList.add('justify-content-end');
      msgDiv.innerHTML = `
        <div class="p-2.5 rounded-2xl bg-violet-600 text-white max-w-[80%] leading-relaxed">
          ${text}
        </div>
      `;
    } else {
      msgDiv.innerHTML = `
        <div class="w-7 h-7 rounded-full bg-zinc-800/80 border border-zinc-700 flex items-center justify-center text-[10px] text-violet-400 font-bold shrink-0">AI</div>
        <div class="p-2.5 rounded-2xl bg-zinc-900/80 border border-zinc-800/60 text-zinc-300 max-w-[80%] leading-relaxed">
          ${text}
        </div>
      `;
    }
    
    contactMessages.appendChild(msgDiv);
    contactMessages.scrollTop = contactMessages.scrollHeight;
  }

  function handleContactSend() {
    if (!contactInput) return;
    const text = contactInput.value.trim();
    if (!text) return;

    if (contactStepNum === 1) {
      if (text.length < 2) {
        appendContactMsg('bot', "Please enter a valid name (at least 2 characters).");
        return;
      }
      contactData.name = text;
      appendContactMsg('user', text);
      contactInput.value = '';
      contactStepNum = 2;
      if (contactStep) contactStep.textContent = "Step 2 of 4";
      contactInput.placeholder = "Type your email...";
      
      showContactTyping();
      setTimeout(() => {
        hideContactTyping();
        appendContactMsg('bot', `Nice to meet you, ${contactData.name}! What is your email address so I can reply to you?`);
      }, 1000);

    } else if (contactStepNum === 2) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(text)) {
        appendContactMsg('bot', "Please enter a valid email address (e.g. name@example.com).");
        return;
      }
      contactData.email = text;
      appendContactMsg('user', text);
      contactInput.value = '';
      contactStepNum = 3;
      if (contactStep) contactStep.textContent = "Step 3 of 4";
      contactInput.placeholder = "Type subject...";
      
      showContactTyping();
      setTimeout(() => {
        hideContactTyping();
        appendContactMsg('bot', "Got it. What is the subject or purpose of your message?");
      }, 1000);

    } else if (contactStepNum === 3) {
      if (text.length < 3) {
        appendContactMsg('bot', "Please enter a subject (at least 3 characters).");
        return;
      }
      contactData.subject = text;
      appendContactMsg('user', text);
      contactInput.value = '';
      contactStepNum = 4;
      if (contactStep) contactStep.textContent = "Step 4 of 4";
      contactInput.placeholder = "Type your message...";
      
      showContactTyping();
      setTimeout(() => {
        hideContactTyping();
        appendContactMsg('bot', "Perfect. Go ahead and type the message you'd like to send to me.");
      }, 1000);

    } else if (contactStepNum === 4) {
      contactData.message = text;
      appendContactMsg('user', text);
      contactInput.value = '';
      contactInput.disabled = true;
      if (contactSend) contactSend.disabled = true;
      contactInput.placeholder = "Sending message...";
      if (contactStep) contactStep.textContent = "Done";

      showContactTyping();

      const formData = {
        access_key: "2ef2f9d9-8993-488b-9f63-6d4745324ffc",
        name: contactData.name,
        email: contactData.email,
        subject: contactData.subject,
        message: contactData.message
      };

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(response => response.json())
      .then(data => {
        hideContactTyping();
        if (data.success) {
          appendContactMsg('bot', `Thank you! Your message has been sent successfully. I will get in touch with you at <strong>${contactData.email}</strong>. Have a great day!`);
        } else {
          appendContactMsg('bot', `Oops! Something went wrong while sending your message. Please try again later.`);
        }
      })
      .catch(err => {
        hideContactTyping();
        appendContactMsg('bot', `Oops! A network error occurred while sending your message. Please try again later.`);
      });
    }
  }

  function showContactTyping() {
    if (contactIndicator) {
      contactIndicator.classList.remove('hidden');
      contactIndicator.classList.add('d-flex');
    }
  }

  function hideContactTyping() {
    if (contactIndicator) {
      contactIndicator.classList.remove('d-flex');
      contactIndicator.classList.add('hidden');
    }
  }

  if (contactInput) {
    contactInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        handleContactSend();
      }
    });
  }

  if (contactSend) {
    contactSend.addEventListener('click', handleContactSend);
  }

  /**
   * Gemini-Style Integrated Hero Chat Logic
   */
  const heroChatInput = document.querySelector('#hero-chat-input');
  const heroChatSend = document.querySelector('#hero-chat-send');
  
  const heroSection = document.querySelector('#hero');
  const heroIntro = document.querySelector('#hero-intro');
  const heroInputContainer = document.querySelector('#hero-input-container');
  const heroChatMessages = document.querySelector('#hero-chat-messages');

  // Open Integrated Chat Mode
  function openIntegratedChat(initialMessage = '') {
    if (!heroSection || !heroChatMessages) return;
    
    // Hide all other sections and footer
    document.querySelectorAll('main > section:not(#hero)').forEach(s => s.classList.add('hidden'));
    const footer = document.querySelector('#footer');
    if (footer) footer.classList.add('hidden');
    
    // Hide hero text (intro)
    if (heroIntro) heroIntro.classList.add('hidden');
    
    // Expand hero to exactly full screen height and lock it so input stays at bottom
    heroSection.classList.remove('min-h-[80vh]', 'justify-center');
    heroSection.classList.add('h-screen', 'max-h-screen', 'overflow-hidden', 'justify-between');
    
    // Disable body scroll so it feels like a native app
    document.body.style.overflow = 'hidden';

    // Show the messages container
    heroChatMessages.classList.remove('hidden');
    heroChatMessages.classList.add('flex');
    
    // Move input box to the bottom
    if (heroInputContainer) {
      heroInputContainer.classList.remove('mt-10', 'max-w-2xl');
      heroInputContainer.classList.add('mt-auto', 'mb-6', 'max-w-4xl');
    }
    
    // Focus input
    setTimeout(() => {
      if (heroChatInput) heroChatInput.focus();
    }, 100);

    if (initialMessage.trim()) {
      handleHeroChatSend(initialMessage);
    }
  }

  // Append message to hero chat
  function appendHeroChatMsg(sender, text, stream = false) {
    if (!heroChatMessages) return;
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('flex', 'gap-4');
    
    if (sender === 'user') {
      msgDiv.classList.add('flex-row-reverse');
      msgDiv.innerHTML = `
        <div class="bg-[#1e1f20] px-5 py-3 rounded-3xl rounded-tr-sm text-zinc-200 text-base max-w-[85%] leading-relaxed whitespace-pre-wrap shadow-sm break-words">${text}</div>
      `;
      heroChatMessages.appendChild(msgDiv);
      heroChatMessages.scrollTop = heroChatMessages.scrollHeight;
    } else {
      msgDiv.innerHTML = `
        <div class="flex-1 text-zinc-200 text-base leading-relaxed max-w-[100%] whitespace-pre-wrap pt-1 bot-text-content">
        </div>
      `;
      heroChatMessages.appendChild(msgDiv);
      
      const textContainer = msgDiv.querySelector('.bot-text-content');
      
      if (stream) {
        let i = 0;
        const words = text.split(' ');
        const interval = setInterval(() => {
          if (i < words.length) {
            textContainer.textContent += (i > 0 ? ' ' : '') + words[i];
            heroChatMessages.scrollTop = heroChatMessages.scrollHeight;
            i++;
          } else {
            clearInterval(interval);
          }
        }, 40); // 40ms per word simulates Gemini's streaming speed
      } else {
        textContainer.textContent = text;
        heroChatMessages.scrollTop = heroChatMessages.scrollHeight;
      }
    }
  }

  // Handle Hero Chat Send
  function handleHeroChatSend(textOverride = null) {
    const text = textOverride !== null ? textOverride : (heroChatInput ? heroChatInput.value.trim() : '');
    if (!text) return;

    if (!textOverride && heroChatInput) {
      heroChatInput.value = '';
    }

    appendHeroChatMsg('user', text);
    
    if (heroChatMessages) {
      heroChatMessages.scrollTop = heroChatMessages.scrollHeight;
    }

    // Mock Response
    setTimeout(() => {
      let reply = "I am currently building the AI brain for this chatbot. Until it's ready, please head over to the Contact section in the sidebar to send me a real message!";
      appendHeroChatMsg('bot', reply, true);
    }, 400); // Reduced delay to mimic fast time-to-first-token
  }

  // Listeners for Hero Chat Input
  if (heroChatInput) {
    heroChatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const text = heroChatInput.value;
        heroChatInput.value = '';
        
        // If not already in full chat mode, open it with initial message
        if (!heroSection.classList.contains('h-screen')) {
          openIntegratedChat(text);
        } else {
          handleHeroChatSend(text);
        }
      }
    });
  }

  if (heroChatSend) {
    heroChatSend.addEventListener('click', () => {
      const text = heroChatInput ? heroChatInput.value : '';
      if (heroChatInput) heroChatInput.value = '';
      
      if (!heroSection.classList.contains('h-screen')) {
        openIntegratedChat(text);
      } else {
        handleHeroChatSend(text);
      }
    });
  }

})();