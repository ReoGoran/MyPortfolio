// Fungsi untuk memotong teks
function truncate(str, maxLength) {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength) + '...';
}

// Fungsi untuk escape HTML
function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, function (m) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[m];
  });
}

// Project Filter Function
function filterProjects(category) {
  const projectCards = document.querySelectorAll(".project-card");

  projectCards.forEach((card) => {
    if (category === "all" || card.dataset.category === category) {
      card.classList.remove("hidden");
    } else {
      card.classList.add("hidden");
    }
  });
}

// Create Project Filters
function createProjectFilters(projects) {
  const filtersContainer = document.querySelector(".project-filters");
  if (!filtersContainer) return;
  // Ambil semua kategori unik dari data project
  const categories = Array.from(new Set(projects.map((p) => p.category)));
  // Mapping kategori ke label
  const categoryLabels = {
    web: "Web Development",
    design: "UI/UX Design",
  };
  // Buat tombol All
  let html = '<button class="filter-btn active" data-filter="all">All</button>';
  categories.forEach((cat) => {
    const label =
      categoryLabels[cat] || cat.charAt(0).toUpperCase() + cat.slice(1);
    html += `<button class="filter-btn" data-filter="${cat}">${label}</button>`;
  });
  filtersContainer.innerHTML = html;
  // Tambahkan event listener ke tombol filter baru
  const filterButtons = filtersContainer.querySelectorAll(".filter-btn");
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
      filterProjects(this.dataset.filter);
    });
  });
}

// Add event listeners to filter buttons
document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(
    ".project-filters .filter-btn"
  );

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      // Add active class to clicked button
      this.classList.add("active");

      // Get category from data-filter attribute
      const category = this.dataset.filter;

      // Filter projects
      filterProjects(category);
    });
  });
});

// Navbar Active State Management
function manageNavbarActiveState() {
  // Get all navigation links and sections
  const navLinks = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll("section");

  // Function to update active state when clicking a link
  function updateActiveStateOnClick(e) {
    e.preventDefault();

    // Get target section ID from href
    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      // Remove active class from all nav links
      navLinks.forEach((navLink) => navLink.classList.remove("active"));

      // Add active class to clicked link
      this.classList.add("active");

      // Calculate scroll position with navbar height offset
      const navbar = document.querySelector(".navbar");
      const navbarHeight = navbar.offsetHeight;

      // Get target position and add offset
      const targetPosition =
        targetElement.getBoundingClientRect().top +
        window.pageYOffset -
        navbarHeight;

      // Smooth scroll to target position
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  }

  // Function to update active state during scroll
  function updateActiveStateOnScroll() {
    const navbar = document.querySelector(".navbar");
    const navbarHeight = navbar.offsetHeight;

    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      // Check if section is in viewport
      if (
        window.pageYOffset >= sectionTop - navbarHeight &&
        window.pageYOffset < sectionTop + sectionHeight - navbarHeight
      ) {
        current = section.getAttribute("id");
      }
    });

    // Update active state of nav links
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  }

  // Add click event listeners to nav links
  navLinks.forEach((link) => {
    link.addEventListener("click", updateActiveStateOnClick);
  });

  // Add scroll event listener
  window.addEventListener("scroll", updateActiveStateOnScroll);

  // Initial active state check
  updateActiveStateOnScroll();
}

// Modal untuk gambar profil
function initProfileImageModal() {
  const modal = document.getElementById('profileModal');
  const modalImg = document.getElementById('modalImage');
  const profileImg = document.querySelector('.profile-image img');
  const closeBtn = document.querySelector('.close-modal');

  if (!modal || !profileImg) return;

  // Buka modal saat gambar profil diklik
  profileImg.addEventListener('click', function() {
    modal.classList.add('show');
    modalImg.src = this.src;
    document.body.style.overflow = 'hidden';
  });

  // Tutup modal saat tombol close diklik
  closeBtn.addEventListener('click', function() {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
  });

  // Tutup modal saat mengklik di luar gambar
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.classList.remove('show');
      document.body.style.overflow = 'auto';
    }
  });

  // Tutup modal dengan tombol ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
      modal.classList.remove('show');
      document.body.style.overflow = 'auto';
    }
  });
}



