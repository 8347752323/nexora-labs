const fs = require('fs');

function getScriptForIndex() {
  return `<script>
    // Initialize Lucide icons
    lucide.createIcons();

    // Services Smart Popup Controls
    function toggleServicesPopup(e) {
      if (e) e.stopPropagation();
      closeResourcesPopup();
      closePortfolioPopup();
      closeMobileMenu();
      const popup = document.getElementById('services-popup');
      const chevron = document.getElementById('services-chevron');
      if (popup.classList.contains('hidden')) {
        popup.classList.remove('hidden');
        if (chevron) chevron.classList.add('rotate-180');
        lucide.createIcons();
      } else {
        closeServicesPopup();
      }
    }

    function closeServicesPopup() {
      const popup = document.getElementById('services-popup');
      const chevron = document.getElementById('services-chevron');
      if (popup) popup.classList.add('hidden');
      if (chevron) chevron.classList.remove('rotate-180');
    }

    function selectService(serviceName) {
      closeServicesPopup();
      scrollToContact();
    }

    // Resources Smart Popup Controls
    function toggleResourcesPopup(e) {
      if (e) e.stopPropagation();
      closeServicesPopup();
      closePortfolioPopup();
      closeMobileMenu();
      const popup = document.getElementById('resources-popup');
      const chevron = document.getElementById('resources-chevron');
      if (popup.classList.contains('hidden')) {
        popup.classList.remove('hidden');
        if (chevron) chevron.classList.add('rotate-180');
        lucide.createIcons();
      } else {
        closeResourcesPopup();
      }
    }

    function closeResourcesPopup() {
      const popup = document.getElementById('resources-popup');
      const chevron = document.getElementById('resources-chevron');
      if (popup) popup.classList.add('hidden');
      if (chevron) chevron.classList.remove('rotate-180');
    }

    function selectResource(resourceName) {
      closeResourcesPopup();
      scrollToContact();
    }

    // Portfolio Smart Popup Controls
    function togglePortfolioPopup(e) {
      if (e) e.stopPropagation();
      closeServicesPopup();
      closeResourcesPopup();
      closeMobileMenu();
      const popup = document.getElementById('portfolio-popup');
      const chevron = document.getElementById('portfolio-chevron');
      if (popup.classList.contains('hidden')) {
        popup.classList.remove('hidden');
        if (chevron) chevron.classList.add('rotate-180');
        lucide.createIcons();
      } else {
        closePortfolioPopup();
      }
    }

    function closePortfolioPopup() {
      const popup = document.getElementById('portfolio-popup');
      const chevron = document.getElementById('portfolio-chevron');
      if (popup) popup.classList.add('hidden');
      if (chevron) chevron.classList.remove('rotate-180');
    }

    function selectPortfolioProject(projectName) {
      closePortfolioPopup();
      scrollToContact();
    }

    // Scroll to About Us Section
    function scrollToAbout() {
      closeServicesPopup();
      closeResourcesPopup();
      closePortfolioPopup();
      closeMobileMenu();
      const aboutSec = document.getElementById('about');
      if (aboutSec) {
        aboutSec.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    // Scroll to Contact Us Section
    function scrollToContact() {
      closeServicesPopup();
      closeResourcesPopup();
      closePortfolioPopup();
      closeMobileMenu();
      const contactSec = document.getElementById('contact');
      if (contactSec) {
        contactSec.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          const nameInput = document.getElementById('sec-contact-name');
          if (nameInput) nameInput.focus();
        }, 500);
      } else {
        window.location.href = '/#contact';
      }
    }

    // Modal compatibility
    function openContactModal() {
      scrollToContact();
    }

    function closeContactModal() {
      // Replaced with in-page section
    }

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

    // Close popups when clicking outside
    document.addEventListener('click', (e) => {
      const sPopup = document.getElementById('services-popup');
      const sBtn = document.getElementById('services-btn');
      if (sPopup && !sPopup.classList.contains('hidden') && !sPopup.contains(e.target) && !sBtn.contains(e.target)) {
        closeServicesPopup();
      }

      const rPopup = document.getElementById('resources-popup');
      const rBtn = document.getElementById('resources-btn');
      if (rPopup && !rPopup.classList.contains('hidden') && !rPopup.contains(e.target) && !rBtn.contains(e.target)) {
        closeResourcesPopup();
      }

      const pPopup = document.getElementById('portfolio-popup');
      const pBtn = document.getElementById('portfolio-btn');
      if (pPopup && !pPopup.classList.contains('hidden') && !pPopup.contains(e.target) && !pBtn.contains(e.target)) {
        closePortfolioPopup();
      }

      const mMenu = document.getElementById('mobile-menu');
      const mBtn = document.getElementById('mobile-menu-btn');
      if (mMenu && !mMenu.classList.contains('hidden') && !mMenu.contains(e.target) && !mBtn.contains(e.target)) {
        closeMobileMenu();
      }
    });

    // Listen for Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeServicesPopup();
        closeResourcesPopup();
        closePortfolioPopup();
        closeContactModal();
        closeMobileMenu();
      }
    });

    // Page Load Initializer
    document.addEventListener('DOMContentLoaded', () => {
      lucide.createIcons();

      if (window.location.hash === '#contact') {
        setTimeout(() => {
          const contactSec = document.getElementById('contact');
          if (contactSec) {
            contactSec.scrollIntoView({ behavior: 'smooth' });
            const nameInput = document.getElementById('sec-contact-name');
            if (nameInput) nameInput.focus();
          }
        }, 200);
      }
    });

    // Clear validation error when user types in in-page section
    function clearSecFieldError(field) {
      const input = document.getElementById('sec-contact-' + field);
      const err = document.getElementById('sec-err-' + field);
      if (input) input.classList.remove('border-rose-500');
      if (err) err.classList.add('hidden');
      const formErr = document.getElementById('sec-form-error');
      if (formErr) formErr.classList.add('hidden');
    }

    // In-page Section Form Validation & Submission
    function handleSectionContactSubmit(e) {
      e.preventDefault();

      const nameInput = document.getElementById('sec-contact-name');
      const emailInput = document.getElementById('sec-contact-email');
      const phoneInput = document.getElementById('sec-contact-phone');

      const nameVal = nameInput ? nameInput.value.trim() : '';
      const emailVal = emailInput ? emailInput.value.trim() : '';
      const phoneVal = phoneInput ? phoneInput.value.trim() : '';

      let hasError = false;

      if (!nameVal) {
        document.getElementById('sec-err-name').classList.remove('hidden');
        nameInput.classList.add('border-rose-500');
        hasError = true;
      } else {
        document.getElementById('sec-err-name').classList.add('hidden');
        nameInput.classList.remove('border-rose-500');
      }

      const emailPattern = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
      if (!emailVal || !emailPattern.test(emailVal)) {
        document.getElementById('sec-err-email').classList.remove('hidden');
        emailInput.classList.add('border-rose-500');
        hasError = true;
      } else {
        document.getElementById('sec-err-email').classList.add('hidden');
        emailInput.classList.remove('border-rose-500');
      }

      if (!phoneVal) {
        document.getElementById('sec-err-phone').classList.remove('hidden');
        phoneInput.classList.add('border-rose-500');
        hasError = true;
      } else {
        document.getElementById('sec-err-phone').classList.add('hidden');
        phoneInput.classList.remove('border-rose-500');
      }

      if (hasError) {
        document.getElementById('sec-form-error').classList.remove('hidden');
        return false;
      }

      document.getElementById('sec-form-error').classList.add('hidden');
      document.getElementById('section-contact-form').classList.add('hidden');
      document.getElementById('sec-contact-success').classList.remove('hidden');

      if (nameInput) nameInput.value = '';
      if (emailInput) emailInput.value = '';
      if (phoneInput) phoneInput.value = '';

      return true;
    }
  </script>`;
}

