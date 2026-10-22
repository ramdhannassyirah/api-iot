CREATE TABLE trx_data_aws (
    id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    sensor_id        INTEGER NOT NULL REFERENCES ref_sensors (id),
    temperature      DOUBLE PRECISION,
    humidity         DOUBLE PRECISION,
    wind_speed       DOUBLE PRECISION,
    wind_direction   DOUBLE PRECISION,
    pressure         DOUBLE PRECISION,
    solar_radiation  DOUBLE PRECISION,
    evaporation      DOUBLE PRECISION,
    rainfall         DOUBLE PRECISION,
    rainfall_5m      DOUBLE PRECISION,
    battery          DOUBLE PRECISION,
    signal           DOUBLE PRECISION,
    recorded_at      TIMESTAMPTZ NOT NULL,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT trx_data_aws_sensor_recorded_key UNIQUE (sensor_id, recorded_at)
);
