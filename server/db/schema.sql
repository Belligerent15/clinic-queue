PRAGMA journal_mode = WAL;

CREATE TABLE IF NOT EXISTS clinics (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  clinic_id TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  pin_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('CLINIC_ADMIN', 'RECEPTIONIST', 'NURSE')),
  room_number TEXT,
  FOREIGN KEY (clinic_id) REFERENCES clinics(id)
);

CREATE TABLE IF NOT EXISTS queues (
  id TEXT PRIMARY KEY,
  clinic_id TEXT NOT NULL,
  category_code TEXT NOT NULL CHECK(category_code IN ('A', 'B', 'C', 'E')),
  name TEXT NOT NULL,
  FOREIGN KEY (clinic_id) REFERENCES clinics(id)
);

CREATE TABLE IF NOT EXISTS tickets (
  id TEXT PRIMARY KEY,
  clinic_id TEXT NOT NULL,
  category_code TEXT NOT NULL,
  ticket_number INTEGER NOT NULL,
  full_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'WAITING' CHECK(status IN ('WAITING', 'CALLED', 'COMPLETED', 'NO_SHOW')),
  patient_name TEXT,
  room_number TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  called_at DATETIME,
  completed_at DATETIME,
  FOREIGN KEY (clinic_id) REFERENCES clinics(id)
);

INSERT OR IGNORE INTO clinics (id, name) 
VALUES ('cl_manganeng', 'Manganeng Primary Health Clinic - Sekhukhune QueueCare Hub');

INSERT OR IGNORE INTO users (id, clinic_id, username, pin_hash, role, room_number) VALUES
('u_admin', 'cl_manganeng', 'admin_manganeng', '$2a$10$wT0lP/.zG828kH458G/tceM7.e4qD0.nI8jWc14E/J3u2F9z9M3 operational', 'CLINIC_ADMIN', NULL),
('u_reception', 'cl_manganeng', 'reception', '$2a$10$7Z2tW8zWzKz6JvG1xQz8ee1Z8W8/2hWk8Z1W8Z1W8Z1W8Z1W8Z1W8', 'RECEPTIONIST', NULL),
('u_nurse2', 'cl_manganeng', 'nurse_room2', '$2a$10$9Z1W8Z1W8Z1W8Z1W8Z1W8e1Z8W8/2hWk8Z1W8Z1W8Z1W8Z1W8Z1W8', 'NURSE', 'Room 2');

INSERT OR IGNORE INTO queues (id, clinic_id, category_code, name) VALUES
('q_a', 'cl_manganeng', 'A', 'General'),
('q_b', 'cl_manganeng', 'B', 'Chronic'),
('q_c', 'cl_manganeng', 'C', 'Mother & Baby'),
('q_e', 'cl_manganeng', 'E', 'Emergency');
