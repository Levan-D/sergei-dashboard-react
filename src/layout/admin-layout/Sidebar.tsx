import { useLocation, useNavigate } from 'react-router-dom';
import { showToast } from '@/lib/toast';
import { cn } from '@/lib/cn';
import { useTheme } from './theme-context';
import { navItems, isActivePath } from './nav';
import { IconMoon, IconSun } from '@/components/_admin/icons';
import Avatar from '@/components/_admin/ui/Avatar';

type Props = { className?: string; onNavigate?: () => void };

export default function Sidebar({ className, onNavigate }: Props) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 z-[100] flex h-dvh w-60 min-w-60 flex-col border-r border-line bg-surface',
        className,
      )}
    >
      <div className="flex h-14 items-center gap-2.5 border-b border-line px-5 py-3 md:py-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-el bg-accent text-xs font-bold text-white">
          M
        </div>
        <div className="text-sm font-semibold text-ink">
          Motority <span className="font-normal text-ink-2">Admin</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain px-2 py-2.5">
        {navItems.map(({ path, label, icon: Icon, badge, section }) => {
          const active = isActivePath(path, pathname);
          return (
            <div key={path}>
              {section && (
                <div className="px-2 pt-2 pb-1.5 text-[10px] font-semibold tracking-[.08em] text-ink-3 uppercase md:px-3 md:pt-3">
                  {section}
                </div>
              )}
              <div
                onClick={() => {
                  navigate(path);
                  onNavigate?.();
                }}
                className={cn(
                  'mb-px flex cursor-pointer items-center gap-2.5 rounded-el px-2 py-2 text-[13.5px] font-medium transition-all duration-150 md:px-3',
                  active ? 'bg-accent-bg text-accent-light' : 'text-ink-2 hover:bg-surface-2 hover:text-ink',
                )}
              >
                <Icon size={16} className={cn('shrink-0', active ? 'opacity-100' : 'opacity-80')} />
                {label}
                {badge && (
                  <span className="ml-auto rounded-[20px] bg-red-bg px-[7px] py-px text-[11px] font-bold text-red">
                    {badge}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-line p-2 md:p-3">
        <div
          className="cursor-pointer px-1 pb-2.5"
          onClick={() => {
            toggleTheme();
            showToast(theme === 'dark' ? '☀️ Light theme enabled' : '🌙 Dark theme enabled');
          }}
        >
          <div className="relative flex rounded-lg border border-line bg-surface-3 p-[3px]">
            <div
              className={cn(
                'z-[1] flex flex-1 items-center justify-center gap-[5px] rounded-md px-1 py-1.5 text-xs font-semibold transition-colors duration-200 select-none',
                theme === 'dark' ? 'text-ink' : 'text-ink-3',
              )}
            >
              <IconMoon size={13} />
              Dark
            </div>
            <div
              className={cn(
                'z-[1] flex flex-1 items-center justify-center gap-[5px] rounded-md px-1 py-1.5 text-xs font-semibold transition-colors duration-200 select-none',
                theme === 'light' ? 'text-ink' : 'text-ink-3',
              )}
            >
              <IconSun size={13} />
              Light
            </div>
            <div
              className="pointer-events-none absolute top-[3px] left-[3px] h-[calc(100%-6px)] w-[calc(50%-3px)] rounded-md bg-surface shadow-[0_1px_4px_rgba(0,0,0,.2)] transition-transform duration-[250ms] ease-[cubic-bezier(.4,0,.2,1)]"
              style={{ transform: theme === 'light' ? 'translateX(100%)' : 'none' }}
            />
          </div>
        </div>
        <div className="flex cursor-pointer items-center gap-2.5 rounded-el p-2 hover:bg-surface-2">
          <Avatar initials="AK" />
          <div>
            <div className="text-[13px] font-semibold text-ink">Anna Kowalski</div>
            <div className="text-[11px] text-ink-3">Super Admin</div>
          </div>
        </div>
      </div>
    </nav>
  );
}