// Smooth scroll function
function smoothScrollTo(target) {
  const element = document.querySelector(target);
  if (element) {
    const headerOffset = 90; // Adjust this value based on your header height
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}

// Initialize all components
document.addEventListener("DOMContentLoaded", () => {
  initializeCardInteractions(".article-card", ".articles-filters .filter-btn");
  initializeCardInteractions(".activity-card", ".activity-filters .filter-btn");
  initializeCardInteractions(".project-card", ".projects-filters .filter-btn");
  addHoverEffect(".article-tag");
  addHoverEffect(".article-link");
  addHoverEffect(".contact-item");
  addHoverEffect(".social-link");
  addHoverEffect(".quick-links a");
  manageNavbarActiveState();
  initProfileImageModal(); // Inisialisasi modal gambar profil
  initActivityFilters();
  
  // Add smooth scroll to quick links
  document.querySelectorAll('.quick-links a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = this.getAttribute('href');
      smoothScrollTo(target);
      
      // Close mobile menu if open
      const mobileMenu = document.querySelector('.mobile-menu');
      if (mobileMenu && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  });
});

// Theme toggle functionality
const themeToggle = document.querySelector(".theme-toggle");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");

    // Update theme toggle icon
    const icon = themeToggle.querySelector("i");
    if (document.body.classList.contains("light-mode")) {
      icon.classList.remove("fa-moon");
      icon.classList.add("fa-sun");
    } else {
      icon.classList.remove("fa-sun");
      icon.classList.add("moon");
    }
  });
}

// Update navbar background
const navbar = document.querySelector(".navbar");
if (navbar) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.style.background = "rgba(30, 41, 59, 0.95)";
    } else {
      navbar.style.background = document.body.classList.contains("light-mode")
        ? "rgba(255, 255, 255, 0.95)"
        : "rgba(30, 41, 59, 0.95)";
    }
  });
}

// Typed.js configuration
try {
  // Initialize Typed.js with optimized configuration
  const typed = new Typed(".typed-text", {
    strings: [
      'Hi, I\'m <span class="highlight">Ferdy Mulyadi Reo Goran</span>', 
      'I\'m a <span class="highlight">Web &amp; AI Developer</span>'
    ],
    typeSpeed: 40,
    backSpeed: 20,
    backDelay: 1500,
    loop: true,
    showCursor: true,
    contentType: 'html',
    cursorChar: '|',
    startDelay: 200,
    smartBackspace: true,
    fadeOut: false,
    // Menghapus jeda antar karakter
    onStringTyped: function(pos, self) {
      // Hapus cursor saat teks selesai diketik
      if (self.cursor) {
        self.cursor.remove();
        self.cursor = null;
      }
    },
    onBegin: (self) => {
      document.querySelector('.typed-text').classList.add('typing');
      // Tambahkan cursor saat mulai mengetik
      if (!self.cursor) {
        self.cursor = document.createElement('span');
        self.cursor.className = 'typed-cursor';
        self.cursor.innerHTML = '|';
        self.el.appendChild(self.cursor);
      }
    },
    onComplete: (self) => {
      document.querySelector('.typed-text').classList.remove('typing');
      // Pastikan cursor dihapus saat selesai
      if (self.cursor) {
        self.cursor.remove();
        self.cursor = null;
      }
    },
    onDestroy: (self) => {
      // Bersihkan cursor saat komponen dihancurkan
      if (self.cursor) {
        self.cursor.remove();
        self.cursor = null;
      }
    }
  });
} catch (e) {
  console.error("Typed.js error:", e);
}

// AOS initialization
try {
  AOS.init({
    duration: 1000,
    once: true,
    offset: 100,
  });
} catch (e) {
  console.error("AOS error:", e);
}

