CREATE TABLE ref_threshold (
    id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    sensor_id   INTEGER NOT NULL REFERENCES ref_sensors (id) ON DELETE CASCADE,
    parameter   TEXT NOT NULL,
    normal      DOUBLE PRECISION,
    siap        DOUBLE PRECISION,
    siaga       DOUBLE PRECISION,
    awas        DOUBLE PRECISION,
    unit        TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT ref_threshold_sensor_parameter_key UNIQUE (sensor_id, parameter),
    CONSTRAINT ref_threshold_parameter_not_blank CHECK (btrim(parameter) <> '')
);

CREATE TRIGGER trg_ref_threshold_updated_at
BEFORE UPDATE ON ref_threshold
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
