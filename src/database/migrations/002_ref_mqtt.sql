CREATE TABLE ref_mqtt (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL UNIQUE,
    ip          TEXT NOT NULL,
    port        INTEGER NOT NULL,
    pub         TEXT,
    sub         TEXT,
    username    TEXT,
    password    TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT ref_mqtt_port_range
        CHECK (port BETWEEN 1 AND 65535)
);