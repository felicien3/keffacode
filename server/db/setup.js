// Creates the schema and loads demo content. Run: npm run db:setup
import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import pg from "pg";

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
});

const here = path.dirname(fileURLToPath(import.meta.url));

const categories = [
  {
    name: "HTML & CSS",
    slug: "html-css",
    blurb: "Structure and style for the web.",
  },
  {
    name: "JavaScript",
    slug: "javascript",
    blurb: "The language of the browser and the server.",
  },
  { name: "React", slug: "react", blurb: "Component-driven user interfaces." },
  { name: "Node.js", slug: "nodejs", blurb: "JavaScript on the server." },
  {
    name: "Databases",
    slug: "databases",
    blurb: "Modelling and querying data with SQL.",
  },
  {
    name: "Data Structures",
    slug: "data-structures",
    blurb: "Arrays, trees, graphs and problem-solving patterns.",
  },
  {
    name: "Algorithms",
    slug: "algorithms",
    blurb: "Greedy, divide-and-conquer, dynamic programming and more.",
  },
  {
    name: "Web Development",
    slug: "web-development",
    blurb: "Frontend, backend and modern application architecture.",
  },
  {
    name: "AI & Data Science",
    slug: "ai-data-science",
    blurb: "Machine learning, analytics and real-world data workflows.",
  },
  {
    name: "Machine Learning",
    slug: "machine-learning",
    blurb: "Models, training, evaluation and deployment basics.",
  },
  {
    name: "Python",
    slug: "python",
    blurb: "A beginner-friendly language for scripting and automation.",
  },
  {
    name: "Java",
    slug: "java",
    blurb: "Enterprise-ready language used in backend and systems work.",
  },
  {
    name: "System Design",
    slug: "system-design",
    blurb: "Scale, reliability and distributed architecture decisions.",
  },
  {
    name: "DevOps",
    slug: "devops",
    blurb: "Deliver faster with CI/CD, containers and automation.",
  },
  {
    name: "Programming Languages",
    slug: "programming-languages",
    blurb: "Compare paradigms, syntax and common patterns.",
  },
  {
    name: "CS Subjects",
    slug: "cs-subjects",
    blurb: "Core theory across operating systems, networks and databases.",
  },
  {
    name: "Software & Tools",
    slug: "software-tools",
    blurb: "Build with the right tooling and workflow for the job.",
  },
];