// Swiper initialization for testimonials
try {
  const swiper = new Swiper(".testimonial-slider", {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
} catch (e) {
  console.error("Swiper error:", e);
}

// Contact form handling
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("admin/contact.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        alert("Message sent successfully!");
        contactForm.reset();
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  });
}

// Stats counter animation
const stats = document.querySelectorAll(".stat-number");
if (stats.length > 0) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        stats.forEach((stat) => {
          const original = stat.textContent.trim();
          // Only animate if original is a pure number (no +, no emoji, no text)
          if (/^\d+$/.test(original)) {
            const target = parseInt(original);
            const duration = 2000;
            let current = 0;
            const increment = target / (duration / 16);
            const updateCounter = () => {
              current += increment;
              stat.textContent = Math.ceil(current);
              if (current < target) {
                requestAnimationFrame(updateCounter);
              } else {
                stat.textContent = target;
              }
            };
            updateCounter();
          } else {
            // Not a pure number, leave as is
            stat.textContent = original;
          }
        });
        observer.unobserve(entry.target);
      }
    });
  });

  observer.observe(stats[0].parentElement);
}

// Skills animation
const skillTags = document.querySelectorAll(".skill-tag");
if (skillTags.length > 0) {
  skillTags.forEach((tag) => {
    tag.addEventListener("mouseenter", () => {
      tag.style.transform = "translateY(-5px)";
    });

    tag.addEventListener("mouseleave", () => {
      tag.style.transform = "translateY(0)";
    });
  });
}

// Service cards animation
const serviceCards = document.querySelectorAll(".service-card");
if (serviceCards.length > 0) {
  serviceCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-10px)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0)";
    });
  });
}

// Social links animation
const socialLinks = document.querySelectorAll(".social-link");
if (socialLinks.length > 0) {
  socialLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      link.style.transform = "translateX(10px)";
    });

    link.addEventListener("mouseleave", () => {
      link.style.transform = "translateX(0)";
    });
  });
}

// Parallax effect for hero section
window.addEventListener("scroll", () => {
  const hero = document.querySelector(".hero");
  const scrolled = window.pageYOffset;

  hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
});

// Mobile menu toggle
// (Move this block to the end of DOMContentLoaded for better timing)
document.addEventListener("DOMContentLoaded", function () {
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navLinks = document.querySelector(".nav-links");
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      navLinks.classList.toggle("active");
      mobileMenuBtn.classList.toggle("active");
    });
    // Close menu when link clicked (mobile UX)
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        mobileMenuBtn.classList.remove("active");
      });
    });
  }
  // Close mobile menu when clicking outside
  window.addEventListener("click", (e) => {
    if (
      navLinks &&
      navLinks.classList.contains("active") &&
      !navLinks.contains(e.target) &&
      !mobileMenuBtn.contains(e.target)
    ) {
      navLinks.classList.remove("active");
      mobileMenuBtn.classList.remove("active");
    }
  });
});

// Card Interactions
function addScrollAnimation(elements) {
  elements.forEach((element) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    element.style.opacity = "0";
    element.style.transform = "translateY(20px)";
    element.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    observer.observe(element);
  });
}

function initializeCardInteractions(containerSelector, filterSelector) {
  const cards = document.querySelectorAll(containerSelector);
  const filterButtons = document.querySelectorAll(filterSelector);

  // Add animation on scroll
  addScrollAnimation(cards);

  // Add hover effects
  cards.forEach((card) => {
    const image = card.querySelector(".image");
    if (image) {
      image.addEventListener("mouseenter", () => {
        image.style.transform = "scale(1.05)";
      });

      image.addEventListener("mouseleave", () => {
        image.style.transform = "scale(1)";
      });
    }

    const achievements = card.querySelectorAll(".achievement");
    achievements.forEach((achievement) => {
      achievement.addEventListener("mouseenter", () => {
        achievement.style.transform = "scale(1.05)";
      });

      achievement.addEventListener("mouseleave", () => {
        achievement.style.transform = "scale(1)";
      });
    });
  });

  // Filter functionality
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filterValue = button.dataset.filter;
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      cards.forEach((card) => {
        if (filterValue === "all" || card.dataset.category === filterValue) {
          card.style.display = "block";
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

// Mobile Menu Toggle
function initMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const navLinksItems = document.querySelectorAll('.nav-links a');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinks.classList.toggle('active');
      mobileMenuBtn.setAttribute('aria-expanded', 
        mobileMenuBtn.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
      );
    });

    // Close menu when clicking on a link
    navLinksItems.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-links') && !e.target.closest('.mobile-menu-btn')) {
        navLinks.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

// Initialize all components
document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initializeCardInteractions(".article-card", ".articles-filters .filter-btn");
  initializeCardInteractions(".activity-card", ".activity-filters .filter-btn");
  initializeCardInteractions(".project-card", ".projects-filters .filter-btn");
});

