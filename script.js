document.addEventListener('DOMContentLoaded', () => {
  // Smooth Body Fade-in
  document.body.classList.add('loaded');

  // Navbar Scroll & Glassmorphism Logic
  const navbar = document.getElementById('navbar');
  
  window.addEventListener('scroll', () => {
    // Effetto Solido/Trasparente (Glassmorphism)
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });



  // Mobile Dropdown Toggle (Tap/Click Support)
  const dropdown = document.querySelector('.dropdown');
  const dropbtn = document.getElementById('progetti-menu-btn') || document.querySelector('.dropbtn');
  
  if (dropbtn && dropdown) {
    dropbtn.addEventListener('click', (e) => {
      // Il tasto principale ora NON naviga mai, apre solo la tendina (coerente tra pc e mobile)
      e.preventDefault(); 
      dropdown.classList.toggle('active');
      e.stopPropagation(); // Evita la chiusura immediata catturata da "document.click"
    });
  }

  // Active Link Highlighting (Intelligent Path Matching)
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.navbar a');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
    // Highlight "PROGETTI" if we are in a sub-category or a project page
    if (href === 'progetti.html' && (
      currentPage.includes('progetto-') || 
      ['interior-design.html', 'outdoor.html', 'lighting.html'].includes(currentPage)
    )) {
      link.classList.add('active');
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (dropdown && !dropdown.contains(e.target)) {
      dropdown.classList.remove('active');
    }
  });

  // Hero Slideshow Logic (Refactored for Synchronized & Variable Durations)
  const heroSlideshows = document.querySelectorAll('.hero-slideshow');
  
  heroSlideshows.forEach(slideshow => {
    const mediaNodes = slideshow.querySelectorAll('img, video');
    const durations = slideshow.getAttribute('data-durations')?.split(',').map(Number) || [];
    
    if (mediaNodes.length > 1) {
      let currentIdx = 0;
      mediaNodes[0].classList.add('active');
      if (mediaNodes[0].tagName === 'VIDEO') {
        mediaNodes[0].play().catch(e => console.error("Autoplay preventito", e));
      }

      function startRotation() {
        // Legge la durata specifica per la slide corrente (es. 6000, 19000, 9000) o default (4.5s)
        const currentDuration = (durations.length > currentIdx) ? durations[currentIdx] : 4500;

        setTimeout(() => {
          // 1. Taglio sul nero (rimuove l'immagine corrente istantaneamente grazie al CSS)
          mediaNodes[currentIdx].classList.remove('active');

          setTimeout(() => {
            // 2. Passa alla prossima immagine/video
            currentIdx = (currentIdx + 1) % mediaNodes.length;
            const node = mediaNodes[currentIdx];
            
            // 3. Reset dei frame (Video al tempo 0, GIF resetta la source)
            if (node.tagName === 'VIDEO') {
              node.currentTime = 0;
              node.play().catch(e => console.error(e));
            } else if (node.tagName === 'IMG' && node.src.includes('.gif')) {
              const baseUrl = node.src.split('?')[0];
              node.src = baseUrl + '?t=' + new Date().getTime();
            }
            
            // 4. Mostra l'elemento
            node.classList.add('active');

            // 5. Ricorsione per la prossima slide
            startRotation();
          }, 500); // Mezzo secondo di nero assoluto richiesto

        }, currentDuration);
      }

      startRotation();
    } else if (mediaNodes.length === 1) {
      mediaNodes[0].classList.add('active');
      if (mediaNodes[0].tagName === 'VIDEO') {
        mediaNodes[0].play().catch(e => {});
      }
    }
  });
});

