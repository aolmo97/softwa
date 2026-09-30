ALTER TABLE analytics_events ADD COLUMN event_id TEXT;
ALTER TABLE analytics_events ADD COLUMN session_hash TEXT NOT NULL DEFAULT '';
ALTER TABLE analytics_events ADD COLUMN referrer TEXT NOT NULL DEFAULT 'Direct';
ALTER TABLE analytics_events ADD COLUMN device TEXT NOT NULL DEFAULT 'unknown';
CREATE UNIQUE INDEX analytics_event_dedup ON analytics_events(visitor_hash,event_id);
CREATE INDEX analytics_session_day ON analytics_events(session_hash,day);
CREATE TABLE analytics_state (key TEXT PRIMARY KEY, value TEXT NOT NULL);
