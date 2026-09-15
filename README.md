# Tp Final Daw

## Database
CREATE DATABASE clinica_medica;

importar o ejecutar el script 'clinica_medica.sql' en postgresql.

-- Crear el usuario con su contraseña
CREATE USER daw WITH PASSWORD '2026';

-- (Opcional) Asignar al usuario como dueño de la base de datos
ALTER DATABASE clinica_medica OWNER TO daw;

-- Otorgar todos los privilegios sobre la base de datos
GRANT ALL PRIVILEGES ON DATABASE clinica_medica TO daw;

-- Conectarse a la base de datos (si usas psql)
\c clinica_medica

-- Otorgar permisos sobre el esquema público y futuras tablas
GRANT ALL ON SCHEMA public TO daw;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO daw;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO daw;