// Add hover effect for interactive elements
function addHoverEffect(selector, transformValue = "translateX(5px)") {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    element.addEventListener("mouseenter", () => {
      element.style.transform = transformValue;
    });

    element.addEventListener("mouseleave", () => {
      element.style.transform = "translateX(0)";
    });
  });
}

// Dynamic Projects Loader
function renderProjects(projects) {
  console.log("renderProjects called with:", projects); // LOG
  const grid = document.getElementById("dynamic-projects");
  grid.innerHTML = "";
  if (!projects || projects.length === 0) {
    grid.innerHTML =
      '<div style="color:#fff;text-align:center;padding:2em;">No projects found.</div>';
    return;
  }
  projects.forEach((project) => {
    const card = document.createElement("div");
    card.className = "project-card";
    card.setAttribute("data-category", project.category);
    card.innerHTML = `
            <div class="project-image">
                ${
                  project.image_url
                    ? `<img src="../../${project.image_url}" alt="${project.title}">`
                    : ""
                }
                <div class="project-overlay">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-links">
                        ${
                          project.demo_url
                            ? `<a href="${project.demo_url}" target="_blank" class="project-link"><i class="fas fa-link"></i></a>`
                            : ""
                        }
                        ${
                          project.github_url
                            ? `<a href="${project.github_url}" target="_blank" class="project-link"><i class="fab fa-github"></i></a>`
                            : ""
                        }
                    </div>
                </div>
            </div>
        `;
    grid.appendChild(card);
  });
}
function fetchProjectsAndRender() {
  console.log("fetchProjectsAndRender called"); // LOG
  fetch("/get-projects.php")
    .then((res) => res.json())
    .then((projects) => {
      console.log("Fetched projects:", projects); // LOG
      createProjectFilters(projects); // Tambahkan filter dinamis
      renderProjects(projects);
      const activeBtn = document.querySelector(".filter-btn.active");
      if (activeBtn) {
        filterProjects(activeBtn.dataset.filter);
      }
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      const grid = document.getElementById("dynamic-projects");
      grid.innerHTML =
        '<div style="color:#fff;text-align:center;padding:2em;">Failed to load projects.</div>';
    });
}
fetchProjectsAndRender();
// Real-time update via storage event (cross-tab)
window.addEventListener("storage", function (e) {
  if (e.key === "projects_updated") {
    fetchProjectsAndRender();
  }
});

// Dinamisasi Education Section
function renderEducationSection() {
  $.post(
    "/get-education.php?ts=" + Date.now(),
    { action: "list" },
    function (res) {
      if (!res.success) return;
      let html = "";
      res.education.forEach((edu) => {
        html += `<div class="education-card">
                <div class="education-icon"><i class="fas fa-graduation-cap"></i></div>
                <div class="education-content">
                    <h3>${$("<div>").text(edu.institution).html()}</h3>
                    <p class="education-institution">${$("<div>")
                      .text(edu.field_of_study)
                      .html()}</p>
                    <p class="education-date">${formatDateLong(edu.start_date)} - ${
          !edu.end_date || edu.end_date === "null" || edu.end_date === "Now"
            ? "Sekarang"
            : formatDateLong(edu.end_date)
        }</p>
                    <ul class="education-details">
                        <li>${$("<div>").text(edu.degree).html()}</li>
                        <li>${$("<div>")
                          .text(edu.description || "")
                          .html()}</li>
                    </ul>
                </div>
            </div>`;
      });
      $(".education-grid").html(
        html ||
          '<div style="padding:2rem;text-align:center;">No education found.</div>'
      );
    },
    "json"
  );
}