const tutorials = [
  {
    cat: "javascript",
    title: "Understanding the JavaScript event loop",
    slug: "javascript-event-loop",
    summary:
      "Why setTimeout(fn, 0) does not run immediately, and how the call stack, task queue and microtasks fit together.",
    minutes: 8,
    body: `## The call stack\n\nJavaScript runs one statement at a time. Function calls are pushed onto a **call stack** and popped off when they return.\n\n## The task queue\n\nWork scheduled by \`setTimeout\`, DOM events or I/O waits in a queue. The event loop moves a queued task onto the stack only when the stack is empty.\n\n\`\`\`js\nconsole.log('first');\nsetTimeout(() => console.log('third'), 0);\nPromise.resolve().then(() => console.log('second'));\n\`\`\`\n\n## Microtasks run first\n\nPromise callbacks live in the microtask queue, which drains completely after each task. That is why \`second\` prints before \`third\` even though the timeout was registered first.`,
  },
  {
    cat: "javascript",
    title: "Array methods you will actually use",
    slug: "array-methods-you-will-use",
    summary:
      "map, filter, reduce, find and some — with the mental model for choosing between them.",
    minutes: 6,
    body: `## Pick the method by the shape of the answer\n\n- Same length, different values → \`map\`\n- Fewer items, same shape → \`filter\`\n- One value out of many → \`reduce\`\n- One item or nothing → \`find\`\n- A yes/no answer → \`some\` or \`every\`\n\n\`\`\`js\nconst total = cart.reduce((sum, item) => sum + item.price, 0);\n\`\`\`\n\nReach for a loop when you need to stop early and the answer is not one of the shapes above.`,
  },
  {
    cat: "html-css",
    title: "Flexbox in one page",
    slug: "flexbox-in-one-page",
    summary:
      "The six properties that cover almost every one-dimensional layout.",
    minutes: 5,
    body: `## The container\n\n\`display: flex\` turns children into flex items along a main axis.\n\n- \`flex-direction\` chooses the main axis\n- \`justify-content\` distributes space along it\n- \`align-items\` positions items across it\n- \`gap\` spaces items without margin hacks\n\n## The items\n\n\`flex: 1\` lets an item grow into free space. \`flex: 0 0 240px\` pins it to a fixed width.`,
  },
  {
    cat: "react",
    title: "State that lives in the right place",
    slug: "react-state-placement",
    summary:
      "Lifting state up, colocating state, and knowing when context is the wrong tool.",
    minutes: 7,
    body: `## Colocate first\n\nKeep state in the component that uses it. Move it up only when two siblings need to read the same value.\n\n## Then lift\n\nThe lowest common parent owns the state and passes both the value and the setter down.\n\n## Context is for rarely-changing values\n\nTheme, current user, language. Putting fast-changing state in context re-renders every consumer.`,
  },
  {
    cat: "nodejs",
    title: "Building a REST API with Express",
    slug: "express-rest-api",
    summary:
      "Routing, middleware order, and returning status codes that mean something.",
    minutes: 9,
    body: `## Middleware is a pipeline\n\nEach \`app.use\` runs in order. Body parsing goes before routes; the error handler goes last.\n\n\`\`\`js\napp.use(express.json());\napp.use('/api/tutorials', tutorialRoutes);\napp.use((err, req, res, next) => res.status(500).json({ error: 'Server error' }));\n\`\`\`\n\n## Status codes\n\n201 for created, 400 for a bad request body, 401 when there is no valid token, 403 when the token is valid but the role is wrong, 404 when the row does not exist.`,
  },
  {
    cat: "databases",
    title: "Writing your first JOIN",
    slug: "writing-your-first-join",
    summary:
      "INNER vs LEFT JOIN, and why the ON clause is not the same as WHERE.",
    minutes: 6,
    body: `## INNER JOIN keeps matches only\n\n\`\`\`sql\nSELECT t.title, c.name\nFROM tutorials t\nJOIN categories c ON c.id = t.category_id;\n\`\`\`\n\n## LEFT JOIN keeps every left row\n\nRows with no match get NULLs on the right side. Filtering those columns in \`WHERE\` silently turns a LEFT JOIN back into an INNER JOIN — put the condition in \`ON\` instead.`,
  },
];

