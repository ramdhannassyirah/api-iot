CREATE TYPE user_status   AS ENUM ('active', 'inactive');
CREATE TYPE device_status AS ENUM ('active', 'inactive', 'maintenance');
CREATE TYPE sensor_type   AS ENUM ('awlr', 'aws', 'arr');
CREATE TYPE alert_level   AS ENUM ('normal', 'siap', 'siaga', 'awas');
