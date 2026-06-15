const drawer = document.getElementById('mobile-drawer');
const backdrop = document.getElementById('drawer-backdrop');
const openDrawer = document.getElementById('open-drawer');
const search = document.getElementById('mobile-search');
const openSearch = document.getElementById('open-search');
const closeSearch = document.getElementById('close-search');

function showDrawer(show) {
  if (!drawer || !backdrop) return;
  drawer.classList.toggle('hidden', !show);
  drawer.classList.toggle('flex', show);
  backdrop.classList.toggle('hidden', !show);
  document.body.style.overflow = show ? 'hidden' : '';
}

openDrawer?.addEventListener('click', () => showDrawer(true));
backdrop?.addEventListener('click', () => showDrawer(false));

openSearch?.addEventListener('click', () => {
  search?.classList.remove('hidden');
  search?.classList.add('flex');
});

closeSearch?.addEventListener('click', () => {
  search?.classList.add('hidden');
  search?.classList.remove('flex');
});

document.querySelectorAll('[data-modal-open]').forEach((button) => {
  button.addEventListener('click', () => {
    const target = document.getElementById(button.dataset.modalOpen);
    target?.classList.remove('hidden');
  });
});

document.querySelectorAll('[data-modal-close]').forEach((button) => {
  button.addEventListener('click', () => {
    button.closest('.modal')?.classList.add('hidden');
  });
});

document.querySelectorAll('.modal').forEach((modal) => {
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.classList.add('hidden');
    }
  });
});

document.querySelector('[data-toggle-password]')?.addEventListener('click', () => {
  const input = document.querySelector('[data-password]');
  if (!input) return;
  input.type = input.type === 'password' ? 'text' : 'password';
});

// Realtime Fallback Polling
(function () {
  const pollEndpoint = '/realtime/poll';
  let lastBalance = null;
  let lastUnread = null;

  async function pollRealtime() {
    try {
      const response = await fetch(pollEndpoint, {
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) return;

      const data = await response.json();
      
      if (lastBalance !== null && data.balance !== lastBalance) {
        showToast('Update: Saldo anda sekarang ' + data.balance_formatted);
        // Update DOM elements if they exist
        document.querySelectorAll('.balance-display').forEach(el => el.innerText = data.balance_formatted);
      }
      
      if (lastUnread !== null && data.unread_notifications > lastUnread) {
        showToast('Anda mendapat notifikasi baru!');
        // Find notification badge
        const badge = document.querySelector('a[href*="notifications"] span.bg-destructive');
        if (badge) badge.classList.remove('hidden');
      }

      lastBalance = data.balance;
      lastUnread = data.unread_notifications;
    } catch (e) {
      // Ignore polling errors
    }
  }

  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-primary text-primary-foreground px-5 py-3 rounded-xl shadow-lg z-50 text-sm font-semibold border border-border animate-in slide-in-from-bottom-5';
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // Poll every 5 seconds if we are on a page with a CSRF token (indicates potential auth session)
  if (document.querySelector('meta[name="csrf-token"]') && window.location.pathname !== '/login' && window.location.pathname !== '/register') {
    setInterval(pollRealtime, 5000);
    setTimeout(pollRealtime, 1000); // Initial check
  }
})();
