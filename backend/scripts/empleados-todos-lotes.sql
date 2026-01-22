-- Generando 8 lotes para 219 empleados

-- LOTE 1/8 - Empleados 1 a 30
INSERT INTO empleados (codigo_empleado, dni, nombres, apellidos, email, fecha_ingreso, puesto_id, area_id, tipo_trabajador_id, es_supervisor, es_rrhh, activo)
SELECT * FROM (VALUES
  ('AGV0002', '09310906', 'Jorge Umberto', 'Calderon Ojeda', 'jorge.calderon@agrovetmarket.com', '1994-08-01'::date, (SELECT id FROM puestos WHERE nombre = 'Director General'), 18, 1, true, false, true),
  ('AGV0010', '09849767', 'Alejandro Victor', 'Vargas Leon', 'alejandro.vargas@agrovetmarket.com', '1995-12-01'::date, (SELECT id FROM puestos WHERE nombre = 'Supervisor de Recepcion, Materiales y Despachos a Maquilas'), 2, 1, true, false, true),
  ('AGV0018', '09314068', 'Pedro Alejandro', 'Calderon Ojeda', 'pedro.calderon@agrovetmarket.com', '1999-05-01'::date, (SELECT id FROM puestos WHERE nombre = 'Jefe de Ventas Ganader´┐¢a'), 24, 1, true, false, true),
  ('AGV0034', '41118341', 'Dagoberto', 'Salazar Guerrero', 'dagoberto.salazar@agrovetmarket.com', '2000-07-05'::date, (SELECT id FROM puestos WHERE nombre = 'Supervisor de Producto Terminado, Distribucion y Transporte'), 2, 1, true, false, true),
  ('AGV0065', '10184621', 'Ricardo Martin', 'Calderon Ojeda', 'ricardo.calderon@agrovetmarket.com', '2003-09-01'::date, (SELECT id FROM puestos WHERE nombre = 'Jefe de Administraci´┐¢n'), 1, 1, true, false, true),
  ('AGV0076', '10545562', 'Jose Aurelio', 'Garcia Fiestas', 'jose.garcia@agrovetmarket.com', '2004-11-01'::date, (SELECT id FROM puestos WHERE nombre = 'Director de Finanzas y Tecnologias de la Informacion'), 12, 1, true, false, true),
  ('AGV0083', '09351865', 'Ivan Serginoff', 'Ramirez', 'ivan.ramirez@agrovetmarket.com', '2005-02-17'::date, (SELECT id FROM puestos WHERE nombre = 'Supervisor de Control de Procesos'), 13, 1, true, false, true),
  ('AGV0111', '41300244', 'Giovanna Del Pilar', 'Anchorena Arias', 'giovanna.anchorena@agrovetmarket.com', '2005-11-14'::date, (SELECT id FROM puestos WHERE nombre = 'Directora de Investigacion y Desarrollo'), 19, 1, true, false, true),
  ('AGV0124', '07097049', 'Ana Maria', 'Pi´┐¢eyros Gonzales', 'ana.pieyros@agrovetmarket.com', '2006-04-01'::date, (SELECT id FROM puestos WHERE nombre = 'Auxiliar de Limpieza Y Mantenimiento'), 1, 1, false, false, true),
  ('AGV0125', '40123188', 'Milady Isabel', 'Alvarez Del Villar Soriano', 'milady.alvarez@agrovetmarket.com', '2006-04-06'::date, (SELECT id FROM puestos WHERE nombre = 'Directora de Desarrollo Organizacional'), 4, 1, true, false, true),
  ('AGV0187', '29672410', 'Sandra Orietta', 'Meneses Del Valle', 'sandra.meneses@agrovetmarket.com', '2007-11-27'::date, (SELECT id FROM puestos WHERE nombre = 'Subgerente de Ventas Internacionales'), 35, 1, true, false, true),
  ('AGV0240', '41866820', 'Johanna', 'Hurtado Candenas', 'johanna.hurtado@agrovetmarket.com', '2009-02-12'::date, (SELECT id FROM puestos WHERE nombre = 'Gerente de Logistica y Distribucion'), 3, 1, true, false, true),
  ('AGV0246', '42705690', 'Alan Armando', 'Tauca Torres', 'alan.tauca@agrovetmarket.com', '2009-03-09'::date, (SELECT id FROM puestos WHERE nombre = 'Jefe de Ventas Ganader´┐¢a'), 24, 1, true, false, true),
  ('AGV0265', '07514765', 'Juan Catalino', 'Felix Rivera', 'juan.felix@agrovetmarket.com', '2009-10-01'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente de Materiales y Despacho Maquilas'), 2, 1, false, false, true),
  ('AGV0267', '09308424', 'Gladis Elizabeth', 'Ojeda Za´┐¢artu', 'gladis.ojeda@agrovetmarket.com', '2009-11-01'::date, (SELECT id FROM puestos WHERE nombre = 'Asesor'), 1, 1, false, false, true),
  ('AGV0298', '43997960', 'Erick Wilfredo', 'Viera Moscol', 'erick.viera@agrovetmarket.com', '2010-06-01'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente de Materiales y Despacho Maquilas'), 2, 1, false, false, true),
  ('AGV0315', '08459479', 'Elvis Lucio', 'Caceres Salcedo', 'elvis.caceres@agrovetmarket.com', '2010-10-01'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente Administrativo de Ventas Internacionales'), 35, 1, false, false, true),
  ('AGV0319', '44671261', 'Jorge Luis Jonathan', 'Cerda Piaca', 'jorge.cerda@agrovetmarket.com', '2010-11-23'::date, (SELECT id FROM puestos WHERE nombre = 'Coordinador de Proyectos de Mejora de TI'), 33, 1, true, false, true),
  ('AGV0343', '41274325', 'Violeta Regina', 'Balbuena Gamarra', 'violeta.balbuena@agrovetmarket.com', '2011-07-18'::date, (SELECT id FROM puestos WHERE nombre = 'Subgerente de Estabilidades y Validaciones Analiticas'), 15, 1, true, false, true),
  ('AGV0359', '42166202', 'Carmen Johana', 'Morales Tarazona', 'carmen.morales@agrovetmarket.com', '2011-12-01'::date, (SELECT id FROM puestos WHERE nombre = 'Gerente de Marketing'), 22, 1, true, false, true),
  ('AGV0361', '40560230', 'Alberto Gaston', 'Vasquez Cuestas', 'alberto.vasquez@agrovetmarket.com', '2011-12-19'::date, (SELECT id FROM puestos WHERE nombre = 'Gerente de Proyectos y Procesos Farmaceuticos'), 30, 1, true, false, true),
  ('AGV0362', '40238779', 'Jimena Maria', 'Del Risco Sotil', 'jimena.del@agrovetmarket.com', '2012-01-02'::date, (SELECT id FROM puestos WHERE nombre = 'Directora Comercial Local'), 1, 1, true, false, true),
  ('AGV0384', '47881508', 'Nexar Leny', 'Mundaca Diaz', 'nexar.mundaca@agrovetmarket.com', '2012-06-15'::date, (SELECT id FROM puestos WHERE nombre = 'Auxiliar de Producto Terminado y Distribucion'), 2, 1, false, false, true),
  ('AGV0397', '44527068', 'Luis Alfredo', 'Chavez Balarezo', 'luis.chavez@agrovetmarket.com', '2012-11-01'::date, (SELECT id FROM puestos WHERE nombre = 'Jefe Tecnico Comercial Internacional Petmedica America Latina'), 35, 1, true, false, true),
  ('AGV0404', '44866308', 'Milagros Yessica', 'Huamani Aguirre', 'milagros.huamani@agrovetmarket.com', '2013-02-01'::date, (SELECT id FROM puestos WHERE nombre = 'Jefe de Produccion de Maquilas'), 29, 1, true, false, true),
  ('AGV0427', '41361328', 'Ursula Maria', 'Retuerto Perez', 'ursula.retuerto@agrovetmarket.com', '2013-09-23'::date, (SELECT id FROM puestos WHERE nombre = 'Jefe de Abastecimiento'), 10, 1, true, false, true),
  ('AGV0442', '44065263', 'Marilia Isabel', 'Tinoco Morales', 'marilia.tinoco@agrovetmarket.com', '2014-01-08'::date, (SELECT id FROM puestos WHERE nombre = 'Supervisor de Finanzas'), 16, 1, true, false, true),
  ('AGV0455', '10120502', 'Raquel Veronica', 'Marcelo Roncal', 'raquel.marcelo@agrovetmarket.com', '2014-04-14'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente de Control de Calidad MP'), 13, 1, false, false, true),
  ('AGV0470', '09881789', 'Lelia Andrea', 'Sanchez Hidalgo', 'lelia.sanchez@agrovetmarket.com', '2014-09-01'::date, (SELECT id FROM puestos WHERE nombre = 'Jefe de Sanidad Aves y Cerdos'), 31, 1, true, false, true),
  ('AGV0476', '42428258', 'Ana Cecilia', 'Flores Silva', 'ana.flores@agrovetmarket.com', '2014-10-16'::date, (SELECT id FROM puestos WHERE nombre = 'Supervisor Contable'), 11, 1, true, false, true)
) AS datos(codigo_empleado, dni, nombres, apellidos, email, fecha_ingreso, puesto_id, area_id, tipo_trabajador_id, es_supervisor, es_rrhh, activo)
ON CONFLICT (dni) DO NOTHING;

-- LOTE 2/8 - Empleados 31 a 60
INSERT INTO empleados (codigo_empleado, dni, nombres, apellidos, email, fecha_ingreso, puesto_id, area_id, tipo_trabajador_id, es_supervisor, es_rrhh, activo)
SELECT * FROM (VALUES
  ('AGV0524', '44880919', 'Luis Alfredo', 'Ore Barrionuevo', 'luis.ore@agrovetmarket.com', '2015-07-20'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente de Distribucion Internacional'), 2, 1, false, false, true),
  ('AGV0563', '48170297', 'Jhosi Silvio', 'Miguel Mayta', 'jhosi.miguel@agrovetmarket.com', '2016-06-18'::date, (SELECT id FROM puestos WHERE nombre = 'Supervisor de Compras Locales'), 10, 1, true, false, true),
  ('AGV0572', '06812394', 'Janet Beatriz', 'Hueza Matencio', 'janet.hueza@agrovetmarket.com', '2016-07-18'::date, (SELECT id FROM puestos WHERE nombre = 'Jefe de Back Office y Procedimientos Comerciales'), 1, 1, true, false, true),
  ('AGV0573', '40326738', 'Norma Melissa', 'Pizarro Rojas', 'norma.pizarro@agrovetmarket.com', '2016-07-18'::date, (SELECT id FROM puestos WHERE nombre = 'Jefe de Asuntos Regulatorios Cuentas Claves'), 5, 1, true, false, true),
  ('AGV0603', '44510264', 'Claudia', 'Roman Sulca', 'claudia.roman@agrovetmarket.com', '2017-02-14'::date, (SELECT id FROM puestos WHERE nombre = 'Supervisor de Dise´┐¢o de Material de Empaque'), 5, 1, false, false, true),
  ('AGV0612', '41279012', 'Karen Melissa', 'Delgado Crispin', 'karen.delgado@agrovetmarket.com', '2017-03-27'::date, (SELECT id FROM puestos WHERE nombre = 'Gerente de Innovacion y Desarrollo Farmaceutico'), 17, 1, true, false, true),
  ('AGV0618', '70538548', 'Yanina', 'Amao Canchari', 'yanina.amao@agrovetmarket.com', '2017-04-10'::date, (SELECT id FROM puestos WHERE nombre = 'Jefe de Asuntos Regulatorios Latam'), 5, 1, true, false, true),
  ('AGV0619', '49080294', 'Eigly Yaritza', 'Pereira Fuentes', 'eigly.pereira@agrovetmarket.com', '2017-04-19'::date, (SELECT id FROM puestos WHERE nombre = 'Analista de Creditos y Cobranzas'), 16, 1, false, false, true),
  ('AGV0620', '07082032', 'Segundo Manuel', 'Rimarachin Olivera', 'segundo.rimarachin@agrovetmarket.com', '2017-04-20'::date, (SELECT id FROM puestos WHERE nombre = 'Chofer'), 1, 1, false, false, true),
  ('AGV0628', '44307069', 'Katherine Magaly', 'Navarro Alayza', 'katherine.navarro@agrovetmarket.com', '2017-06-05'::date, (SELECT id FROM puestos WHERE nombre = 'Jefe de CRM'), 35, 1, true, false, true),
  ('AGV0630', '47049563', '´┐¢Lucy Mercedes', 'Zapata Bran', 'lucy.zapata@agrovetmarket.com', '2017-07-01'::date, (SELECT id FROM puestos WHERE nombre = 'Jefe de Validaciones Analiticas'), 15, 1, true, false, true),
  ('AGV0632', '46609730', 'Nataly Del Carmen', 'Valdez Hinostroza', 'nataly.valdez@agrovetmarket.com', '2017-07-03'::date, (SELECT id FROM puestos WHERE nombre = 'Jefe de Escalonamiento y Transferencia'), 17, 1, true, false, true),
  ('AGV0640', '72611115', 'Esperanza Victoria', 'Alhuay Perez', 'esperanza.alhuay@agrovetmarket.com', '2017-08-15'::date, (SELECT id FROM puestos WHERE nombre = 'Analista de Tesoreria'), 16, 1, false, false, true),
  ('AGV0650', '46481506', 'Cenit Pablo', 'Diaz Velasquez', 'cenit.diaz@agrovetmarket.com', '2017-10-02'::date, (SELECT id FROM puestos WHERE nombre = 'Editor de Contenidos'), 22, 1, false, false, true),
  ('AGV0653', '48138936', 'Brayan', 'Malca Carpio', 'brayan.malca@agrovetmarket.com', '2017-11-13'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente de Distribucion Local'), 2, 1, false, false, true),
  ('AGV0662', '41487544', 'Perci', 'Mondragon Dominguez', 'perci.mondragon@agrovetmarket.com', '2018-02-05'::date, (SELECT id FROM puestos WHERE nombre = 'Jefe de Centro de Distribucion'), 2, 1, true, false, true),
  ('AGV0663', '43271693', 'Michael', 'Vilchez Rivera', 'michael.vilchez@agrovetmarket.com', '2018-04-02'::date, (SELECT id FROM puestos WHERE nombre = 'Representante de Ventas Ganaderia'), 24, 1, false, false, true),
  ('AGV0668', '45434771', 'Kattya Adelaida', 'Barcena Braga', 'kattya.barcena@agrovetmarket.com', '2018-04-09'::date, (SELECT id FROM puestos WHERE nombre = 'Supervisor de Creditos y Cobranzas'), 16, 1, true, false, true),
  ('AGV0674', '42133895', 'Veronica', 'Campos Facundo', 'veronica.campos@agrovetmarket.com', '2018-07-03'::date, (SELECT id FROM puestos WHERE nombre = 'Representante de Ventas - Animales de Compa´┐¢´┐¢a'), 1, 1, false, false, true),
  ('AGV0685', '09372197', 'Raul Rafael', 'Marroquin Cabezudo', 'raul.marroquin@agrovetmarket.com', '2018-09-01'::date, (SELECT id FROM puestos WHERE nombre = 'Asesor Legal'), 16, 1, false, false, true),
  ('AGV0690', '48319203', 'Miguel Angel', 'Molinero Piaca', 'miguel.molinero@agrovetmarket.com', '2018-09-18'::date, (SELECT id FROM puestos WHERE nombre = 'Auxiliar de Producto Terminado y Distribucion'), 2, 1, false, false, true),
  ('AGV0691', '09599599', 'Ursula', 'Huamancaja Cardenas', 'ursula.huamancaja@agrovetmarket.com', '2018-10-01'::date, (SELECT id FROM puestos WHERE nombre = 'Gerente de Talento Humano y SST'), 34, 1, false, true, true),
  ('AGV0706', '10095081', 'Olga Antonia', 'Guerra Barriga', 'olga.guerra@agrovetmarket.com', '2018-12-01'::date, (SELECT id FROM puestos WHERE nombre = 'Auxiliar de Laboratorio'), 15, 1, false, false, true),
  ('AGV0725', '10880202', 'Julio Cesar', 'Camargo Alvino', 'julio.camargo@agrovetmarket.com', '2019-02-25'::date, (SELECT id FROM puestos WHERE nombre = 'Auxiliar de Almacen'), 2, 1, false, false, true),
  ('AGV0729', '45267996', 'Jonas Eli', 'Torres Solorzano', 'jonas.torres@agrovetmarket.com', '2019-03-08'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente de Gestion de la Calidad'), 4, 1, false, false, true),
  ('AGV0749', '40816315', 'Ivan Rafael', 'Ramos Guzman', 'ivan.ramos@agrovetmarket.com', '2019-08-01'::date, (SELECT id FROM puestos WHERE nombre = 'Representante de Ventas Ganaderia'), 24, 1, false, false, true),
  ('AGV0767', '09533163', 'Augusto Walter', 'Matto Astete', 'augusto.matto@agrovetmarket.com', '2019-12-09'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente de Creditos y Cobranzas'), 16, 1, false, false, true),
  ('AGV0771', '44023038', 'Erick Alfredo', 'Molleapaza Aguilar', 'erick.molleapaza@agrovetmarket.com', '2020-01-08'::date, (SELECT id FROM puestos WHERE nombre = 'Subgerente de Formulacion y Desarrollo de Procesos'), 17, 1, true, false, true),
  ('AGV0776', '45340693', 'Jose Luis', 'Delgado Sanchez', 'jose.delgado@agrovetmarket.com', '2020-01-22'::date, (SELECT id FROM puestos WHERE nombre = 'Jefe de Sanidad- Animales Mayores y de Produccion'), 31, 1, true, false, true),
  ('AGV0779', '06605348', 'Jesus Wilfredo', 'Calderon Vera', 'jesus.calderon@agrovetmarket.com', '2020-03-01'::date, (SELECT id FROM puestos WHERE nombre = 'Asesor Externo de Investigaci´┐¢n en Ganado Lechero'), 31, 1, false, false, true)
) AS datos(codigo_empleado, dni, nombres, apellidos, email, fecha_ingreso, puesto_id, area_id, tipo_trabajador_id, es_supervisor, es_rrhh, activo)
ON CONFLICT (dni) DO NOTHING;

-- LOTE 3/8 - Empleados 61 a 90
INSERT INTO empleados (codigo_empleado, dni, nombres, apellidos, email, fecha_ingreso, puesto_id, area_id, tipo_trabajador_id, es_supervisor, es_rrhh, activo)
SELECT * FROM (VALUES
  ('AGV0780', '71066355', 'Roldan', 'Manihuari Tenazoa', 'roldan.manihuari@agrovetmarket.com', '2020-03-01'::date, (SELECT id FROM puestos WHERE nombre = 'Guardian'), 31, 1, false, false, true),
  ('AGV0786', '08883259', 'Cesar', 'Morales de la Cruz', 'cesar.morales@agrovetmarket.com', '2020-07-01'::date, (SELECT id FROM puestos WHERE nombre = 'Subgerente de Desarrollo Analitico'), 14, 1, true, false, true),
  ('AGV0800', '47146124', 'Diana Maythe', 'Cornejo Cornejo', 'diana.cornejo@agrovetmarket.com', '2020-10-26'::date, (SELECT id FROM puestos WHERE nombre = 'Jefe de Asuntos Regulatorios'), 5, 1, true, false, true),
  ('AGV0801', '45682368', 'Stefanny Marianella', 'Rios German', 'stefanny.rios@agrovetmarket.com', '2020-11-01'::date, (SELECT id FROM puestos WHERE nombre = 'Gerente de Animales de Compa´┐¢´┐¢a'), 1, 1, true, false, true),
  ('AGV0802', '46556650', 'Mauricio Yvan', 'Porras Nicho', 'mauricio.porras@agrovetmarket.com', '2020-11-01'::date, (SELECT id FROM puestos WHERE nombre = 'Jefe de Formulaciones'), 17, 1, true, false, true),
  ('AGV0823', '41126035', 'Beatriz', 'Mayma Chumbiauca', 'beatriz.mayma@agrovetmarket.com', '2020-11-18'::date, (SELECT id FROM puestos WHERE nombre = 'Jefe de Estabilidades'), 15, 1, true, false, true),
  ('AGV0836', '002114405', 'Jose Libardo', 'Pereira Fuentes', 'jose.pereira@agrovetmarket.com', '2021-01-18'::date, (SELECT id FROM puestos WHERE nombre = 'Auxiliar de Mensajer´┐¢a de Investigaci´┐¢n Y Desarrollo'), 19, 1, false, false, true),
  ('AGV0850', '44824879', 'Jennyfer Patricia', 'Miguel Solis', 'jennyfer.miguel@agrovetmarket.com', '2021-04-12'::date, (SELECT id FROM puestos WHERE nombre = 'Jefe de Seguridad y Medio Ambiente'), 32, 1, true, false, true),
  ('AGV0852', '47525376', 'Karen Dalila', 'Guerra Soto', 'karen.guerra@agrovetmarket.com', '2021-06-01'::date, (SELECT id FROM puestos WHERE nombre = 'Supervisor de Asuntos Regulatorios'), 5, 1, true, false, true),
  ('AGV0856', '71329473', 'Erick Ronaldo', 'Arias Otoya', 'erick.arias@agrovetmarket.com', '2021-07-01'::date, (SELECT id FROM puestos WHERE nombre = 'Jefe Tecnico Comercial'), 1, 1, true, false, true),
  ('AGV0859', '74581999', 'Camila', 'Calderon Agreda', 'camila.calderon@agrovetmarket.com', '2021-08-16'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente de Ventas'), 35, 1, false, false, true),
  ('AGV0866', '44409869', 'Karina Lisset', 'Torres Riega', 'karina.torres@agrovetmarket.com', '2021-11-02'::date, (SELECT id FROM puestos WHERE nombre = 'Jefe de Control de Calidad'), 13, 1, true, false, true),
  ('AGV0867', '46434409', 'Juan Carlos', 'Campos Drago', 'juan.campos@agrovetmarket.com', '2021-11-02'::date, (SELECT id FROM puestos WHERE nombre = 'Jefe de Marketing Internacional'), 35, 1, true, false, true),
  ('AGV0868', '43978070', 'Paola Yanina', 'Arias Bazan', 'paola.arias@agrovetmarket.com', '2021-11-02'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente de Dise´┐¢o de Material de Empaque'), 5, 1, false, false, true),
  ('AGV0872', '46974645', 'Estefani Milagros', 'Huamani Carrasco', 'estefani.huamani@agrovetmarket.com', '2022-01-03'::date, (SELECT id FROM puestos WHERE nombre = 'Jefe de Asuntos Regulatorios'), 5, 1, true, false, true),
  ('AGV0878', '72477744', 'Vanessa Alexandra', 'Parker Mendoza', 'vanessa.parker@agrovetmarket.com', '2022-01-10'::date, (SELECT id FROM puestos WHERE nombre = 'Supervisor de Ventas Internacionales'), 35, 1, true, false, true),
  ('AGV0881', '47700102', 'Sharon Carolyn', 'Francisco Perez', 'sharon.francisco@agrovetmarket.com', '2022-02-01'::date, (SELECT id FROM puestos WHERE nombre = 'Representante de Ventas - Nutriscience'), 26, 1, false, false, true),
  ('AGV0884', '23997723', 'Fernando Samuel', 'Paredes Baca', 'fernando.paredes@agrovetmarket.com', '2022-02-01'::date, (SELECT id FROM puestos WHERE nombre = 'Jefe de Ventas Ganaderia Zona Sur Oriente'), 24, 1, true, false, true),
  ('AGV0885', '47832678', 'Giovana Kathedry', 'Cordova Carhuamaca', 'giovana.cordova@agrovetmarket.com', '2022-02-07'::date, (SELECT id FROM puestos WHERE nombre = 'Supervisor de Operaciones'), 29, 1, true, false, true),
  ('AGV0893', '72474117', 'Marcia Fernanda', 'Palacios Hoyos', 'marcia.palacios@agrovetmarket.com', '2022-04-08'::date, (SELECT id FROM puestos WHERE nombre = 'Supervisor de Dispensacion'), 29, 1, true, false, true),
  ('AGV0896', '10434281', 'Blanca Luz', 'Loayza Rodriguez', 'blanca.loayza@agrovetmarket.com', '2022-05-01'::date, (SELECT id FROM puestos WHERE nombre = 'Supervisor de Costos'), 11, 1, true, false, true),
  ('AGV0898', '42933766', 'Carlos Alfredo', 'Barboza Castro', 'carlos.barboza@agrovetmarket.com', '2022-05-02'::date, (SELECT id FROM puestos WHERE nombre = 'Jefe de Comercio Exterior'), 8, 1, true, false, true),
  ('AGV0905', '42260711', 'Pamela Raquel', 'Torres Salinas', 'pamela.torres@agrovetmarket.com', '2022-07-07'::date, (SELECT id FROM puestos WHERE nombre = 'Jefe de Planeamiento Financiero'), 28, 1, true, false, true),
  ('AGV0908', '06595692', 'Jesus Wilfredo', 'Calderon Ojeda', 'jesus.calderon@agrovetmarket.com', '2022-08-01'::date, (SELECT id FROM puestos WHERE nombre = 'Subgerente de Ventas Locales'), 24, 1, true, false, true),
  ('AGV0914', '44943485', 'Jancarlo', 'Pariasca Cuba', 'jancarlo.pariasca@agrovetmarket.com', '2022-09-01'::date, (SELECT id FROM puestos WHERE nombre = 'Jefe de Finanzas'), 16, 1, true, false, true),
  ('AGV0915', '74176101', 'Lucero cusi ccoyllur', 'Flores Lava', 'lucero.flores@agrovetmarket.com', '2022-09-20'::date, (SELECT id FROM puestos WHERE nombre = 'Jefe de Sanidad - Animales Menores y Farmacovigilancia'), 31, 1, true, false, true),
  ('AGV0922', '40252256', 'Rommel', 'Chinchay Mayoria', 'rommel.chinchay@agrovetmarket.com', '2022-11-02'::date, (SELECT id FROM puestos WHERE nombre = 'Jefe de Ventas Ganaderia-Zona Norte'), 24, 1, true, false, true),
  ('AGV0924', '76163353', 'Flavia Rosa', 'Mendoza Ancajima', 'flavia.mendoza@agrovetmarket.com', '2022-11-07'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente de Marketing'), 7, 1, false, false, true),
  ('AGV0925', '46462043', 'Anabel Luisa', 'Giraldo Mayhuiri', 'anabel.giraldo@agrovetmarket.com', '2022-11-09'::date, (SELECT id FROM puestos WHERE nombre = 'Analista Contable'), 11, 1, false, false, true),
  ('AGV0926', '76845847', 'Jessica Carolina', 'Ore Lude´┐¢a', 'jessica.ore@agrovetmarket.com', '2022-11-09'::date, (SELECT id FROM puestos WHERE nombre = 'Supervisor Senior de Tecnicas Analiticas'), 14, 1, true, false, true)
) AS datos(codigo_empleado, dni, nombres, apellidos, email, fecha_ingreso, puesto_id, area_id, tipo_trabajador_id, es_supervisor, es_rrhh, activo)
ON CONFLICT (dni) DO NOTHING;

-- LOTE 4/8 - Empleados 91 a 120
INSERT INTO empleados (codigo_empleado, dni, nombres, apellidos, email, fecha_ingreso, puesto_id, area_id, tipo_trabajador_id, es_supervisor, es_rrhh, activo)
SELECT * FROM (VALUES
  ('AGV0931', '48517948', 'Juana', 'Lovaton Ramirez', 'juana.lovaton@agrovetmarket.com', '2022-12-05'::date, (SELECT id FROM puestos WHERE nombre = 'Jefe de Aplicaciones TI'), 33, 1, true, false, true),
  ('AGV0934', '75096888', 'Melina Yessenia', 'Cochachin Lucar', 'melina.cochachin@agrovetmarket.com', '2022-12-22'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente Contable'), 11, 1, false, false, true),
  ('AGV0935', '47566082', 'Maria Esther', 'Rodriguez Carmona', 'maria.rodriguez@agrovetmarket.com', '2023-01-03'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente de Administraci´┐¢n'), 1, 1, false, false, true),
  ('AGV0939', '73362975', 'Belinda', 'Santiago Bravo', 'belinda.santiago@agrovetmarket.com', '2023-01-16'::date, (SELECT id FROM puestos WHERE nombre = 'Analista Contable'), 11, 1, false, false, true),
  ('AGV0946', '46594683', 'Alimao', 'Hinostroza Villanueva', 'alimao.hinostroza@agrovetmarket.com', '2023-02-10'::date, (SELECT id FROM puestos WHERE nombre = 'Supervisor de Talento Humano'), 34, 1, false, true, true),
  ('AGV0949', '71337566', 'Jonathan Javier', 'Barrera Rozas', 'jonathan.barrera@agrovetmarket.com', '2023-03-01'::date, (SELECT id FROM puestos WHERE nombre = 'Gestor de Contenido Digital Veterinario'), 7, 1, false, false, true),
  ('AGV0950', '02887604', 'Manuel Federico', 'Bravo Perez', 'manuel.bravo@agrovetmarket.com', '2023-03-01'::date, (SELECT id FROM puestos WHERE nombre = 'Gerente Comercial Ganaderia'), 24, 1, true, false, true),
  ('AGV0952', '09597601', 'Elio Jorge', 'Vilchez Gutierrez', 'elio.vilchez@agrovetmarket.com', '2023-03-13'::date, (SELECT id FROM puestos WHERE nombre = 'Chofer'), 1, 1, false, false, true),
  ('AGV0953', '40808976', 'Beatriz Marina', 'Truel Robles', 'beatriz.truel@agrovetmarket.com', '2023-03-17'::date, (SELECT id FROM puestos WHERE nombre = 'Supervisor de Direcci´┐¢n de Investigaci´┐¢n y Desarrollo'), 19, 1, true, false, true),
  ('AGV0956', '48113547', 'Antonieta', 'Ortiz Ortiz', 'antonieta.ortiz@agrovetmarket.com', '2023-04-03'::date, (SELECT id FROM puestos WHERE nombre = 'Supervisor de Tecnicas Analiticas'), 14, 1, true, false, true),
  ('AGV0957', '43431921', 'Ena Maria Patricia', 'Fernandez Mu´┐¢oz', 'ena.fernandez@agrovetmarket.com', '2023-04-03'::date, (SELECT id FROM puestos WHERE nombre = 'Gerente de Transformaci´┐¢n Digital'), 33, 1, true, false, true),
  ('AGV0959', '70438614', 'Raquel Consuelo', 'Arellano Bastidas', 'raquel.arellano@agrovetmarket.com', '2023-04-21'::date, (SELECT id FROM puestos WHERE nombre = 'Supervisor de Asuntos Regulatorios Latam'), 5, 1, true, false, true),
  ('AGV0961', '73141547', 'Nicolas Paolo', 'Ramos Cuya', 'nicolas.ramos@agrovetmarket.com', '2023-05-09'::date, (SELECT id FROM puestos WHERE nombre = 'Auxiliar de Formulaciones'), 17, 1, false, false, true),
  ('AGV0963', '75131900', 'Samire Andrea', 'Huaman Cordova', 'samire.huaman@agrovetmarket.com', '2023-05-29'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente de Ventas Ecommerce'), 7, 1, false, false, true),
  ('AGV0964', '007080768', 'Jonathan Jesus', 'Reyes Quintero', 'jonathan.reyes@agrovetmarket.com', '2023-06-20'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente de Almacen e Inventarios'), 2, 1, false, false, true),
  ('AGV0965', '74390287', 'Yohani Liseth', 'Mera Toro', 'yohani.mera@agrovetmarket.com', '2023-06-21'::date, (SELECT id FROM puestos WHERE nombre = 'Representante de Ventas Ganaderia'), 24, 1, false, false, true),
  ('AGV0966', '46554968', 'Jean Carlo Jose', 'Romani Garcia', 'jean.romani@agrovetmarket.com', '2023-06-27'::date, (SELECT id FROM puestos WHERE nombre = 'Jefe de Comunicaci´┐¢n Interna'), 34, 1, true, false, true),
  ('AGV0967', '41967991', 'Jose Benigno', 'Quea Espinoza', 'jose.quea@agrovetmarket.com', '2023-07-03'::date, (SELECT id FROM puestos WHERE nombre = 'Representante de Ventas Ganaderia'), 24, 1, false, false, true),
  ('AGV0968', '48248365', 'Nathaly Elena', 'Calderon Ascona', 'nathaly.calderon@agrovetmarket.com', '2023-07-03'::date, (SELECT id FROM puestos WHERE nombre = 'Supervisor de Procesos Industriales'), 17, 1, true, false, true),
  ('AGV0970', '43967204', 'Miguel Angel', 'Caballero Palomino', 'miguel.caballero@agrovetmarket.com', '2023-07-10'::date, (SELECT id FROM puestos WHERE nombre = 'Supervisor de Formulaciones 2'), 17, 1, true, false, true),
  ('AGV0973', '007078460', 'Pedro Antonio', 'Otaiza Valdivez', 'pedro.otaiza@agrovetmarket.com', '2023-08-07'::date, (SELECT id FROM puestos WHERE nombre = 'Auxiliar de Distribucion de Materiales'), 2, 1, false, false, true),
  ('AGV0976', '41747025', 'Orlando Franco', 'Jaimes Rojas', 'orlando.jaimes@agrovetmarket.com', '2023-08-28'::date, (SELECT id FROM puestos WHERE nombre = 'KAM Aves y Cerdos Lima - Arequipa'), 6, 1, false, false, true),
  ('AGV0978', '41221724', 'Gisela Ivette', 'Reategui Vasquez', 'gisela.reategui@agrovetmarket.com', '2023-09-01'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente de Costos'), 11, 1, false, false, true),
  ('AGV0979', '72706327', 'Kevin', 'Sanchez Champi', 'kevin.sanchez@agrovetmarket.com', '2023-09-01'::date, (SELECT id FROM puestos WHERE nombre = 'Representante de Ventas Ganaderia'), 24, 1, false, false, true),
  ('AGV0980', '71491227', 'Nidia Yamilet', 'Lope Erazo', 'nidia.lope@agrovetmarket.com', '2023-09-04'::date, (SELECT id FROM puestos WHERE nombre = 'Promotor de Ventas Animales de Compa´┐¢´┐¢a'), 1, 1, false, false, true),
  ('AGV0984', '74932277', 'Sandra Monica', 'Krklec Torres', 'sandra.krklec@agrovetmarket.com', '2023-09-18'::date, (SELECT id FROM puestos WHERE nombre = 'Supervisor de Sanidad - Animales Menores y Farmacovigilancia'), 31, 1, false, false, true),
  ('AGV0986', '48170145', 'Regina Pamela', 'Martinez Flores', 'regina.martinez@agrovetmarket.com', '2023-10-11'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente de Televentas'), 1, 1, false, false, true),
  ('AGV0991', '72217788', 'Sebastian Daryl', 'Morales Ayquipa', 'sebastian.morales@agrovetmarket.com', '2023-11-17'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente de Operaciones y Logistica'), 27, 1, false, false, true),
  ('AGV0996', '71618290', 'Miguel Antonio', 'Caycho Gonzales', 'miguel.caycho@agrovetmarket.com', '2023-12-19'::date, (SELECT id FROM puestos WHERE nombre = 'Auxiliar de Distribuci´┐¢n de Materiales'), 2, 1, false, false, true),
  ('AGV0997', '74205077', 'Angie Anabel', 'Gomero Asencio', 'angie.gomero@agrovetmarket.com', '2023-12-27'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente de Tesoreria'), 16, 1, false, false, true)
) AS datos(codigo_empleado, dni, nombres, apellidos, email, fecha_ingreso, puesto_id, area_id, tipo_trabajador_id, es_supervisor, es_rrhh, activo)
ON CONFLICT (dni) DO NOTHING;

-- LOTE 5/8 - Empleados 121 a 150
INSERT INTO empleados (codigo_empleado, dni, nombres, apellidos, email, fecha_ingreso, puesto_id, area_id, tipo_trabajador_id, es_supervisor, es_rrhh, activo)
SELECT * FROM (VALUES
  ('AGV0999', '70993751', 'Deysi Maricielo', 'Campo Valverde', 'deysi.campo@agrovetmarket.com', '2024-01-08'::date, (SELECT id FROM puestos WHERE nombre = 'Representante de Ventas - Animales de Compa´┐¢´┐¢a'), 1, 1, false, false, true),
  ('AGV1001', '71747437', 'Ariana', 'Carmona Gavidia', 'ariana.carmona@agrovetmarket.com', '2024-01-19'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente de Ventas internacionales'), 35, 1, false, false, true),
  ('AGV1002', '70691089', 'Luis Anthony', 'Quinteros Arosti', 'luis.quinteros@agrovetmarket.com', '2024-01-22'::date, (SELECT id FROM puestos WHERE nombre = 'Auxiliar de Distribuci´┐¢n de Materiales'), 2, 1, false, false, true),
  ('AGV1008', '70357139', 'Gianella Stephanie', 'Neves Ordo´┐¢ez', 'gianella.neves@agrovetmarket.com', '2024-02-12'::date, (SELECT id FROM puestos WHERE nombre = 'Supervisor de Estabilidades'), 15, 1, true, false, true),
  ('AGV1012', '40214605', 'Ivonne Katty', 'Riquez Alvaro', 'ivonne.riquez@agrovetmarket.com', '2024-02-21'::date, (SELECT id FROM puestos WHERE nombre = 'Gerente de Producci´┐¢n'), 29, 1, true, false, true),
  ('AGV1013', '09918364', 'Abner Abahadt', 'Hoyos Miranda', 'abner.hoyos@agrovetmarket.com', '2024-03-01'::date, (SELECT id FROM puestos WHERE nombre = 'Jefe de Ventas Zona Centro'), 24, 1, true, false, true),
  ('AGV1014', '73489936', 'Anyela Lisset', 'Celi Castillo', 'anyela.celi@agrovetmarket.com', '2024-03-01'::date, (SELECT id FROM puestos WHERE nombre = 'Promotor de Ventas Animales de Compa´┐¢´┐¢a'), 1, 1, false, false, true),
  ('AGV1015', '48340724', 'Brenda Noemi', 'Cupe Pardo', 'brenda.cupe@agrovetmarket.com', '2024-03-06'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente de Compras Locales'), 10, 1, false, false, true),
  ('AGV1018', '73134126', 'Irvin Armando', 'Tomas Huaman', 'irvin.tomas@agrovetmarket.com', '2024-03-13'::date, (SELECT id FROM puestos WHERE nombre = 'Representante de Ventas Ganaderia'), 24, 1, false, false, true),
  ('AGV1020', '74123539', 'Mariano Raul', 'Polo Caycho', 'mariano.polo@agrovetmarket.com', '2024-04-01'::date, (SELECT id FROM puestos WHERE nombre = 'Supervisor de TI'), 33, 1, true, false, true),
  ('AGV1024', '48476040', 'Maria Elena', 'Cucchi Conde', 'maria.cucchi@agrovetmarket.com', '2024-05-06'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente de Asuntos Regulatorios'), 5, 1, false, false, true),
  ('AGV1026', '46403531', 'Carolina betzabe', 'Tasayco Ashtu', 'carolina.tasayco@agrovetmarket.com', '2024-05-27'::date, (SELECT id FROM puestos WHERE nombre = 'Supervisor de Marketing Linea Nutricional'), 22, 1, true, false, true),
  ('AGV1031', '70890247', 'Cristhian Vicente', 'Toro Soberon', 'cristhian.toro@agrovetmarket.com', '2024-07-08'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente de Seguridad y Medio Ambiente'), 32, 1, false, false, true),
  ('AGV1033', '41434910', 'Weslie Alan', 'Guanilo Costilla', 'weslie.guanilo@agrovetmarket.com', '2024-07-17'::date, (SELECT id FROM puestos WHERE nombre = 'Auxiliar de PT y Distribuci´┐¢n'), 2, 1, false, false, true),
  ('AGV1036', '71872184', 'Gianella Rosario', 'Gutierrez Ambrosio', 'gianella.gutierrez@agrovetmarket.com', '2024-08-16'::date, (SELECT id FROM puestos WHERE nombre = 'Supervisor de Planeamiento Y Control de La Producci´┐¢n'), 27, 1, true, false, true),
  ('AGV1037', '75994233', 'Ximena', 'Portocarrero Robles', 'ximena.portocarrero@agrovetmarket.com', '2024-09-02'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente de Asuntos Regulatorios'), 5, 1, false, false, true),
  ('AGV1038', '70827118', 'Eliud', 'Ferrari Castillo', 'eliud.ferrari@agrovetmarket.com', '2024-09-02'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente de Sanidad Animal'), 31, 1, false, false, true),
  ('AGV1039', '72793869', 'Christian Antonio', 'Santiba´┐¢ez Pe´┐¢a', 'christian.santibaez@agrovetmarket.com', '2024-09-02'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente de Compras Internacionales'), 10, 1, false, false, true),
  ('AGV1040', '47445953', 'Angela del Pilar', 'De la cruz Torres', 'angela.de@agrovetmarket.com', '2024-09-04'::date, (SELECT id FROM puestos WHERE nombre = 'Promotor de Ventas Animales de Compa´┐¢´┐¢a'), 1, 1, false, false, true),
  ('AGV1042', '70604766', 'Jose Gorge', 'Montero Vilcas', 'jose.montero@agrovetmarket.com', '2024-09-23'::date, (SELECT id FROM puestos WHERE nombre = 'Supervisor de Proyectos de Finanzas'), 16, 1, false, false, true),
  ('AGV1044', '41676618', 'Carlos Alberto', 'Garcia Carrasco', 'carlos.garcia@agrovetmarket.com', '2024-10-04'::date, (SELECT id FROM puestos WHERE nombre = 'Supervisor de Infraestructura y Operaciones'), 33, 1, true, false, true),
  ('AGV1045', '74299298', 'Miguel Angel', 'Magui´┐¢a Vargas', 'miguel.maguia@agrovetmarket.com', '2024-10-04'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente de Infraestructura y Soporte TI'), 33, 1, false, false, true),
  ('AGV1046', '75706717', 'Davis Gerson', 'Huaman Gomez', 'davis.huaman@agrovetmarket.com', '2024-10-04'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente de Infraestructura y Soporte TI'), 33, 1, false, false, true),
  ('AGV1048', '76569973', 'Alberto Alan', 'Ariza Alva', 'alberto.ariza@agrovetmarket.com', '2024-10-15'::date, (SELECT id FROM puestos WHERE nombre = 'Supervisor de Formulaciones 3'), 17, 1, true, false, true),
  ('AGV1049', '60789436', 'Vannya Yadira', 'Aylas Torres', 'vannya.aylas@agrovetmarket.com', '2024-10-16'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente de Sanidad - Animales Menores y Farmacovigilancia'), 31, 1, false, false, true),
  ('AGV1050', '70613872', 'Ingrid Tiffany', 'Poma Huamani', 'ingrid.poma@agrovetmarket.com', '2024-11-04'::date, (SELECT id FROM puestos WHERE nombre = 'Supervisor de Validaciones Anal´┐¢ticas'), 15, 1, true, false, true),
  ('AGV1052', '70166395', 'Juan yonatan', 'Galvez Sulluchuco', 'juan.galvez@agrovetmarket.com', '2024-11-04'::date, (SELECT id FROM puestos WHERE nombre = 'Jefe de Desarrollo Analitico'), 14, 1, true, false, true),
  ('AGV1053', '76134040', 'Narda Mirella', 'Rojas Vera', 'narda.rojas@agrovetmarket.com', '2024-11-04'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente de Atracci´┐¢n del Talento'), 34, 1, false, false, true),
  ('AGV1054', '40627935', 'Milagritos Yoana', 'Chipa Yupanqui', 'milagritos.chipa@agrovetmarket.com', '2024-11-04'::date, (SELECT id FROM puestos WHERE nombre = 'Jefe de Propiedad Intelectual'), 17, 1, true, false, true),
  ('AGV1058', '72212319', 'Monica Andrea', 'Diaz Pe´┐¢a', 'monica.diaz@agrovetmarket.com', '2024-11-06'::date, (SELECT id FROM puestos WHERE nombre = 'Promotor de Ventas Animales de Compa´┐¢´┐¢a'), 1, 1, false, false, true)
) AS datos(codigo_empleado, dni, nombres, apellidos, email, fecha_ingreso, puesto_id, area_id, tipo_trabajador_id, es_supervisor, es_rrhh, activo)
ON CONFLICT (dni) DO NOTHING;

-- LOTE 6/8 - Empleados 151 a 180
INSERT INTO empleados (codigo_empleado, dni, nombres, apellidos, email, fecha_ingreso, puesto_id, area_id, tipo_trabajador_id, es_supervisor, es_rrhh, activo)
SELECT * FROM (VALUES
  ('AGV1062', '75728077', 'Keila Athalia', 'Zenobio Cadillo', 'keila.zenobio@agrovetmarket.com', '2024-11-22'::date, (SELECT id FROM puestos WHERE nombre = 'Promotor de Ventas Animales de Compa´┐¢´┐¢a'), 1, 1, false, false, true),
  ('AGV1064', '43302712', 'Marlene', 'Bejar Pillaca', 'marlene.bejar@agrovetmarket.com', '2024-12-02'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente de Operaciones de Producci´┐¢n'), 29, 1, false, false, true),
  ('AGV1065', '41352478', 'Maria Isabel', 'Takaeshi Senmache', 'maria.takaeshi@agrovetmarket.com', '2024-12-02'::date, (SELECT id FROM puestos WHERE nombre = 'Supervisor de Estabilidades'), 15, 1, true, false, true),
  ('AGV1068', '76605055', 'Linda ketty', 'Ore Ramos', 'linda.ore@agrovetmarket.com', '2024-12-05'::date, (SELECT id FROM puestos WHERE nombre = 'Promotor de Ventas Pet Nutriscience'), 26, 1, false, false, true),
  ('AGV1070', '72181704', 'Jose Jesus', 'Chacaliaza Coronel', 'jose.chacaliaza@agrovetmarket.com', '2024-12-18'::date, (SELECT id FROM puestos WHERE nombre = 'Promotor de Ventas Pet Nutriscience'), 26, 1, false, false, true),
  ('AGV1071', '42039545', 'Miguel Alfredo', 'Hernandez Ballena', 'miguel.hernandez@agrovetmarket.com', '2024-12-23'::date, (SELECT id FROM puestos WHERE nombre = 'Jefe de Investigaci´┐¢n y Planeamiento de Demanda'), 1, 1, true, false, true),
  ('AGV1073', '40602403', 'Jimmy Antonio', 'Medina Seminario', 'jimmy.medina@agrovetmarket.com', '2025-01-02'::date, (SELECT id FROM puestos WHERE nombre = 'Auxiliar de Recepci´┐¢n'), 2, 1, false, false, true),
  ('AGV1074', '72567118', 'Jhon David', 'Guerrero Vargas', 'jhon.guerrero@agrovetmarket.com', '2025-01-02'::date, (SELECT id FROM puestos WHERE nombre = 'Auxiliar de Infraestructura y TI - Part Time'), 33, 1, false, false, true),
  ('AGV1075', '73257866', 'Medalith Gretel', 'Sierra Marquina', 'medalith.sierra@agrovetmarket.com', '2025-01-08'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente de Asuntos Regulatorios'), 5, 1, false, false, true),
  ('AGV1076', '72168925', 'Andrea Anali', 'Guerreros Carneiro', 'andrea.guerreros@agrovetmarket.com', '2025-01-08'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente de Asuntos Regulatorios'), 5, 1, false, false, true),
  ('AGV1077', '45263715', 'Zaida Carolina', 'Rojas Bernal', 'zaida.rojas@agrovetmarket.com', '2025-01-20'::date, (SELECT id FROM puestos WHERE nombre = 'Representante de Ventas - Animales de Compa´┐¢´┐¢a'), 1, 1, false, false, true),
  ('AGV1079', '74096193', 'Diana Ruby', 'Ballena Pisfil', 'diana.ballena@agrovetmarket.com', '2025-02-03'::date, (SELECT id FROM puestos WHERE nombre = 'Promotor de Ventas Animales de Compa´┐¢´┐¢a'), 1, 1, false, false, true),
  ('AGV1081', '48395142', 'Ydalia Griselda', 'Huallparimachi Carbajal', 'ydalia.huallparimachi@agrovetmarket.com', '2025-02-03'::date, (SELECT id FROM puestos WHERE nombre = 'Supervisor de Desarrollo Anal´┐¢tico'), 14, 1, true, false, true),
  ('AGV1082', '72802670', 'Yeny', 'Llaccolla Supa', 'yeny.llaccolla@agrovetmarket.com', '2025-02-03'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente de Control de Producci´┐¢n'), 27, 1, false, false, true),
  ('AGV1084', '45672003', 'Juan Enrique', 'Portal Marcelo', 'juan.portal@agrovetmarket.com', '2025-02-07'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente de Aplicaciones'), 33, 1, false, false, true),
  ('AGV1085', '25773070', 'Teodoro Edilberto', 'Balarezo Arquinio', 'teodoro.balarezo@agrovetmarket.com', '2025-02-10'::date, (SELECT id FROM puestos WHERE nombre = 'Jefe de Proyectos de TI'), 33, 1, true, false, true),
  ('AGV1089', '72188682', 'Christian Rodrigo', 'Arista Escobar', 'christian.arista@agrovetmarket.com', '2025-03-03'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente de Importaciones'), 8, 1, false, false, true),
  ('AGV1091', '72193032', 'Lesli Gianina', 'Galiano Franco', 'lesli.galiano@agrovetmarket.com', '2025-03-03'::date, (SELECT id FROM puestos WHERE nombre = 'Promotor de Ventas Animales de Compa´┐¢´┐¢a'), 1, 1, false, false, true),
  ('AGV1092', '70885189', 'Jhosselyn Jarumy', 'Paliza Camavilca', 'jhosselyn.paliza@agrovetmarket.com', '2025-03-03'::date, (SELECT id FROM puestos WHERE nombre = 'Auxiliar de Facturaci´┐¢n'), 16, 1, false, false, true),
  ('AGV1093', '46373012', 'Samantha Andrea', 'Ulloa Encinas', 'samantha.ulloa@agrovetmarket.com', '2025-03-03'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente de Dise´┐¢o Gr´┐¢fico'), 22, 1, false, false, true),
  ('AGV1094', '70112700', 'Jennifer Marisel', 'Alvarado Villegas', 'jennifer.alvarado@agrovetmarket.com', '2025-03-12'::date, (SELECT id FROM puestos WHERE nombre = 'Promotor de Ventas Animales de Compa´┐¢´┐¢a'), 1, 1, false, false, true),
  ('AGV1095', '76749265', 'Erick Franz', 'Mendoza Huerta', 'erick.mendoza@agrovetmarket.com', '2025-03-12'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente T´┐¢cnico de Mantenimiento'), 30, 1, false, false, true),
  ('AGV1098', '77025697', 'Ana Valentina', 'Gavidia Avila', 'ana.gavidia@agrovetmarket.com', '2025-03-19'::date, (SELECT id FROM puestos WHERE nombre = 'Auxiliar de Control de Calidad'), 13, 1, false, false, true),
  ('AGV1100', '76217474', 'Nayib Alexander', 'Ramos Baz´┐¢n', 'nayib.ramos@agrovetmarket.com', '2025-03-24'::date, (SELECT id FROM puestos WHERE nombre = 'Promotor de Ventas Pet Nutriscience'), 26, 1, false, false, true),
  ('AGV1102', '72522922', 'Mariapaz', 'Navarro Zavala', 'mariapaz.navarro@agrovetmarket.com', '2025-04-08'::date, (SELECT id FROM puestos WHERE nombre = 'Promotor de Ventas Pet Nutriscience'), 26, 1, false, false, true),
  ('AGV1103', '72839638', 'Joseph Junior', 'Tuestas Leyva', 'joseph.tuestas@agrovetmarket.com', '2025-04-08'::date, (SELECT id FROM puestos WHERE nombre = 'Promotor de Ventas Pet Nutriscience'), 26, 1, false, false, true),
  ('AGV1105', '70982117', 'Margiory Ivonne', 'Tito Navarro', 'margiory.tito@agrovetmarket.com', '2025-04-15'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente de Exportaciones'), 8, 1, false, false, true),
  ('AGV1109', '46753717', 'Diana Rebeca', 'Cajas Regal', 'diana.cajas@agrovetmarket.com', '2025-05-15'::date, (SELECT id FROM puestos WHERE nombre = 'Supervisor de Formulaciones I'), 17, 1, true, false, true),
  ('AGV1110', '46455569', 'Thalia Veronica', 'Grillo Enriquez', 'thalia.grillo@agrovetmarket.com', '2025-05-22'::date, (SELECT id FROM puestos WHERE nombre = 'Jefe de Marketing'), 21, 1, true, false, true),
  ('AGV1111', '72644298', 'Andrea Marilyn', 'Sanchez Estrada', 'andrea.sanchez@agrovetmarket.com', '2025-05-22'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente de Dise´┐¢o Gr´┐¢fico'), 35, 1, false, false, true)
) AS datos(codigo_empleado, dni, nombres, apellidos, email, fecha_ingreso, puesto_id, area_id, tipo_trabajador_id, es_supervisor, es_rrhh, activo)
ON CONFLICT (dni) DO NOTHING;

-- LOTE 7/8 - Empleados 181 a 210
INSERT INTO empleados (codigo_empleado, dni, nombres, apellidos, email, fecha_ingreso, puesto_id, area_id, tipo_trabajador_id, es_supervisor, es_rrhh, activo)
SELECT * FROM (VALUES
  ('AGV1112', '42585020', 'Martin Jesus', 'Curi Palomino', 'martin.curi@agrovetmarket.com', '2025-06-03'::date, (SELECT id FROM puestos WHERE nombre = 'Auxiliar de PT y Distribuci´┐¢n'), 2, 1, false, false, true),
  ('AGV1116', '44565606', 'Stephanie Pamela', 'Hiyagon Arroyo', 'stephanie.hiyagon@agrovetmarket.com', '2025-06-16'::date, (SELECT id FROM puestos WHERE nombre = 'Gerente Pet Nutriscience'), 26, 1, true, false, true),
  ('AGV1118', '72869070', 'Omar Andres', 'Chavez Abanto', 'omar.chavez@agrovetmarket.com', '2025-07-01'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente de Marketing'), 22, 1, false, false, true),
  ('AGV1120', '70902987', 'Americo Augusto', 'Reyes Soplin', 'americo.reyes@agrovetmarket.com', '2025-07-02'::date, (SELECT id FROM puestos WHERE nombre = 'Supervisor de Dise´┐¢o'), 22, 1, true, false, true),
  ('AGV1121', '71914533', 'Mirtha Liliana', 'Huamani Ccochachi', 'mirtha.huamani@agrovetmarket.com', '2025-07-07'::date, (SELECT id FROM puestos WHERE nombre = 'Supervisor de Marketing - L´┐¢nea Ganader´┐¢a / Aves y Cerdos'), 22, 1, true, false, true),
  ('AGV1124', '07826393', 'Eduardo Edgardo', 'Chaman Comotto', 'eduardo.chaman@agrovetmarket.com', '2025-08-04'::date, (SELECT id FROM puestos WHERE nombre = 'Sub Gerente T´┐¢cnico de Proyectos y Asesor Comercial'), 30, 1, true, false, true),
  ('AGV1126', '73409693', 'Nicole', 'Bendezu Solimano', 'nicole.bendezu@agrovetmarket.com', '2025-08-04'::date, (SELECT id FROM puestos WHERE nombre = 'Jefe de Ventas Interpet'), 20, 1, true, false, true),
  ('AGV1127', '74230044', 'Ximena Alejandra', 'Beltran Flores', 'ximena.beltran@agrovetmarket.com', '2025-08-11'::date, (SELECT id FROM puestos WHERE nombre = 'Representante de Venta Interpet'), 20, 1, false, false, true),
  ('AGV1128', '73073054', 'Valeria Cristina', 'D´┐¢az Hernandez', 'valeria.daz@agrovetmarket.com', '2025-08-11'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente de Dise´┐¢o Gr´┐¢fico'), 22, 1, false, false, true),
  ('AGV1130', '76695340', 'Patricia Rosario', 'Santander Salas', 'patricia.santander@agrovetmarket.com', '2025-08-18'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente de Desarrollo Anal´┐¢tico'), 14, 1, false, false, true),
  ('AGV1132', '71792073', 'Jean Carlos', 'De la Cruz Ochochoque', 'jean.de@agrovetmarket.com', '2025-08-25'::date, (SELECT id FROM puestos WHERE nombre = 'Representante de Venta Interpet'), 20, 1, false, false, true),
  ('AGV1133', '71132558', 'Alejandra Moraima', 'Corrales Velasquez', 'alejandra.corrales@agrovetmarket.com', '2025-08-25'::date, (SELECT id FROM puestos WHERE nombre = 'Promotor de Ventas Animales de Compa´┐¢´┐¢a'), 1, 1, false, false, true),
  ('AGV1134', '77463557', 'Jose Martin', 'Quispe Jave', 'jose.quispe@agrovetmarket.com', '2025-09-03'::date, (SELECT id FROM puestos WHERE nombre = 'Auxiliar de Dispensaci´┐¢n'), 29, 1, false, false, true),
  ('AGV1135', '44120590', 'Rosario del Pilar', 'Manchego Molina', 'rosario.manchego@agrovetmarket.com', '2025-09-03'::date, (SELECT id FROM puestos WHERE nombre = 'Auxiliar de Limpieza y Lavado'), 14, 1, false, false, true),
  ('AGV1136', '40961746', 'Alex', 'Quispe Azurin', 'alex.quispe@agrovetmarket.com', '2025-09-05'::date, (SELECT id FROM puestos WHERE nombre = 'Supervisor de Estabilidades'), 15, 1, true, false, true),
  ('AGV1137', '46576009', 'Piere Arturo', 'Castillo Chavez', 'piere.castillo@agrovetmarket.com', '2025-09-10'::date, (SELECT id FROM puestos WHERE nombre = 'Jefe de Planeamiento y Control de la Producci´┐¢n'), 27, 1, true, false, true),
  ('AGV1138', '48705619', 'Gustavo', 'Espinoza Sanchez', 'gustavo.espinoza@agrovetmarket.com', '2025-09-10'::date, (SELECT id FROM puestos WHERE nombre = 'Auxiliar de Distribuci´┐¢n de Ventas E-Commerce'), 2, 1, false, false, true),
  ('AGV1139', '62948691', 'Pablo Gerardo', 'Fajardo Vasquez', 'pablo.fajardo@agrovetmarket.com', '2025-09-10'::date, (SELECT id FROM puestos WHERE nombre = 'Auxiliar de Distribuci´┐¢n de Materiales'), 2, 1, false, false, true),
  ('AGV1141', '75254819', 'Diana Dedicacia', 'Quiquia Urribarre', 'diana.quiquia@agrovetmarket.com', '2025-09-15'::date, (SELECT id FROM puestos WHERE nombre = 'Supervisor de Desarrollo de Packaging'), 17, 1, true, false, true),
  ('AGV1142', '70418798', 'Juan Carlos', 'Nu´┐¢ez Diaz', 'juan.nuez@agrovetmarket.com', '2025-09-15'::date, (SELECT id FROM puestos WHERE nombre = 'Auxiliar de Formulaciones'), 17, 1, false, false, true),
  ('AGV1144', '76490171', 'Miguel Angel', 'Quispe Alva', 'miguel.quispe@agrovetmarket.com', '2025-10-01'::date, (SELECT id FROM puestos WHERE nombre = 'Auxiliar de Distribuci´┐¢n de Materiales'), 2, 1, false, false, true),
  ('AGV1145', '29631547', 'Jorge Luis', 'Espinoza Andrade', 'jorge.espinoza@agrovetmarket.com', '2025-10-10'::date, (SELECT id FROM puestos WHERE nombre = 'Jefe T´┐¢cnico Ganader´┐¢a'), 24, 1, true, false, true),
  ('AGV1146', '73199615', 'Diana Dorelli', 'Escamilo Mu´┐¢oz', 'diana.escamilo@agrovetmarket.com', '2025-10-17'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente de Marketing Internacional'), 35, 1, false, false, true),
  ('AGV1147', '74220087', 'Javier Renato', 'Felix Merino', 'javier.felix@agrovetmarket.com', '2025-10-20'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente de Seguridad y Medio Ambiente'), 32, 1, false, false, true),
  ('AGV1148', '48552044', 'Anthony Ashley', 'Vargas Morales', 'anthony.vargas@agrovetmarket.com', '2025-10-27'::date, (SELECT id FROM puestos WHERE nombre = 'Chofer de Operaciones Log´┐¢sticas'), 2, 1, false, false, true),
  ('AGV1149', '74324450', 'Giomar Raul', 'Marin Orellana', 'giomar.marin@agrovetmarket.com', '2025-11-10'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente de Trade Marketing Pets'), 22, 1, false, false, true),
  ('AGV1152', '76393671', 'Jeferson Grabiel', 'Cove´┐¢as Roman', 'jeferson.coveas@agrovetmarket.com', '2025-11-12'::date, (SELECT id FROM puestos WHERE nombre = 'Supervisor de Desarrollo Online'), 7, 1, true, false, true),
  ('AGV1153', '72666791', 'Angela Antuanett', 'Sanchez Paucar', 'angela.sanchez@agrovetmarket.com', '2025-11-18'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente de Dise´┐¢o de Material de Empaque - Compras'), 5, 1, false, false, true),
  ('AGV1154', '47479678', 'Adrian Antonio', 'Torres Zapata', 'adrian.torres@agrovetmarket.com', '2025-12-01'::date, (SELECT id FROM puestos WHERE nombre = 'Chofer'), 1, 1, false, false, true),
  ('AGV1156', '73019940', 'Zizi Lucero', 'Vasquez Vasquez', 'zizi.vasquez@agrovetmarket.com', '2025-12-04'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente de Asuntos Regulatorios'), 5, 1, false, false, true)
) AS datos(codigo_empleado, dni, nombres, apellidos, email, fecha_ingreso, puesto_id, area_id, tipo_trabajador_id, es_supervisor, es_rrhh, activo)
ON CONFLICT (dni) DO NOTHING;

-- LOTE 8/8 - Empleados 211 a 219
INSERT INTO empleados (codigo_empleado, dni, nombres, apellidos, email, fecha_ingreso, puesto_id, area_id, tipo_trabajador_id, es_supervisor, es_rrhh, activo)
SELECT * FROM (VALUES
  ('AGV1158', '75439270', 'Diego Alonso', 'Guerra Araujo', 'diego.guerra@agrovetmarket.com', '2025-12-11'::date, (SELECT id FROM puestos WHERE nombre = 'Auxiliar de Dise´┐¢o de Material de Empaque'), 5, 1, false, false, true),
  ('AGV1159', '71774340', 'Severo', 'Nina Chino', 'severo.nina@agrovetmarket.com', '2025-12-18'::date, (SELECT id FROM puestos WHERE nombre = 'Promotor de Ventas Animales de Compa´┐¢´┐¢a'), 1, 1, false, false, true),
  ('AGV1161', '47161226', 'Nitnay Angelita', 'Chuquino Ventura', 'nitnay.chuquino@agrovetmarket.com', '2026-01-02'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente de Estabilidades'), 1, 1, false, false, true),
  ('AGV1162', '006620552', 'Cristian Jes´┐¢s', 'Reyes Quintero', 'cristian.reyes@agrovetmarket.com', '2026-01-02'::date, (SELECT id FROM puestos WHERE nombre = 'Auxiliar de Distribuci´┐¢n de Ventas E-Commerce'), 2, 1, false, false, true),
  ('AGV1163', '41133415', 'Edgar Octavio', 'Huayanay Bohorquez', 'edgar.huayanay@agrovetmarket.com', '2026-01-05'::date, (SELECT id FROM puestos WHERE nombre = 'Supervisor de Procesos Industriales'), 1, 1, true, false, true),
  ('AGV1164', '73378593', 'Carolina Andrea', 'Balbuena Zamora', 'carolina.balbuena@agrovetmarket.com', '2026-01-05'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente de Asuntos Regulatorios'), 5, 1, false, false, true),
  ('AGV1165', '72910612', 'Cristhy Nicole', 'Plasencia Torres', 'cristhy.plasencia@agrovetmarket.com', '2026-01-06'::date, (SELECT id FROM puestos WHERE nombre = 'Representante de Venta Interpet'), 20, 1, false, false, true),
  ('AGV1166', '46204593', 'Gloria Elena', 'Barba Claros', 'gloria.barba@agrovetmarket.com', '2026-01-12'::date, (SELECT id FROM puestos WHERE nombre = 'Supervisor de Aseguramiento de la Calidad'), 4, 1, true, false, true),
  ('AGV1167', '70745565', 'Mireylla Alexandra', 'Moquillaza Rodriguez', 'mireylla.moquillaza@agrovetmarket.com', '2026-01-12'::date, (SELECT id FROM puestos WHERE nombre = 'Asistente de Dise´┐¢o Gr´┐¢fico'), 21, 1, false, false, true)
) AS datos(codigo_empleado, dni, nombres, apellidos, email, fecha_ingreso, puesto_id, area_id, tipo_trabajador_id, es_supervisor, es_rrhh, activo)
ON CONFLICT (dni) DO NOTHING;

-- Total: 219 empleados en 8 lotes
