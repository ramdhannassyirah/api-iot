CREATE TABLE ref_mqtt (
    id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name        TEXT,
    ip          TEXT NOT NULL,  -- bisa IP atau hostname broker
    port        INTEGER NOT NULL DEFAULT 1883,
    pub         TEXT,
    sub         TEXT,
    username    TEXT,
    password    TEXT,           -- simpan terenkripsi di level aplikasi
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT ref_mqtt_ip_not_blank CHECK (btrim(ip) <> ''),
    CONSTRAINT ref_mqtt_port_range CHECK (port BETWEEN 1 AND 65535)
);

CREATE TRIGGER trg_ref_mqtt_updated_at
BEFORE UPDATE ON ref_mqtt
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
