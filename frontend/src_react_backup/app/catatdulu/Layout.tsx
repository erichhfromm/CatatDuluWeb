import { ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, ArrowDownCircle, ArrowUpCircle, PieChart, Wallet, FileText,
  Bell, User, Settings, LogOut, Search, Sparkles, ChevronDown, Palette, AlertTriangle, Menu, X,
} from 'lucide-react';

// TAMBAHKAN 'otp-register-verify' ke dalam daftar tipe Route agar TypeScript tidak error
export type Route =
  | 'splash' | 'login' | 'register' | 'otp-register-verify'
  | 'forgot-password' | 'otp-reset-password' | 'create-new-password' | 'password-changed-success'
  | 'dashboard' | 'income' | 'expense' | 'transaction-detail'
  | 'budget' | 'analytics' | 'reports' | 'notifications'
  | 'profile' | 'settings' | 'design-system' | 'empty' | 'error';

interface Props {
  route: Route;
  setRoute: (r: Route) => void;
  children: ReactNode;
}

const navItems: { key: Route; label: string; icon: any; group?: string }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'Overview' },
  { key: 'income', label: 'Income', icon: ArrowDownCircle, group: 'Manage' },
  { key: 'expense', label: 'Expense', icon: ArrowUpCircle, group: 'Manage' },
  { key: 'budget', label: 'Budget', icon: Wallet, group: 'Manage' },
  { key: 'analytics', label: 'Analytics', icon: PieChart, group: 'Insights' },
  { key: 'reports', label: 'Reports', icon: FileText, group: 'Insights' },
  { key: 'notifications', label: 'Notifications', icon: Bell, group: 'Account' },
  { key: 'profile', label: 'Profile', icon: User, group: 'Account' },
  { key: 'settings', label: 'Settings', icon: Settings, group: 'Account' },
  { key: 'design-system', label: 'Design System', icon: Palette, group: 'System' },
  { key: 'empty', label: 'Empty States', icon: Sparkles, group: 'System' },
  { key: 'error', label: 'Error States', icon: AlertTriangle, group: 'System' },
];

function SidebarContent({ route, setRoute, onNavigate }: { route: Route; setRoute: (r: Route) => void; onNavigate?: () => void }) {
  const groups = Array.from(new Set(navItems.map((i) => i.group!)));
  return (
    <>
      <div className="h-20 px-6 flex items-center gap-3 border-b border-sidebar-border shrink-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Wallet className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="font-bold text-[15px] tracking-tight">CatatDulu</div>
          <div className="text-[11px] text-muted-foreground">Personal Finance</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {groups.map((g) => (
          <div key={g}>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 px-3">{g}</div>
            <div className="space-y-1">
              {navItems.filter((i) => i.group === g).map((item) => {
                const Icon = item.icon;
                const active = route === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => { setRoute(item.key); onNavigate?.(); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${active
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold'
                        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                      }`}
                  >
                    <Icon className={`w-[18px] h-[18px] ${active ? 'text-primary' : ''}`} />
                    <span>{item.label}</span>
                    {active && <motion.div layoutId="nav-indicator" className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border shrink-0">
        <div className="bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4" />
            <div className="text-xs font-semibold">Upgrade to Pro</div>
          </div>
          <div className="text-[11px] text-white/80 mb-3">Unlock advanced analytics & unlimited reports</div>
          <button className="w-full bg-white text-primary text-xs font-semibold py-1.5 rounded-md hover:bg-white/90">Upgrade</button>
        </div>
      </div>
    </>
  );
}

export function Layout({ route, setRoute, children }: Props) {
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[280px] bg-sidebar border-r border-sidebar-border flex-col h-screen sticky top-0 shrink-0">
        <SidebarContent route={route} setRoute={setRoute} />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] max-w-[85vw] bg-sidebar border-r border-sidebar-border z-50 flex flex-col lg:hidden"
            >
              <SidebarContent route={route} setRoute={setRoute} onNavigate={() => setOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="flex-1 min-w-0 w-full">
        <header className="h-16 sm:h-20 bg-card border-b border-border flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30 gap-2">
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted shrink-0"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden md:flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Search transactions, categories, reports..."
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-muted/40 focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
              />
            </div>
          </div>

          {/* Mobile brand */}
          <div className="md:hidden flex items-center gap-2 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center shrink-0">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            <div className="font-bold text-sm tracking-tight truncate">CatatDulu</div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setShowSearch(true)}
              className="md:hidden w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
            <button onClick={() => setRoute('notifications')} className="relative w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive" />
            </button>
            <button onClick={() => setRoute('login')} className="hidden sm:flex w-10 h-10 rounded-lg border border-border items-center justify-center hover:bg-muted" title="Logout">
              <LogOut className="w-4 h-4" />
            </button>
            <button onClick={() => setRoute('profile')} className="flex items-center gap-2 pl-1 pr-1 sm:pl-2 sm:pr-3 py-1 sm:py-1.5 rounded-lg sm:border border-border hover:bg-muted">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent text-white text-xs font-semibold flex items-center justify-center">AR</div>
              <div className="text-left hidden xl:block">
                <div className="text-xs font-semibold leading-tight">Ariana Rizki</div>
                <div className="text-[10px] text-muted-foreground leading-tight">Premium</div>
              </div>
              <ChevronDown className="w-3 h-3 text-muted-foreground hidden xl:block" />
            </button>
          </div>
        </header>

        {/* Mobile search overlay */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="md:hidden fixed top-0 inset-x-0 z-40 bg-card border-b border-border p-3 flex items-center gap-2 shadow-lg"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  autoFocus
                  placeholder="Search..."
                  className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-muted/40 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <button onClick={() => setShowSearch(false)} className="w-10 h-10 rounded-lg hover:bg-muted flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto">{children}</div>
      </main>
    </div>
  );
}