// Extra short notes are inserted independently of the demo reset. This keeps
// new learning material available for existing databases without touching
// user-created rows.
const learningNotes = [
  {
    cat: "python",
    title: "Python functions: inputs, outputs, and defaults",
    slug: "python-functions-basics",
    summary: "Write reusable functions with clear parameters, return values, and safe default arguments.",
    minutes: 6,
    body: `## Start with one responsibility\n\nA function should do one small job. Give it a descriptive name and accept only the inputs it needs.\n\n\`\`\`python\ndef greet(name, greeting='Hello'):\n    return f'{greeting}, {name}!'\n\`\`\`\n\n## Return instead of print\n\n\`return\` gives the caller a value to reuse. Use \`print\` for temporary debugging or user-facing output, not as the main result of a function.\n\n## Avoid mutable defaults\n\nUse \`None\` instead of \`[]\` or \`{}\` as a default value, then create a fresh list inside the function.`,
  },
  {
    cat: "java",
    title: "Java classes and objects in practice",
    slug: "java-classes-and-objects",
    summary: "Model real data with fields, constructors, methods, and small, focused classes.",
    minutes: 7,
    body: `## A class is a blueprint\n\nA class groups related data and behavior. An object is one value created from that class.\n\n\`\`\`java\nclass Book {\n  String title;\n\n  Book(String title) {\n    this.title = title;\n  }\n\n  String label() {\n    return \"Book: \" + title;\n  }\n}\n\`\`\`\n\n## Keep state private\n\nPrefer private fields and expose the smallest useful set of methods. This prevents outside code from leaving an object in an invalid state.`,
  },
  {
    cat: "web-development",
    title: "How the web request cycle works",
    slug: "web-request-cycle",
    summary: "Follow a browser request from URL to server response, rendering, and the next interaction.",
    minutes: 8,
    body: `## Request and response\n\nWhen you visit a URL, the browser sends an HTTP request. A server responds with a status code, headers, and usually HTML, JSON, CSS, JavaScript, or images.\n\n## Rendering a page\n\nThe browser parses HTML into a document tree, applies CSS, and runs JavaScript. Modern applications often request JSON from an API after the initial page loads.\n\n## Useful status codes\n\n- \`200\`: the request succeeded\n- \`201\`: a resource was created\n- \`400\`: the request data is invalid\n- \`401\`: sign-in is required\n- \`404\`: the resource was not found\n- \`500\`: the server failed while handling the request`,
  },
  {
    cat: "algorithms",
    title: "Big O without the mystery",
    slug: "big-o-basics",
    summary: "Estimate how work grows as input grows, then use that estimate to choose a practical solution.",
    minutes: 7,
    body: `## Focus on growth\n\nBig O describes how the number of operations changes as input size \`n\` grows. It ignores small constants so you can compare approaches.\n\n- One pass through a list is usually \`O(n)\`\n- A loop inside a loop is often \`O(n²)\`\n- Binary search is \`O(log n)\`\n\n## A practical habit\n\nBefore coding, write down the largest input you expect and ask whether your algorithm scans, sorts, or nests work. A clear \`O(n)\` solution is usually preferable to a clever-looking \`O(n²)\` one.`,
  },
  {
    cat: "ai-data-science",
    title: "Preparing data before analysis",
    slug: "data-preparation-basics",
    summary: "Check types, missing values, duplicates, and outliers before trusting a chart or model.",
    minutes: 7,
    body: `## Know what each column means\n\nStart with a data dictionary: the unit, source, allowed values, and whether a field can be empty. This catches interpretation mistakes early.\n\n## Clean deliberately\n\nDo not silently remove rows. Count missing values, decide whether to fill or exclude them, and record that decision. Check duplicates and make sure dates and numbers have the right type.\n\n## Split before modelling\n\nWhen building a model, set aside validation data before making choices based on the data. Otherwise your evaluation can look better than real performance.`,
  },
  {
    cat: "machine-learning",
    title: "Train, validate, and test a model",
    slug: "machine-learning-evaluation",
    summary: "Use separate data splits to tune a model honestly and measure how it generalizes.",
    minutes: 8,
    body: `## Three different jobs\n\nTraining data teaches model parameters. Validation data helps you compare settings. Test data is used once at the end to estimate real-world performance.\n\n## Pick a metric that matches the task\n\nAccuracy can be misleading when one class is rare. For classification, also consider precision, recall, and F1. For numerical predictions, consider mean absolute error.\n\n## Watch for leakage\n\nLeakage happens when information from the future or target sneaks into the inputs. A high score with leakage will fail in production.`,
  },
];

export async function ensureLearningNotes() {
  const { rows: categoryRows } = await pool.query(
    "SELECT id, slug FROM categories WHERE slug = ANY($1)",
    [learningNotes.map((note) => note.cat)],
  );
  const categoryIds = new Map(categoryRows.map((row) => [row.slug, row.id]));

  for (const note of learningNotes) {
    const categoryId = categoryIds.get(note.cat);
    if (!categoryId) continue;
    await pool.query(
      `INSERT INTO tutorials (category_id, title, slug, summary, body, read_minutes)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (slug) DO NOTHING`,
      [categoryId, note.title, note.slug, note.summary, note.body, note.minutes],
    );
  }
}

