CREATE TABLE IF NOT EXISTS analytics_events (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 occurred_at TEXT NOT NULL,
 day TEXT NOT NULL,
 visitor_hash TEXT NOT NULL,
 event TEXT NOT NULL,
 path TEXT NOT NULL,
 slug TEXT,
 query TEXT,
 metadata TEXT NOT NULL DEFAULT '{}'
);
CREATE INDEX IF NOT EXISTS analytics_events_day ON analytics_events(day);
CREATE INDEX IF NOT EXISTS analytics_events_visitor_day ON analytics_events(visitor_hash,day);
CREATE INDEX IF NOT EXISTS analytics_events_event_day ON analytics_events(event,day);
CREATE INDEX IF NOT EXISTS analytics_events_slug ON analytics_events(slug,event);
