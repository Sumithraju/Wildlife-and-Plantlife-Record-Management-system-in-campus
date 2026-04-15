-- ============================================================
-- Wildlife & Plantlife Record Management System
-- Group 1 | PostgreSQL 15 Schema
-- ============================================================

-- ENUM types
CREATE TYPE user_role   AS ENUM ('admin', 'researcher', 'viewer');
CREATE TYPE rec_status  AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE wildlife_cat AS ENUM ('mammal','bird','reptile','amphibian','insect','fish');
CREATE TYPE record_type_enum AS ENUM ('wildlife', 'plant');

-- ============================================================
-- Table: users
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id            SERIAL PRIMARY KEY,
    full_name     VARCHAR(120)        NOT NULL,
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT                NOT NULL,
    role          user_role           NOT NULL DEFAULT 'viewer',
    is_active     BOOLEAN             NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Table: wildlife_records
-- ============================================================
CREATE TABLE IF NOT EXISTS wildlife_records (
    id               SERIAL PRIMARY KEY,
    user_id          INT            NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    species_name     VARCHAR(200)   NOT NULL,
    common_name      VARCHAR(200),
    category         wildlife_cat   NOT NULL,
    observation_date DATE           NOT NULL,
    latitude         DECIMAL(9,6),
    longitude        DECIMAL(9,6),
    habitat          TEXT,
    notes            TEXT,
    status           rec_status     NOT NULL DEFAULT 'pending',
    created_at       TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Table: plant_records
-- ============================================================
CREATE TABLE IF NOT EXISTS plant_records (
    id               SERIAL PRIMARY KEY,
    user_id          INT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    species_name     VARCHAR(200) NOT NULL,
    family           VARCHAR(120),
    common_name      VARCHAR(200),
    flowering_season VARCHAR(60),
    height_cm        INT CHECK (height_cm > 0),
    iucn_status      VARCHAR(30)  CHECK (iucn_status IN ('LC','NT','VU','EN','CR','EW','EX')),
    observation_date DATE         NOT NULL,
    latitude         DECIMAL(9,6),
    longitude        DECIMAL(9,6),
    notes            TEXT,
    status           rec_status   NOT NULL DEFAULT 'pending',
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Table: record_images
-- ============================================================
CREATE TABLE IF NOT EXISTS record_images (
    id          SERIAL PRIMARY KEY,
    record_type record_type_enum NOT NULL,
    record_id   INT              NOT NULL,
    image_url   TEXT             NOT NULL,
    uploaded_at TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Table: activity_logs
-- ============================================================
CREATE TABLE IF NOT EXISTS activity_logs (
    id           SERIAL PRIMARY KEY,
    user_id      INT           REFERENCES users(id) ON DELETE SET NULL,
    action       VARCHAR(100)  NOT NULL,
    target_table VARCHAR(60),
    target_id    INT,
    ip_address   VARCHAR(45),
    created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Indexes for performance
-- ============================================================
CREATE INDEX idx_wildlife_species  ON wildlife_records (species_name);
CREATE INDEX idx_wildlife_date     ON wildlife_records (observation_date);
CREATE INDEX idx_wildlife_status   ON wildlife_records (status);
CREATE INDEX idx_wildlife_category ON wildlife_records (category);
CREATE INDEX idx_plant_species     ON plant_records    (species_name);
CREATE INDEX idx_plant_date        ON plant_records    (observation_date);
CREATE INDEX idx_plant_status      ON plant_records    (status);

-- ============================================================
-- Trigger: auto-update updated_at on users
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_wildlife_updated_at
    BEFORE UPDATE ON wildlife_records
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_plant_updated_at
    BEFORE UPDATE ON plant_records
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- Trigger: auto-insert activity log on wildlife INSERT
-- ============================================================
CREATE OR REPLACE FUNCTION log_wildlife_insert()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO activity_logs (user_id, action, target_table, target_id)
    VALUES (NEW.user_id, 'CREATE_WILDLIFE', 'wildlife_records', NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_wildlife_log_insert
    AFTER INSERT ON wildlife_records
    FOR EACH ROW EXECUTE FUNCTION log_wildlife_insert();

-- ============================================================
-- Trigger: auto-insert activity log on plant INSERT
-- ============================================================
CREATE OR REPLACE FUNCTION log_plant_insert()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO activity_logs (user_id, action, target_table, target_id)
    VALUES (NEW.user_id, 'CREATE_PLANT', 'plant_records', NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_plant_log_insert
    AFTER INSERT ON plant_records
    FOR EACH ROW EXECUTE FUNCTION log_plant_insert();
