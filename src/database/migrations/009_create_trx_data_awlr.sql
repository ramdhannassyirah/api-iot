CREATE TABLE trx_data_awlr (
    id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    sensor_id    INTEGER NOT NULL REFERENCES ref_sensors (id),
    level        DOUBLE PRECISION,  -- jarak sensor ke permukaan air
    tma          DOUBLE PRECISION,  -- tinggi muka air (hasil hitung)
    debit        DOUBLE PRECISION,
    battery      DOUBLE PRECISION,
    signal       DOUBLE PRECISION,
    status       alert_level,
    recorded_at  TIMESTAMPTZ NOT NULL,  -- waktu pengukuran dari sensor
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- sekaligus menjadi index untuk query rentang waktu per sensor
    CONSTRAINT trx_data_awlr_sensor_recorded_key UNIQUE (sensor_id, recorded_at)
);
