import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/cn';
import { ROUTING } from '@/lib/routing';
import { titleForPath } from './nav';
import { IconArrowLeft, IconBell, IconExternal, IconMenu } from '@/components/_admin/icons';
import IconButton from '@/components/_admin/ui/IconButton';

/** Resolve the editor breadcrumb label from `/admin/catalog/{model|gen}/:name`. */
function editorLabel(pathname: string): string | null {
  const prefix = [ROUTING.adminCatalogModel, ROUTING.adminCatalogGen].find((p) => pathname.startsWith(p));
  if (!prefix) return null;
  const raw = pathname.slice(prefix.length);
  if (!raw) return null;
  const name = decodeURIComponent(raw);
  if (name === 'new') return prefix === ROUTING.adminCatalogModel ? 'Add Model' : 'Add Generation';
  return name;
}

type Props = { onMenuClick: () => void };

export default function Topbar({ onMenuClick }: Props) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const breadcrumb = editorLabel(pathname);
  const isSubPage = breadcrumb !== null;

  return (
    <div className="flex h-14 shrink-0 items-center gap-3 border-b border-line bg-surface px-4 md:gap-4 md:px-6">
      <IconButton title="Menu" className="md:hidden" onClick={onMenuClick}>
        <IconMenu size={15} />
      </IconButton>
      <div className="flex items-center">
        {isSubPage && (
          <button
            onClick={() => navigate(ROUTING.adminCatalog)}
            className="mr-1 flex cursor-pointer items-center gap-1.5 border-none bg-transparent pr-2 text-[13px] font-semibold text-ink-3 transition-colors hover:text-ink md:pr-3"
          >
            <IconArrowLeft size={16} sw={2.5} />
          </button>
        )}
        <div className="flex items-center gap-1.5 text-[13px]">
          {isSubPage && (
            <>
              <Link to={ROUTING.adminCatalog} className="cursor-pointer font-medium text-ink-3">
                Cars Catalog
              </Link>
              <p className="text-line-2">/</p>
            </>
          )}
          <p className={cn('font-semibold text-ink', isSubPage ? 'text-sm' : 'text-[15px]')}>
            {isSubPage ? breadcrumb : titleForPath(pathname)}
          </p>
        </div>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-el bg-green-bg px-2 py-[5px] text-xs font-semibold text-green before:h-1.5 before:w-1.5 before:rounded-full before:bg-green before:content-[''] md:px-3">
          Live
        </div>
        <IconButton title="Notifications" onClick={() => navigate(ROUTING.adminNotifications)}>
          <IconBell size={15} />
        </IconButton>
        <IconButton title="View landing" onClick={() => window.open(ROUTING.home, '_blank', 'noopener')}>
          <IconExternal size={15} />
        </IconButton>
      </div>
    </div>
  );
}
