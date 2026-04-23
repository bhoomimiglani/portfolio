// ═══════════════════════════════════════════════════════════════
//  PORTFOLIO WEBSITE - MAIN JAVASCRIPT
// ═══════════════════════════════════════════════════════════════

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  initConfig();
  initNavigation();
  initHeroCanvas();
  initTypingEffect();
  initScrollAnimations();
  initSkillBars();
  initProjects();
  initContactForm();
  initFooter();
});

// ─────────────────────────────────────────────────────────────────
//  CONFIG INITIALIZATION
// ─────────────────────────────────────────────────────────────────
function initConfig() {
  // Update name
  const heroName = document.getElementById('heroName');
  if (heroName) heroName.textContent = CONFIG.name;

  // Update social links
  const githubLinks = ['heroGithub', 'aboutGithub', 'contactGithub', 'viewAllGithub'];
  githubLinks.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.href = CONFIG.github;
  });

  const linkedinLinks = ['heroLinkedin', 'aboutLinkedin', 'contactLinkedin'];
  linkedinLinks.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.href = CONFIG.linkedin;
  });

  // Update contact GitHub username
  const contactGithub = document.getElementById('contactGithub');
  if (contactGithub) contactGithub.textContent = CONFIG.githubUsername;

  // Update stats
  const statNums = document.querySelectorAll('.stat-num');
  statNums.forEach((num, idx) => {
    const values = [CONFIG.stats.projects, CONFIG.stats.experience, CONFIG.stats.technologies];
    if (values[idx]) num.setAttribute('data-target', values[idx]);
  });

  // Update profile photo with better error handling
  const profilePhoto = document.getElementById('profilePhoto');
  const photoPlaceholder = document.getElementById('photoPlaceholder');
  
  if (profilePhoto && photoPlaceholder) {
    // Show loading state
    photoPlaceholder.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Loading Photo...</span>';
    photoPlaceholder.className = 'photo-placeholder loading';
    photoPlaceholder.style.display = 'flex';
    
    // Create a new image to test if it loads
    const testImg = new Image();
    testImg.onload = function() {
      // Image loaded successfully
      console.log('✅ Profile photo loaded successfully:', CONFIG.profilePhoto);
      profilePhoto.src = CONFIG.profilePhoto;
      profilePhoto.style.display = 'block';
      photoPlaceholder.style.display = 'none';
    };
    testImg.onerror = function() {
      // Image failed to load
      console.error('❌ Failed to load profile photo:', CONFIG.profilePhoto);
      photoPlaceholder.innerHTML = '<i class="fas fa-user"></i><span>Photo Not Found</span><small style="font-size: 0.8rem; margin-top: 0.5rem;">Add ' + CONFIG.profilePhoto + '</small>';
      photoPlaceholder.className = 'photo-placeholder';
      photoPlaceholder.style.display = 'flex';
      profilePhoto.style.display = 'none';
    };
    
    // Add timeout for slow loading
    setTimeout(() => {
      if (!testImg.complete) {
        console.warn('⏰ Profile photo loading timeout');
        photoPlaceholder.innerHTML = '<i class="fas fa-clock"></i><span>Loading Slow</span><small style="font-size: 0.8rem; margin-top: 0.5rem;">Check file size</small>';
      }
    }, 5000);
    
    testImg.src = CONFIG.profilePhoto;
  }
}

// ─────────────────────────────────────────────────────────────────
//  NAVIGATION
// ─────────────────────────────────────────────────────────────────
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const links = document.querySelectorAll('.nav-link');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active section highlighting
    let current = '';
    document.querySelectorAll('.section').forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile menu toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close menu on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}

// ─────────────────────────────────────────────────────────────────
//  HERO CANVAS ANIMATION (Particle Network)
// ─────────────────────────────────────────────────────────────────
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    initParticles();
  }

  function initParticles() {
    particles = [];
    const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      // Update position
      p.x += p.vx;
      p.y += p.vy;

      // Bounce off edges
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(99, 102, 241, 0.6)';
      ctx.fill();

      // Draw connections
      particles.slice(i + 1).forEach(p2 => {
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(99, 102, 241, ${0.2 * (1 - distance / 120)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });
    });

    animationId = requestAnimationFrame(drawParticles);
  }

  resize();
  drawParticles();

  window.addEventListener('resize', resize);
}

// ─────────────────────────────────────────────────────────────────
//  TYPING EFFECT
// ─────────────────────────────────────────────────────────────────
function initTypingEffect() {
  const typedText = document.getElementById('typedText');
  if (!typedText) return;

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const pauseTime = 2000;

  function type() {
    const currentRole = CONFIG.roles[roleIndex];
    
    if (isDeleting) {
      typedText.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedText.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    let timeout = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentRole.length) {
      timeout = pauseTime;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % CONFIG.roles.length;
    }

    setTimeout(type, timeout);
  }

  type();
}

