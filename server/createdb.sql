drop table if exists users;

create table users (
    id serial primary key,
    email varchar(50) not null unique,
    password varchar(255) not null
);

-- Create role if it doesn't exist
DO
$$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE rolname = 'dbuser') THEN
      CREATE ROLE dbuser LOGIN PASSWORD 'Qwerty123';
   ELSE
      -- If user exists, update password
      ALTER ROLE dbuser WITH PASSWORD 'Qwerty123' LOGIN;
   END IF;
END
$$;

-- Revoke all first for a clean state
REVOKE ALL PRIVILEGES ON TABLE users FROM dbuser;

-- Grant adequate rights (read, insert, update, delete)
GRANT SELECT, INSERT, UPDATE, DELETE ON users TO dbuser;

-- Also grant sequence usage for inserts (needed for serial ID)
GRANT USAGE, SELECT, UPDATE ON SEQUENCE users_id_seq TO dbuser;