// Lightbox Logic - Grouped by Container
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('lightbox-modal')) {
        const lightboxHTML = `
            <div id="lightbox-modal" class="lightbox-modal">
                <span class="lightbox-close">&times;</span>
                <span class="lightbox-prev">&#10094;</span>
                <span class="lightbox-next">&#10095;</span>
                <img class="lightbox-content" id="lightbox-img">
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    }
    const modal = document.getElementById('lightbox-modal');
    const modalImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    
    let currentGallery = [];
    let currentIndex = 0;

    function showImage(index) {
        if (index < 0) {
            currentIndex = currentGallery.length - 1;
        } else if (index >= currentGallery.length) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }
        modalImg.src = currentGallery[currentIndex].src;
        
        // Hide navigation if there's only one image in the current sequence
        if (currentGallery.length <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'block';
            nextBtn.style.display = 'block';
        }
    }

    // Delegation to handle all current and future triggers
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('.lightbox-trigger');
        if (!trigger) return;

        e.preventDefault();
        
        // Find sibling triggers within the same .gallery, or treat as single if none
        const galleryContainer = trigger.closest('.gallery');
        if (galleryContainer) {
            currentGallery = Array.from(galleryContainer.querySelectorAll('.lightbox-trigger'));
        } else {
            currentGallery = [trigger];
        }
        
        currentIndex = currentGallery.indexOf(trigger);
        showImage(currentIndex);
        modal.classList.add('active');
    });

    if (modal && closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });

        prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
        nextBtn.addEventListener('click', () => showImage(currentIndex + 1));

        document.addEventListener('keydown', (e) => {
            if (!modal.classList.contains('active')) return;
            if (e.key === 'Escape') modal.classList.remove('active');
            if (e.key === 'ArrowLeft' && currentGallery.length > 1) showImage(currentIndex - 1);
            if (e.key === 'ArrowRight' && currentGallery.length > 1) showImage(currentIndex + 1);
        });
    }
});

// Impedisci il tasto destro (menu contestuale) sulle immagini
document.addEventListener('contextmenu', function(e) {
  if (e.target.tagName === 'IMG') {
    e.preventDefault();
  }
});

// Fallback automatico tra JPG, PNG, WEBP (e viceversa) se un'immagine non viene trovata
document.addEventListener('error', function(e) {
  if (e.target.tagName === 'IMG' && !e.target.dataset.triedAll) {
    const img = e.target;
    // Evitiamo loop infiniti
    if (img.dataset.attemptCount === undefined) img.dataset.attemptCount = 0;
    
    // Lista estensioni comuni da provare (Aggiunto .tif come richiesto)
    const extensions = ['.jpg', '.png', '.webp', '.jpeg', '.tif', '.tiff'];
    const currentSrc = img.src;
    const baseSrc = currentSrc.substring(0, currentSrc.lastIndexOf('.'));
    const currentExt = currentSrc.substring(currentSrc.lastIndexOf('.')).toLowerCase();
    
    // Filtriamo l'estensione che ha appena fallito
    const fallbackExtensions = extensions.filter(ext => ext !== currentExt);
    
    let attemptIdx = parseInt(img.dataset.attemptIdx || -1) + 1;
    
    if (attemptIdx < fallbackExtensions.length) {
      img.dataset.attemptIdx = attemptIdx;
      img.src = baseSrc + fallbackExtensions[attemptIdx];
    } else {
      img.dataset.triedAll = 'true'; // Abbiamo provato tutto, ci arrendiamo
    }
  }
}, true);

// Scroll Reveal Observer
document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Una volta animato, smettiamo di osservarlo per performance
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15, // L'elemento deve essere visibile al 15%
        rootMargin: '0px 0px -50px 0px' // Attiva leggermente prima che entri del tutto
    });
    
    revealElements.forEach(el => revealObserver.observe(el));
});

// Funzione Filtri Dinamici (Pagina Progetti)
document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.progetto-card');
  const grid = document.querySelector('.progetti-grid');

  if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');

        // Gestione visibilità Tag (Nascondi se filtro attivo, mostra se "All")
        if (grid) {
          if (filter === 'all') {
            grid.classList.remove('filters-active');
          } else {
            grid.classList.add('filters-active');
          }
        }

        // Aggiorna stato bottoni
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Filtra le card
        projectCards.forEach(card => {
          const category = card.getAttribute('data-category');
          
          if (filter === 'all' || category === filter) {
            card.style.display = 'block'; 
            requestAnimationFrame(() => {
              card.classList.remove('filtered-out');
            });
          } else {
            card.classList.add('filtered-out');
            // Nascondi dopo una breve transizione
            setTimeout(() => {
              if (card.classList.contains('filtered-out')) {
                card.style.display = 'none';
              }
            }, 300); 
          }
        });
      });
    });
  }
});

// Initialize Fancybox if present
document.addEventListener('DOMContentLoaded', () => {
    if (typeof Fancybox !== 'undefined') {
        Fancybox.bind('[data-fancybox]', {
            Toolbar: {
                display: {
                    left: ["infobar"],
                    middle: ["zoomIn", "zoomOut", "toggle1to1", "rotateCCW", "rotateCW", "flipX", "flipY"],
                    right: ["slideshow", "thumbs", "close"],
                },
            },
            Images: {
                Panzoom: {
                    maxScale: 2,
                },
            },
            Thumbs: {
                autoStart: true,
            },
        });
    }
});

// Funzione globale per gestione apertura client di posta "intelligente"
function apriPosta(event) {
  if(event) event.preventDefault();
  // Riconosce se il dispositivo  un telefono/tablet
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    window.location.href = 'mailto:info@dirom.it';
  } else {
    // Apri Gmail in web
    window.open('https://mail.google.com/mail/?view=cm&fs=1&to=info@dirom.it', '_blank');
  }
}

// Custom Select Dropdown Logic for Contact Form
document.addEventListener('DOMContentLoaded', () => {
  const customSelect = document.getElementById('customSelect');
  if (customSelect) {
    const trigger = customSelect.querySelector('.select-trigger');
    const options = customSelect.querySelectorAll('.select-options li');
    const hiddenInput = customSelect.querySelector('input[type="hidden"]');

    trigger.addEventListener('click', () => {
      customSelect.classList.toggle('active');
    });

    options.forEach(opt => {
      opt.addEventListener('click', () => {
        const value = opt.getAttribute('data-value');
        const text = opt.innerText;
        
        trigger.innerText = text;
        hiddenInput.value = value;
        customSelect.classList.remove('active');
        
        // Visual feedback
        trigger.style.color = '#C69881';
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (customSelect.classList.contains('active') && !customSelect.contains(e.target)) {
        customSelect.classList.remove('active');
      }
    });
  }
  // Maintenance Modal Dismissal Logic
  const maintenanceOverlay = document.getElementById('maintenance-overlay');
  const closeMaintenance = document.getElementById('close-maintenance');
  
  if (maintenanceOverlay && closeMaintenance) {
    closeMaintenance.addEventListener('click', () => {
      // Tenta di chiudere la scheda
      window.close();
      
      // Fallback: Se window.close viene bloccato (comune), reindirizza fuori
      setTimeout(() => {
        window.location.href = "https://www.google.it"; 
      }, 100);
    });
  }
});
