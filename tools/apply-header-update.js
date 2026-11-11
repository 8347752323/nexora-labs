const fs = require('fs');
const path = require('path');

function getHeaderHtml(activePage) {
  const isWebDev = activePage === 'web';
  const isMobileApp = activePage === 'mobile';
  const isWebsite = activePage === 'website';
  const isIndex = activePage === 'index';

  const aboutLink = isIndex 
    ? `<a href="#about" onclick="scrollToAbout(); return false;" class="hover:text-cyan-400 transition font-medium focus:outline-none">About Us</a>`
    : `<a href="/#about" class="hover:text-cyan-400 transition font-medium focus:outline-none">About Us</a>`;

  const contactLink = isIndex
    ? `<a href="#contact" onclick="scrollToContact(); return false;" class="hover:text-cyan-400 transition font-medium focus:outline-none">Contact Us</a>`
    : `<a href="/#contact" class="hover:text-cyan-400 transition font-medium focus:outline-none">Contact Us</a>`;

  const mobileAboutAction = isIndex
    ? `onclick="closeMobileMenu(); scrollToAbout(); return false;"`
    : `onclick="closeMobileMenu();"`;

  const mobileContactAction = isIndex
    ? `onclick="closeMobileMenu(); scrollToContact(); return false;"`
    : `onclick="closeMobileMenu();"`;

  const resourceAction = isIndex
    ? `scrollToContact();`
    : `window.location.href = '/#contact';`;

  return `  <!-- ==================== HEADER & NAVBAR ==================== -->
  <header class="sticky top-0 z-50 backdrop-blur-xl bg-[#05070d]/85 border-b border-slate-800/80 transition-all duration-300">
    <div class="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
      
      <!-- Brand Logo (Left) -->
      <a href="/" class="flex items-center gap-2 group shrink-0">
        <img src="/assets/nexora-logo.png" alt="Nexora" class="h-10 md:h-12 w-auto object-contain transition-transform group-hover:scale-105">
        <span class="font-bold text-xs md:text-sm tracking-widest bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">LABS</span>
      </a>

      <!-- Right Side Corner Navigation Container (Services, Resources, Portfolio, About Us, Contact Us) -->
      <div class="flex items-center gap-4 ml-auto">

        <!-- Desktop Navigation Links (Pinned to Right Corner) -->
        <nav class="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-slate-300 relative">
          
          <!-- 1. Services Dropdown -->
          <div class="relative">
            <button 
              id="services-btn"
              onclick="toggleServicesPopup(event)" 
              class="${isWebDev || isMobileApp || isWebsite ? 'text-cyan-400 font-semibold' : 'hover:text-cyan-400 text-slate-200'} transition font-medium focus:outline-none flex items-center gap-1.5 py-1"
            >
              <span>Services</span>
              <i data-lucide="chevron-down" id="services-chevron" class="w-3.5 h-3.5 transition-transform duration-200 ${isWebDev || isMobileApp || isWebsite ? 'text-cyan-400' : 'text-slate-400'}"></i>
            </button>

            <!-- Services Smart Popup (Right-aligned to stay on-screen) -->
            <div 
              id="services-popup" 
              class="hidden absolute top-full right-0 mt-3 w-[560px] md:w-[620px] max-w-[calc(100vw-2rem)] rounded-2xl bg-[#090e1c] border border-slate-700/80 shadow-2xl p-4 z-50 transition-all duration-200"
            >
              <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <span class="text-sm font-bold text-white tracking-wide">Services</span>
                <button onclick="closeServicesPopup()" class="w-6 h-6 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition focus:outline-none">
                  <i data-lucide="x" class="w-3.5 h-3.5"></i>
                </button>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <!-- Web Development -->
                <a href="/web-development.html" class="text-left p-3 rounded-xl ${isWebDev ? 'bg-cyan-950/40 border border-cyan-500/80' : 'bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/60'} transition-all duration-200 group flex flex-col justify-between h-[112px]">
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-800/80 text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <i data-lucide="code-2" class="w-4 h-4"></i>
                    </div>
                    <span class="text-xs font-bold ${isWebDev ? 'text-cyan-300' : 'text-white group-hover:text-cyan-300'} transition-colors truncate">Web Development</span>
                  </div>
                  <p class="text-[11px] text-slate-400 line-clamp-2 leading-snug">
                    High-performance web apps built with Next.js, React & scalable APIs.
                  </p>
                </a>

                <!-- Mobile Apps -->
                <a href="/mobile-app-development.html" class="text-left p-3 rounded-xl ${isMobileApp ? 'bg-purple-950/40 border border-purple-500/80' : 'bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-purple-500/60'} transition-all duration-200 group flex flex-col justify-between h-[112px]">
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 rounded-lg bg-purple-950/80 border border-purple-800/80 text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <i data-lucide="smartphone" class="w-4 h-4"></i>
                    </div>
                    <span class="text-xs font-bold ${isMobileApp ? 'text-purple-300' : 'text-white group-hover:text-purple-300'} transition-colors truncate">Mobile Apps</span>
                  </div>
                  <p class="text-[11px] text-slate-400 line-clamp-2 leading-snug">
                    Native & cross-platform apps for iOS and Android devices.
                  </p>
                </a>

                <!-- Websites -->
                <a href="/website-development.html" class="text-left p-3 rounded-xl ${isWebsite ? 'bg-blue-950/40 border border-blue-500/80' : 'bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-blue-500/60'} transition-all duration-200 group flex flex-col justify-between h-[112px]">
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 rounded-lg bg-blue-950/80 border border-blue-800/80 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <i data-lucide="globe" class="w-4 h-4"></i>
                    </div>
                    <span class="text-xs font-bold ${isWebsite ? 'text-blue-300' : 'text-white group-hover:text-blue-300'} transition-colors truncate">Websites</span>
                  </div>
                  <p class="text-[11px] text-slate-400 line-clamp-2 leading-snug">
                    High-conversion landing pages, brand portals & eCommerce stores.
                  </p>
                </a>

                <!-- AI Chatbots -->
                <button onclick="closeServicesPopup(); if(window.__nexoraOpenChat) window.__nexoraOpenChat();" class="text-left p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/60 transition-all duration-200 group flex flex-col justify-between h-[112px] focus:outline-none">
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 rounded-lg bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <i data-lucide="bot" class="w-4 h-4"></i>
                    </div>
                    <span class="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors truncate">AI Chatbots</span>
                  </div>
                  <p class="text-[11px] text-slate-400 line-clamp-2 leading-snug">
                    Conversational agents, customer support automation & smart workflows.
                  </p>
                </button>

                <!-- Quality Assurance -->
                <a href="${isIndex ? '#contact' : '/#contact'}" onclick="selectService('Quality Assurance'); return ${isIndex ? 'false' : 'true'};" class="text-left p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/60 transition-all duration-200 group flex flex-col justify-between h-[112px] focus:outline-none">
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 rounded-lg bg-amber-950/80 border border-amber-800/80 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <i data-lucide="shield-check" class="w-4 h-4"></i>
                    </div>
                    <span class="text-xs font-bold text-white group-hover:text-amber-300 transition-colors truncate">Quality Assurance</span>
                  </div>
                  <p class="text-[11px] text-slate-400 line-clamp-2 leading-snug">
                    Automated regression testing, CI/CD verification & security audits.
                  </p>
                </a>
              </div>
            </div>
          </div>

          <!-- 2. Resources Dropdown -->
          <div class="relative">
            <button 
              id="resources-btn"
              onclick="toggleResourcesPopup(event)" 
              class="hover:text-cyan-400 transition font-medium focus:outline-none flex items-center gap-1.5 py-1 text-slate-200"
            >
              <span>Resources</span>
              <i data-lucide="chevron-down" id="resources-chevron" class="w-3.5 h-3.5 transition-transform duration-200 text-slate-400"></i>
            </button>

            <!-- Resources Smart Popup (Right-aligned to stay on-screen) -->
            <div 
              id="resources-popup" 
              class="hidden absolute top-full right-0 mt-3 w-[460px] md:w-[500px] max-w-[calc(100vw-2rem)] rounded-2xl bg-[#090e1c] border border-slate-700/80 shadow-2xl p-4 z-50 transition-all duration-200"
            >
              <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <span class="text-sm font-bold text-white tracking-wide">Resources</span>
                <button onclick="closeResourcesPopup()" class="w-6 h-6 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition focus:outline-none">
                  <i data-lucide="x" class="w-3.5 h-3.5"></i>
                </button>
              </div>

              <div class="grid grid-cols-2 gap-2.5">
                <button onclick="selectResource('Blog')" class="text-left p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/60 transition-all duration-200 group flex flex-col justify-between h-[112px] focus:outline-none">
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-800/80 text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <i data-lucide="book-open" class="w-4 h-4"></i>
                    </div>
                    <span class="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">Blog</span>
                  </div>
                  <p class="text-[11px] text-slate-400 line-clamp-2 leading-snug">Tech insights, industry trends, and engineering best practices.</p>
                </button>

                <button onclick="selectResource('Case Studies')" class="text-left p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-purple-500/60 transition-all duration-200 group flex flex-col justify-between h-[112px] focus:outline-none">
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 rounded-lg bg-purple-950/80 border border-purple-800/80 text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <i data-lucide="file-text" class="w-4 h-4"></i>
                    </div>
                    <span class="text-xs font-bold text-white group-hover:text-purple-300 transition-colors truncate">Case Studies</span>
                  </div>
                  <p class="text-[11px] text-slate-400 line-clamp-2 leading-snug">Real client success stories, architecture breakdowns & results.</p>
                </button>

                <button onclick="selectResource('Technologies')" class="text-left p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-blue-500/60 transition-all duration-200 group flex flex-col justify-between h-[112px] focus:outline-none">
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 rounded-lg bg-blue-950/80 border border-blue-800/80 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <i data-lucide="cpu" class="w-4 h-4"></i>
                    </div>
                    <span class="text-xs font-bold text-white group-hover:text-blue-300 transition-colors truncate">Technologies</span>
                  </div>
                  <p class="text-[11px] text-slate-400 line-clamp-2 leading-snug">Modern technology stack, frameworks, and deployment standards.</p>
                </button>

                <button onclick="selectResource('FAQs')" class="text-left p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/60 transition-all duration-200 group flex flex-col justify-between h-[112px] focus:outline-none">
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 rounded-lg bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <i data-lucide="help-circle" class="w-4 h-4"></i>
                    </div>
                    <span class="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors truncate">FAQs</span>
                  </div>
                  <p class="text-[11px] text-slate-400 line-clamp-2 leading-snug">Frequently asked questions about processes, pricing & timelines.</p>
                </button>
              </div>
            </div>
          </div>

          <!-- 3. Portfolio Dropdown -->
          <div class="relative">
            <button 
              id="portfolio-btn"
              onclick="togglePortfolioPopup(event)" 
              class="hover:text-cyan-400 transition font-medium focus:outline-none flex items-center gap-1.5 py-1 text-slate-200"
            >
              <span>Portfolio</span>
              <i data-lucide="chevron-down" id="portfolio-chevron" class="w-3.5 h-3.5 transition-transform duration-200 text-slate-400"></i>
            </button>

            <!-- Portfolio Smart Popup (Right-aligned to stay on-screen) -->
            <div 
              id="portfolio-popup" 
              class="hidden absolute top-full right-0 mt-3 w-[560px] md:w-[620px] max-w-[calc(100vw-2rem)] rounded-2xl bg-[#090e1c] border border-slate-700/80 shadow-2xl p-4 z-50 transition-all duration-200"
            >
              <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <span class="text-sm font-bold text-white tracking-wide">Portfolio</span>
                <button onclick="closePortfolioPopup()" class="w-6 h-6 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition focus:outline-none">
                  <i data-lucide="x" class="w-3.5 h-3.5"></i>
                </button>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button onclick="selectPortfolioProject('E-Commerce Website')" class="text-left p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/60 transition-all duration-200 group flex flex-col justify-between h-[116px] focus:outline-none">
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-800/80 text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <i data-lucide="shopping-bag" class="w-4 h-4"></i>
                    </div>
                    <span class="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">E-Commerce Website</span>
                  </div>
                  <p class="text-[11px] text-slate-400 line-clamp-2 leading-snug">Full-featured online store with product catalog, cart, and payment checkout.</p>
                </button>

                <button onclick="selectPortfolioProject('Real Estate Website')" class="text-left p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-purple-500/60 transition-all duration-200 group flex flex-col justify-between h-[116px] focus:outline-none">
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 rounded-lg bg-purple-950/80 border border-purple-800/80 text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <i data-lucide="building" class="w-4 h-4"></i>
                    </div>
                    <span class="text-xs font-bold text-white group-hover:text-purple-300 transition-colors truncate">Real Estate Website</span>
                  </div>
                  <p class="text-[11px] text-slate-400 line-clamp-2 leading-snug">Property listing portal with interactive map search, filters, and booking.</p>
                </button>

                <a href="https://www.odoo.com/app/ecommerce" target="_blank" rel="noopener noreferrer" class="text-left p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/60 transition-all duration-200 group flex flex-col justify-between h-[116px] focus:outline-none">
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 rounded-lg bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <i data-lucide="shield-check" class="w-4 h-4"></i>
                    </div>
                    <div class="flex items-center gap-1 min-w-0">
                      <span class="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors truncate">QA Automation</span>
                      <i data-lucide="external-link" class="w-3 h-3 text-slate-500 group-hover:text-emerald-400 shrink-0"></i>
                    </div>
                  </div>
                  <p class="text-[11px] text-slate-400 line-clamp-2 leading-snug">Enterprise test automation suite for Odoo eCommerce platform.</p>
                </a>
              </div>
            </div>
          </div>

          <!-- 4. About Us -->
          ${aboutLink}

          <!-- 5. Contact Us -->
          ${contactLink}
        </nav>

        <!-- Mobile Navigation Menu Button (Visible on screens < md, Pinned to Right Corner) -->
        <div class="relative md:hidden">
          <button 
            id="mobile-menu-btn"
            onclick="toggleMobileMenu(event)"
            aria-label="Toggle navigation menu"
            aria-expanded="false"
            class="w-11 h-11 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-200 hover:text-white hover:border-cyan-400 hover:bg-slate-800 flex items-center justify-center transition-all shadow-md focus:outline-none"
          >
            <i data-lucide="menu" id="mobile-menu-icon" class="w-5 h-5"></i>
          </button>

          <!-- Mobile Menu Dropdown Panel (Anchored to top-right corner) -->
          <div 
            id="mobile-menu"
            class="hidden absolute right-0 top-full mt-3 w-80 max-w-[calc(100vw-2rem)] rounded-2xl bg-[#090e1c] border border-slate-700/80 shadow-2xl p-4 z-50 transition-all duration-200"
          >
            <!-- Header with title & close button -->
            <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <span class="text-sm font-bold text-white tracking-wide">Menu</span>
              <button 
                type="button" 
                onclick="closeMobileMenu()" 
                class="w-6 h-6 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition focus:outline-none"
                aria-label="Close Menu"
              >
                <i data-lucide="x" class="w-3.5 h-3.5"></i>
              </button>
            </div>

            <!-- Navigation Items List -->
            <div class="space-y-1.5 text-sm">
              <!-- 1. Services Accordion -->
              <div class="rounded-xl bg-slate-900/60 border border-slate-800/80 overflow-hidden">
                <button 
                  onclick="toggleMobileSubmenu('services')" 
                  class="w-full flex items-center justify-between p-3 text-left font-semibold text-slate-200 hover:text-cyan-400 hover:bg-slate-800/50 transition focus:outline-none"
                >
                  <span class="flex items-center gap-2">
                    <i data-lucide="layers" class="w-4 h-4 text-cyan-400"></i>
                    <span>Services</span>
                  </span>
                  <i data-lucide="chevron-down" id="mobile-sub-services-chevron" class="w-4 h-4 text-slate-400 transition-transform"></i>
                </button>
                <div id="mobile-sub-services" class="hidden px-3 pb-3 pt-1 space-y-1 text-xs border-t border-slate-800/60">
                  <a href="/web-development.html" class="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-cyan-300 transition">
                    <i data-lucide="code-2" class="w-3.5 h-3.5 text-cyan-400"></i>
                    <span>Web Development</span>
                  </a>
                  <a href="/mobile-app-development.html" class="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-purple-300 transition">
                    <i data-lucide="smartphone" class="w-3.5 h-3.5 text-purple-400"></i>
                    <span>Mobile Apps</span>
                  </a>
                  <a href="/website-development.html" class="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-blue-300 transition">
                    <i data-lucide="globe" class="w-3.5 h-3.5 text-blue-400"></i>
                    <span>Website Development</span>
                  </a>
                  <button onclick="closeMobileMenu(); if(window.__nexoraOpenChat) window.__nexoraOpenChat();" class="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-emerald-300 transition text-left focus:outline-none">
                    <i data-lucide="bot" class="w-3.5 h-3.5 text-emerald-400"></i>
                    <span>AI Chatbot Solutions</span>
                  </button>
                  <a href="https://www.odoo.com/app/ecommerce" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-amber-300 transition">
                    <i data-lucide="shield-check" class="w-3.5 h-3.5 text-amber-400"></i>
                    <span>Quality Assurance</span>
                  </a>
                </div>
              </div>

              <!-- 2. Resources Accordion -->
              <div class="rounded-xl bg-slate-900/60 border border-slate-800/80 overflow-hidden">
                <button 
                  onclick="toggleMobileSubmenu('resources')" 
                  class="w-full flex items-center justify-between p-3 text-left font-semibold text-slate-200 hover:text-cyan-400 hover:bg-slate-800/50 transition focus:outline-none"
                >
                  <span class="flex items-center gap-2">
                    <i data-lucide="book-open" class="w-4 h-4 text-purple-400"></i>
                    <span>Resources</span>
                  </span>
                  <i data-lucide="chevron-down" id="mobile-sub-resources-chevron" class="w-4 h-4 text-slate-400 transition-transform"></i>
                </button>
                <div id="mobile-sub-resources" class="hidden px-3 pb-3 pt-1 space-y-1 text-xs border-t border-slate-800/60">
                  <button onclick="closeMobileMenu(); ${resourceAction}" class="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-purple-300 transition text-left focus:outline-none">
                    <i data-lucide="file-text" class="w-3.5 h-3.5 text-purple-400"></i>
                    <span>Case Studies</span>
                  </button>
                  <button onclick="closeMobileMenu(); ${resourceAction}" class="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-blue-300 transition text-left focus:outline-none">
                    <i data-lucide="cpu" class="w-3.5 h-3.5 text-blue-400"></i>
                    <span>Technologies</span>
                  </button>
                  <button onclick="closeMobileMenu(); ${resourceAction}" class="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-emerald-300 transition text-left focus:outline-none">
                    <i data-lucide="help-circle" class="w-3.5 h-3.5 text-emerald-400"></i>
                    <span>FAQs</span>
                  </button>
                </div>
              </div>

              <!-- 3. Portfolio Accordion -->
              <div class="rounded-xl bg-slate-900/60 border border-slate-800/80 overflow-hidden">
                <button 
                  onclick="toggleMobileSubmenu('portfolio')" 
                  class="w-full flex items-center justify-between p-3 text-left font-semibold text-slate-200 hover:text-cyan-400 hover:bg-slate-800/50 transition focus:outline-none"
                >
                  <span class="flex items-center gap-2">
                    <i data-lucide="briefcase" class="w-4 h-4 text-blue-400"></i>
                    <span>Portfolio</span>
                  </span>
                  <i data-lucide="chevron-down" id="mobile-sub-portfolio-chevron" class="w-4 h-4 text-slate-400 transition-transform"></i>
                </button>
                <div id="mobile-sub-portfolio" class="hidden px-3 pb-3 pt-1 space-y-1 text-xs border-t border-slate-800/60">
                  <button onclick="closeMobileMenu(); ${resourceAction}" class="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-cyan-300 transition text-left focus:outline-none">
                    <i data-lucide="shopping-bag" class="w-3.5 h-3.5 text-cyan-400"></i>
                    <span>E-Commerce Website</span>
                  </button>
                  <button onclick="closeMobileMenu(); ${resourceAction}" class="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-purple-300 transition text-left focus:outline-none">
                    <i data-lucide="building" class="w-3.5 h-3.5 text-purple-400"></i>
                    <span>Real Estate Website</span>
                  </button>
                  <a href="https://www.odoo.com/app/ecommerce" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-emerald-300 transition">
                    <i data-lucide="shield-check" class="w-3.5 h-3.5 text-emerald-400"></i>
                    <span>QA Automation for WebSite</span>
                  </a>
                </div>
              </div>

              <!-- 4. About Us -->
              <a 
                href="/#about" 
                ${mobileAboutAction}
                class="flex items-center gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 font-semibold text-slate-200 hover:text-cyan-400 hover:bg-slate-800/50 transition"
              >
                <i data-lucide="info" class="w-4 h-4 text-cyan-400"></i>
                <span>About Us</span>
              </a>

              <!-- 5. Contact Us -->
              <a 
                href="/#contact" 
                ${mobileContactAction}
                class="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/40 font-semibold text-cyan-300 hover:text-white hover:border-cyan-400 transition"
              >
                <i data-lucide="mail" class="w-4 h-4 text-cyan-400"></i>
                <span>Contact Us</span>
              </a>
            </div>
          </div>
        </div>

      </div>

    </div>
  </header>`;
}

