import { NavLink } from 'react-router-dom';

export default function CategoryRail({ categories, basePath, active, countKey }) {
  return (
    <aside className="lg:sticky lg:top-20">
      <h2 className="mb-2 font-display text-sm font-semibold">Categories</h2>
      <ul className="space-y-1">
        <li>
          <NavLink
            to={basePath}
            className={`flex justify-between rounded-md px-3 py-2 text-sm ${!active ? 'bg-ink text-white' : 'hover:bg-white'}`}
          >
            All
          </NavLink>
        </li>
        {categories.map((c) => (
          <li key={c.slug}>
            <NavLink
              to={`${basePath}?category=${c.slug}`}
              className={`flex justify-between rounded-md px-3 py-2 text-sm ${active === c.slug ? 'bg-ink text-white' : 'hover:bg-white'}`}
            >
              <span>{c.name}</span>
              <span className={active === c.slug ? 'text-white/60' : 'text-ink/40'}>{c[countKey]}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}
