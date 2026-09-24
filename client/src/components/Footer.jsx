export default function Footer() {
  return (
    <footer className="border-t border-[#143f32] bg-[#0a2e22] text-green-50">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 text-sm sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
        <div>
          <div className="mb-3 flex items-center gap-3 font-display text-lg font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f4d77c] text-sm font-black text-[#0a2e22]">
              G
            </span>
            <span>KeffaCode</span>
          </div>
          <p className="text-green-100/80">
            Learn to code with guided tutorials, interview prep, and real coding
            challenges.
          </p>
        </div>
        <div>
          <h3 className="mb-3 font-semibold text-white">Company</h3>
          <ul className="space-y-2 text-green-100/80">
            <li>About</li>
            <li>Careers</li>
            <li>Contact</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-semibold text-white">Learning</h3>
          <ul className="space-y-2 text-green-100/80">
            <li>Tutorials</li>
            <li>Practice</li>
            <li>Courses</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-semibold text-white">Community</h3>
          <ul className="space-y-2 text-green-100/80">
            <li>Students</li>
            <li>Bootcamp</li>
            <li>Blog</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-green-100/70 sm:flex-row sm:items-center sm:justify-between lg:px-6">
          <p>© 2026 GFG Clone. All rights reserved.</p>
          <p className="font-mono">
            Built with React, Tailwind, Node and PostgreSQL
          </p>
        </div>
      </div>
    </footer>
  );
}
