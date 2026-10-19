CREATE TYPE estados_usuarios AS ENUM ('ACTIVO','BAJA');
CREATE TYPE roles_usuarios AS ENUM ('MEDICO','PACIENTE','ADMINISTRADOR');
CREATE TYPE estados_reservas AS ENUM ('ACTIVO','ATENDIDO','AUSENTE','CANCELADO');

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    documento TEXT NOT NULL UNIQUE,
    apellidos TEXT NOT NULL,
    nombres TEXT NOT NULL,
    email TEXT NOT NULL,
    clave TEXT NOT NULL,
    estado estados_usuarios NOT NULL,
    rol roles_usuarios NOT NULL
);

CREATE TABLE medicos (
    id SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL UNIQUE,
    matricula INT NOT NULL,
    valor_consulta INT NOT NULL,
    CONSTRAINT fk_medicos_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id)
);

CREATE TABLE reservas (
    id SERIAL PRIMARY KEY,
    id_medico INT NOT NULL,
    id_paciente INT NOT NULL,
    fecha_hora TIMESTAMP NOT NULL,
    estado estados_reservas NOT NULL,
    valor_consulta INT NOT NULL,

    CONSTRAINT fk_reservas_medico
        FOREIGN KEY (id_medico)
        REFERENCES medicos(id),

    CONSTRAINT fk_reservas_paciente
        FOREIGN KEY (id_paciente)
        REFERENCES usuarios(id)
);

CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- Usuarios de prueba (uno por rol)
INSERT INTO usuarios (documento, apellidos, nombres, email, clave, estado, rol) VALUES
('30111222', 'Admin', 'admin', 'admin@clinica.com', crypt('admin', gen_salt('bf', 10)), 'ACTIVO', 'ADMINISTRADOR'),
('30222333', 'Medico', 'medico', 'medico@clinica.com', crypt('medico', gen_salt('bf', 10)), 'ACTIVO', 'MEDICO'),
('30333444', 'Paciente', 'paciente', 'paciente@clinica.com', crypt('paciente', gen_salt('bf', 10)), 'ACTIVO', 'PACIENTE'),
('30444555', 'Baja', 'inactivo', 'inactivo@clinica.com', crypt('inactivo', gen_salt('bf', 10)), 'BAJA', 'PACIENTE');

-- El usuario médico también va en la tabla medicos
INSERT INTO medicos (id_usuario, matricula, valor_consulta)
SELECT id, 12345, 20000 FROM usuarios WHERE documento = '30222333';