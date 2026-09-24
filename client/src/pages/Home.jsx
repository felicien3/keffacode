import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api.js";
import Difficulty from "../components/Difficulty.jsx";

const topPills = [
  { label: "Placement 360", to: "/problems" },
  { label: "Data Science 360", to: "/search?q=data+science" },
  { label: "Full Stack Dev", to: "/tutorials?category=web-development" },
];

const fallbackExploreCards = [
  {
    title: "Data Structure and Algorithms",
    slug: "data-structures",
    tone: "bg-[#6a8cc8]",
  },
  { title: "Web Development", slug: "web-development", tone: "bg-[#d78f92]" },
  {
    title: "AI ML & Data Science",
    slug: "ai-data-science",
    tone: "bg-[#7fbc8d]",
  },
  { title: "Machine Learning", slug: "machine-learning", tone: "bg-[#b3a4d8]" },
  { title: "Python", slug: "python", tone: "bg-[#d5b37a]" },
  { title: "Java", slug: "java", tone: "bg-[#d7b2c4]" },
  { title: "System Design", slug: "system-design", tone: "bg-[#8ec3c9]" },
  { title: "DevOps", slug: "devops", tone: "bg-[#d8c288]" },
  {
    title: "Programming Languages",
    slug: "programming-languages",
    tone: "bg-[#a5b3c5]",
  },
  { title: "CS Subjects", slug: "cs-subjects", tone: "bg-[#d7a49d]" },
  { title: "Databases", slug: "databases", tone: "bg-[#b8a9d8]" },
  { title: "Software & Tools", slug: "software-tools", tone: "bg-[#d7b3a4]" },
];

const courses = [
  {
    title: "DSA & System Design",
    subtitle: "SDE Interview Prep",
    tag: "LIVE COURSE",
    bg: "bg-[#c8d9f4]",
    rating: "4.7",
  },
  {
    title: "AI Engineering",
    subtitle: "Generative AI & Agentic AI",
    tag: "LIVE COURSE",
    bg: "bg-[#c5ebff]",
    rating: "4.7",
  },
  {
    title: "DevOps & Cloud",
    subtitle: "AWS, Docker, Kubernetes & AI",
    tag: "LIVE COURSE",
    bg: "bg-[#d1f0d5]",
    rating: "4.7",
  },
  {
    title: "Java Backend",
    subtitle: "Spring Boot, Microservices & AI",
    tag: "LIVE COURSE",
    bg: "bg-[#d1e3df]",
    rating: "4.6",
  },
  {
    title: "MERN Full Stack",
    subtitle: "React, Node & MongoDB",
    tag: "LIVE COURSE",
    bg: "bg-[#d8c9f5]",
    rating: "4.7",
  },
  {
    title: "System Design",
    subtitle: "HLD, Scalability & Distributed Systems",
    tag: "LIVE COURSE",
    bg: "bg-[#d9c3df]",
    rating: "4.9",
  },
];

const mustExplore = [
  { label: "Trending Now", to: "/search?q=trending+now" },
  { label: "Watch Videos", to: "/search?q=watch+videos" },
  { label: "GfG Coding Contest", to: "/search?q=coding+contest" },
  { label: "Advertise with Us", to: "/" },
];

