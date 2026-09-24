import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const links = [
  {
    to: "/tutorials",
    label: "Courses",
    items: [
      { label: "Web Development", slug: "web-development" },
      { label: "JavaScript", slug: "javascript" },
      { label: "React", slug: "react" },
      { label: "Node.js", slug: "nodejs" },
      { label: "Data Structures", slug: "data-structures" },
      { label: "Algorithms", slug: "algorithms" },
      { label: "Databases", slug: "databases" },
      { label: "AI & Data Science", slug: "ai-data-science" },
    ],
  },
  {
    to: "/tutorials",
    label: "Tutorials",
    items: [
      { label: "JavaScript", slug: "javascript" },
      { label: "HTML & CSS", slug: "html-css" },
      { label: "React", slug: "react" },
      { label: "Node.js", slug: "nodejs" },
      { label: "Databases", slug: "databases" },
    ],
  },
  {
    to: "/problems",
    label: "Interview Prep",
    items: [
      { label: "Arrays", slug: "data-structures" },
      { label: "Strings", slug: "programming-languages" },
      { label: "Dynamic Programming", slug: "algorithms" },
      { label: "System Design", slug: "system-design" },
      { label: "JavaScript", slug: "javascript" },
    ],
  },
];

const categories = [
  { label: "DSA", to: "/tutorials?category=data-structures" },
  { label: "Practice Problems", to: "/problems" },
  { label: "C++", to: "/tutorials?category=programming-languages" },
  { label: "Java", to: "/tutorials?category=java" },
  { label: "Python", to: "/tutorials?category=python" },
  { label: "JavaScript", to: "/tutorials?category=javascript" },
  { label: "Data Science", to: "/tutorials?category=ai-data-science" },
  { label: "Machine Learning", to: "/tutorials?category=machine-learning" },
  { label: "Courses", to: "/tutorials" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  function search(e) {
    e.preventDefault();
    if (!term.trim()) return;
    navigate(`/search?q=${encodeURIComponent(term.trim())}`);
    setOpen(false);
    setSearchOpen(false);
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-[#e5e7eb] bg-white text-[#111827] shadow-sm">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 lg:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <Link to="/" className="flex items-center gap-2" aria-label="KeffaCode home">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#0d6d4f] bg-[#f2f8f5] text-xl font-black text-[#0d6d4f] leading-none">
              K
            </span>
            <span className="hidden text-lg font-bold tracking-tight text-[#163b2c] sm:block">
              KeffaCode
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setSearchOpen((current) => !current)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#374151] transition hover:bg-[#eef7f3] hover:text-[#0d6d4f]"
            aria-label="Open search"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.3"
              className="h-5 w-5"
            >
              <circle cx="11" cy="11" r="5.7" />
              <path d="M16 16L21 21" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav
          ref={menuRef}
          className="hidden items-center justify-center gap-7 lg:flex"
        >
          {links.map((l) => {
            const isOpen = openDropdown === l.label;
            const targetPath = l.to;

            return (
              <div key={l.label} className="relative">
                {l.items ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenDropdown((current) =>
                          current === l.label ? null : l.label,
                        )
                      }
                      className="flex items-center gap-1 text-sm font-semibold text-[#374151] transition hover:text-[#0d6d4f]"
                      aria-expanded={isOpen}
                    >
                      <span>{l.label}</span>
                      <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      >
                        <path
                          d="M5 7.5L10 12.5L15 7.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    {isOpen && (
                      <div className="absolute left-0 top-full mt-3 w-64 rounded-2xl border border-[#dfe7e1] bg-white p-2 shadow-xl">
                        {l.items.map((item) => {
                          const destination =
                            l.label === "Interview Prep"
                              ? `/problems?category=${encodeURIComponent(item.slug)}`
                              : `/tutorials?category=${encodeURIComponent(item.slug)}`;

                          return (
                            <Link
                              key={`${l.label}-${item.slug}`}
                              to={destination}
                              onClick={() => setOpenDropdown(null)}
                              className="block rounded-xl px-3 py-2 text-sm font-medium text-[#111827] transition hover:bg-[#eef7f3] hover:text-[#0d6d4f]"
                            >
                              {item.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <NavLink
                    to={targetPath}
                    className={({ isActive }) =>
                      `flex items-center gap-1 text-sm font-semibold transition-colors ${
                        isActive
                          ? "text-[#111827]"
                          : "text-[#111827] hover:text-[#0d6d4f]"
                      }`
                    }
                  >
                    <span>{l.label}</span>
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-4 w-4"
                    >
                      <path
                        d="M5 7.5L10 12.5L15 7.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </NavLink>
                )}
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="hidden text-sm font-medium text-[#111827] hover:text-[#0d6d4f] sm:block"
                >
                  Admin
                </Link>
              )}
              <Link
                to="/profile"
                className="rounded-full border border-[#d9dfe0] bg-white px-4 py-2 text-sm font-semibold text-[#111827] shadow-sm hover:border-[#0d6d4f] hover:text-[#0d6d4f]"
              >
                {user.username}
              </Link>
              <button
                onClick={logout}
                className="text-sm font-medium text-[#111827] hover:text-[#0d6d4f]"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d7dbdc] bg-[#f7f7f7] text-[#111827] shadow-sm transition hover:border-[#0d6d4f]"
                aria-label="Notifications"
              >
                <span className="relative flex h-5 w-5 items-center justify-center">
                  <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-[#ff4b4b] ring-2 ring-[#f3f3f4]" />
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    className="h-5 w-5"
                  >
                    <path
                      d="M13 18H11M6 9C6 6.5 7.8 4.5 10.4 4.5C13.1 4.5 15 6.7 15 9.1V14.7L17 17H5L6 14.7V9Z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
              <Link
                to="/login"
                className="rounded-md bg-[#0d6d4f] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#09543d]"
              >
                Sign In
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="flex h-9 w-9 items-center justify-center rounded-md text-[#374151] transition hover:bg-[#eef7f3] hover:text-[#0d6d4f] lg:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={open}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      <div className="border-t border-[#edf0ee] bg-[#f6f8f7]">
        <div className="mx-auto flex h-12 max-w-[1440px] items-center gap-1 overflow-x-auto px-4 text-sm font-medium lg:px-6">
          {categories.map(({ label, to }) => (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-md px-3 py-2 transition-colors hover:bg-[#e7f3ed] hover:text-[#0d6d4f] ${
                  isActive ? "text-[#0d6d4f]" : "text-[#111827]"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-[#e5e7eb] bg-white px-4 py-3 shadow-sm">
          <form onSubmit={search} className="mx-auto flex max-w-[720px] gap-2">
            <input
              autoFocus
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder="Search tutorials and problems"
              className="min-w-0 flex-1 rounded-md border border-[#cfd8d3] px-3 py-2 text-sm outline-none transition focus:border-[#0d6d4f] focus:ring-2 focus:ring-[#0d6d4f]/15"
            />
            <button className="rounded-md bg-[#0d6d4f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#09543d]">
              Search
            </button>
          </form>
        </div>
      )}

      {open && (
        <div className="border-t border-white/10 bg-[#0a2e22] px-4 py-3 lg:hidden">
          <form onSubmit={search} className="mb-3">
            <input
              className="w-full rounded-full border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-green-100/70 focus:border-[#f4d77c] focus:outline-none"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search"
            />
          </form>
          {links.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm text-green-100/80 hover:text-white"
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
