const { createClient } = supabase
const supabaseCliente = createClient("https://jdznsnyutvdlygtvpmmr.supabase.co" , "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impkem5zbnl1dHZkbHlndHZwbW1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyOTUxNDgsImV4cCI6MjEwMzg3MTE0OH0.LzBB-9Sqgvz8qL530aETtaCNcU-ytHGWv71l1sw89bQ")

// ===== NAVBAR EFFECTS =====
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar-custom');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.scrollY;

        if (scrollTop > 50) {
            navbar.style.boxShadow = '0 0 40px rgba(0, 82, 204, 0.5)';
        } else {
            navbar.style.boxShadow = '0 0 20px rgba(0, 82, 204, 0.3)';
        }

        // Navbar hide/show on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    navbar.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Close mobile menu
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                document.querySelector('.navbar-toggler').click();
            }
        }
    });
});

// ===== SCROLL REVEAL ANIMATION =====
const revealElements = document.querySelectorAll('.work-card, .portfolio-card, .faq-item, .section-title');

const revealOnScroll = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
                entry.target.classList.add('revealed');
            }, index * 100);
            revealOnScroll.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
});

revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px) scale(0.95)';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    revealOnScroll.observe(el);
});

// ===== FORM SUBMISSION =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const button = this.querySelector('button');
        const originalText = button.textContent;
        
        button.textContent = 'Enviando...';
        button.disabled = true;

        const formDados = new FormData(contactForm)
        const nome = formDados.get("nome")
        const msg = formDados.get("msg")

        const postMsg = await supabaseCliente
        .from("mensagens")
        .insert({
            nome,
            msg
        })
        if(postMsg){
            button.textContent = "enviado"
            button.disabled = false
        }
    });
}

// ===== BACK TO TOP BUTTON =====
function createScrollToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'scroll-to-top';
    button.setAttribute('aria-label', 'Voltar ao topo');
    
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #0052CC 0%, #0066FF 100%);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 24px;
        cursor: pointer;
        display: none;
        z-index: 999;
        transition: all 0.3s ease;
        box-shadow: 0 0 20px rgba(0, 82, 204, 0.3);
        font-weight: bold;
        align-items: center;
        justify-content: center;
    `;
    
    document.body.appendChild(button);
    
    window.addEventListener('scroll', () => {
        button.style.display = window.scrollY > 300 ? 'flex' : 'none';
    });
    
    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    button.addEventListener('mouseenter', () => {
        button.style.background = 'linear-gradient(135deg, #0066FF 0%, #00B4D8 100%)';
        button.style.transform = 'scale(1.1)';
        button.style.boxShadow = '0 0 30px rgba(0, 82, 204, 0.5)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.background = 'linear-gradient(135deg, #0052CC 0%, #0066FF 100%)';
        button.style.transform = 'scale(1)';
        button.style.boxShadow = '0 0 20px rgba(0, 82, 204, 0.3)';
    });
}

createScrollToTopButton();

// ===== ACTIVE NAV LINK =====
window.addEventListener('scroll', () => {
    let current = '';
    
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ===== PERFORMANCE & LAZY LOAD =====
if ('IntersectionObserver' in window) {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

console.log('✓ RG Organization - Sistema carregado');