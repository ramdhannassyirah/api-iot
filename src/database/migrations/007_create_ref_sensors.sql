CREATE TABLE ref_sensors (
    id           INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    public_id    UUID NOT NULL DEFAULT gen_random_uuid(),  -- dipakai di API/frontend
    user_id      INTEGER REFERENCES users (id)    ON DELETE SET NULL,
    mqtt_id      INTEGER REFERENCES ref_mqtt (id) ON DELETE SET NULL,
    das_id       INTEGER REFERENCES ref_das (id)  ON DELETE SET NULL,
    device_id    TEXT NOT NULL,                            -- ID perangkat di payload MQTT
    name         TEXT NOT NULL,
    type         sensor_type NOT NULL,
    lat          NUMERIC(9,6),
    lon          NUMERIC(9,6),
    status       device_status NOT NULL DEFAULT 'active',
    is_online    BOOLEAN NOT NULL DEFAULT FALSE,
    last_active  TIMESTAMPTZ,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT ref_sensors_public_id_key UNIQUE (public_id),
    CONSTRAINT ref_sensors_device_id_key UNIQUE (device_id),
    CONSTRAINT ref_sensors_device_id_not_blank CHECK (btrim(device_id) <> ''),
    CONSTRAINT ref_sensors_name_not_blank CHECK (btrim(name) <> ''),
    CONSTRAINT ref_sensors_lat_range CHECK (lat IS NULL OR lat BETWEEN -90 AND 90),
    CONSTRAINT ref_sensors_lon_range CHECK (lon IS NULL OR lon BETWEEN -180 AND 180)
);

CREATE INDEX idx_ref_sensors_type    ON ref_sensors (type);
CREATE INDEX idx_ref_sensors_das_id  ON ref_sensors (das_id);
CREATE INDEX idx_ref_sensors_user_id ON ref_sensors (user_id);
CREATE INDEX idx_ref_sensors_mqtt_id ON ref_sensors (mqtt_id);

CREATE TRIGGER trg_ref_sensors_updated_at
BEFORE UPDATE ON ref_sensors
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