const problems = [
  {
    cat: "javascript",
    title: "Sum of an array",
    slug: "sum-of-an-array",
    difficulty: "easy",
    fn: "sumArray",
    statement: `Return the sum of all numbers in the array. An empty array sums to \`0\`.\n\n**Example**\n\n\`\`\`\nsumArray([1, 2, 3]) -> 6\n\`\`\``,
    starter: "function sumArray(numbers) {\n  // your code here\n}\n",
    tests: [
      { args: [[1, 2, 3]], expected: 6, sample: true },
      { args: [[]], expected: 0, sample: true },
      { args: [[-4, 4, 10]], expected: 10, sample: false },
      { args: [[2.5, 2.5]], expected: 5, sample: false },
    ],
  },
  {
    cat: "javascript",
    title: "Count vowels",
    slug: "count-vowels",
    difficulty: "easy",
    fn: "countVowels",
    statement: `Count how many vowels (a, e, i, o, u) a string contains. Uppercase counts too.\n\n**Example**\n\n\`\`\`\ncountVowels('Kigali') -> 3\n\`\`\``,
    starter: "function countVowels(text) {\n  // your code here\n}\n",
    tests: [
      { args: ["Kigali"], expected: 3, sample: true },
      { args: [""], expected: 0, sample: true },
      { args: ["RHYTHM"], expected: 0, sample: false },
      { args: ["EducationForAll"], expected: 7, sample: false },
    ],
  },
  {
    cat: "javascript",
    title: "Group words by first letter",
    slug: "group-words-by-first-letter",
    difficulty: "medium",
    fn: "groupByFirstLetter",
    statement: `Given an array of lowercase words, return an object whose keys are first letters and whose values are arrays of the words that start with that letter, in their original order.\n\n**Example**\n\n\`\`\`\ngroupByFirstLetter(['apple', 'avocado', 'beet'])\n-> { a: ['apple', 'avocado'], b: ['beet'] }\n\`\`\``,
    starter: "function groupByFirstLetter(words) {\n  // your code here\n}\n",
    tests: [
      {
        args: [["apple", "avocado", "beet"]],
        expected: { a: ["apple", "avocado"], b: ["beet"] },
        sample: true,
      },
      { args: [[]], expected: {}, sample: true },
      { args: [["zebra"]], expected: { z: ["zebra"] }, sample: false },
    ],
  },
  {
    cat: "javascript",
    title: "Longest run of repeated characters",
    slug: "longest-run",
    difficulty: "medium",
    fn: "longestRun",
    statement: `Return the length of the longest run of identical consecutive characters.\n\n**Example**\n\n\`\`\`\nlongestRun('aabbbcc') -> 3\n\`\`\``,
    starter: "function longestRun(text) {\n  // your code here\n}\n",
    tests: [
      { args: ["aabbbcc"], expected: 3, sample: true },
      { args: [""], expected: 0, sample: true },
      { args: ["abcd"], expected: 1, sample: false },
      { args: ["wwwwww"], expected: 6, sample: false },
    ],
  },
  {
    cat: "javascript",
    title: "Balanced brackets",
    slug: "balanced-brackets",
    difficulty: "hard",
    fn: "isBalanced",
    statement: `Return \`true\` if every bracket in the string is closed by the matching type in the right order. The string may contain \`()\`, \`[]\` and \`{}\` only.\n\n**Example**\n\n\`\`\`\nisBalanced('{[()]}') -> true\nisBalanced('([)]')   -> false\n\`\`\``,
    starter: "function isBalanced(text) {\n  // your code here\n}\n",
    tests: [
      { args: ["{[()]}"], expected: true, sample: true },
      { args: ["([)]"], expected: false, sample: true },
      { args: [""], expected: true, sample: false },
      { args: ["((("], expected: false, sample: false },
    ],
  },
];

