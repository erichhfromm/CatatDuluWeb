import { ReactNode } from 'react';
import { motion } from 'motion/react';

export function Card({ children, className = '', hover = false }: { children: ReactNode; className?: string; hover?: boolean }) {
  return (
    <div className={`bg-card border border-border rounded-2xl ${hover ? 'hover:shadow-lg hover:-translate-y-0.5 transition-all' : ''} ${className}`}>
      {children}
    </div>
  );
}

export function Button({
  children, variant = 'primary', size = 'md', className = '', onClick, type = 'button', icon,
}: {
  children?: ReactNode; variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg'; className?: string; onClick?: () => void; type?: 'button' | 'submit'; icon?: ReactNode;
}) {
  const sizes = { sm: 'h-8 px-3 text-xs', md: 'h-10 px-4 text-sm', lg: 'h-12 px-6 text-sm' };
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-blue-900/10',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-border bg-card hover:bg-muted text-foreground',
    ghost: 'hover:bg-muted text-foreground',
    danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    success: 'bg-[#10B981] text-white hover:bg-[#059669]',
  };
  return (
    <button type={type} onClick={onClick} className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${sizes[size]} ${variants[variant]} ${className}`}>
      {icon}
      {children}
    </button>
  );
}

export function Badge({ children, variant = 'default' }: { children: ReactNode; variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline' }) {
  const variants = {
    default: 'bg-muted text-foreground',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    danger: 'bg-red-50 text-red-700 border border-red-200',
    info: 'bg-blue-50 text-blue-700 border border-blue-200',
    outline: 'border border-border text-foreground',
  };
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${variants[variant]}`}>{children}</span>;
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full h-10 px-3 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition ${props.className || ''}`}
    />
  );
}

export function Label({ children, required }: { children: ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-semibold text-foreground mb-1.5">
      {children} {required && <span className="text-destructive">*</span>}
    </label>
  );
}

export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const initials = name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div
      className="rounded-full bg-gradient-to-br from-primary to-accent text-white font-semibold flex items-center justify-center shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  );
}

export function StatCard({
  label, value, delta, icon, accent = 'primary', variant = 'gradient',
}: {
  label: string;
  value: string;
  delta?: string;
  icon: ReactNode;
  accent?: 'primary' | 'success' | 'warning' | 'danger';
  variant?: 'flat' | 'gradient';
}) {
  const containerStyles = variant === 'gradient'
    ? {
        primary: 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-transparent shadow-md shadow-blue-500/10',
        success: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-transparent shadow-md shadow-emerald-500/10',
        warning: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white border-transparent shadow-md shadow-amber-500/10',
        danger: 'bg-gradient-to-br from-rose-500 to-red-600 text-white border-transparent shadow-md shadow-red-500/10',
      }[accent]
    : {
        primary: 'bg-card border-border text-foreground',
        success: 'bg-card border-border text-foreground',
        warning: 'bg-card border-border text-foreground',
        danger: 'bg-card border-border text-foreground',
      }[accent];

  const iconStyles = variant === 'gradient'
    ? 'bg-white/20 text-white'
    : {
        primary: 'bg-blue-50 text-blue-600',
        success: 'bg-emerald-50 text-emerald-600',
        warning: 'bg-amber-50 text-amber-600',
        danger: 'bg-red-50 text-red-600',
      }[accent];

  const labelStyles = variant === 'gradient'
    ? 'text-white/85'
    : 'text-muted-foreground';

  const badgeStyles = variant === 'gradient'
    ? 'bg-white/25 text-white border-transparent'
    : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border rounded-2xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ${containerStyles}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconStyles}`}>
          {icon}
        </div>
        {delta && (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
            badgeStyles ? badgeStyles : (delta.startsWith('-') ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700')
          }`}>
            {delta}
          </span>
        )}
      </div>
      <div className={`text-xs mb-1 font-medium ${labelStyles}`}>{label}</div>
      <div className="text-2xl font-bold tracking-tight">{value}</div>
    </motion.div>
  );
}

export function SectionHeader({ title, desc, action }: { title: string; desc?: string; action?: ReactNode }) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        <h1>{title}</h1>
        {desc && <p className="text-muted-foreground mt-1">{desc}</p>}
      </div>
      {action}
    </div>
  );
}

export function Modal({ open, onClose, title, children, footer }: { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3>{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground">✕</button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-border flex justify-end gap-2">{footer}</div>}
      </motion.div>
    </div>
  );
}
