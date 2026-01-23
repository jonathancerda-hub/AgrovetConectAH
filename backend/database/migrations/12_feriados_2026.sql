-- Agregar feriados de Perú 2026
INSERT INTO feriados (fecha, nombre, tipo, anio) VALUES
('2026-01-01', 'Año Nuevo', 'nacional', 2026),
('2026-04-02', 'Jueves Santo', 'nacional', 2026),
('2026-04-03', 'Viernes Santo', 'nacional', 2026),
('2026-04-04', 'Sábado de Gloria', 'nacional', 2026),
('2026-05-01', 'Día del Trabajo', 'nacional', 2026),
('2026-06-29', 'San Pedro y San Pablo', 'nacional', 2026),
('2026-07-28', 'Día de la Independencia', 'nacional', 2026),
('2026-07-29', 'Fiestas Patrias', 'nacional', 2026),
('2026-08-30', 'Santa Rosa de Lima', 'nacional', 2026),
('2026-10-08', 'Combate de Angamos', 'nacional', 2026),
('2026-11-01', 'Día de Todos los Santos', 'nacional', 2026),
('2026-12-08', 'Inmaculada Concepción', 'nacional', 2026),
('2026-12-25', 'Navidad', 'nacional', 2026)
ON CONFLICT (fecha) DO NOTHING;