const footerSections = {
  Company: [
    "About Us",
    "Legal",
    "Privacy Policy",
    "Contact Us",
    "Advertise with us",
  ],
  Explore: ["POTD", "Job-A-Thon", "Blogs", "Nation Skill Up", "GFG Corporate"],
  Tutorials: [
    "Programming Languages",
    "DSA",
    "Web Technology",
    "AI, ML & Data Science",
    "DevOps",
    "Software and Tools",
  ],
  Courses: [
    "ML and Data Science",
    "DSA",
    "Java",
    "C++",
    "Web Development",
    "Programming Languages",
    "CS Core Subjects",
    "Interview Preparation",
  ],
  Videos: [
    "DSA",
    "Python",
    "Java",
    "C++",
    "Web Development",
    "Data Science",
    "System Design",
    "GFG 160",
  ],
  Preparation: [
    "Interview Corner",
    "Aptitude",
    "Puzzles",
    "GfG 160",
    "Data Science",
    "System Design",
  ],
};

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [tutorials, setTutorials] = useState([]);
  const [problems, setProblems] = useState([]);

  const exploreCards = categories.length
    ? categories.slice(0, 12).map((category, index) => ({
        title: category.name,
        slug: category.slug,
        tone: fallbackExploreCards[index % fallbackExploreCards.length].tone,
      }))
    : fallbackExploreCards;

  const courseNotes = tutorials.length
    ? tutorials.slice(0, 6).map((tutorial) => ({
        title: tutorial.title,
        summary: tutorial.summary,
        category: tutorial.category || "Course note",
        slug: tutorial.slug,
      }))
    : [
        {
          title: "JavaScript Event Loop",
          summary:
            "Understand how the stack, queue, and microtasks behave together.",
          category: "JavaScript",
          slug: "javascript-event-loop",
        },
        {
          title: "Flexbox in One Page",
          summary:
            "Learn the container and item rules that power modern layouts.",
          category: "HTML & CSS",
          slug: "flexbox-in-one-page",
        },
        {
          title: "Writing Your First JOIN",
          summary:
            "Understand tables, related data, and how relational queries really work.",
          category: "Databases",
          slug: "writing-your-first-join",
        },
      ];

  useEffect(() => {
    api("/categories")
      .then(setCategories)
      .catch(() => {});
    api("/tutorials?limit=4")
      .then(setTutorials)
      .catch(() => {});
    api("/problems")
      .then((p) => setProblems(p.slice(0, 5)))
      .catch(() => {});
  }, []);

  return (
    <div className="bg-[#f4f3f4] text-[#0b1f2a]">
      <div className="bg-[#dfeae6] px-4 py-8 lg:px-6">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="font-display text-[2rem] font-bold tracking-tight text-[#111827] sm:text-[2.4rem] lg:text-[2.75rem]">
            Start Your Learning Today!
          </h1>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {topPills.map((pill, index) => (
              <Link
                key={pill.label}
                to={pill.to}
                className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                  index === 0
                    ? "border-transparent bg-[#1f8d62] text-white shadow-sm"
                    : "border-[#d8dbd8] bg-white/70 text-[#0b1f2a] hover:border-[#1f8d62] hover:text-[#1f8d62]"
                }`}
              >
                {pill.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl space-y-10 px-4 py-8 lg:px-6">
        <section>
          <h2 className="mb-6 font-display text-[2rem] font-bold text-[#0b1f2a]">
            Explore
          </h2>
          <div className="grid gap-5 lg:grid-cols-2">
            {exploreCards.slice(0, 2).map((card) => (
              <div
                key={card.title}
                className={`${card.tone} flex min-h-[180px] flex-col justify-between rounded-[28px] p-6 shadow-sm`}
              >
                <div className="text-[2rem] font-bold leading-tight tracking-tight text-white">
                  {card.title}
                </div>
                <div className="flex justify-center">
                  <Link
                    to={`/tutorials?category=${card.slug ?? encodeURIComponent(card.title)}`}
                    className="inline-flex items-center justify-center rounded-full border border-white/90 bg-transparent px-5 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                  >
                    View more <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            {exploreCards.slice(2, 6).map((card) => (
              <div
                key={card.title}
                className={`${card.tone} flex min-h-[180px] flex-col justify-between rounded-[28px] p-6 shadow-sm`}
              >
                <div className="text-[2rem] font-bold leading-tight tracking-tight text-white">
                  {card.title}
                </div>
                <div className="flex justify-center">
                  <Link
                    to={`/tutorials?category=${card.slug ?? encodeURIComponent(card.title)}`}
                    className="inline-flex items-center justify-center rounded-full border border-white/90 bg-transparent px-5 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                  >
                    View more <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            {exploreCards.slice(6).map((card) => (
              <div
                key={card.title}
                className={`${card.tone} flex min-h-[180px] flex-col justify-between rounded-[28px] p-6 shadow-sm`}
              >
                <div className="text-[2rem] font-bold leading-tight tracking-tight text-white">
                  {card.title}
                </div>
                <div className="flex justify-center">
                  <Link
                    to={`/tutorials?category=${card.slug ?? encodeURIComponent(card.title)}`}
                    className="inline-flex items-center justify-center rounded-full border border-white/90 bg-transparent px-5 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                  >
                    View more <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-[#dfe7e1]">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="font-display text-[1.8rem] font-bold text-[#0b1f2a]">
              Learning notes
            </h2>
            <Link
              to="/tutorials"
              className="text-sm font-medium text-[#0d6d4f] hover:underline"
            >
              Browse all notes
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {courseNotes.map((note) => (
              <Link
                key={note.title}
                to={note.slug ? `/tutorials/${note.slug}` : "/tutorials"}
                className="block rounded-[22px] border border-[#e7ece9] bg-[#f8faf9] p-4 transition hover:border-[#1f8d62] hover:bg-[#f0faf6]"
              >
                <div className="mb-3 inline-flex rounded-full bg-[#eaf7f2] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#0d6d4f]">
                  {note.category}
                </div>
                <h3 className="text-lg font-bold text-[#0b1f2a]">
                  {note.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#374151]">
                  {note.summary}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] bg-gradient-to-r from-[#7d6cc6] to-[#8f5fbd] p-6 text-white shadow-sm">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <h3 className="font-display text-[1.7rem] font-bold tracking-tight">
              Interested in advertising with us?
            </h3>
            <a
              href="mailto:hello@keffacode.rw?subject=Advertising%20with%20KeffaCode"
              className="rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-[#1a1a1a] transition hover:bg-[#f3f4f6]"
            >
              Get in touch
            </a>
          </div>
        </section>

        <section>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-[2.2rem] font-bold text-[#0b1f2a]">
              Courses
            </h2>
            <Link
              to="/tutorials"
              className="rounded-full border border-[#d1d5d8] bg-white px-4 py-2 text-sm text-[#0b1f2a] transition hover:border-[#1f8d62] hover:text-[#1f8d62]"
            >
              View All
            </Link>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {courses.map((course) => (
              <article
                key={course.title}
                className="rounded-[22px] border border-[#dfe7e1] bg-white p-2.5 shadow-sm"
              >
                <div
                  className={`${course.bg} flex min-h-[180px] flex-col justify-between rounded-[18px] p-4`}
                >
                  <div className="flex items-start justify-between">
                    <span className="rounded-md bg-[#d94d4d] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                      {course.tag}
                    </span>
                    <span className="rounded-full bg-white/60 px-2 py-1 text-xs font-medium text-[#0b1f2a]">
                      ⭐ {course.rating}
                    </span>
                  </div>
                  <div>
                    <div className="text-[1.7rem] font-black uppercase tracking-tight text-[#0b1f2a]">
                      {course.title}
                    </div>
                    <div className="mt-1 text-sm font-medium text-[#0b1f2a]/80">
                      {course.subtitle}
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-lg font-bold text-[#0b1f2a]">
                  {course.title} Course - {course.subtitle}
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-[#eef1ef] pt-3">
                  <div className="flex items-center gap-2 text-sm text-[#1f2a37]">
                    <span className="text-[#0f8a55]">↗</span>
                    <span>{course.subtitle}</span>
                  </div>
                  <Link
                    to="/tutorials"
                    className="rounded-full border border-[#1f8d62] px-3 py-1.5 text-sm font-medium text-[#1f8d62] hover:bg-[#eaf7f2]"
                  >
                    Explore now
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-6 font-display text-[2rem] font-bold text-[#0b1f2a]">
            Must Explore
          </h2>
          <div className="grid gap-4 lg:grid-cols-4">
            {mustExplore.map((item, index) => (
              <Link
                key={item.label}
                to={item.to}
                className={`flex min-h-[140px] items-center justify-between rounded-[24px] p-5 text-white shadow-sm ${
                  index % 2 === 0 ? "bg-[#7ea4d8]" : "bg-[#5f94d8]"
                }`}
              >
                <div className="text-xl font-bold tracking-tight">
                  {item.label}
                </div>
                <span className="text-3xl">→</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-t border-[#dfe7e1] pt-8">
          <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr]">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#1f8d62] bg-white text-lg font-bold text-[#1f8d62]">
                  G
                </div>
                <div>
                  <div className="text-[2rem] font-bold text-[#0b1f2a]">
                    KeffaCode
                  </div>
                  <div className="text-xs text-[#1f8d62]">
                    Learn, practise, and grow your coding skills
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-[#0b1f2a]">
                <div className="flex items-start gap-3">
                  <span className="mt-1 text-[#1f8d62]">◉</span>
                  <div>Corporate &amp; Communications Address:</div>
                </div>
                <div className="pl-7 text-[#0b1f2a]">
                  A-143, 3rd Floor, Sovereign Corporate Tower, Sector-136,
                  Noida, Uttar Pradesh (201305)
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-start gap-3 text-sm text-[#0b1f2a]">
                  <span className="mt-1 text-[#1f8d62]">◉</span>
                  <div>Registered Address:</div>
                </div>
                <div className="pl-7 text-[#0b1f2a]">
                  K 061, Tower K, Gulshan Vivante Apartment, Sector 137, Noida,
                  Gautam Buddh Nagar, Uttar Pradesh, 201305
                </div>
              </div>

              <div className="mt-5 flex gap-3">
                {["in", "o", "x", "f", "▶"].map((icon, idx) => (
                  <div
                    key={idx}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4b5563] text-sm font-bold text-white"
                  >
                    {icon}
                  </div>
                ))}
              </div>
            </div>

            {Object.entries(footerSections).map(([title, entries]) => (
              <div key={title}>
                <h3 className="mb-3 text-xl font-bold text-[#0b1f2a]">
                  {title}
                </h3>
                <ul className="space-y-2 text-sm text-[#0b1f2a]/80">
                  {entries.map((entry) => (
                    <li key={entry}>{entry}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-[#dfe7e1] pt-6 text-sm text-[#0b1f2a]">
            KeffaCode. All rights reserved.
          </div>
        </section>
      </main>
    </div>
  );
}
