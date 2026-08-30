const body = document.body;
const loader = document.querySelector('.loader');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-links');
const themeToggle = document.getElementById('themeToggle');
const backToTop = document.querySelector('.back-to-top');
const revealItems = document.querySelectorAll('.reveal');
const skillFilters = document.querySelectorAll('.skill-filter');
const skillCards = document.querySelectorAll('.skill-card');
const projectFilters = document.querySelectorAll('.project-filter');
const projectCards = document.querySelectorAll('.project-card');
const projectSearch = document.getElementById('projectSearch');
const modal = document.getElementById('projectModal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.querySelector('.modal-close');

function setTheme(theme) {
  const isLight = theme === 'light';
  body.classList.toggle('light-mode', isLight);
  const indicator = themeToggle ? themeToggle.querySelector('.theme-indicator') : null;
  if (indicator) indicator.textContent = isLight ? '☾' : '☀';
  localStorage.setItem('portfolio-theme', theme);
}

const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme) {
  setTheme(savedTheme);
} else {
  setTheme('dark');
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const theme = body.classList.contains('light-mode') ? 'dark' : 'light';
    setTheme(theme);
  });
}

window.addEventListener('load', () => {
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 650);
  }
});

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

if (revealItems.length > 0) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  revealItems.forEach((item) => observer.observe(item));
}

const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('main section[id], section[id]');
function updateActiveNav() {
  const scrollPosition = window.scrollY + 140;
  let activeId = '';

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      activeId = section.getAttribute('id') || '';
    }
  });

  if (activeId) {
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + activeId);
    });
  }
}
window.addEventListener('scroll', updateActiveNav);
updateActiveNav();

skillFilters.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    skillFilters.forEach((btn) => btn.classList.toggle('active', btn === button));
    skillCards.forEach((card) => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
    });
  });
});

projectFilters.forEach((button) => {
  button.addEventListener('click', () => {
    button.classList.add('active');
    projectFilters.forEach((btn) => {
      if (btn !== button) btn.classList.remove('active');
    });
    applyProjectFilters();
  });
});

function applyProjectFilters() {
  const selectedCategory = document.querySelector('.project-filter.active')?.dataset.category || 'all';
  const query = (projectSearch?.value || '').trim().toLowerCase();

  projectCards.forEach((card) => {
    const cardCategory = card.dataset.category || '';
    const cardText = (card.dataset.search || card.textContent).toLowerCase();
    const categoryMatch = selectedCategory === 'all' || cardCategory.includes(selectedCategory);
    const searchMatch = !query || cardText.includes(query);
    card.classList.toggle('hidden', !(categoryMatch && searchMatch));
  });
}

if (projectSearch) {
  projectSearch.addEventListener('input', applyProjectFilters);
}

const projectData = {
  project1: {
    title: 'Multimodal Hate Speech Detection',
    overview:
      'Developed a multimodal system for predicting hate speech detection using both audio and text data. Several models were developed and compared using metrics for Tamil, Telugu, and Malayalam.',
    sections: [
      { heading: 'Input Modalities', list: ['Audio', 'Text'] },
      { heading: 'Languages', list: ['Tamil', 'Telugu', 'Malayalam'] },
      { heading: 'Technology', list: ['Machine Learning', 'Deep Learning', 'NLP', 'LibROSA'] },
      { heading: 'Model Comparison', text: 'Several models were built and compared using metrics across the supported languages.' }
    ],
    flow: ['Audio + Text', 'ML / DL / NLP', 'Model Comparison', 'Hate Speech Detection']
  },
  project2: {
    title: 'Age Prediction',
    overview:
      'Developed an age prediction model using Convolutional Neural Networks for age estimation from facial images.',
    sections: [
      { heading: 'Problem', text: 'Age estimation from facial images.' },
      { heading: 'AI Component', text: 'Convolutional Neural Network.' },
      { heading: 'Backend', text: 'Flask.' },
      { heading: 'Frontend', text: 'React.js.' },
      { heading: 'Styling', text: 'Tailwind CSS.' },
      { heading: 'Deployment', text: 'Render and Vercel.' }
    ],
    flow: ['Facial Image', 'CNN', 'Age Prediction', 'Flask Backend', 'React Frontend']
  },
  project3: {
    title: 'Twitter Sentiment Analysis',
    overview:
      'Developed a Twitter Sentiment Analysis platform using machine learning, Flask, React.js, NLP, and real-time APIs.',
    sections: [
      { heading: 'Machine Learning', text: 'Machine learning-based sentiment analysis.' },
      { heading: 'NLP', text: 'Natural Language Processing.' },
      { heading: 'Backend', text: 'Flask.' },
      { heading: 'Frontend', text: 'React.js.' },
      { heading: 'APIs', text: 'Real-time APIs.' },
      { heading: 'Deployment', text: 'Render and Vercel.' }
    ],
    flow: ['Twitter Data', 'NLP / Machine Learning', 'Sentiment Analysis', 'Flask', 'React.js']
  }
};

document.querySelectorAll('.details-trigger').forEach((button) => {
  button.addEventListener('click', () => {
    const key = button.dataset.project;
    const data = projectData[key];
    if (!data || !modalBody || !modal) return;

    modalBody.innerHTML = `
      <h3 id="modalTitle">${data.title}</h3>
      <p>${data.overview}</p>
      <div class="modal-section">
        <h4>Project Technology Flow</h4>
        <div class="flow-diagram">
          ${data.flow.map((item, index) => `
            <span>${item}</span>
            ${index < data.flow.length - 1 ? '<span class="arrow">↓</span>' : ''}
          `).join('')}
        </div>
      </div>
      ${data.sections.map((section) => section.list ? `
        <div class="modal-section">
          <h4>${section.heading}</h4>
          <ul class="modal-list">${section.list.map((item) => `<li>${item}</li>`).join('')}</ul>
        </div>
      ` : `
        <div class="modal-section">
          <h4>${section.heading}</h4>
          <p>${section.text}</p>
        </div>
      `).join('')}
    `;

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
  });
});

function closeModal() {
  if (modal) {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  }
}

if (modalClose) modalClose.addEventListener('click', closeModal);
if (modal) {
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });
}
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal && modal.classList.contains('is-open')) closeModal();
});

if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 300);
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

if (projectCards.length > 0) {
  applyProjectFilters();
}
