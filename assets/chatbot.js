/**
 * Nexora Labs — Modern Floating Rule-Based Chatbot
 * "Nexora Assistant"
 * Features:
 * - Floating bottom-right launcher with pulse glow & floating animation
 * - Electric cyan & purple brand accents
 * - Smooth slide-up & scale animations
 * - Pre-configured rule-based options & keyword matching
 * - Typing indicators with realistic delay
 * - Auto-scroll, minimize & close controls
 * - WhatsApp "Talk to an Expert" integration
 * - Light and Dark theme compatibility
 */

(function () {
  'use strict';

  // Prevent multiple initializations
  if (window.__NEXORA_CHATBOT_INITIALIZED__) return;
  window.__NEXORA_CHATBOT_INITIALIZED__ = true;

  // CSS Styles
  const styleEl = document.createElement('style');
  styleEl.id = 'nexora-chatbot-styles';
  styleEl.textContent = `
    @keyframes nexoraFloat {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-7px); }
    }

    @keyframes nexoraGlow {
      0%, 100% {
        box-shadow: 0 0 20px rgba(0, 245, 255, 0.45), 0 0 35px rgba(168, 85, 247, 0.35);
      }
      50% {
        box-shadow: 0 0 30px rgba(0, 245, 255, 0.75), 0 0 50px rgba(168, 85, 247, 0.6);
      }
    }

    @keyframes nexoraPulseWave {
      0% { transform: scale(0.92); opacity: 0.8; }
      50% { transform: scale(1.22); opacity: 0.2; }
      100% { transform: scale(0.92); opacity: 0.8; }
    }

    @keyframes nexoraBounceDot {
      0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
      40% { transform: scale(1); opacity: 1; }
    }

    .nexora-floating-btn {
      animation: nexoraFloat 4s ease-in-out infinite, nexoraGlow 3s ease-in-out infinite;
    }

    .nexora-pulse-ring {
      animation: nexoraPulseWave 2.6s ease-in-out infinite;
    }

    .nexora-dot-1 { animation: nexoraBounceDot 1.4s infinite ease-in-out 0s; }
    .nexora-dot-2 { animation: nexoraBounceDot 1.4s infinite ease-in-out 0.2s; }
    .nexora-dot-3 { animation: nexoraBounceDot 1.4s infinite ease-in-out 0.4s; }

    #nexora-chat-messages::-webkit-scrollbar {
      width: 5px;
    }
    #nexora-chat-messages::-webkit-scrollbar-track {
      background: transparent;
    }
    #nexora-chat-messages::-webkit-scrollbar-thumb {
      background: rgba(148, 163, 184, 0.3);
      border-radius: 9999px;
    }
    #nexora-chat-messages::-webkit-scrollbar-thumb:hover {
      background: rgba(0, 245, 255, 0.6);
    }
  `;
  document.head.appendChild(styleEl);

  // SVG Icons
  const ICONS = {
    bot: `<svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>`,
    sparkle: `<svg class="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>`,
    close: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
    minimize: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>`,
    refresh: `<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>`,
    send: `<svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>`,
    whatsapp: `<svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.031 2C6.516 2 2.031 6.484 2.031 12c0 2.215.723 4.267 1.947 5.928L2 22l4.246-1.928A9.92 9.92 0 0 0 12.031 22c5.516 0 10-4.484 10-10s-4.484-10-10-10zm5.836 14.285c-.246.691-1.234 1.309-1.996 1.477-.523.113-1.207.203-3.504-.75-2.934-1.219-4.828-4.238-4.973-4.434-.145-.195-1.18-1.57-1.18-2.992s.746-2.117 1.012-2.406c.266-.289.582-.363.777-.363.195 0 .391.004.563.012.18.008.422-.066.66.508.246.594.844 2.063.918 2.215.074.152.125.332.023.531-.098.203-.148.332-.297.508-.145.176-.309.395-.441.531-.148.148-.305.313-.133.609.172.297.77 1.266 1.648 2.047 1.133 1.008 2.086 1.32 2.383 1.469.297.148.469.125.645-.078.176-.203.75-875.953-1.176.203-.297.406-.246.684-.148.277.098 1.766.832 2.07.984.305.152.508.227.582.355.074.129.074.746-.172 1.437z"/></svg>`,
    external: `<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>`,
    mail: `<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
    phone: `<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`
  };

  // Rule-based choices definition
  const CHAT_OPTIONS = [
    { id: 'website', label: '1. Website Development', icon: '🌐' },
    { id: 'webapp', label: '2. Web Application Development', icon: '⚡' },
    { id: 'mobile', label: '3. Mobile App Development', icon: '📱' },
    { id: 'chatbot', label: '4. AI Chatbot Solutions', icon: '🤖' },
    { id: 'quote', label: '5. Get a Free Quote', icon: '📊' },
    { id: 'contact', label: '6. Contact Us', icon: '✉️' }
  ];

  // Rule-based responses
  const RESPONSES = {
    website: {
      text: "We build business websites, corporate websites, portfolio websites, landing pages, and e-commerce platforms.",
      linkText: "Explore Website Services ↗",
      linkUrl: "/website-development.html",
      actions: ['quote', 'expert', 'reset']
    },
    webapp: {
      text: "We develop custom web applications, admin panels, SaaS products, dashboards, booking systems, and business management solutions.",
      linkText: "Explore Web App Services ↗",
      linkUrl: "/web-development.html",
      actions: ['quote', 'expert', 'reset']
    },
    mobile: {
      text: "We create Android, iOS, and cross-platform mobile applications tailored to your business requirements.",
      linkText: "Explore Mobile App Services ↗",
      linkUrl: "/mobile-app-development.html",
      actions: ['quote', 'expert', 'reset']
    },
    chatbot: {
      text: "We provide AI-powered chatbot solutions for websites, customer support, FAQs, lead generation, and business automation.",
      actions: ['quote', 'expert', 'reset']
    },
    quote: {
      text: "Please share your project requirements, and our team will contact you shortly.",
      isQuote: true,
      actions: ['openForm', 'expert', 'reset']
    },
    contact: {
      text: "Here is how you can connect directly with our technology team:",
      isContactCard: true,
      actions: ['expert', 'reset']
    }
  };

  const WHATSAPP_URL = "https://wa.me/15550192834?text=Hi%20Nexora%20Labs%2C%20I%20would%20like%20to%20discuss%20a%20project";

  // Build Floating UI Markup
  const container = document.createElement('div');
  container.id = 'nexora-chatbot-root';
  container.innerHTML = `
    <!-- Floating Trigger Button -->
    <div id="nexora-chat-trigger-container" class="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      <!-- Welcome Callout Pill -->
      <div id="nexora-chat-callout" class="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#090e1c] border border-cyan-500/40 shadow-xl text-xs text-slate-200 cursor-pointer hover:border-cyan-400 transition-all select-none">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span class="font-medium">Need help? <strong class="text-cyan-300">Chat with us</strong></span>
      </div>

      <!-- Button -->
      <button 
        id="nexora-chat-trigger" 
        class="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-2xl nexora-floating-btn hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none"
        aria-label="Open Nexora Assistant"
      >
        <!-- Pulse Ring Behind -->
        <span class="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-400 to-purple-500 opacity-40 blur-sm -z-10 nexora-pulse-ring"></span>
        
        <!-- Online Dot Indicator -->
        <span class="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#05070d] ring-2 ring-emerald-400/40"></span>

        <!-- Bot Icon -->
        <span id="nexora-trigger-icon" class="w-8 h-8 flex items-center justify-center">
          <img src="/assets/nexora-mark.png" alt="Nexora" class="w-full h-full object-contain drop-shadow">
        </span>
      </button>
    </div>

    <!-- Chatbot Window -->
    <div 
      id="nexora-chat-window" 
      class="fixed bottom-24 right-4 sm:right-6 z-50 w-[360px] sm:w-[390px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-7.5rem)] rounded-3xl bg-[#090e1c]/95 backdrop-blur-2xl border border-slate-700/80 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_35px_rgba(0,245,255,0.18)] flex flex-col overflow-hidden transform transition-all duration-300 origin-bottom-right scale-95 opacity-0 pointer-events-none select-none"
    >
      <!-- Top Decorative Accent -->
      <div class="h-1 bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 shrink-0"></div>

      <!-- Header -->
      <div id="nexora-chat-header" class="px-5 py-4 bg-[#080d19] border-b border-slate-800 flex items-center justify-between shrink-0">
        <div class="flex items-center gap-3">
          <div class="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-0.5 shadow-md shadow-cyan-500/20">
            <div class="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center p-1">
              <img src="/assets/nexora-mark.png" alt="Nexora" class="w-full h-full object-contain">
            </div>
            <span class="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900"></span>
          </div>
          <div>
            <div class="flex items-center gap-1.5">
              <h4 class="text-sm font-bold text-white tracking-wide">Nexora Assistant</h4>
              <span class="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-950/80 border border-cyan-800/80 text-cyan-300">AI</span>
            </div>
            <p class="text-[11px] text-emerald-400 flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Online | Instant Support</span>
            </p>
          </div>
        </div>

        <!-- Window Controls -->
        <div class="flex items-center gap-1.5 text-slate-400">
          <button id="nexora-chat-reset" title="Restart conversation" class="w-7 h-7 rounded-lg hover:bg-slate-800 hover:text-white flex items-center justify-center transition">
            ${ICONS.refresh}
          </button>
          <button id="nexora-chat-minimize" title="Minimize" class="w-7 h-7 rounded-lg hover:bg-slate-800 hover:text-white flex items-center justify-center transition">
            ${ICONS.minimize}
          </button>
          <button id="nexora-chat-close" title="Close" class="w-7 h-7 rounded-lg hover:bg-slate-800 hover:text-white flex items-center justify-center transition">
            ${ICONS.close}
          </button>
        </div>
      </div>

      <!-- Chat Messages Scroll Container -->
      <div id="nexora-chat-messages" class="flex-1 overflow-y-auto p-4 space-y-3.5 scroll-smooth">
        <!-- Messages will be rendered dynamically -->
      </div>

      <!-- Bottom Quick Contact & WhatsApp Bar -->
      <div id="nexora-chat-footer" class="p-3 bg-[#080d19]/90 border-t border-slate-800 shrink-0 space-y-2">
        <!-- Expert WhatsApp CTA -->
        <a 
          href="${WHATSAPP_URL}" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition active:scale-95"
        >
          <span>${ICONS.whatsapp}</span>
          <span>Talk to an Expert on WhatsApp</span>
        </a>

        <!-- Input Bar (Keyword-friendly & interactive) -->
        <form id="nexora-chat-form" class="flex items-center gap-2" onsubmit="return false;">
          <input 
            type="text" 
            id="nexora-chat-input" 
            placeholder="Type your question or choose an option..." 
            class="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
          >
          <button 
            type="submit" 
            id="nexora-chat-send" 
            class="w-8 h-8 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white flex items-center justify-center shrink-0 hover:opacity-90 active:scale-95 transition"
            title="Send"
          >
            ${ICONS.send}
          </button>
        </form>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  // References
  const triggerBtn = document.getElementById('nexora-chat-trigger');
  const callout = document.getElementById('nexora-chat-callout');
  const chatWindow = document.getElementById('nexora-chat-window');
  const messagesBox = document.getElementById('nexora-chat-messages');
  const closeBtn = document.getElementById('nexora-chat-close');
  const minBtn = document.getElementById('nexora-chat-minimize');
  const resetBtn = document.getElementById('nexora-chat-reset');
  const form = document.getElementById('nexora-chat-form');
  const input = document.getElementById('nexora-chat-input');

  let isOpen = false;

  // Open Chat
  function openChat() {
    isOpen = true;
    chatWindow.classList.remove('scale-95', 'opacity-0', 'pointer-events-none');
    chatWindow.classList.add('scale-100', 'opacity-100', 'pointer-events-auto');
    if (callout) callout.classList.add('hidden');
    scrollToBottom();
    setTimeout(() => {
      if (input) input.focus();
    }, 200);
  }

  // Close Chat
  function closeChat() {
    isOpen = false;
    chatWindow.classList.add('scale-95', 'opacity-0', 'pointer-events-none');
    chatWindow.classList.remove('scale-100', 'opacity-100', 'pointer-events-auto');
  }

  // Toggle Chat
  function toggleChat() {
    if (isOpen) closeChat();
    else openChat();
  }

  // Global helper exports
  window.__nexoraOpenChat = openChat;
  window.__nexoraToggleChat = toggleChat;

  // Scroll to bottom
  function scrollToBottom() {
    setTimeout(() => {
      if (messagesBox) {
        messagesBox.scrollTo({ top: messagesBox.scrollHeight, behavior: 'smooth' });
      }
    }, 50);
  }

  // Typing animation element
  function showTypingIndicator() {
    const typingId = 'nexora-typing-indicator';
    const existing = document.getElementById(typingId);
    if (existing) existing.remove();

    const el = document.createElement('div');
    el.id = typingId;
    el.className = 'flex items-center gap-2 text-slate-400 text-xs py-1 animate-fadeIn';
    el.innerHTML = `
      <div class="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 text-[10px]">
        🤖
      </div>
      <div class="px-3.5 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-1.5 shadow-sm">
        <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 nexora-dot-1"></span>
        <span class="w-1.5 h-1.5 rounded-full bg-indigo-400 nexora-dot-2"></span>
        <span class="w-1.5 h-1.5 rounded-full bg-purple-400 nexora-dot-3"></span>
      </div>
    `;
    messagesBox.appendChild(el);
    scrollToBottom();
  }

  function hideTypingIndicator() {
    const el = document.getElementById('nexora-typing-indicator');
    if (el) el.remove();
  }

  // Render Bot Message
  function appendBotMessage(contentHtml) {
    const msg = document.createElement('div');
    msg.className = 'flex items-start gap-2.5 animate-fadeIn';
    msg.innerHTML = `
      <div class="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-0.5 shrink-0 mt-0.5">
        <div class="w-full h-full bg-slate-950 rounded-[9px] flex items-center justify-center p-0.5">
          <img src="/assets/nexora-mark.png" alt="Nexora" class="w-full h-full object-contain">
        </div>
      </div>
      <div class="flex-1 space-y-2">
        <div class="nexora-bot-bubble p-3.5 rounded-2xl rounded-tl-sm bg-slate-900/90 border border-slate-800 text-xs text-slate-200 leading-relaxed shadow-md">
          ${contentHtml}
        </div>
      </div>
    `;
    messagesBox.appendChild(msg);
    scrollToBottom();
  }

  // Render User Message
  function appendUserMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'flex items-end justify-end animate-fadeIn';
    msg.innerHTML = `
      <div class="max-w-[82%] px-4 py-2.5 rounded-2xl rounded-tr-sm bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-medium leading-relaxed shadow-lg shadow-cyan-950">
        ${escapeHtml(text)}
      </div>
    `;
    messagesBox.appendChild(msg);
    scrollToBottom();
  }

  function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  // Render Initial Welcome
  function renderWelcome() {
    messagesBox.innerHTML = '';

    const welcomeHtml = `
      <p class="font-medium text-white mb-2">👋 Welcome to Nexora Labs! How can we help you today?</p>
      <p class="text-[11px] text-slate-400 mb-3">Choose one of the options below to get started instantly:</p>
      
      <!-- Option Chips -->
      <div class="grid grid-cols-1 gap-1.5 pt-1">
        ${CHAT_OPTIONS.map(opt => `
          <button 
            data-option="${opt.id}" 
            class="nexora-option-btn text-left px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/60 transition-all text-xs font-semibold text-slate-200 flex items-center gap-2 group"
          >
            <span class="text-sm">${opt.icon}</span>
            <span class="group-hover:text-cyan-300 transition-colors">${opt.label}</span>
          </button>
        `).join('')}
      </div>
    `;

    appendBotMessage(welcomeHtml);
  }

  // Process Option Click
  function handleOptionSelect(optionId) {
    const option = CHAT_OPTIONS.find(o => o.id === optionId);
    const userLabel = option ? option.label : optionId;

    appendUserMessage(userLabel);
    showTypingIndicator();

    setTimeout(() => {
      hideTypingIndicator();
      const resp = RESPONSES[optionId];
      if (!resp) {
        appendBotMessage("I am here to assist with our technology services. Please select from the menu below.");
        renderOptionPills();
        return;
      }

      let content = `<p class="leading-relaxed">${resp.text}</p>`;

      if (resp.linkUrl) {
        content += `
          <div class="pt-2">
            <a href="${resp.linkUrl}" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-[11px] font-semibold hover:border-cyan-400 hover:text-white transition">
              <span>${resp.linkText}</span>
              ${ICONS.external}
            </a>
          </div>
        `;
      }

      if (resp.isQuote) {
        content += `
          <div class="pt-2.5 flex flex-wrap gap-2">
            <button onclick="window.__nexoraOpenContact()" class="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 text-white text-[11px] font-semibold shadow-md hover:opacity-95 transition">
              Open Project Form 📝
            </button>
          </div>
        `;
      }

      if (resp.isContactCard) {
        content += `
          <div class="mt-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-[11px]">
            <div class="flex items-center gap-2 text-slate-300">
              <span class="text-cyan-400">${ICONS.mail}</span>
              <a href="mailto:contact@nexoralabs.com" class="hover:text-cyan-300 underline font-medium">contact@nexoralabs.com</a>
            </div>
            <div class="flex items-center gap-2 text-slate-300">
              <span class="text-purple-400">${ICONS.phone}</span>
              <a href="tel:+15550192834" class="hover:text-purple-300 underline font-medium">+1 (555) 019-2834</a>
            </div>
            <div class="pt-2 flex flex-col gap-2">
              <a href="${WHATSAPP_URL}" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition">
                <span>${ICONS.whatsapp}</span>
                <span>Chat on WhatsApp</span>
              </a>
              <button onclick="window.__nexoraOpenContact()" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold border border-slate-700 transition">
                Open Contact Page Form
              </button>
            </div>
          </div>
        `;
      }

      // Add Return to Options button
      content += `
        <div class="pt-3 border-t border-slate-800/80 mt-3 flex items-center justify-between text-[11px]">
          <span class="text-slate-500">Need something else?</span>
          <button data-action="reset" class="text-cyan-400 hover:text-cyan-300 font-semibold underline">
            View All Services
          </button>
        </div>
      `;

      appendBotMessage(content);
    }, 450);
  }

  // Global helper to redirect/scroll to Contact section
  window.__nexoraOpenContact = function () {
    if (typeof closeChat === 'function') {
      try { closeChat(); } catch (err) {}
    }
    if (typeof window.scrollToContact === 'function') {
      window.scrollToContact();
    } else if (typeof window.openContactModal === 'function') {
      window.openContactModal();
    } else {
      window.location.href = '/#contact';
    }
  };

  // Keyword Matching for Text Input
  function handleUserInput(text) {
    const raw = text.trim();
    if (!raw) return;

    appendUserMessage(raw);
    showTypingIndicator();

    const lower = raw.toLowerCase();

    setTimeout(() => {
      hideTypingIndicator();

      if (lower.includes('website') || lower.includes('site') || lower.includes('landing') || lower.includes('portfolio') || lower.includes('e-commerce') || lower.includes('ecommerce')) {
        handleOptionSelect('website');
      } else if (lower.includes('web app') || lower.includes('application') || lower.includes('saas') || lower.includes('dashboard') || lower.includes('admin')) {
        handleOptionSelect('webapp');
      } else if (lower.includes('mobile') || lower.includes('app') || lower.includes('android') || lower.includes('ios') || lower.includes('flutter') || lower.includes('react native')) {
        handleOptionSelect('mobile');
      } else if (lower.includes('chat') || lower.includes('bot') || lower.includes('ai') || lower.includes('automation')) {
        handleOptionSelect('chatbot');
      } else if (lower.includes('quote') || lower.includes('price') || lower.includes('cost') || lower.includes('estimate') || lower.includes('hire') || lower.includes('rate')) {
        handleOptionSelect('quote');
      } else if (lower.includes('contact') || lower.includes('call') || lower.includes('email') || lower.includes('whatsapp') || lower.includes('phone') || lower.includes('reach')) {
        handleOptionSelect('contact');
      } else {
        appendBotMessage(`
          <p>Thanks for your message! Here are the core services we offer at Nexora Labs. Please choose an option below or chat directly with an engineer:</p>
          <div class="grid grid-cols-1 gap-1.5 pt-2">
            ${CHAT_OPTIONS.map(opt => `
              <button 
                data-option="${opt.id}" 
                class="nexora-option-btn text-left px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/60 transition-all text-xs font-semibold text-slate-200 flex items-center gap-2 group"
              >
                <span>${opt.icon}</span>
                <span class="group-hover:text-cyan-300 transition-colors">${opt.label}</span>
              </button>
            `).join('')}
          </div>
        `);
      }
    }, 450);
  }

  // Delegated Click Listener for Options & Actions
  messagesBox.addEventListener('click', (e) => {
    const optBtn = e.target.closest('[data-option]');
    if (optBtn) {
      const optionId = optBtn.getAttribute('data-option');
      handleOptionSelect(optionId);
      return;
    }

    const actionBtn = e.target.closest('[data-action]');
    if (actionBtn) {
      const act = actionBtn.getAttribute('data-action');
      if (act === 'reset') {
        renderWelcome();
      }
    }
  });

  // Event Listeners
  triggerBtn.addEventListener('click', toggleChat);
  if (callout) callout.addEventListener('click', openChat);
  closeBtn.addEventListener('click', closeChat);
  minBtn.addEventListener('click', closeChat);
  resetBtn.addEventListener('click', renderWelcome);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = input.value;
    input.value = '';
    handleUserInput(val);
  });

  // Initialize
  renderWelcome();
})();