const mobileMenuJs = `
    // Mobile Menu Controls
    function toggleMobileMenu(e) {
      if (e) e.stopPropagation();
      closeServicesPopup();
      closeResourcesPopup();
      closePortfolioPopup();
      const menu = document.getElementById('mobile-menu');
      const btn = document.getElementById('mobile-menu-btn');
      const icon = document.getElementById('mobile-menu-icon');
      if (!menu) return;
      if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        if (btn) btn.setAttribute('aria-expanded', 'true');
        if (icon) icon.setAttribute('data-lucide', 'x');
        lucide.createIcons();
      } else {
        closeMobileMenu();
      }
    }

    function closeMobileMenu() {
      const menu = document.getElementById('mobile-menu');
      const btn = document.getElementById('mobile-menu-btn');
      const icon = document.getElementById('mobile-menu-icon');
      if (menu) menu.classList.add('hidden');
      if (btn) btn.setAttribute('aria-expanded', 'false');
      if (icon) icon.setAttribute('data-lucide', 'menu');
      lucide.createIcons();
    }

    function toggleMobileSubmenu(id) {
      const sub = document.getElementById('mobile-sub-' + id);
      const chevron = document.getElementById('mobile-sub-' + id + '-chevron');
      if (!sub) return;
      if (sub.classList.contains('hidden')) {
        sub.classList.remove('hidden');
        if (chevron) chevron.classList.add('rotate-180');
      } else {
        sub.classList.add('hidden');
        if (chevron) chevron.classList.remove('rotate-180');
      }
    }
`;