// ─────────────────────────────────────────────────────────────────
//  SCROLL ANIMATIONS
// ─────────────────────────────────────────────────────────────────
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          
          // Animate stats
          if (entry.target.classList.contains('stat-card')) {
            animateStats();
          }
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.about-grid, .skill-category, .stat-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

function animateStats() {
  const statNums = document.querySelectorAll('.stat-num');
  statNums.forEach(num => {
    const target = parseInt(num.getAttribute('data-target'));
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        num.textContent = target;
        clearInterval(timer);
      } else {
        num.textContent = Math.floor(current);
      }
    }, 30);
  });
}

// ─────────────────────────────────────────────────────────────────
//  SKILL BARS ANIMATION
// ─────────────────────────────────────────────────────────────────
function initSkillBars() {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fills = entry.target.querySelectorAll('.skill-fill');
          fills.forEach(fill => {
            const width = fill.getAttribute('data-width');
            fill.style.width = width + '%';
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  document.querySelectorAll('.skill-category').forEach(category => {
    observer.observe(category);
  });
}

// ─────────────────────────────────────────────────────────────────
//  PROJECTS - FETCH FROM GITHUB (single API call + localStorage cache)
// ─────────────────────────────────────────────────────────────────
const CACHE_KEY   = `gh_repos_${CONFIG.githubUsername}`;
const CACHE_TTL   = 60 * 60 * 1000; // 1 hour in ms

async function initProjects() {
  const projectsGrid = document.getElementById('projectsGrid');
  if (!projectsGrid) return;

  projectsGrid.innerHTML = `
    <div class="projects-loading">
      <div class="loader-ring"></div>
      <p>Fetching projects from GitHub…</p>
    </div>`;

  try {
    let repos = loadCache();

    if (!repos) {
      // ── Single API call — no per-repo language requests ──
      const response = await fetch(
        `https://api.github.com/users/${CONFIG.githubUsername}/repos?sort=stars&per_page=100`,
        { headers: { 'Accept': 'application/vnd.github.v3+json' } }
      );

      if (response.status === 403) {
        const reset = response.headers.get('X-RateLimit-Reset');
        const t = reset ? new Date(reset * 1000).toLocaleTimeString() : 'soon';
        throw new Error(`rate_limit:Rate limit exceeded. Resets at ${t}.`);
      }
      if (response.status === 404) {
        throw new Error(`not_found:User "${CONFIG.githubUsername}" not found.`);
      }
      if (!response.ok) {
        throw new Error(`http_error:GitHub returned status ${response.status}.`);
      }

      repos = await response.json();
      saveCache(repos);
    }

    // Filter forks, apply pin list, sort, limit
    repos = repos.filter(r => !r.fork);
    if (CONFIG.pinnedRepos && CONFIG.pinnedRepos.length > 0) {
      repos = repos.filter(r => CONFIG.pinnedRepos.includes(r.name));
    }
    repos.sort((a, b) =>
      b.stargazers_count - a.stargazers_count ||
      new Date(b.updated_at) - new Date(a.updated_at)
    );
    repos = repos.slice(0, CONFIG.maxProjects);

    if (repos.length === 0) {
      projectsGrid.innerHTML = `
        <div class="projects-loading">
          <p style="color:var(--text-secondary);">
            No public repositories found for <strong>${CONFIG.githubUsername}</strong>.
          </p>
        </div>`;
      return;
    }

    projectsGrid.innerHTML = '';
    repos.forEach((repo, i) => projectsGrid.appendChild(createProjectCard(repo, i)));
    initProjectFilters();

  } catch (error) {
    console.error('GitHub fetch error:', error.message);

    let title  = 'Could not load projects';
    let detail = error.message;
    let hint   = '';

    if (error.message.startsWith('rate_limit:')) {
      detail = error.message.replace('rate_limit:', '');
      hint   = 'Results are cached for 1 hour. The cache will be used on next reload once the limit resets.';
    } else if (error.message.startsWith('not_found:')) {
      detail = error.message.replace('not_found:', '');
      hint   = 'Check <code>githubUsername</code> in <code>js/config.js</code>.';
    } else if (error.message.startsWith('http_error:')) {
      detail = error.message.replace('http_error:', '');
      hint   = 'GitHub API may be temporarily unavailable.';
    } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      detail = 'Network request blocked.';
      hint   = 'Open the site via a local server (e.g. VS Code Live Server) instead of double-clicking the HTML file.';
    }

    projectsGrid.innerHTML = `
      <div class="projects-error">
        <div class="error-icon"><i class="fab fa-github"></i></div>
        <h3>${title}</h3>
        <p>${detail}</p>
        ${hint ? `<p class="error-hint">${hint}</p>` : ''}
        <button class="btn btn-outline" onclick="initProjects()" style="margin-top:1.5rem;">
          <i class="fas fa-redo"></i> Retry
        </button>
      </div>`;
  }
}

// ── Cache helpers ──────────────────────────────────────────────
function saveCache(repos) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), repos }));
  } catch (_) {}
}

function loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { ts, repos } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) { localStorage.removeItem(CACHE_KEY); return null; }
    console.log('📦 Loaded projects from cache');
    return repos;
  } catch (_) { return null; }
}

// ── Card builder — uses repo.language (no extra API calls) ─────
function createProjectCard(repo, index) {
  const card = document.createElement('div');
  card.className = 'project-card';
  card.style.animationDelay = `${index * 0.1}s`;
  card.setAttribute('data-language', repo.language || 'Other');

  // Language tag — from the repo object itself (no extra request needed)
  const langTag = repo.language
    ? `<span class="project-tag">${repo.language}</span>`
    : '';

  // Topic tags
  const topicsHtml = (repo.topics && repo.topics.length > 0)
    ? repo.topics.map(t => `<span class="project-tag topic-tag">${t}</span>`).join('')
    : '';

  const stars      = repo.stargazers_count || 0;
  const forks      = repo.forks_count      || 0;
  const lastUpdated = new Date(repo.updated_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });

  card.innerHTML = `
    <div class="project-header">
      <h3 class="project-title">
        <i class="fas fa-folder-open" style="color:var(--accent-primary);margin-right:0.5rem;font-size:1rem;"></i>
        ${repo.name}
      </h3>
      <span class="project-updated"><i class="fas fa-clock" style="margin-right:0.3rem;"></i>${lastUpdated}</span>
    </div>
    <div class="project-body">
      <p class="project-tech-label">Technologies</p>
      <div class="project-tags">
        ${langTag}${topicsHtml}
      </div>
      <div class="project-stats">
        <span class="project-stat"><i class="fas fa-star"></i> ${stars}</span>
        <span class="project-stat"><i class="fas fa-code-branch"></i> ${forks}</span>
        <span class="project-stat"><i class="fas fa-weight-hanging"></i> ${repo.size} KB</span>
      </div>
    </div>
    <div class="project-footer">
      <a href="${repo.html_url}" target="_blank" class="project-link">
        <i class="fab fa-github"></i> View Code
      </a>
      ${repo.homepage ? `
        <a href="${repo.homepage}" target="_blank" class="project-link">
          <i class="fas fa-external-link-alt"></i> Live Demo
        </a>` : ''}
    </div>`;

  return card;
}

function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter projects
      projectCards.forEach(card => {
        const language = card.getAttribute('data-language');
        if (filter === 'all' || language === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// ─────────────────────────────────────────────────────────────────
//  CONTACT FORM
// ─────────────────────────────────────────────────────────────────
function initContactForm() {
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
      name: form.name.value,
      email: form.email.value,
      subject: form.subject.value,
      message: form.message.value,
    };

    // Show loading state
    formStatus.textContent = 'Sending message...';
    formStatus.className = 'form-status';
    formStatus.style.display = 'block';

    // Check if in test mode
    if (CONFIG.contactForm.testMode) {
      // Simulate sending
      setTimeout(() => {
        formStatus.textContent = '✓ TEST MODE: Form validation passed! Set up email service to send real messages.';
        formStatus.className = 'form-status success';
        form.reset();
        
        console.log('📧 Form data (test mode):', formData);
        console.log('💡 To enable real email sending, check EMAIL_SETUP_GUIDE.md');
        
        setTimeout(() => formStatus.style.display = 'none', 8000);
      }, 1500);
      return;
    }

    try {
      let response;
      
      switch (CONFIG.contactForm.service) {
        case 'formspree':
          response = await fetch(`https://formspree.io/f/${CONFIG.contactForm.formspreeId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
          });
          break;
          
        case 'mailto':
          const mailtoLink = `mailto:${CONFIG.email}?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`From: ${formData.name} (${formData.email})\n\n${formData.message}`)}`;
          window.location.href = mailtoLink;
          formStatus.textContent = '✓ Opening your email client...';
          formStatus.className = 'form-status success';
          setTimeout(() => formStatus.style.display = 'none', 3000);
          return;
          
        default:
          throw new Error('Email service not configured. Check config.js');
      }

      if (response && response.ok) {
        formStatus.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
        formStatus.className = 'form-status success';
        form.reset();
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      formStatus.textContent = '✗ Failed to send message. Please try again or email me directly at ' + CONFIG.email;
      formStatus.className = 'form-status error';
    }

    setTimeout(() => formStatus.style.display = 'none', 5000);
  });
}

// ─────────────────────────────────────────────────────────────────
//  FOOTER
// ─────────────────────────────────────────────────────────────────
function initFooter() {
  const footerYear = document.getElementById('footerYear');
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }
}
