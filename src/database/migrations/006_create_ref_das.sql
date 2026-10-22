CREATE TABLE ref_das (
    id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name        TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT ref_das_name_key UNIQUE (name),
    CONSTRAINT ref_das_name_not_blank CHECK (btrim(name) <> '')
);

CREATE TRIGGER trg_ref_das_updated_at
BEFORE UPDATE ON ref_das
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
