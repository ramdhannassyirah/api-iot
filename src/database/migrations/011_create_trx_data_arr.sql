CREATE TABLE trx_data_arr (
    id                BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    sensor_id         INTEGER NOT NULL REFERENCES ref_sensors (id),
    rainfall          DOUBLE PRECISION,
    rain_intensity_5  DOUBLE PRECISION,
    battery           DOUBLE PRECISION,
    signal            DOUBLE PRECISION,
    recorded_at       TIMESTAMPTZ NOT NULL,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT trx_data_arr_sensor_recorded_key UNIQUE (sensor_id, recorded_at)
);
