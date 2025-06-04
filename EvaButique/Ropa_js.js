// script.js - Interactividad para la tienda de ropa

document.addEventListener('DOMContentLoaded', function() {
  // Variables globales
  const primaryColor = '#ff6b8b';
  const primaryDark = '#ff4d73';
  const secondaryColor = '#6c757d';
  
  // 1. Efecto de carga inicial
  function initLoadingAnimation() {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.style.position = 'fixed';
    loadingOverlay.style.top = '0';
    loadingOverlay.style.left = '0';
    loadingOverlay.style.width = '100%';
    loadingOverlay.style.height = '100%';
    loadingOverlay.style.backgroundColor = '#f9f9f9';
    loadingOverlay.style.display = 'flex';
    loadingOverlay.style.justifyContent = 'center';
    loadingOverlay.style.alignItems = 'center';
    loadingOverlay.style.zIndex = '9999';
    loadingOverlay.style.transition = 'opacity 0.5s ease';
    
    const spinner = document.createElement('div');
    spinner.style.width = '50px';
    spinner.style.height = '50px';
    spinner.style.border = `5px solid ${primaryColor}20`;
    spinner.style.borderRadius = '50%';
    spinner.style.borderTopColor = primaryColor;
    spinner.style.animation = 'spin 1s linear infinite';
    
    loadingOverlay.appendChild(spinner);
    document.body.appendChild(loadingOverlay);
    
    // Crear la animación de spin
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    
    // Ocultar después de 1.5 segundos
    setTimeout(() => {
      loadingOverlay.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(loadingOverlay);
      }, 500);
    }, 1500);
  }
  
  // 2. Efectos para las tarjetas de ropa
  function enhanceRopaCards() {
    const cards = document.querySelectorAll('.ropa-card');
    
    cards.forEach(card => {
      // Efecto hover mejorado
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
        this.style.boxShadow = `0 15px 30px ${hexToRgba(primaryColor, 0.2)}`;
        
        // Resaltar la imagen
        const img = this.querySelector('.ropa-img');
        if (img) {
          img.style.transform = 'scale(1.05)';
          img.style.transition = 'transform 0.5s ease';
        }
      });
      
      card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'var(--box-shadow)';
        
        const img = this.querySelector('.ropa-img');
        if (img) {
          img.style.transform = 'scale(1)';
        }
      });
      
      // Efecto al hacer clic
      card.addEventListener('click', function(e) {
        if (!e.target.classList.contains('ropa-btn')) {
          this.style.transform = 'scale(0.98)';
          setTimeout(() => {
            this.style.transform = 'translateY(-10px)';
          }, 200);
        }
      });
    });
  }
  
  // 3. Filtros interactivos
  function setupFilters() {
    const filterButtons = document.querySelectorAll('.filtros button');
    
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Quitar clase active de todos los botones
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Añadir clase active al botón clickeado
        this.classList.add('active');
        
        // Efecto de onda
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.backgroundColor = `${primaryColor}40`;
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 600ms linear';
        ripple.style.pointerEvents = 'none';
        
        // Posicionar el ripple
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size/2}px`;
        ripple.style.top = `${e.clientY - rect.top - size/2}px`;
        
        this.appendChild(ripple);
        
        // Eliminar el ripple después de la animación
        setTimeout(() => {
          ripple.remove();
        }, 600);
        
        // Filtrar productos (simulado)
        filterProducts(this.textContent.trim());
      });
    });
    
    // Añadir animación ripple
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // 4. Barra de búsqueda mejorada
  function enhanceSearch() {
    const searchContainer = document.querySelector('.search-container');
    const searchInput = document.getElementById('ropaSearch');
    
    if (searchInput) {
      searchInput.addEventListener('focus', function() {
        searchContainer.style.boxShadow = `0 0 0 3px ${hexToRgba(primaryColor, 0.2)}`;
        searchContainer.style.borderColor = primaryColor;
      });
      
      searchInput.addEventListener('blur', function() {
        searchContainer.style.boxShadow = 'none';
        searchContainer.style.borderColor = '#ddd';
      });
      
      // Buscar al presionar Enter
      searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          performSearch(this.value);
        }
      });
    }
  }
  
  // 5. Efecto de scroll suave para la navegación
  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      });
    });
  }
  
  // 6. Notificación al añadir al carrito
  function setupAddToCart() {
    document.querySelectorAll('.ropa-btn').forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const productName = this.closest('.ropa-card').querySelector('.ropa-name').textContent;
        showNotification(`¡${productName} añadido al carrito!`);
        
        // Efecto de confeti
        createConfetti(this);
      });
    });
  }
  
  // Función para mostrar notificación
  function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = primaryColor;
    notification.style.color = 'white';
    notification.style.padding = '15px 25px';
    notification.style.borderRadius = '8px';
    notification.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
    notification.style.zIndex = '1000';
    notification.style.transform = 'translateY(100px)';
    notification.style.opacity = '0';
    notification.style.transition = 'all 0.3s ease';
    
    document.body.appendChild(notification);
    
    // Mostrar notificación
    setTimeout(() => {
      notification.style.transform = 'translateY(0)';
      notification.style.opacity = '1';
    }, 10);
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
      notification.style.transform = 'translateY(100px)';
      notification.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
  
  // Función para crear efecto confeti
  function createConfetti(button) {
    const rect = button.getBoundingClientRect();
    const colors = [primaryColor, primaryDark, secondaryColor, '#ffffff'];
    
    for (let i = 0; i < 30; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.width = '8px';
      confetti.style.height = '8px';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.borderRadius = '50%';
      confetti.style.left = `${rect.left + rect.width/2}px`;
      confetti.style.top = `${rect.top}px`;
      confetti.style.zIndex = '1000';
      confetti.style.transform = 'translate(-50%, -50%)';
      confetti.style.opacity = '0';
      
      // Animación
      const angle = Math.random() * Math.PI * 2;
      const velocity = 5 + Math.random() * 5;
      const x = Math.cos(angle) * velocity;
      const y = Math.sin(angle) * velocity;
      
      document.body.appendChild(confetti);
      
      // Animar
      let posX = 0;
      let posY = 0;
      let opacity = 1;
      let scale = 1;
      let rotation = 0;
      
      const animate = () => {
        posX += x;
        posY += y + 0.2; // Gravedad
        opacity -= 0.02;
        scale -= 0.01;
        rotation += 2;
        
        confetti.style.transform = `translate(${posX}px, ${posY}px) rotate(${rotation}deg) scale(${scale})`;
        confetti.style.opacity = opacity;
        
        if (opacity > 0) {
          requestAnimationFrame(animate);
        } else {
          document.body.removeChild(confetti);
        }
      };
      
      // Mostrar primero
      setTimeout(() => {
        confetti.style.opacity = '1';
        animate();
      }, 10);
    }
  }
  
  // Función auxiliar para convertir hex a rgba
  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  
  // Función simulada para filtrar productos
  function filterProducts(category) {
    console.log(`Filtrando por: ${category}`);
    // Aquí iría la lógica real para filtrar los productos
    // Por simplicidad, solo mostramos un efecto visual
    
    const cards = document.querySelectorAll('.ropa-card');
    cards.forEach(card => {
      card.style.opacity = '0.5';
      card.style.transform = 'scale(0.95)';
    });
    
    setTimeout(() => {
      cards.forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
      });
    }, 500);
  }
  
  // Función simulada para realizar búsqueda
  function performSearch(query) {
    console.log(`Buscando: ${query}`);
    // Aquí iría la lógica real de búsqueda
    
    // Efecto visual
    const ropaSection = document.querySelector('.ropa-section');
    if (ropaSection) {
      ropaSection.style.opacity = '0.5';
      ropaSection.style.transform = 'translateY(20px)';
      ropaSection.style.transition = 'all 0.3s ease';
      
      setTimeout(() => {
        ropaSection.style.opacity = '1';
        ropaSection.style.transform = 'translateY(0)';
      }, 300);
    }
  }
  
  // Inicializar todas las funciones
  initLoadingAnimation();
  enhanceRopaCards();
  setupFilters();
  enhanceSearch();
  setupSmoothScroll();
  setupAddToCart();
  
  // Mostrar mensaje de bienvenida después de la carga
  setTimeout(() => {
    showNotification('¡Bienvenido a nuestra tienda de ropa!');
  }, 2000);
});