// Render Experience Section (dinamis dari database)
function renderExperienceSection() {
  $.post(
    "/get-experience.php",
    { action: "list" },
    function (res) {
      console.log("Experience response:", res); // Debug log
      if (!res.success) return;
      let html = "";
      res.experience.forEach((exp) => {
        // Split description by newline, filter empty lines, dan beri centang karakter ✔ di depan tiap paragraf
        const descList = (exp.description || "")
          .split(/\r?\n/)
          .filter((line) => line.trim() !== "")
          .map((line) => `<li>✔ ${$("<div>").text(line).html()}</li>`)
          .join("");
        html += `<div class="timeline-item">
                <div class="timeline-icon"><i class="fas fa-briefcase"></i></div>
                <div class="timeline-content">
                    <div class="timeline-header">
                        <h3>${$("<div>").text(exp.position).html()}</h3>
                        <p class="timeline-company">${$("<div>")
                          .text(exp.company)
                          .html()}</p>
                        <p class="timeline-date">${formatDateLong(exp.start_date)} - ${
          exp.end_date ? formatDateLong(exp.end_date) : "Sekarang"
        }</p>
                    </div>
                    <div class="timeline-details">
                        <div class="timeline-achievements">
                            <ul>${descList}</ul>
                        </div>
                    </div>
                </div>
            </div>`;
      });
      if ($(".experience-timeline .timeline-items").length === 0) {
        $(".experience-timeline").html(
          '<div class="timeline-line"></div><div class="timeline-items"></div>'
        );
      }
      $(".experience-timeline .timeline-items").html(
        html ||
          '<div style="padding:2rem;text-align:center;">No experience found.</div>'
      );
    },
    "json"
  );
}

// Render Organization Section (dinamis dari database)
function renderOrganizationSection() {
  fetch("/get-organization.php")
    .then((res) => res.json())
    .then((data) => {
      if (!data.success || !Array.isArray(data.organization)) return;
      const grid = document.querySelector(".org-grid");
      if (!grid) return;
      let html = "";
      data.organization.forEach((org) => {
        // Split description by newline, tampilkan tiap baris sebagai achievement
        let achievements = "";
        if (org.description) {
          achievements = org.description
            .split(/\r?\n/)
            .filter((line) => line.trim() !== "")
            .map((line, i) => {
              // Pilih icon berbeda untuk 3 baris pertama, sisanya default
              let icon = "fa-code-branch";
              if (i === 1) icon = "fa-bug";
              if (i === 2) icon = "fa-comments";
              return `<div class=\"achievement\"><i class=\"fas ${icon}\"></i><span>${escapeHTML(
                line
              )}</span></div>`;
            })
            .join("");
        }
        html += `<div class=\"org-card\">
                    <div class=\"org-icon\"><i class=\"fas fa-handshake\"></i></div>
                    <div class=\"org-content\">
                        <h3>${escapeHTML(org.name)}</h3>
                        <div class=\"org-role\">${escapeHTML(org.role)}</div>
                        <div class=\"org-date\">${formatDateLong(
                          org.start_date
                        )} - ${
          org.end_date && org.end_date !== "0000-00-00"
            ? formatDateLong(org.end_date)
            : "Present"
        }</div>
                        <div class=\"org-achievements\">${achievements}</div>
                    </div>
                </div>`;
      });
      grid.innerHTML =
        html ||
        '<div style="padding:2rem;text-align:center;">No organization found.</div>';
    });
}

