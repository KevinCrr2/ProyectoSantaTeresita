
  let cart = [];
  let deliveryType = 'delivery'; // 'delivery' or 'pickup'
  const WHATSAPP_NUMBER = '5492284606363';

  function formatCurrency(amount) {
    return '$' + Number(amount).toLocaleString('es-AR');
  }

  function toggleCartDrawer(open) {
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-drawer-backdrop');
    if (!drawer || !backdrop) return;
    if (open) {
      backdrop.classList.remove('hidden', 'pointer-events-none');
      setTimeout(() => {
        backdrop.classList.remove('opacity-0');
        drawer.classList.remove('translate-x-full');
      }, 10);
    } else {
      drawer.classList.add('translate-x-full');
      backdrop.classList.add('opacity-0');
      backdrop.classList.add('pointer-events-none');
      setTimeout(() => {
        backdrop.classList.add('hidden');
      }, 300);
    }
  }

  function addToCart(name, price, category) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ name, price: Number(price), category: category || 'Parrilla', quantity: 1 });
    }
    updateCartUI();
    showToastNotification('Agregado: ' + name);
  }

  function changeQuantity(index, delta) {
    if (cart[index]) {
      cart[index].quantity += delta;
      if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
      }
    }
    updateCartUI();
  }

  function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
  }

  function clearCart() {
    cart = [];
    updateCartUI();
  }

  function setDeliveryType(type) {
    deliveryType = type;
    const btnDelivery = document.getElementById('delivery-type-delivery');
    const btnPickup = document.getElementById('delivery-type-pickup');
    const addressContainer = document.getElementById('address-container');
    const deliveryFeeRow = document.getElementById('delivery-fee-row');
    const pickupInfoBox = document.getElementById('pickup-info-box');

    if (type === 'delivery') {
      btnDelivery.className = 'py-2 px-3 rounded text-center font-label-md text-xs uppercase tracking-wider transition-all bg-secondary-container text-white font-semibold';
      btnPickup.className = 'py-2 px-3 rounded text-center font-label-md text-xs uppercase tracking-wider transition-all text-on-surface-variant hover:text-on-surface';
      addressContainer.classList.remove('hidden');
      deliveryFeeRow.classList.remove('hidden');
      if (pickupInfoBox) pickupInfoBox.classList.add('hidden');
    } else {
      btnPickup.className = 'py-2 px-3 rounded text-center font-label-md text-xs uppercase tracking-wider transition-all bg-secondary-container text-white font-semibold';
      btnDelivery.className = 'py-2 px-3 rounded text-center font-label-md text-xs uppercase tracking-wider transition-all text-on-surface-variant hover:text-on-surface';
      addressContainer.classList.add('hidden');
      deliveryFeeRow.classList.add('hidden');
      if (pickupInfoBox) pickupInfoBox.classList.remove('hidden');
    }
  }

  function updateCartUI() {
    const container = document.getElementById('cart-items-container');
    const emptyState = document.getElementById('cart-empty-state');
    const clearBtn = document.getElementById('btn-clear-cart');
    const checkoutSection = document.getElementById('checkout-form-section');
    const floatBadge = document.getElementById('floating-badge');
    const floatTotal = document.getElementById('floating-total');
    const subtotalText = document.getElementById('cart-subtotal-text');
    const totalText = document.getElementById('cart-total-text');
    const submitBtn = document.getElementById('btn-submit-order');

    let totalItems = 0;
    let totalPrice = 0;

    container.innerHTML = '';

    if (cart.length === 0) {
      emptyState.classList.remove('hidden');
      clearBtn.classList.add('hidden');
      checkoutSection.classList.add('opacity-50', 'pointer-events-none');
      submitBtn.disabled = true;
      submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
      emptyState.classList.add('hidden');
      clearBtn.classList.remove('hidden');
      checkoutSection.classList.remove('opacity-50', 'pointer-events-none');
      submitBtn.disabled = false;
      submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');

      cart.forEach((item, index) => {
        totalItems += item.quantity;
        const itemSubtotal = item.price * item.quantity;
        totalPrice += itemSubtotal;

        const el = document.createElement('div');
        el.className = 'p-space-sm rounded-lg bg-surface-container flex items-center justify-between gap-space-sm';
        el.innerHTML = `
          <div class="flex-1 min-w-0">
            <h4 class="font-body-md font-semibold text-on-surface text-sm truncate">${item.name}</h4>
            <div class="flex items-center gap-space-xs text-xs text-on-surface-variant">
              <span class="text-tertiary">${formatCurrency(item.price)} u.</span>
              <span>• Subtotal: <strong class="text-on-surface">${formatCurrency(itemSubtotal)}</strong></span>
            </div>
          </div>
          <div class="flex items-center gap-1 shrink-0">
            <button onclick="changeQuantity(${index}, -1)" class="w-7 h-7 rounded bg-surface-container-high hover:bg-surface-variant flex items-center justify-center text-on-surface transition-colors" title="Disminuir">
              <span class="material-symbols-outlined text-[16px]">remove</span>
            </button>
            <span class="w-6 text-center text-sm font-bold text-on-surface">${item.quantity}</span>
            <button onclick="changeQuantity(${index}, 1)" class="w-7 h-7 rounded bg-surface-container-high hover:bg-surface-variant flex items-center justify-center text-on-surface transition-colors" title="Aumentar">
              <span class="material-symbols-outlined text-[16px]">add</span>
            </button>
            <button onclick="removeFromCart(${index})" title="Eliminar ítem" class="w-7 h-7 rounded bg-surface-container-high hover:bg-error/30 flex items-center justify-center text-outline hover:text-error transition-colors ml-1">
              <span class="material-symbols-outlined text-[16px]">delete</span>
            </button>
          </div>
        `;
        container.appendChild(el);
      });
    }

    if (floatBadge) floatBadge.textContent = totalItems;
    if (floatTotal) floatTotal.textContent = formatCurrency(totalPrice);
    if (subtotalText) subtotalText.textContent = formatCurrency(totalPrice);
    if (totalText) totalText.textContent = formatCurrency(totalPrice);
  }

  function showToastNotification(message) {
    const existing = document.getElementById('cart-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'cart-toast';
    toast.className = 'fixed bottom-24 right-6 z-50 bg-surface-container-high border border-tertiary/40 text-on-surface px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 transform transition-all duration-300 translate-y-2 opacity-0 font-body-sm text-sm';
    toast.innerHTML = `<span class="material-symbols-outlined text-tertiary text-[18px]">check_circle</span><span>${message}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
    }, 10);

    setTimeout(() => {
      toast.classList.add('translate-y-2', 'opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  function sendOrderToWhatsApp() {
    if (cart.length === 0) {
      alert('Por favor agregue productos al pedido.');
      return;
    }

    const name = document.getElementById('client-name').value.trim();
    const phone = document.getElementById('client-phone').value.trim();
    const address = document.getElementById('client-address').value.trim();
    const payment = document.getElementById('payment-method').value;
    const notes = document.getElementById('client-notes').value.trim();

    if (!name) {
      alert('Por favor complete su Nombre y Apellido.');
      document.getElementById('client-name').focus();
      return;
    }
    if (!phone) {
      alert('Por favor ingrese su número de teléfono / WhatsApp.');
      document.getElementById('client-phone').focus();
      return;
    }
    if (deliveryType === 'delivery' && !address) {
      alert('Por favor ingrese la dirección de entrega en Pehuajó.');
      document.getElementById('client-address').focus();
      return;
    }

    let totalPrice = 0;
    let itemsText = '';

    cart.forEach(item => {
      const itemSubtotal = item.price * item.quantity;
      totalPrice += itemSubtotal;
      itemsText += `• ${item.quantity}x ${item.name} (${formatCurrency(itemSubtotal)})\n`;
    });

    const modalidad = deliveryType === 'delivery' ? '🛵 Envío a Domicilio' : '🏪 Retiro en local Güemes 169 (BRAZAS)';
    const direccionTexto = deliveryType === 'delivery' ? `📍 Dirección: ${address}` : '📍 Modalidad: Retiro en local Güemes 169, Pehuajó';

    let message = `🔥 *NUEVO PEDIDO · BRAZAS PARRILLA PEHUAJÓ* 🔥\n`;
    message += `------------------------------------\n`;
    message += `👤 *Cliente:* ${name}\n`;
    message += `📞 *Teléfono:* ${phone}\n`;
    message += `📦 *Modalidad:* ${modalidad}\n`;
    message += `${direccionTexto}\n`;
    message += `💳 *Pago:* ${payment}\n`;
    if (notes) {
      message += `📝 *Notas:* ${notes}\n`;
    }
    message += `------------------------------------\n`;
    message += `📋 *DETALLE DEL PEDIDO:*\n`;
    message += itemsText;
    message += `------------------------------------\n`;
    message += `💰 *TOTAL A PAGAR:* ${formatCurrency(totalPrice)}\n\n`;

    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;

    window.open(waUrl, '_blank');
  }

  // Active Menu Scrollspy & Smooth Click handling
  const navLinks = document.querySelectorAll('#top-nav .nav-link, #mobile-menu .mobile-nav-link');
  const sections = [
    { id: 'hero', navPaths: ['inicio'] },
    { id: 'asador', navPaths: ['asador-y-cortes', 'carta-completa'] },
    { id: 'hamburguesas', navPaths: ['milanesas-y-hamburguesas'] },
    { id: 'milanesas', navPaths: ['milanesas-y-hamburguesas'] },
    { id: 'pizzas-empanadas', navPaths: ['pizzas-empanadas'] },
    { id: 'guarniciones', navPaths: ['contacto'] }
  ];

  function setActiveNavLink(path) {
    navLinks.forEach(link => {
      const linkPath = link.getAttribute('data-path');
      if (linkPath === path) {
        link.classList.add('text-primary', 'border-primary');
        link.classList.remove('text-on-surface-variant', 'border-transparent');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('text-primary', 'border-primary');
        link.classList.add('text-on-surface-variant', 'border-transparent');
        link.removeAttribute('aria-current');
      }
    });
  }

  function handleScrollSpy() {
    const scrollPos = window.scrollY + 140;
    for (let i = sections.length - 1; i >= 0; i--) {
      const sectionEl = document.getElementById(sections[i].id);
      if (sectionEl) {
        const top = sectionEl.offsetTop;
        if (scrollPos >= top) {
          const primaryPath = sections[i].navPaths[0];
          setActiveNavLink(primaryPath);
          return;
        }
      }
    }
    setActiveNavLink('inicio');
  }

  window.addEventListener('scroll', handleScrollSpy, { passive: true });

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const top = target.getBoundingClientRect().top + window.pageYOffset - 75;
          window.scrollTo({ top, behavior: 'smooth' });
          const path = link.getAttribute('data-path');
          setActiveNavLink(path);
        }
      }
      closeMobileMenu();
    });
  });

  // Menú desplegable mobile (hamburguesa)
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuIcon = document.getElementById('mobile-menu-icon');

  function openMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('hidden');
    mobileMenu.classList.add('flex');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    if (mobileMenuIcon) mobileMenuIcon.textContent = 'close';
  }

  function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('hidden');
    mobileMenu.classList.remove('flex');
    if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
    if (mobileMenuIcon) mobileMenuIcon.textContent = 'menu';
  }

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('flex');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  // Cerrar el menú mobile si se agranda la ventana a escritorio
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
      closeMobileMenu();
    }
  });

  // Inicializar estado del carrito y navegación
  updateCartUI();
  handleScrollSpy();
