-- KeffaCode schema
DROP TABLE IF EXISTS submissions, test_cases, problems, tutorial_progress, tutorials, categories, users CASCADE;

CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(40)  NOT NULL UNIQUE,
  email         VARCHAR(160) NOT NULL UNIQUE,
  password_hash TEXT         NOT NULL,
  role          VARCHAR(10)  NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin')),
  bio           TEXT         DEFAULT '',
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE categories (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(60) NOT NULL UNIQUE,
  slug  VARCHAR(60) NOT NULL UNIQUE,
  blurb TEXT DEFAULT ''
);

CREATE TABLE tutorials (
  id           SERIAL PRIMARY KEY,
  category_id  INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  title        VARCHAR(200) NOT NULL,
  slug         VARCHAR(200) NOT NULL UNIQUE,
  summary      TEXT NOT NULL DEFAULT '',
  body         TEXT NOT NULL,              -- markdown
  read_minutes INTEGER NOT NULL DEFAULT 5,
  author_id    INTEGER REFERENCES users(id) ON DELETE SET NULL,
  published    BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE tutorial_progress (
  user_id      INTEGER REFERENCES users(id) ON DELETE CASCADE,
  tutorial_id  INTEGER REFERENCES tutorials(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, tutorial_id)
);

CREATE TABLE problems (
  id          SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  title       VARCHAR(200) NOT NULL,
  slug        VARCHAR(200) NOT NULL UNIQUE,
  difficulty  VARCHAR(6) NOT NULL CHECK (difficulty IN ('easy','medium','hard')),
  statement   TEXT NOT NULL,               -- markdown
  fn_name     VARCHAR(60) NOT NULL,        -- function the solution must export
  starter_code TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE test_cases (
  id         SERIAL PRIMARY KEY,
  problem_id INTEGER NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  args       JSONB NOT NULL,               -- array of arguments
  expected   JSONB NOT NULL,
  is_sample  BOOLEAN NOT NULL DEFAULT false,
  position   INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE submissions (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  problem_id   INTEGER NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  code         TEXT NOT NULL,
  status       VARCHAR(20) NOT NULL,       -- passed | failed | error
  passed_count INTEGER NOT NULL DEFAULT 0,
  total_count  INTEGER NOT NULL DEFAULT 0,
  runtime_ms   INTEGER NOT NULL DEFAULT 0,
  message      TEXT DEFAULT '',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ON tutorials (category_id);
CREATE INDEX ON problems (category_id, difficulty);
CREATE INDEX ON submissions (user_id, problem_id);
CREATE INDEX tutorials_search_idx ON tutorials USING GIN (to_tsvector('english', title || ' ' || summary));
CREATE INDEX problems_search_idx  ON problems  USING GIN (to_tsvector('english', title || ' ' || statement));