export async function seedDatabase() {
  const {
    rows: [{ total }],
  } = await pool.query("SELECT COUNT(*)::int AS total FROM categories");

  if (Number(total) > 0) {
    return { seeded: false };
  }

  const adminHash = await bcrypt.hash("admin1234", 10);
  const userHash = await bcrypt.hash("learner1234", 10);
  const {
    rows: [admin],
  } = await pool.query(
    `INSERT INTO users (username, email, password_hash, role, bio)
     VALUES ($1,$2,$3,'admin',$4)
     ON CONFLICT (username) DO UPDATE SET email = EXCLUDED.email, password_hash = EXCLUDED.password_hash, bio = EXCLUDED.bio
     RETURNING id`,
    ["keffa", "admin@keffacode.rw", adminHash, "Maintainer of KeffaCode."],
  );

  await pool.query(
    `INSERT INTO users (username, email, password_hash, role)
     VALUES ($1,$2,$3,'user')
     ON CONFLICT (username) DO UPDATE SET email = EXCLUDED.email, password_hash = EXCLUDED.password_hash`,
    ["learner", "learner@keffacode.rw", userHash],
  );

  const catIds = {};
  for (const c of categories) {
    const {
      rows: [row],
    } = await pool.query(
      `INSERT INTO categories (name, slug, blurb)
       VALUES ($1,$2,$3)
       ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, blurb = EXCLUDED.blurb
       RETURNING id`,
      [c.name, c.slug, c.blurb],
    );
    catIds[c.slug] = row.id;
  }

  for (const t of tutorials) {
    await pool.query(
      `INSERT INTO tutorials (category_id, title, slug, summary, body, read_minutes, author_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       ON CONFLICT (slug) DO UPDATE SET
         category_id = EXCLUDED.category_id,
         title = EXCLUDED.title,
         summary = EXCLUDED.summary,
         body = EXCLUDED.body,
         read_minutes = EXCLUDED.read_minutes,
         author_id = EXCLUDED.author_id`,
      [catIds[t.cat], t.title, t.slug, t.summary, t.body, t.minutes, admin.id],
    );
  }

  for (const p of problems) {
    const {
      rows: [row],
    } = await pool.query(
      `INSERT INTO problems (category_id, title, slug, difficulty, statement, fn_name, starter_code)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       ON CONFLICT (slug) DO UPDATE SET
         category_id = EXCLUDED.category_id,
         title = EXCLUDED.title,
         difficulty = EXCLUDED.difficulty,
         statement = EXCLUDED.statement,
         fn_name = EXCLUDED.fn_name,
         starter_code = EXCLUDED.starter_code
       RETURNING id`,
      [
        catIds[p.cat],
        p.title,
        p.slug,
        p.difficulty,
        p.statement,
        p.fn,
        p.starter,
      ],
    );

    await pool.query("DELETE FROM test_cases WHERE problem_id = $1", [row.id]);
    let position = 0;
    for (const t of p.tests) {
      await pool.query(
        "INSERT INTO test_cases (problem_id, args, expected, is_sample, position) VALUES ($1,$2,$3,$4,$5)",
        [
          row.id,
          JSON.stringify(t.args),
          JSON.stringify(t.expected),
          t.sample,
          position++,
        ],
      );
    }
  }

  return { seeded: true };
}

export async function main() {
  const schema = await fs.readFile(path.join(here, "schema.sql"), "utf8");
  await pool.query(schema);
  console.log("schema created");

  const result = await seedDatabase();
  await ensureLearningNotes();
  const seededMessage = result.seeded
    ? "demo content loaded"
    : "demo content already present";
  console.log(seededMessage);
  console.log("  admin   admin@keffacode.rw / admin1234");
  console.log("  learner learner@keffacode.rw / learner1234");
  await pool.end();
}

const isDirectRun =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
