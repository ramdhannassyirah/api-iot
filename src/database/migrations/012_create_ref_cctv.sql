CREATE TABLE ref_cctv (
    id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    sensor_id   INTEGER NOT NULL REFERENCES ref_sensors (id) ON DELETE CASCADE,
    name        TEXT,
    url         TEXT NOT NULL,
    status      device_status NOT NULL DEFAULT 'active',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT ref_cctv_url_not_blank CHECK (btrim(url) <> '')
);

CREATE INDEX idx_ref_cctv_sensor_id ON ref_cctv (sensor_id);

CREATE TRIGGER trg_ref_cctv_updated_at
BEFORE UPDATE ON ref_cctv
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