// Render Activity Section (dinamis dari database)
function renderActivitySection() {
  fetch("/get-activity.php")
    .then((res) => res.json())
    .then((data) => {
      console.log("Raw activity data received:", data);
      const grid = document.querySelector(".activity-grid");
      const filtersContainer = document.querySelector(".activity-filters");
      
      if (!grid) return;
      
      if (!data.success || !Array.isArray(data.activity) || data.activity.length === 0) {
        grid.innerHTML = '<div style="color:#fff;text-align:center;padding:2em;">No activity found.</div>';
        if (filtersContainer) filtersContainer.style.display = 'none';
        return;
      }
      
      // Debug: Log all activities with their categories
      console.log('All activities with their categories:');
      data.activity.forEach(act => {
        console.log(`- Title: ${act.title}, Category: ${act.category || 'undefined'}, Type: ${act.type || 'undefined'}`);
      });
      
      // Get unique categories from activities
      const categories = ['all', ...new Set(data.activity.map(act => {
        const categoryValue = act.category || act.type || 'project';
        const normalized = categoryValue.trim().toLowerCase();
        
        // Map various category names to standard ones
        const categoryMap = {
          'speaking': 'speaking',
          'talk': 'speaking',
          'presentation': 'speaking',
          'project': 'project',
          'award': 'award',
          'achievement': 'award',
          'other': 'other',
          'lainnya': 'other',
          'lain-lain': 'other',
          '': 'project' // default for empty categories
        };
        
        // If category exists in our map, use it, otherwise use the original category (lowercase)
        const mappedCategory = categoryMap[normalized] || normalized;
        console.log(`Mapped ${normalized} to: ${mappedCategory}`);
        return mappedCategory;
      }).filter(Boolean))]; // Remove any falsy values
      
      console.log('Final unique categories:', categories);
      
      // Update filter buttons based on available categories
      if (filtersContainer) {
        // Hapus semua tombol filter yang ada
        filtersContainer.innerHTML = '';
        
        // Tambahkan tombol All
        const allButton = document.createElement('button');
        allButton.className = 'filter-btn active';
        allButton.setAttribute('data-filter', 'all');
        allButton.textContent = 'All';
        filtersContainer.appendChild(allButton);
        
        // Tambahkan tombol untuk setiap kategori unik
        categories.filter(cat => cat !== 'all').forEach(cat => {
          const button = document.createElement('button');
          button.className = 'filter-btn';
          button.setAttribute('data-filter', cat);
          button.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
          filtersContainer.appendChild(button);
        });
        
        initActivityFilters();
      }
      
      // Render activity cards
      let html = "";
      data.activity.forEach((act) => {
        // Determine category - use the same mapping logic as above
        const categoryValue = act.category || act.type || 'project';
        const normalized = categoryValue.trim().toLowerCase();
        
        const categoryMap = {
          'speaking': 'speaking',
          'talk': 'speaking',
          'presentation': 'speaking',
          'project': 'project',
          'award': 'award',
          'achievement': 'award',
          'other': 'other',
          'lainnya': 'other',
          'lain-lain': 'other',
          '': 'project' // default for empty categories
        };
        
        // If category exists in our map, use it, otherwise use the original category (lowercase)
        const category = categoryMap[normalized] || normalized;
        console.log(`Rendering activity: ${act.title} with category: ${category} (original: ${categoryValue})`);
        
        // Process achievements from description
        let achievements = "";
        if (act.description) {
          achievements = act.description
            .split(/\r?\n/)
            .filter(line => line.trim() !== "")
            .map(line => 
              `<div class="achievement">
                <i class="fas fa-check-circle"></i>
                <span>${escapeHTML(line)}</span>
              </div>`
            )
            .join("");
        }
        
        // Build activity card HTML
        html += `
          <div class="activity-card" data-id="${act.id}" data-category="${category}">
            <div class="activity-image">
              ${act.image_url ? `<img src="../../${act.image_url}" alt="${escapeHTML(act.title)}">` : ''}
            </div>
            <div class="activity-content">
              <h3>${escapeHTML(act.title)}</h3>
              <div class="activity-category">${category.charAt(0).toUpperCase() + category.slice(1)}</div>
              <div class="activity-date">${formatDateLong(act.date)}</div>
              <div class="activity-achievements">${achievements}</div>
            </div>
          </div>`;
      });
      
      grid.innerHTML = html;
      
      // Add fade-in animation to activity cards
      const activityCards = grid.querySelectorAll(".activity-card");
      activityCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;
      });
      
      // Initialize animations on scroll
      if (typeof addScrollAnimation === "function") {
        addScrollAnimation(activityCards);
      }
    })
    .catch((err) => {
      console.error("Fetch activity error:", err);
      const grid = document.querySelector(".activity-grid");
      if (grid)
        grid.innerHTML =
          '<div style="color:#fff;text-align:center;padding:2em;">Failed to load activity.</div>';
    });
}

