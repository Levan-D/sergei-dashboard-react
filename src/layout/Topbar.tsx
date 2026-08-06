import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store';
import { showToast } from '@/store/uiSlice';
import { cn } from '@/lib/cn';
import { ROUTING } from '@/lib/routing';
import { titleForPath } from './nav';
import { IconArrowLeft, IconBell, IconExternal } from '@/components/icons';
import { IconButton } from '@/components/ui';

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

export default function Topbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const breadcrumb = editorLabel(pathname);
  const isSubPage = breadcrumb !== null;

  return (
    <div className="flex h-14 shrink-0 items-center gap-4 border-b border-line bg-surface px-6">
      <div className="flex items-center">
        {isSubPage && (
          <button
            onClick={() => navigate(ROUTING.adminCatalog)}
            className="mr-1 flex cursor-pointer items-center gap-1.5 border-none bg-transparent pr-3 text-[13px] font-semibold text-ink-3 transition-colors duration-150 hover:text-ink"
          >
            <IconArrowLeft size={16} sw={2.5} />
          </button>
        )}
        <div className="flex items-center gap-1.5 text-[13px]">
          {isSubPage && (
            <>
              <span className="cursor-pointer font-medium text-ink-3" onClick={() => navigate(ROUTING.adminCatalog)}>
                Cars Catalog
              </span>
              <span className="text-line-2">/</span>
            </>
          )}
          <span className={cn('font-semibold text-ink', isSubPage ? 'text-sm' : 'text-[15px]')}>
            {isSubPage ? breadcrumb : titleForPath(pathname)}
          </span>
        </div>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-el bg-green-bg px-3 py-[5px] text-xs font-semibold text-green before:h-1.5 before:w-1.5 before:rounded-full before:bg-green before:content-['']">
          Live
        </div>
        <IconButton title="Notifications" onClick={() => navigate(ROUTING.adminNotifications)}>
          <IconBell size={15} />
        </IconButton>
        <IconButton title="View landing" onClick={() => dispatch(showToast('🔗 bmw.motority.com opened'))}>
          <IconExternal size={15} />
        </IconButton>
      </div>
    </div>
  );
}