function getScriptForSecondary() {
  return `<script>
    // Initialize Lucide icons
    lucide.createIcons();

    // Services Smart Popup Controls
    function toggleServicesPopup(e) {
      if (e) e.stopPropagation();
      closeResourcesPopup();
      closePortfolioPopup();
      closeMobileMenu();
      const popup = document.getElementById('services-popup');
      const chevron = document.getElementById('services-chevron');
      if (popup.classList.contains('hidden')) {
        popup.classList.remove('hidden');
        if (chevron) chevron.classList.add('rotate-180');
        lucide.createIcons();
      } else {
        closeServicesPopup();
      }
    }

    function closeServicesPopup() {
      const popup = document.getElementById('services-popup');
      const chevron = document.getElementById('services-chevron');
      if (popup) popup.classList.add('hidden');
      if (chevron) chevron.classList.remove('rotate-180');
    }

    function selectService(serviceName) {
      closeServicesPopup();
      window.location.href = '/#contact';
    }

    // Resources Smart Popup Controls
    function toggleResourcesPopup(e) {
      if (e) e.stopPropagation();
      closeServicesPopup();
      closePortfolioPopup();
      closeMobileMenu();
      const popup = document.getElementById('resources-popup');
      const chevron = document.getElementById('resources-chevron');
      if (popup.classList.contains('hidden')) {
        popup.classList.remove('hidden');
        if (chevron) chevron.classList.add('rotate-180');
        lucide.createIcons();
      } else {
        closeResourcesPopup();
      }
    }

    function closeResourcesPopup() {
      const popup = document.getElementById('resources-popup');
      const chevron = document.getElementById('resources-chevron');
      if (popup) popup.classList.add('hidden');
      if (chevron) chevron.classList.remove('rotate-180');
    }

    function selectResource(resourceName) {
      closeResourcesPopup();
      window.location.href = '/#contact';
    }

    // Portfolio Smart Popup Controls
    function togglePortfolioPopup(e) {
      if (e) e.stopPropagation();
      closeServicesPopup();
      closeResourcesPopup();
      closeMobileMenu();
      const popup = document.getElementById('portfolio-popup');
      const chevron = document.getElementById('portfolio-chevron');
      if (popup.classList.contains('hidden')) {
        popup.classList.remove('hidden');
        if (chevron) chevron.classList.add('rotate-180');
        lucide.createIcons();
      } else {
        closePortfolioPopup();
      }
    }

    function closePortfolioPopup() {
      const popup = document.getElementById('portfolio-popup');
      const chevron = document.getElementById('portfolio-chevron');
      if (popup) popup.classList.add('hidden');
      if (chevron) chevron.classList.remove('rotate-180');
    }

    function selectPortfolioProject(projectName) {
      closePortfolioPopup();
      window.location.href = '/#contact';
    }

    // Contact controls - redirects to the About us page contact section
    function openContactModal() {
      window.location.href = '/#contact';
    }

    function closeContactModal() {
      // Replaced
    }

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

    // Close on outside click
    document.addEventListener('click', (e) => {
      const sPopup = document.getElementById('services-popup');
      const sBtn = document.getElementById('services-btn');
      if (sPopup && !sPopup.classList.contains('hidden') && !sPopup.contains(e.target) && !sBtn.contains(e.target)) {
        closeServicesPopup();
      }
      const rPopup = document.getElementById('resources-popup');
      const rBtn = document.getElementById('resources-btn');
      if (rPopup && !rPopup.classList.contains('hidden') && !rPopup.contains(e.target) && !rBtn.contains(e.target)) {
        closeResourcesPopup();
      }
      const pPopup = document.getElementById('portfolio-popup');
      const pBtn = document.getElementById('portfolio-btn');
      if (pPopup && !pPopup.classList.contains('hidden') && !pPopup.contains(e.target) && !pBtn.contains(e.target)) {
        closePortfolioPopup();
      }
      const mMenu = document.getElementById('mobile-menu');
      const mBtn = document.getElementById('mobile-menu-btn');
      if (mMenu && !mMenu.classList.contains('hidden') && !mMenu.contains(e.target) && !mBtn.contains(e.target)) {
        closeMobileMenu();
      }
    });

    // Escape listener
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeServicesPopup();
        closeResourcesPopup();
        closePortfolioPopup();
        closeMobileMenu();
      }
    });

    document.addEventListener('DOMContentLoaded', () => {
      lucide.createIcons();
    });
  </script>`;
}

function updateFileScript(filePath, isIndex) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace <script>...</script> before the chatbot script
  const scriptRegex = /<script>[\s\S]*?<\/script>\s*(?=<!-- Nexora Assistant Chatbot -->|<script src="\/assets\/chatbot\.js">)/;
  const newScript = isIndex ? getScriptForIndex() : getScriptForSecondary();

  if (!scriptRegex.test(content)) {
    console.error('Could not match script tag in', filePath);
    return;
  }

  content = content.replace(scriptRegex, newScript + '\n\n  ');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Cleaned script in', filePath);
}

updateFileScript('index.html', true);
updateFileScript('web-development.html', false);
updateFileScript('mobile-app-development.html', false);
updateFileScript('website-development.html', false);