// Filter Activities Function
function filterActivities(category) {
  console.log('Filtering activities by category:', category);
  const activityCards = document.querySelectorAll('.activity-card');
  let visibleCount = 0;
  
  activityCards.forEach((card, index) => {
    const cardCategory = card.dataset.category;
    const isMatch = category === 'all' || cardCategory === category;
    
    if (isMatch) {
      card.classList.remove('hidden');
      card.style.animation = `fadeIn 0.5s ease forwards ${visibleCount * 0.05}s`;
      visibleCount++;
    } else {
      card.classList.add('hidden');
    }
  });
  
  // Update URL without page reload
  const url = new URL(window.location);
  if (category === 'all') {
    url.searchParams.delete('filter');
  } else {
    url.searchParams.set('filter', category);
  }
  window.history.pushState({}, '', url);
  
  console.log(`Showing ${visibleCount} activities for category: ${category}`);
}

// Initialize Activity Filters
function initActivityFilters() {
  const filterButtons = document.querySelectorAll('.activity-filters .filter-btn');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      this.classList.add('active');
      // Filter activities
      filterActivities(this.dataset.filter);
    });
  });
}

// Filter Articles Function
function filterArticles(category) {
  const articleCards = document.querySelectorAll('.article-card');
  
  articleCards.forEach(card => {
    if (category === 'all' || card.dataset.category === category) {
      card.style.display = '';
      card.style.animation = 'fadeIn 0.5s ease forwards';
    } else {
      card.style.display = 'none';
    }
  });
}

// Initialize Article Filters
function initArticleFilters() {
  const filterButtons = document.querySelectorAll('.articles-filters .filter-btn');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      this.classList.add('active');
      // Filter articles
      filterArticles(this.dataset.filter);
    });
  });
}

