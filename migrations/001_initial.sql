CREATE TABLE IF NOT EXISTS software (
 slug TEXT PRIMARY KEY, name TEXT NOT NULL, short_description TEXT NOT NULL, description TEXT NOT NULL,
 company TEXT, website TEXT NOT NULL, logo TEXT, color TEXT NOT NULL, pricing_model TEXT NOT NULL, license TEXT REFERENCES licenses(name),
 published INTEGER NOT NULL DEFAULT 0, premium INTEGER NOT NULL DEFAULT 0, sponsored INTEGER NOT NULL DEFAULT 0,
 version INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS licenses(name TEXT PRIMARY KEY);
CREATE TABLE IF NOT EXISTS categories(slug TEXT PRIMARY KEY,name TEXT NOT NULL,description TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS platforms(slug TEXT PRIMARY KEY,name TEXT NOT NULL,description TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS features(slug TEXT PRIMARY KEY,name TEXT NOT NULL,description TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS software_categories(software TEXT REFERENCES software(slug) ON DELETE CASCADE,category TEXT REFERENCES categories(slug),PRIMARY KEY(software,category));
CREATE TABLE IF NOT EXISTS software_platforms(software TEXT REFERENCES software(slug) ON DELETE CASCADE,platform TEXT REFERENCES platforms(slug),PRIMARY KEY(software,platform));
CREATE TABLE IF NOT EXISTS software_features(software TEXT REFERENCES software(slug) ON DELETE CASCADE,feature TEXT REFERENCES features(slug),PRIMARY KEY(software,feature));
CREATE TABLE IF NOT EXISTS software_facts(software TEXT REFERENCES software(slug) ON DELETE CASCADE,field TEXT NOT NULL,value INTEGER CHECK(value IN(0,1) OR value IS NULL),PRIMARY KEY(software,field));
CREATE TABLE IF NOT EXISTS software_text(software TEXT REFERENCES software(slug) ON DELETE CASCADE,kind TEXT NOT NULL,position INTEGER NOT NULL,value TEXT NOT NULL,PRIMARY KEY(software,kind,position));
CREATE TABLE IF NOT EXISTS pricing_plans(software TEXT REFERENCES software(slug) ON DELETE CASCADE,id TEXT NOT NULL,name TEXT NOT NULL,amount REAL,currency TEXT,period TEXT NOT NULL,notes TEXT NOT NULL,PRIMARY KEY(software,id));
CREATE TABLE IF NOT EXISTS sources(software TEXT REFERENCES software(slug) ON DELETE CASCADE,id TEXT NOT NULL,title TEXT NOT NULL,url TEXT NOT NULL,accessed_at TEXT NOT NULL,verified_at TEXT,fields TEXT NOT NULL,notes TEXT NOT NULL,status TEXT NOT NULL,PRIMARY KEY(software,id));
CREATE TABLE IF NOT EXISTS relationships(id TEXT PRIMARY KEY,from_slug TEXT REFERENCES software(slug),to_slug TEXT REFERENCES software(slug),reason TEXT NOT NULL,comparison INTEGER NOT NULL DEFAULT 0,UNIQUE(from_slug,to_slug),CHECK(from_slug<>to_slug));
CREATE TABLE IF NOT EXISTS landings(id TEXT PRIMARY KEY,software TEXT REFERENCES software(slug),filter TEXT NOT NULL,title TEXT NOT NULL,intro TEXT NOT NULL,guidance TEXT NOT NULL,published INTEGER NOT NULL,UNIQUE(software,filter));
CREATE TABLE IF NOT EXISTS affiliates(id TEXT PRIMARY KEY,software TEXT UNIQUE REFERENCES software(slug),url TEXT NOT NULL,provider TEXT NOT NULL,enabled INTEGER NOT NULL,commission_notes TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS change_history(id INTEGER PRIMARY KEY AUTOINCREMENT,resource TEXT NOT NULL,record_id TEXT NOT NULL,actor TEXT NOT NULL,before_json TEXT,after_json TEXT NOT NULL,created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS admins(id TEXT PRIMARY KEY,password_hash TEXT NOT NULL,created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS sessions(token_hash TEXT PRIMARY KEY,admin_id TEXT REFERENCES admins(id),expires_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS rate_limits(key TEXT PRIMARY KEY,count INTEGER NOT NULL,reset_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS software_published ON software(published,name);
CREATE INDEX IF NOT EXISTS sources_review ON sources(status,verified_at);
CREATE INDEX IF NOT EXISTS relationships_from ON relationships(from_slug);
CREATE INDEX IF NOT EXISTS history_record ON change_history(resource,record_id);