function processFile(filePath, pageType) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Replace the entire <header>...</header> block
  const headerRegex = /<!-- ==================== HEADER & NAVBAR ==================== -->[\s\S]*?<\/header>/;
  const newHeader = getHeaderHtml(pageType);
  if (!headerRegex.test(content)) {
    console.error('Could not find header regex in', filePath);
    return;
  }
  content = content.replace(headerRegex, newHeader);

  // 2. Remove light mode CSS overrides in <style>
  // Remove block from "/* ==================== WHOLE-WEBSITE LIGHT THEME ==================== */" or similar html.light rules
  content = content.replace(/\/\* ==================== WHOLE-WEBSITE LIGHT THEME ==================== \*\/[\s\S]*?<\/style>/, '</style>');
  // Also remove standalone html.light rules if any remain
  content = content.replace(/html\.light[\s\S]*?\}[\r\n]*/g, '');
  content = content.replace(/html:not\(\.light\)[\s\S]*?\}[\r\n]*/g, '');

  // 3. Remove nexora-logo-light.png and dark-logo class in footers
  content = content.replace(/<img[^>]*nexora-logo-light\.png[^>]*>/g, '');
  content = content.replace(/\s*dark-logo/g, '');

  // 4. Remove light-overlay element if present in hero
  content = content.replace(/<div class="[^"]*light-overlay[^"]*"><\/div>/g, '');

  // 5. Replace settings popup & drawer JS functions with mobile menu JS
  // Remove toggleSettingsPopup, closeSettingsPopup, toggleSettingsDrawer, closeSettingsDrawer, handleThemeToggle
  content = content.replace(/\/\/ Small Settings Popup Controls[\s\S]*?\/\/ Backwards-compatibility aliases[\s\S]*?function closeSettingsDrawer\(\)[^}]*\}/, '');
  content = content.replace(/function toggleSettingsPopup[\s\S]*?function closeSettingsDrawer\(\)[^}]*\}/, '');
  content = content.replace(/function handleThemeToggle[\s\S]*?localStorage\.setItem\('nexora_theme', 'dark'\);[\s\S]*?\}/, '');
  content = content.replace(/function handleThemeToggle[\s\S]*?\}\s*\}/, '}');

  // Remove theme check in DOMContentLoaded
  content = content.replace(/const saved = localStorage\.getItem\('nexora_theme'\);[\s\S]*?handleThemeToggle\(saved === 'light'\);/, '');
  content = content.replace(/const saved = localStorage\.getItem\('nexora_theme'\);[\s\S]*?handleThemeToggle\(false\);[\s\S]*?\}/, '}');

  // Update outside click listener: replace settings popup check with mobile menu check
  content = content.replace(/const setPopup = document\.getElementById\('settings-popup'\);[\s\S]*?closeSettingsPopup\(\);[\s\S]*?\}/, 
`const mMenu = document.getElementById('mobile-menu');
      const mBtn = document.getElementById('mobile-menu-btn');
      if (mMenu && !mMenu.classList.contains('hidden') && !mMenu.contains(e.target) && !mBtn.contains(e.target)) {
        closeMobileMenu();
      }`);

  // In Escape key listener: replace closeSettingsPopup() with closeMobileMenu()
  content = content.replace(/closeSettingsPopup\(\);/g, 'closeMobileMenu();');

  // Insert mobileMenuJs before the escape listener or before </script>
  if (!content.includes('function toggleMobileMenu')) {
    content = content.replace(/window\.addEventListener\('keydown',/, `${mobileMenuJs}\n    window.addEventListener('keydown',`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated', filePath);
}

processFile('index.html', 'index');
processFile('web-development.html', 'web');
processFile('mobile-app-development.html', 'mobile');
processFile('website-development.html', 'website');