// Render Articles Section (dinamis dari database)
function renderArticlesSection() {
  fetch(`/get-articles.php?ts=${Date.now()}`)
    .then((res) => res.json())
    .then((data) => {
      const grid = document.querySelector(".articles-grid");
      const filtersContainer = document.querySelector(".articles-filters");
      if (!grid || !filtersContainer) return;
      
      // Get unique categories from articles
      const categories = ['all', ...new Set(data.articles.map(article => {
        return (article.category || 'uncategorized').toLowerCase();
      }))];
      
      // Update filter buttons
      filtersContainer.innerHTML = '';
      
      // Add 'All' button
      const allButton = document.createElement('button');
      allButton.className = 'filter-btn active';
      allButton.setAttribute('data-filter', 'all');
      allButton.textContent = 'All';
      filtersContainer.appendChild(allButton);
      
      // Add category buttons
      categories.filter(cat => cat !== 'all').forEach(category => {
        const button = document.createElement('button');
        button.className = 'filter-btn';
        button.setAttribute('data-filter', category);
        button.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        filtersContainer.appendChild(button);
      });
      
      // Initialize filters
      initArticleFilters();
      
      if (!Array.isArray(data.articles) ||
        data.articles.length === 0
      ) {
        grid.innerHTML =
          '<div style="color:#fff;text-align:center;padding:2em;">No articles found.</div>';
        return;
      }
      let html = "";
      data.articles.forEach((article) => {
        html += `
                <div class="article-card" data-category="${escapeHTML(article.category)}">
                    <div class="article-image">
                        ${
                          article.image_url
                            ? `<img src="../../${article.image_url}" 
                                 alt="${escapeHTML(article.title)}" 
                                 loading="lazy">`
                            : '<div class="no-image"></div>'
                        }
                        <div class="article-overlay">
                            <span class="article-category">${escapeHTML(categoryLabel(article.category))}</span>
                            <span class="article-date">${formatDateLong(article.date)}</span>
                        </div>
                    </div>
                    <div class="article-content">
                        <h3 class="article-title">${escapeHTML(article.title)}</h3>
                        <p class="article-excerpt">${truncate(article.excerpt || '', 120)}</p>
                        <div class="article-footer">
                            <a href="https://portofolio.mkz.my.id/pages/article/article-detail.html?id=${article.id}" 
                               class="article-link"
                               target="_self"
                               onclick="console.log('Opening:', this.href); return true;"
                               style="text-decoration: none;">
                                Read More <i class="fas fa-arrow-right"></i>
                            </a>
                        </div>
                    </div>
                </div>`;
      });
      grid.innerHTML = html;
      
      // Inisialisasi filter artikel
      initArticleFilters();
      
      // Tambahkan animasi fade-in ke semua kartu artikel
      const articleCards = grid.querySelectorAll(".article-card");
      articleCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;
      });
      
      // Aktifkan animasi scroll jika diperlukan
      if (typeof addScrollAnimation === "function") {
        addScrollAnimation(articleCards);
      }
    })
    .catch((err) => {
      console.error("Fetch articles error:", err);
      const grid = document.querySelector(".articles-grid");
      if (grid)
        grid.innerHTML =
          '<div style="color:#fff;text-align:center;padding:2em;">Failed to load articles.</div>';
    });
}
function categoryLabel(cat) {
  const map = {
    webdev: "Web Development",
    tech: "Technology",
    tutorial: "Tutorial",
    review: "Review",
    ai: "Algoritma & AI",
  };
  return map[cat] || cat;
}
function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  const month = d.toLocaleString("id-ID", { month: "long" });
  return `${month} ${d.getDate()}, ${d.getFullYear()}`;
}
function formatDateDMY(dateStr) {
  // Mendukung format yyyy-mm-dd atau yyyy/mm/dd
  if (!dateStr) return "";
  const parts = dateStr.includes("-") ? dateStr.split("-") : dateStr.split("/");
  if (parts.length === 3) {
    // yyyy-mm-dd atau yyyy/mm/dd
    return `${parts[2].padStart(2, "0")}/${parts[1].padStart(2, "0")}/${
      parts[0]
    }`;
  }
  return dateStr;
}
function formatDateLong(dateStr) {
  if (!dateStr) return "";
  // Mendukung yyyy-mm-dd atau yyyy/mm/dd
  let parts = dateStr.includes("-") ? dateStr.split("-") : dateStr.split("/");
  if (parts.length === 3) {
    // yyyy-mm-dd atau yyyy/mm/dd
    let year = parts[0];
    let month = parts[1].padStart(2, "0");
    let day = parts[2].padStart(2, "0");
    // Nama bulan Indonesia
    const bulan = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    let monthIdx = parseInt(month, 10) - 1;
    return `${parseInt(day)} ${bulan[monthIdx]}, ${year}`;
  }
  // Jika format tidak sesuai, fallback ke formatDate bawaan
  return formatDate(dateStr);
}
$(function () {
  if (typeof renderEducationSection === "function") {
    renderEducationSection();
  }
  if (typeof renderExperienceSection === "function") {
    renderExperienceSection();
  }
  if (typeof renderOrganizationSection === "function") {
    renderOrganizationSection();
  }
  if (typeof renderActivitySection === "function") {
    renderActivitySection();
  }
  if (typeof renderArticlesSection === "function") {
    renderArticlesSection();
  }
});
window.addEventListener("storage", function (e) {
  if (e.key === "activity_updated") {
    if (typeof renderActivitySection === "function") {
      renderActivitySection();
    }
  }
  if (e.key === "articles_updated") {
    if (typeof renderArticlesSection === "function") {
      renderArticlesSection();
    }
  }
});
