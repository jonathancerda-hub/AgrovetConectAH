-- PASO 1: Obtener IDs de puestos
DO $$
DECLARE
  puesto_record RECORD;
BEGIN
  -- Crear tabla temporal para mapeo de puestos
  CREATE TEMP TABLE IF NOT EXISTS temp_puestos_map (nombre TEXT, puesto_id INT);
  FOR puesto_record IN SELECT id, nombre FROM puestos LOOP
    INSERT INTO temp_puestos_map VALUES (puesto_record.nombre, puesto_record.id);
  END LOOP;
END $$;

-- PASO 2: Insertar empleados (sin supervisores)
INSERT INTO empleados (codigo_empleado, dni, nombres, apellidos, email, fecha_ingreso, puesto_id, area_id, tipo_trabajador_id, es_supervisor, es_rrhh, activo)
VALUES
  ('AGV0002', '09310906', 'Jorge Umberto', 'Calderon Ojeda', 'jorge.calderon@agrovetmarket.com', '8/1/1994', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Director General'), 18, 1, true, false, true),
  ('AGV0010', '09849767', 'Alejandro Victor', 'Vargas Leon', 'alejandro.vargas@agrovetmarket.com', '12/1/1995', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Supervisor de Recepcion, Materiales y Despachos a Maquilas'), 2, 1, true, false, true),
  ('AGV0018', '09314068', 'Pedro Alejandro', 'Calderon Ojeda', 'pedro.calderon@agrovetmarket.com', '5/1/1999', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Jefe de Ventas Ganader´┐¢a'), 24, 1, true, false, true),
  ('AGV0034', '41118341', 'Dagoberto', 'Salazar Guerrero', 'dagoberto.salazar@agrovetmarket.com', '7/5/2000', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Supervisor de Producto Terminado, Distribucion y Transporte'), 2, 1, true, false, true),
  ('AGV0065', '10184621', 'Ricardo Martin', 'Calderon Ojeda', 'ricardo.calderon@agrovetmarket.com', '9/1/2003', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Jefe de Administraci´┐¢n'), 1, 1, true, false, true),
  ('AGV0076', '10545562', 'Jose Aurelio', 'Garcia Fiestas', 'jose.garcia@agrovetmarket.com', '11/1/2004', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Director de Finanzas y Tecnologias de la Informacion'), 12, 1, true, false, true),
  ('AGV0083', '09351865', 'Ivan Serginoff', 'Ramirez', 'ivan.ramirez@agrovetmarket.com', '2/17/2005', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Supervisor de Control de Procesos'), 13, 1, true, false, true),
  ('AGV0111', '41300244', 'Giovanna Del Pilar', 'Anchorena Arias', 'giovanna.anchorena@agrovetmarket.com', '11/14/2005', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Directora de Investigacion y Desarrollo'), 19, 1, true, false, true),
  ('AGV0124', '07097049', 'Ana Maria', 'Pi´┐¢eyros Gonzales', 'ana.pieyros@agrovetmarket.com', '4/1/2006', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Auxiliar de Limpieza Y Mantenimiento'), 1, 1, false, false, true),
  ('AGV0125', '40123188', 'Milady Isabel', 'Alvarez Del Villar Soriano', 'milady.alvarez@agrovetmarket.com', '4/6/2006', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Directora de Desarrollo Organizacional'), 4, 1, true, false, true),
  ('AGV0187', '29672410', 'Sandra Orietta', 'Meneses Del Valle', 'sandra.meneses@agrovetmarket.com', '11/27/2007', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Subgerente de Ventas Internacionales'), 35, 1, true, false, true),
  ('AGV0240', '41866820', 'Johanna', 'Hurtado Candenas', 'johanna.hurtado@agrovetmarket.com', '2/12/2009', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Gerente de Logistica y Distribucion'), 3, 1, true, false, true),
  ('AGV0246', '42705690', 'Alan Armando', 'Tauca Torres', 'alan.tauca@agrovetmarket.com', '3/9/2009', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Jefe de Ventas Ganader´┐¢a'), 24, 1, true, false, true),
  ('AGV0265', '07514765', 'Juan Catalino', 'Felix Rivera', 'juan.felix@agrovetmarket.com', '10/1/2009', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente de Materiales y Despacho Maquilas'), 2, 1, false, false, true),
  ('AGV0267', '09308424', 'Gladis Elizabeth', 'Ojeda Za´┐¢artu', 'gladis.ojeda@agrovetmarket.com', '11/1/2009', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asesor'), 1, 1, false, false, true),
  ('AGV0298', '43997960', 'Erick Wilfredo', 'Viera Moscol', 'erick.viera@agrovetmarket.com', '6/1/2010', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente de Materiales y Despacho Maquilas'), 2, 1, false, false, true),
  ('AGV0315', '08459479', 'Elvis Lucio', 'Caceres Salcedo', 'elvis.caceres@agrovetmarket.com', '10/1/2010', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente Administrativo de Ventas Internacionales'), 35, 1, false, false, true),
  ('AGV0319', '44671261', 'Jorge Luis Jonathan', 'Cerda Piaca', 'jorge.cerda@agrovetmarket.com', '11/23/2010', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Coordinador de Proyectos de Mejora de TI'), 33, 1, true, false, true),
  ('AGV0343', '41274325', 'Violeta Regina', 'Balbuena Gamarra', 'violeta.balbuena@agrovetmarket.com', '7/18/2011', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Subgerente de Estabilidades y Validaciones Analiticas'), 15, 1, true, false, true),
  ('AGV0359', '42166202', 'Carmen Johana', 'Morales Tarazona', 'carmen.morales@agrovetmarket.com', '12/1/2011', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Gerente de Marketing'), 22, 1, true, false, true),
  ('AGV0361', '40560230', 'Alberto Gaston', 'Vasquez Cuestas', 'alberto.vasquez@agrovetmarket.com', '12/19/2011', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Gerente de Proyectos y Procesos Farmaceuticos'), 30, 1, true, false, true),
  ('AGV0362', '40238779', 'Jimena Maria', 'Del Risco Sotil', 'jimena.del@agrovetmarket.com', '1/2/2012', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Directora Comercial Local'), 1, 1, true, false, true),
  ('AGV0384', '47881508', 'Nexar Leny', 'Mundaca Diaz', 'nexar.mundaca@agrovetmarket.com', '6/15/2012', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Auxiliar de Producto Terminado y Distribucion'), 2, 1, false, false, true),
  ('AGV0397', '44527068', 'Luis Alfredo', 'Chavez Balarezo', 'luis.chavez@agrovetmarket.com', '11/1/2012', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Jefe Tecnico Comercial Internacional Petmedica America Latina'), 35, 1, true, false, true),
  ('AGV0404', '44866308', 'Milagros Yessica', 'Huamani Aguirre', 'milagros.huamani@agrovetmarket.com', '2/1/2013', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Jefe de Produccion de Maquilas'), 29, 1, true, false, true),
  ('AGV0427', '41361328', 'Ursula Maria', 'Retuerto Perez', 'ursula.retuerto@agrovetmarket.com', '9/23/2013', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Jefe de Abastecimiento'), 10, 1, true, false, true),
  ('AGV0442', '44065263', 'Marilia Isabel', 'Tinoco Morales', 'marilia.tinoco@agrovetmarket.com', '1/8/2014', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Supervisor de Finanzas'), 16, 1, true, false, true),
  ('AGV0455', '10120502', 'Raquel Veronica', 'Marcelo Roncal', 'raquel.marcelo@agrovetmarket.com', '4/14/2014', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente de Control de Calidad MP'), 13, 1, false, false, true),
  ('AGV0470', '09881789', 'Lelia Andrea', 'Sanchez Hidalgo', 'lelia.sanchez@agrovetmarket.com', '9/1/2014', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Jefe de Sanidad Aves y Cerdos'), 31, 1, true, false, true),
  ('AGV0476', '42428258', 'Ana Cecilia', 'Flores Silva', 'ana.flores@agrovetmarket.com', '10/16/2014', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Supervisor Contable'), 11, 1, true, false, true),
  ('AGV0524', '44880919', 'Luis Alfredo', 'Ore Barrionuevo', 'luis.ore@agrovetmarket.com', '7/20/2015', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente de Distribucion Internacional'), 2, 1, false, false, true),
  ('AGV0563', '48170297', 'Jhosi Silvio', 'Miguel Mayta', 'jhosi.miguel@agrovetmarket.com', '6/18/2016', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Supervisor de Compras Locales'), 10, 1, true, false, true),
  ('AGV0572', '06812394', 'Janet Beatriz', 'Hueza Matencio', 'janet.hueza@agrovetmarket.com', '7/18/2016', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Jefe de Back Office y Procedimientos Comerciales'), 1, 1, true, false, true),
  ('AGV0573', '40326738', 'Norma Melissa', 'Pizarro Rojas', 'norma.pizarro@agrovetmarket.com', '7/18/2016', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Jefe de Asuntos Regulatorios Cuentas Claves'), 5, 1, true, false, true),
  ('AGV0603', '44510264', 'Claudia', 'Roman Sulca', 'claudia.roman@agrovetmarket.com', '2/14/2017', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Supervisor de Dise´┐¢o de Material de Empaque'), 5, 1, false, false, true),
  ('AGV0612', '41279012', 'Karen Melissa', 'Delgado Crispin', 'karen.delgado@agrovetmarket.com', '3/27/2017', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Gerente de Innovacion y Desarrollo Farmaceutico'), 17, 1, true, false, true),
  ('AGV0618', '70538548', 'Yanina', 'Amao Canchari', 'yanina.amao@agrovetmarket.com', '4/10/2017', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Jefe de Asuntos Regulatorios Latam'), 5, 1, true, false, true),
  ('AGV0619', '49080294', 'Eigly Yaritza', 'Pereira Fuentes', 'eigly.pereira@agrovetmarket.com', '4/19/2017', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Analista de Creditos y Cobranzas'), 16, 1, false, false, true),
  ('AGV0620', '07082032', 'Segundo Manuel', 'Rimarachin Olivera', 'segundo.rimarachin@agrovetmarket.com', '4/20/2017', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Chofer'), 1, 1, false, false, true),
  ('AGV0628', '44307069', 'Katherine Magaly', 'Navarro Alayza', 'katherine.navarro@agrovetmarket.com', '6/5/2017', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Jefe de CRM'), 35, 1, true, false, true),
  ('AGV0630', '47049563', '´┐¢Lucy Mercedes', 'Zapata Bran', 'lucy.zapata@agrovetmarket.com', '7/1/2017', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Jefe de Validaciones Analiticas'), 15, 1, true, false, true),
  ('AGV0632', '46609730', 'Nataly Del Carmen', 'Valdez Hinostroza', 'nataly.valdez@agrovetmarket.com', '7/3/2017', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Jefe de Escalonamiento y Transferencia'), 17, 1, true, false, true),
  ('AGV0640', '72611115', 'Esperanza Victoria', 'Alhuay Perez', 'esperanza.alhuay@agrovetmarket.com', '8/15/2017', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Analista de Tesoreria'), 16, 1, false, false, true),
  ('AGV0650', '46481506', 'Cenit Pablo', 'Diaz Velasquez', 'cenit.diaz@agrovetmarket.com', '10/2/2017', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Editor de Contenidos'), 22, 1, false, false, true),
  ('AGV0653', '48138936', 'Brayan', 'Malca Carpio', 'brayan.malca@agrovetmarket.com', '11/13/2017', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente de Distribucion Local'), 2, 1, false, false, true),
  ('AGV0662', '41487544', 'Perci', 'Mondragon Dominguez', 'perci.mondragon@agrovetmarket.com', '2/5/2018', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Jefe de Centro de Distribucion'), 2, 1, true, false, true),
  ('AGV0663', '43271693', 'Michael', 'Vilchez Rivera', 'michael.vilchez@agrovetmarket.com', '4/2/2018', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Representante de Ventas Ganaderia'), 24, 1, false, false, true),
  ('AGV0668', '45434771', 'Kattya Adelaida', 'Barcena Braga', 'kattya.barcena@agrovetmarket.com', '4/9/2018', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Supervisor de Creditos y Cobranzas'), 16, 1, true, false, true),
  ('AGV0674', '42133895', 'Veronica', 'Campos Facundo', 'veronica.campos@agrovetmarket.com', '7/3/2018', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Representante de Ventas - Animales de Compa´┐¢´┐¢a'), 1, 1, false, false, true),
  ('AGV0685', '09372197', 'Raul Rafael', 'Marroquin Cabezudo', 'raul.marroquin@agrovetmarket.com', '9/1/2018', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asesor Legal'), 16, 1, false, false, true),
  ('AGV0690', '48319203', 'Miguel Angel', 'Molinero Piaca', 'miguel.molinero@agrovetmarket.com', '9/18/2018', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Auxiliar de Producto Terminado y Distribucion'), 2, 1, false, false, true),
  ('AGV0691', '09599599', 'Ursula', 'Huamancaja Cardenas', 'ursula.huamancaja@agrovetmarket.com', '10/1/2018', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Gerente de Talento Humano y SST'), 34, 1, false, true, true),
  ('AGV0706', '10095081', 'Olga Antonia', 'Guerra Barriga', 'olga.guerra@agrovetmarket.com', '12/1/2018', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Auxiliar de Laboratorio'), 15, 1, false, false, true),
  ('AGV0725', '10880202', 'Julio Cesar', 'Camargo Alvino', 'julio.camargo@agrovetmarket.com', '2/25/2019', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Auxiliar de Almacen'), 2, 1, false, false, true),
  ('AGV0729', '45267996', 'Jonas Eli', 'Torres Solorzano', 'jonas.torres@agrovetmarket.com', '3/8/2019', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente de Gestion de la Calidad'), 4, 1, false, false, true),
  ('AGV0749', '40816315', 'Ivan Rafael', 'Ramos Guzman', 'ivan.ramos@agrovetmarket.com', '8/1/2019', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Representante de Ventas Ganaderia'), 24, 1, false, false, true),
  ('AGV0767', '09533163', 'Augusto Walter', 'Matto Astete', 'augusto.matto@agrovetmarket.com', '12/9/2019', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente de Creditos y Cobranzas'), 16, 1, false, false, true),
  ('AGV0771', '44023038', 'Erick Alfredo', 'Molleapaza Aguilar', 'erick.molleapaza@agrovetmarket.com', '1/8/2020', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Subgerente de Formulacion y Desarrollo de Procesos'), 17, 1, true, false, true),
  ('AGV0776', '45340693', 'Jose Luis', 'Delgado Sanchez', 'jose.delgado@agrovetmarket.com', '1/22/2020', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Jefe de Sanidad- Animales Mayores y de Produccion'), 31, 1, true, false, true),
  ('AGV0779', '06605348', 'Jesus Wilfredo', 'Calderon Vera', 'jesus.calderon@agrovetmarket.com', '3/1/2020', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asesor Externo de Investigaci´┐¢n en Ganado Lechero'), 31, 1, false, false, true),
  ('AGV0780', '71066355', 'Roldan', 'Manihuari Tenazoa', 'roldan.manihuari@agrovetmarket.com', '3/1/2020', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Guardian'), 31, 1, false, false, true),
  ('AGV0786', '08883259', 'Cesar', 'Morales de la Cruz', 'cesar.morales@agrovetmarket.com', '7/1/2020', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Subgerente de Desarrollo Analitico'), 14, 1, true, false, true),
  ('AGV0800', '47146124', 'Diana Maythe', 'Cornejo Cornejo', 'diana.cornejo@agrovetmarket.com', '10/26/2020', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Jefe de Asuntos Regulatorios'), 5, 1, true, false, true),
  ('AGV0801', '45682368', 'Stefanny Marianella', 'Rios German', 'stefanny.rios@agrovetmarket.com', '11/1/2020', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Gerente de Animales de Compa´┐¢´┐¢a'), 1, 1, true, false, true),
  ('AGV0802', '46556650', 'Mauricio Yvan', 'Porras Nicho', 'mauricio.porras@agrovetmarket.com', '11/1/2020', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Jefe de Formulaciones'), 17, 1, true, false, true),
  ('AGV0823', '41126035', 'Beatriz', 'Mayma Chumbiauca', 'beatriz.mayma@agrovetmarket.com', '11/18/2020', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Jefe de Estabilidades'), 15, 1, true, false, true),
  ('AGV0836', '002114405', 'Jose Libardo', 'Pereira Fuentes', 'jose.pereira@agrovetmarket.com', '1/18/2021', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Auxiliar de Mensajer´┐¢a de Investigaci´┐¢n Y Desarrollo'), 19, 1, false, false, true),
  ('AGV0850', '44824879', 'Jennyfer Patricia', 'Miguel Solis', 'jennyfer.miguel@agrovetmarket.com', '4/12/2021', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Jefe de Seguridad y Medio Ambiente'), 32, 1, true, false, true),
  ('AGV0852', '47525376', 'Karen Dalila', 'Guerra Soto', 'karen.guerra@agrovetmarket.com', '6/1/2021', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Supervisor de Asuntos Regulatorios'), 5, 1, true, false, true),
  ('AGV0856', '71329473', 'Erick Ronaldo', 'Arias Otoya', 'erick.arias@agrovetmarket.com', '7/1/2021', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Jefe Tecnico Comercial'), 1, 1, true, false, true),
  ('AGV0859', '74581999', 'Camila', 'Calderon Agreda', 'camila.calderon@agrovetmarket.com', '8/16/2021', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente de Ventas'), 35, 1, false, false, true),
  ('AGV0866', '44409869', 'Karina Lisset', 'Torres Riega', 'karina.torres@agrovetmarket.com', '11/2/2021', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Jefe de Control de Calidad'), 13, 1, true, false, true),
  ('AGV0867', '46434409', 'Juan Carlos', 'Campos Drago', 'juan.campos@agrovetmarket.com', '11/2/2021', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Jefe de Marketing Internacional'), 35, 1, true, false, true),
  ('AGV0868', '43978070', 'Paola Yanina', 'Arias Bazan', 'paola.arias@agrovetmarket.com', '11/2/2021', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente de Dise´┐¢o de Material de Empaque'), 5, 1, false, false, true),
  ('AGV0872', '46974645', 'Estefani Milagros', 'Huamani Carrasco', 'estefani.huamani@agrovetmarket.com', '1/3/2022', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Jefe de Asuntos Regulatorios'), 5, 1, true, false, true),
  ('AGV0878', '72477744', 'Vanessa Alexandra', 'Parker Mendoza', 'vanessa.parker@agrovetmarket.com', '1/10/2022', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Supervisor de Ventas Internacionales'), 35, 1, true, false, true),
  ('AGV0881', '47700102', 'Sharon Carolyn', 'Francisco Perez', 'sharon.francisco@agrovetmarket.com', '2/1/2022', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Representante de Ventas - Nutriscience'), 26, 1, false, false, true),
  ('AGV0884', '23997723', 'Fernando Samuel', 'Paredes Baca', 'fernando.paredes@agrovetmarket.com', '2/1/2022', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Jefe de Ventas Ganaderia Zona Sur Oriente'), 24, 1, true, false, true),
  ('AGV0885', '47832678', 'Giovana Kathedry', 'Cordova Carhuamaca', 'giovana.cordova@agrovetmarket.com', '2/7/2022', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Supervisor de Operaciones'), 29, 1, true, false, true),
  ('AGV0893', '72474117', 'Marcia Fernanda', 'Palacios Hoyos', 'marcia.palacios@agrovetmarket.com', '4/8/2022', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Supervisor de Dispensacion'), 29, 1, true, false, true),
  ('AGV0896', '10434281', 'Blanca Luz', 'Loayza Rodriguez', 'blanca.loayza@agrovetmarket.com', '5/1/2022', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Supervisor de Costos'), 11, 1, true, false, true),
  ('AGV0898', '42933766', 'Carlos Alfredo', 'Barboza Castro', 'carlos.barboza@agrovetmarket.com', '5/2/2022', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Jefe de Comercio Exterior'), 8, 1, true, false, true),
  ('AGV0905', '42260711', 'Pamela Raquel', 'Torres Salinas', 'pamela.torres@agrovetmarket.com', '7/7/2022', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Jefe de Planeamiento Financiero'), 28, 1, true, false, true),
  ('AGV0908', '06595692', 'Jesus Wilfredo', 'Calderon Ojeda', 'jesus.calderon1@agrovetmarket.com', '8/1/2022', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Subgerente de Ventas Locales'), 24, 1, true, false, true),
  ('AGV0914', '44943485', 'Jancarlo', 'Pariasca Cuba', 'jancarlo.pariasca@agrovetmarket.com', '9/1/2022', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Jefe de Finanzas'), 16, 1, true, false, true),
  ('AGV0915', '74176101', 'Lucero cusi ccoyllur', 'Flores Lava', 'lucero.flores@agrovetmarket.com', '9/20/2022', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Jefe de Sanidad - Animales Menores y Farmacovigilancia'), 31, 1, true, false, true),
  ('AGV0922', '40252256', 'Rommel', 'Chinchay Mayoria', 'rommel.chinchay@agrovetmarket.com', '11/2/2022', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Jefe de Ventas Ganaderia-Zona Norte'), 24, 1, true, false, true),
  ('AGV0924', '76163353', 'Flavia Rosa', 'Mendoza Ancajima', 'flavia.mendoza@agrovetmarket.com', '11/7/2022', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente de Marketing'), 7, 1, false, false, true),
  ('AGV0925', '46462043', 'Anabel Luisa', 'Giraldo Mayhuiri', 'anabel.giraldo@agrovetmarket.com', '11/9/2022', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Analista Contable'), 11, 1, false, false, true),
  ('AGV0926', '76845847', 'Jessica Carolina', 'Ore Lude´┐¢a', 'jessica.ore@agrovetmarket.com', '11/9/2022', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Supervisor Senior de Tecnicas Analiticas'), 14, 1, true, false, true),
  ('AGV0931', '48517948', 'Juana', 'Lovaton Ramirez', 'juana.lovaton@agrovetmarket.com', '12/5/2022', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Jefe de Aplicaciones TI'), 33, 1, true, false, true),
  ('AGV0934', '75096888', 'Melina Yessenia', 'Cochachin Lucar', 'melina.cochachin@agrovetmarket.com', '12/22/2022', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente Contable'), 11, 1, false, false, true),
  ('AGV0935', '47566082', 'Maria Esther', 'Rodriguez Carmona', 'maria.rodriguez@agrovetmarket.com', '1/3/2023', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente de Administraci´┐¢n'), 1, 1, false, false, true),
  ('AGV0939', '73362975', 'Belinda', 'Santiago Bravo', 'belinda.santiago@agrovetmarket.com', '1/16/2023', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Analista Contable'), 11, 1, false, false, true),
  ('AGV0946', '46594683', 'Alimao', 'Hinostroza Villanueva', 'alimao.hinostroza@agrovetmarket.com', '2/10/2023', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Supervisor de Talento Humano'), 34, 1, false, true, true),
  ('AGV0949', '71337566', 'Jonathan Javier', 'Barrera Rozas', 'jonathan.barrera@agrovetmarket.com', '3/1/2023', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Gestor de Contenido Digital Veterinario'), 7, 1, false, false, true),
  ('AGV0950', '02887604', 'Manuel Federico', 'Bravo Perez', 'manuel.bravo@agrovetmarket.com', '3/1/2023', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Gerente Comercial Ganaderia'), 24, 1, true, false, true),
  ('AGV0952', '09597601', 'Elio Jorge', 'Vilchez Gutierrez', 'elio.vilchez@agrovetmarket.com', '3/13/2023', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Chofer'), 1, 1, false, false, true),
  ('AGV0953', '40808976', 'Beatriz Marina', 'Truel Robles', 'beatriz.truel@agrovetmarket.com', '3/17/2023', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Supervisor de Direcci´┐¢n de Investigaci´┐¢n y Desarrollo'), 19, 1, true, false, true),
  ('AGV0956', '48113547', 'Antonieta', 'Ortiz Ortiz', 'antonieta.ortiz@agrovetmarket.com', '4/3/2023', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Supervisor de Tecnicas Analiticas'), 14, 1, true, false, true),
  ('AGV0957', '43431921', 'Ena Maria Patricia', 'Fernandez Mu´┐¢oz', 'ena.fernandez@agrovetmarket.com', '4/3/2023', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Gerente de Transformaci´┐¢n Digital'), 33, 1, true, false, true),
  ('AGV0959', '70438614', 'Raquel Consuelo', 'Arellano Bastidas', 'raquel.arellano@agrovetmarket.com', '4/21/2023', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Supervisor de Asuntos Regulatorios Latam'), 5, 1, true, false, true),
  ('AGV0961', '73141547', 'Nicolas Paolo', 'Ramos Cuya', 'nicolas.ramos@agrovetmarket.com', '5/9/2023', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Auxiliar de Formulaciones'), 17, 1, false, false, true),
  ('AGV0963', '75131900', 'Samire Andrea', 'Huaman Cordova', 'samire.huaman@agrovetmarket.com', '5/29/2023', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente de Ventas Ecommerce'), 7, 1, false, false, true),
  ('AGV0964', '007080768', 'Jonathan Jesus', 'Reyes Quintero', 'jonathan.reyes@agrovetmarket.com', '6/20/2023', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente de Almacen e Inventarios'), 2, 1, false, false, true),
  ('AGV0965', '74390287', 'Yohani Liseth', 'Mera Toro', 'yohani.mera@agrovetmarket.com', '6/21/2023', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Representante de Ventas Ganaderia'), 24, 1, false, false, true),
  ('AGV0966', '46554968', 'Jean Carlo Jose', 'Romani Garcia', 'jean.romani@agrovetmarket.com', '6/27/2023', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Jefe de Comunicaci´┐¢n Interna'), 34, 1, true, false, true),
  ('AGV0967', '41967991', 'Jose Benigno', 'Quea Espinoza', 'jose.quea@agrovetmarket.com', '7/3/2023', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Representante de Ventas Ganaderia'), 24, 1, false, false, true),
  ('AGV0968', '48248365', 'Nathaly Elena', 'Calderon Ascona', 'nathaly.calderon@agrovetmarket.com', '7/3/2023', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Supervisor de Procesos Industriales'), 17, 1, true, false, true),
  ('AGV0970', '43967204', 'Miguel Angel', 'Caballero Palomino', 'miguel.caballero@agrovetmarket.com', '7/10/2023', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Supervisor de Formulaciones 2'), 17, 1, true, false, true),
  ('AGV0973', '007078460', 'Pedro Antonio', 'Otaiza Valdivez', 'pedro.otaiza@agrovetmarket.com', '8/7/2023', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Auxiliar de Distribucion de Materiales'), 2, 1, false, false, true),
  ('AGV0976', '41747025', 'Orlando Franco', 'Jaimes Rojas', 'orlando.jaimes@agrovetmarket.com', '8/28/2023', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'KAM Aves y Cerdos Lima - Arequipa'), 6, 1, false, false, true),
  ('AGV0978', '41221724', 'Gisela Ivette', 'Reategui Vasquez', 'gisela.reategui@agrovetmarket.com', '9/1/2023', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente de Costos'), 11, 1, false, false, true),
  ('AGV0979', '72706327', 'Kevin', 'Sanchez Champi', 'kevin.sanchez@agrovetmarket.com', '9/1/2023', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Representante de Ventas Ganaderia'), 24, 1, false, false, true),
  ('AGV0980', '71491227', 'Nidia Yamilet', 'Lope Erazo', 'nidia.lope@agrovetmarket.com', '9/4/2023', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Promotor de Ventas Animales de Compa´┐¢´┐¢a'), 1, 1, false, false, true),
  ('AGV0984', '74932277', 'Sandra Monica', 'Krklec Torres', 'sandra.krklec@agrovetmarket.com', '9/18/2023', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Supervisor de Sanidad - Animales Menores y Farmacovigilancia'), 31, 1, false, false, true),
  ('AGV0986', '48170145', 'Regina Pamela', 'Martinez Flores', 'regina.martinez@agrovetmarket.com', '10/11/2023', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente de Televentas'), 1, 1, false, false, true),
  ('AGV0991', '72217788', 'Sebastian Daryl', 'Morales Ayquipa', 'sebastian.morales@agrovetmarket.com', '11/17/2023', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente de Operaciones y Logistica'), 27, 1, false, false, true),
  ('AGV0996', '71618290', 'Miguel Antonio', 'Caycho Gonzales', 'miguel.caycho@agrovetmarket.com', '12/19/2023', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Auxiliar de Distribuci´┐¢n de Materiales'), 2, 1, false, false, true),
  ('AGV0997', '74205077', 'Angie Anabel', 'Gomero Asencio', 'angie.gomero@agrovetmarket.com', '12/27/2023', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente de Tesoreria'), 16, 1, false, false, true),
  ('AGV0999', '70993751', 'Deysi Maricielo', 'Campo Valverde', 'deysi.campo@agrovetmarket.com', '1/8/2024', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Representante de Ventas - Animales de Compa´┐¢´┐¢a'), 1, 1, false, false, true),
  ('AGV1001', '71747437', 'Ariana', 'Carmona Gavidia', 'ariana.carmona@agrovetmarket.com', '1/19/2024', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente de Ventas internacionales'), 35, 1, false, false, true),
  ('AGV1002', '70691089', 'Luis Anthony', 'Quinteros Arosti', 'luis.quinteros@agrovetmarket.com', '1/22/2024', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Auxiliar de Distribuci´┐¢n de Materiales'), 2, 1, false, false, true),
  ('AGV1008', '70357139', 'Gianella Stephanie', 'Neves Ordo´┐¢ez', 'gianella.neves@agrovetmarket.com', '2/12/2024', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Supervisor de Estabilidades'), 15, 1, true, false, true),
  ('AGV1012', '40214605', 'Ivonne Katty', 'Riquez Alvaro', 'ivonne.riquez@agrovetmarket.com', '2/21/2024', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Gerente de Producci´┐¢n'), 29, 1, true, false, true),
  ('AGV1013', '09918364', 'Abner Abahadt', 'Hoyos Miranda', 'abner.hoyos@agrovetmarket.com', '3/1/2024', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Jefe de Ventas Zona Centro'), 24, 1, true, false, true),
  ('AGV1014', '73489936', 'Anyela Lisset', 'Celi Castillo', 'anyela.celi@agrovetmarket.com', '3/1/2024', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Promotor de Ventas Animales de Compa´┐¢´┐¢a'), 1, 1, false, false, true),
  ('AGV1015', '48340724', 'Brenda Noemi', 'Cupe Pardo', 'brenda.cupe@agrovetmarket.com', '3/6/2024', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente de Compras Locales'), 10, 1, false, false, true),
  ('AGV1018', '73134126', 'Irvin Armando', 'Tomas Huaman', 'irvin.tomas@agrovetmarket.com', '3/13/2024', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Representante de Ventas Ganaderia'), 24, 1, false, false, true),
  ('AGV1020', '74123539', 'Mariano Raul', 'Polo Caycho', 'mariano.polo@agrovetmarket.com', '4/1/2024', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Supervisor de TI'), 33, 1, true, false, true),
  ('AGV1024', '48476040', 'Maria Elena', 'Cucchi Conde', 'maria.cucchi@agrovetmarket.com', '5/6/2024', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente de Asuntos Regulatorios'), 5, 1, false, false, true),
  ('AGV1026', '46403531', 'Carolina betzabe', 'Tasayco Ashtu', 'carolina.tasayco@agrovetmarket.com', '5/27/2024', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Supervisor de Marketing Linea Nutricional'), 22, 1, true, false, true),
  ('AGV1031', '70890247', 'Cristhian Vicente', 'Toro Soberon', 'cristhian.toro@agrovetmarket.com', '7/8/2024', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente de Seguridad y Medio Ambiente'), 32, 1, false, false, true),
  ('AGV1033', '41434910', 'Weslie Alan', 'Guanilo Costilla', 'weslie.guanilo@agrovetmarket.com', '7/17/2024', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Auxiliar de PT y Distribuci´┐¢n'), 2, 1, false, false, true),
  ('AGV1036', '71872184', 'Gianella Rosario', 'Gutierrez Ambrosio', 'gianella.gutierrez@agrovetmarket.com', '8/16/2024', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Supervisor de Planeamiento Y Control de La Producci´┐¢n'), 27, 1, true, false, true),
  ('AGV1037', '75994233', 'Ximena', 'Portocarrero Robles', 'ximena.portocarrero@agrovetmarket.com', '9/2/2024', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente de Asuntos Regulatorios'), 5, 1, false, false, true),
  ('AGV1038', '70827118', 'Eliud', 'Ferrari Castillo', 'eliud.ferrari@agrovetmarket.com', '9/2/2024', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente de Sanidad Animal'), 31, 1, false, false, true),
  ('AGV1039', '72793869', 'Christian Antonio', 'Santiba´┐¢ez Pe´┐¢a', 'christian.santibaez@agrovetmarket.com', '9/2/2024', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente de Compras Internacionales'), 10, 1, false, false, true),
  ('AGV1040', '47445953', 'Angela del Pilar', 'De la cruz Torres', 'angela.de@agrovetmarket.com', '9/4/2024', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Promotor de Ventas Animales de Compa´┐¢´┐¢a'), 1, 1, false, false, true),
  ('AGV1042', '70604766', 'Jose Gorge', 'Montero Vilcas', 'jose.montero@agrovetmarket.com', '9/23/2024', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Supervisor de Proyectos de Finanzas'), 16, 1, false, false, true),
  ('AGV1044', '41676618', 'Carlos Alberto', 'Garcia Carrasco', 'carlos.garcia@agrovetmarket.com', '10/4/2024', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Supervisor de Infraestructura y Operaciones'), 33, 1, true, false, true),
  ('AGV1045', '74299298', 'Miguel Angel', 'Magui´┐¢a Vargas', 'miguel.maguia@agrovetmarket.com', '10/4/2024', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente de Infraestructura y Soporte TI'), 33, 1, false, false, true),
  ('AGV1046', '75706717', 'Davis Gerson', 'Huaman Gomez', 'davis.huaman@agrovetmarket.com', '10/4/2024', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente de Infraestructura y Soporte TI'), 33, 1, false, false, true),
  ('AGV1048', '76569973', 'Alberto Alan', 'Ariza Alva', 'alberto.ariza@agrovetmarket.com', '10/15/2024', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Supervisor de Formulaciones 3'), 17, 1, true, false, true),
  ('AGV1049', '60789436', 'Vannya Yadira', 'Aylas Torres', 'vannya.aylas@agrovetmarket.com', '10/16/2024', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente de Sanidad - Animales Menores y Farmacovigilancia'), 31, 1, false, false, true),
  ('AGV1050', '70613872', 'Ingrid Tiffany', 'Poma Huamani', 'ingrid.poma@agrovetmarket.com', '11/4/2024', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Supervisor de Validaciones Anal´┐¢ticas'), 15, 1, true, false, true),
  ('AGV1052', '70166395', 'Juan yonatan', 'Galvez Sulluchuco', 'juan.galvez@agrovetmarket.com', '11/4/2024', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Jefe de Desarrollo Analitico'), 14, 1, true, false, true),
  ('AGV1053', '76134040', 'Narda Mirella', 'Rojas Vera', 'narda.rojas@agrovetmarket.com', '11/4/2024', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente de Atracci´┐¢n del Talento'), 34, 1, false, false, true),
  ('AGV1054', '40627935', 'Milagritos Yoana', 'Chipa Yupanqui', 'milagritos.chipa@agrovetmarket.com', '11/4/2024', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Jefe de Propiedad Intelectual'), 17, 1, true, false, true),
  ('AGV1058', '72212319', 'Monica Andrea', 'Diaz Pe´┐¢a', 'monica.diaz@agrovetmarket.com', '11/6/2024', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Promotor de Ventas Animales de Compa´┐¢´┐¢a'), 1, 1, false, false, true),
  ('AGV1062', '75728077', 'Keila Athalia', 'Zenobio Cadillo', 'keila.zenobio@agrovetmarket.com', '11/22/2024', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Promotor de Ventas Animales de Compa´┐¢´┐¢a'), 1, 1, false, false, true),
  ('AGV1064', '43302712', 'Marlene', 'Bejar Pillaca', 'marlene.bejar@agrovetmarket.com', '12/2/2024', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente de Operaciones de Producci´┐¢n'), 29, 1, false, false, true),
  ('AGV1065', '41352478', 'Maria Isabel', 'Takaeshi Senmache', 'maria.takaeshi@agrovetmarket.com', '12/2/2024', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Supervisor de Estabilidades'), 15, 1, true, false, true),
  ('AGV1068', '76605055', 'Linda ketty', 'Ore Ramos', 'linda.ore@agrovetmarket.com', '12/5/2024', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Promotor de Ventas Pet Nutriscience'), 26, 1, false, false, true),
  ('AGV1070', '72181704', 'Jose Jesus', 'Chacaliaza Coronel', 'jose.chacaliaza@agrovetmarket.com', '12/18/2024', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Promotor de Ventas Pet Nutriscience'), 26, 1, false, false, true),
  ('AGV1071', '42039545', 'Miguel Alfredo', 'Hernandez Ballena', 'miguel.hernandez@agrovetmarket.com', '12/23/2024', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Jefe de Investigaci´┐¢n y Planeamiento de Demanda'), 1, 1, true, false, true),
  ('AGV1073', '40602403', 'Jimmy Antonio', 'Medina Seminario', 'jimmy.medina@agrovetmarket.com', '1/2/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Auxiliar de Recepci´┐¢n'), 2, 1, false, false, true),
  ('AGV1074', '72567118', 'Jhon David', 'Guerrero Vargas', 'jhon.guerrero@agrovetmarket.com', '1/2/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Auxiliar de Infraestructura y TI - Part Time'), 33, 1, false, false, true),
  ('AGV1075', '73257866', 'Medalith Gretel', 'Sierra Marquina', 'medalith.sierra@agrovetmarket.com', '1/8/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente de Asuntos Regulatorios'), 5, 1, false, false, true),
  ('AGV1076', '72168925', 'Andrea Anali', 'Guerreros Carneiro', 'andrea.guerreros@agrovetmarket.com', '1/8/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente de Asuntos Regulatorios'), 5, 1, false, false, true),
  ('AGV1077', '45263715', 'Zaida Carolina', 'Rojas Bernal', 'zaida.rojas@agrovetmarket.com', '1/20/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Representante de Ventas - Animales de Compa´┐¢´┐¢a'), 1, 1, false, false, true),
  ('AGV1079', '74096193', 'Diana Ruby', 'Ballena Pisfil', 'diana.ballena@agrovetmarket.com', '2/3/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Promotor de Ventas Animales de Compa´┐¢´┐¢a'), 1, 1, false, false, true),
  ('AGV1081', '48395142', 'Ydalia Griselda', 'Huallparimachi Carbajal', 'ydalia.huallparimachi@agrovetmarket.com', '2/3/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Supervisor de Desarrollo Anal´┐¢tico'), 14, 1, true, false, true),
  ('AGV1082', '72802670', 'Yeny', 'Llaccolla Supa', 'yeny.llaccolla@agrovetmarket.com', '2/3/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente de Control de Producci´┐¢n'), 27, 1, false, false, true),
  ('AGV1084', '45672003', 'Juan Enrique', 'Portal Marcelo', 'juan.portal@agrovetmarket.com', '2/7/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente de Aplicaciones'), 33, 1, false, false, true),
  ('AGV1085', '25773070', 'Teodoro Edilberto', 'Balarezo Arquinio', 'teodoro.balarezo@agrovetmarket.com', '2/10/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Jefe de Proyectos de TI'), 33, 1, true, false, true),
  ('AGV1089', '72188682', 'Christian Rodrigo', 'Arista Escobar', 'christian.arista@agrovetmarket.com', '3/3/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente de Importaciones'), 8, 1, false, false, true),
  ('AGV1091', '72193032', 'Lesli Gianina', 'Galiano Franco', 'lesli.galiano@agrovetmarket.com', '3/3/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Promotor de Ventas Animales de Compa´┐¢´┐¢a'), 1, 1, false, false, true),
  ('AGV1092', '70885189', 'Jhosselyn Jarumy', 'Paliza Camavilca', 'jhosselyn.paliza@agrovetmarket.com', '3/3/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Auxiliar de Facturaci´┐¢n'), 16, 1, false, false, true),
  ('AGV1093', '46373012', 'Samantha Andrea', 'Ulloa Encinas', 'samantha.ulloa@agrovetmarket.com', '3/3/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente de Dise´┐¢o Gr´┐¢fico'), 22, 1, false, false, true),
  ('AGV1094', '70112700', 'Jennifer Marisel', 'Alvarado Villegas', 'jennifer.alvarado@agrovetmarket.com', '3/12/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Promotor de Ventas Animales de Compa´┐¢´┐¢a'), 1, 1, false, false, true),
  ('AGV1095', '76749265', 'Erick Franz', 'Mendoza Huerta', 'erick.mendoza@agrovetmarket.com', '3/12/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente T´┐¢cnico de Mantenimiento'), 30, 1, false, false, true),
  ('AGV1098', '77025697', 'Ana Valentina', 'Gavidia Avila', 'ana.gavidia@agrovetmarket.com', '3/19/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Auxiliar de Control de Calidad'), 13, 1, false, false, true),
  ('AGV1100', '76217474', 'Nayib Alexander', 'Ramos Baz´┐¢n', 'nayib.ramos@agrovetmarket.com', '3/24/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Promotor de Ventas Pet Nutriscience'), 26, 1, false, false, true),
  ('AGV1102', '72522922', 'Mariapaz', 'Navarro Zavala', 'mariapaz.navarro@agrovetmarket.com', '4/8/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Promotor de Ventas Pet Nutriscience'), 26, 1, false, false, true),
  ('AGV1103', '72839638', 'Joseph Junior', 'Tuestas Leyva', 'joseph.tuestas@agrovetmarket.com', '4/8/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Promotor de Ventas Pet Nutriscience'), 26, 1, false, false, true),
  ('AGV1105', '70982117', 'Margiory Ivonne', 'Tito Navarro', 'margiory.tito@agrovetmarket.com', '4/15/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente de Exportaciones'), 8, 1, false, false, true),
  ('AGV1109', '46753717', 'Diana Rebeca', 'Cajas Regal', 'diana.cajas@agrovetmarket.com', '5/15/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Supervisor de Formulaciones I'), 17, 1, true, false, true),
  ('AGV1110', '46455569', 'Thalia Veronica', 'Grillo Enriquez', 'thalia.grillo@agrovetmarket.com', '5/22/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Jefe de Marketing'), 21, 1, true, false, true),
  ('AGV1111', '72644298', 'Andrea Marilyn', 'Sanchez Estrada', 'andrea.sanchez@agrovetmarket.com', '5/22/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente de Dise´┐¢o Gr´┐¢fico'), 35, 1, false, false, true),
  ('AGV1112', '42585020', 'Martin Jesus', 'Curi Palomino', 'martin.curi@agrovetmarket.com', '6/3/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Auxiliar de PT y Distribuci´┐¢n'), 2, 1, false, false, true),
  ('AGV1116', '44565606', 'Stephanie Pamela', 'Hiyagon Arroyo', 'stephanie.hiyagon@agrovetmarket.com', '6/16/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Gerente Pet Nutriscience'), 26, 1, true, false, true),
  ('AGV1118', '72869070', 'Omar Andres', 'Chavez Abanto', 'omar.chavez@agrovetmarket.com', '7/1/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente de Marketing'), 22, 1, false, false, true),
  ('AGV1120', '70902987', 'Americo Augusto', 'Reyes Soplin', 'americo.reyes@agrovetmarket.com', '7/2/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Supervisor de Dise´┐¢o'), 22, 1, true, false, true),
  ('AGV1121', '71914533', 'Mirtha Liliana', 'Huamani Ccochachi', 'mirtha.huamani@agrovetmarket.com', '7/7/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Supervisor de Marketing - L´┐¢nea Ganader´┐¢a / Aves y Cerdos'), 22, 1, true, false, true),
  ('AGV1124', '07826393', 'Eduardo Edgardo', 'Chaman Comotto', 'eduardo.chaman@agrovetmarket.com', '8/4/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Sub Gerente T´┐¢cnico de Proyectos y Asesor Comercial'), 30, 1, true, false, true),
  ('AGV1126', '73409693', 'Nicole', 'Bendezu Solimano', 'nicole.bendezu@agrovetmarket.com', '8/4/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Jefe de Ventas Interpet'), 20, 1, true, false, true),
  ('AGV1127', '74230044', 'Ximena Alejandra', 'Beltran Flores', 'ximena.beltran@agrovetmarket.com', '8/11/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Representante de Venta Interpet'), 20, 1, false, false, true),
  ('AGV1128', '73073054', 'Valeria Cristina', 'D´┐¢az Hernandez', 'valeria.daz@agrovetmarket.com', '8/11/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente de Dise´┐¢o Gr´┐¢fico'), 22, 1, false, false, true),
  ('AGV1130', '76695340', 'Patricia Rosario', 'Santander Salas', 'patricia.santander@agrovetmarket.com', '8/18/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente de Desarrollo Anal´┐¢tico'), 14, 1, false, false, true),
  ('AGV1132', '71792073', 'Jean Carlos', 'De la Cruz Ochochoque', 'jean.de@agrovetmarket.com', '8/25/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Representante de Venta Interpet'), 20, 1, false, false, true),
  ('AGV1133', '71132558', 'Alejandra Moraima', 'Corrales Velasquez', 'alejandra.corrales@agrovetmarket.com', '8/25/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Promotor de Ventas Animales de Compa´┐¢´┐¢a'), 1, 1, false, false, true),
  ('AGV1134', '77463557', 'Jose Martin', 'Quispe Jave', 'jose.quispe@agrovetmarket.com', '9/3/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Auxiliar de Dispensaci´┐¢n'), 29, 1, false, false, true),
  ('AGV1135', '44120590', 'Rosario del Pilar', 'Manchego Molina', 'rosario.manchego@agrovetmarket.com', '9/3/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Auxiliar de Limpieza y Lavado'), 14, 1, false, false, true),
  ('AGV1136', '40961746', 'Alex', 'Quispe Azurin', 'alex.quispe@agrovetmarket.com', '9/5/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Supervisor de Estabilidades'), 15, 1, true, false, true),
  ('AGV1137', '46576009', 'Piere Arturo', 'Castillo Chavez', 'piere.castillo@agrovetmarket.com', '9/10/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Jefe de Planeamiento y Control de la Producci´┐¢n'), 27, 1, true, false, true),
  ('AGV1138', '48705619', 'Gustavo', 'Espinoza Sanchez', 'gustavo.espinoza@agrovetmarket.com', '9/10/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Auxiliar de Distribuci´┐¢n de Ventas E-Commerce'), 2, 1, false, false, true),
  ('AGV1139', '62948691', 'Pablo Gerardo', 'Fajardo Vasquez', 'pablo.fajardo@agrovetmarket.com', '9/10/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Auxiliar de Distribuci´┐¢n de Materiales'), 2, 1, false, false, true),
  ('AGV1141', '75254819', 'Diana Dedicacia', 'Quiquia Urribarre', 'diana.quiquia@agrovetmarket.com', '9/15/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Supervisor de Desarrollo de Packaging'), 17, 1, true, false, true),
  ('AGV1142', '70418798', 'Juan Carlos', 'Nu´┐¢ez Diaz', 'juan.nuez@agrovetmarket.com', '9/15/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Auxiliar de Formulaciones'), 17, 1, false, false, true),
  ('AGV1144', '76490171', 'Miguel Angel', 'Quispe Alva', 'miguel.quispe@agrovetmarket.com', '10/1/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Auxiliar de Distribuci´┐¢n de Materiales'), 2, 1, false, false, true),
  ('AGV1145', '29631547', 'Jorge Luis', 'Espinoza Andrade', 'jorge.espinoza@agrovetmarket.com', '10/10/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Jefe T´┐¢cnico Ganader´┐¢a'), 24, 1, true, false, true),
  ('AGV1146', '73199615', 'Diana Dorelli', 'Escamilo Mu´┐¢oz', 'diana.escamilo@agrovetmarket.com', '10/17/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente de Marketing Internacional'), 35, 1, false, false, true),
  ('AGV1147', '74220087', 'Javier Renato', 'Felix Merino', 'javier.felix@agrovetmarket.com', '10/20/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente de Seguridad y Medio Ambiente'), 32, 1, false, false, true),
  ('AGV1148', '48552044', 'Anthony Ashley', 'Vargas Morales', 'anthony.vargas@agrovetmarket.com', '10/27/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Chofer de Operaciones Log´┐¢sticas'), 2, 1, false, false, true),
  ('AGV1149', '74324450', 'Giomar Raul', 'Marin Orellana', 'giomar.marin@agrovetmarket.com', '11/10/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente de Trade Marketing Pets'), 22, 1, false, false, true),
  ('AGV1152', '76393671', 'Jeferson Grabiel', 'Cove´┐¢as Roman', 'jeferson.coveas@agrovetmarket.com', '11/12/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Supervisor de Desarrollo Online'), 7, 1, true, false, true),
  ('AGV1153', '72666791', 'Angela Antuanett', 'Sanchez Paucar', 'angela.sanchez@agrovetmarket.com', '11/18/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente de Dise´┐¢o de Material de Empaque - Compras'), 5, 1, false, false, true),
  ('AGV1154', '47479678', 'Adrian Antonio', 'Torres Zapata', 'adrian.torres@agrovetmarket.com', '12/1/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Chofer'), 1, 1, false, false, true),
  ('AGV1156', '73019940', 'Zizi Lucero', 'Vasquez Vasquez', 'zizi.vasquez@agrovetmarket.com', '12/4/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente de Asuntos Regulatorios'), 5, 1, false, false, true),
  ('AGV1158', '75439270', 'Diego Alonso', 'Guerra Araujo', 'diego.guerra@agrovetmarket.com', '12/11/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Auxiliar de Dise´┐¢o de Material de Empaque'), 5, 1, false, false, true),
  ('AGV1159', '71774340', 'Severo', 'Nina Chino', 'severo.nina@agrovetmarket.com', '12/18/2025', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Promotor de Ventas Animales de Compa´┐¢´┐¢a'), 1, 1, false, false, true),
  ('AGV1161', '47161226', 'Nitnay Angelita', 'Chuquino Ventura', 'nitnay.chuquino@agrovetmarket.com', '1/2/2026', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente de Estabilidades'), 1, 1, false, false, true),
  ('AGV1162', '006620552', 'Cristian Jes´┐¢s', 'Reyes Quintero', 'cristian.reyes@agrovetmarket.com', '1/2/2026', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Auxiliar de Distribuci´┐¢n de Ventas E-Commerce'), 2, 1, false, false, true),
  ('AGV1163', '41133415', 'Edgar Octavio', 'Huayanay Bohorquez', 'edgar.huayanay@agrovetmarket.com', '1/5/2026', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Supervisor de Procesos Industriales'), 1, 1, true, false, true),
  ('AGV1164', '73378593', 'Carolina Andrea', 'Balbuena Zamora', 'carolina.balbuena@agrovetmarket.com', '1/5/2026', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente de Asuntos Regulatorios'), 5, 1, false, false, true),
  ('AGV1165', '72910612', 'Cristhy Nicole', 'Plasencia Torres', 'cristhy.plasencia@agrovetmarket.com', '1/6/2026', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Representante de Venta Interpet'), 20, 1, false, false, true),
  ('AGV1166', '46204593', 'Gloria Elena', 'Barba Claros', 'gloria.barba@agrovetmarket.com', '1/12/2026', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Supervisor de Aseguramiento de la Calidad'), 4, 1, true, false, true),
  ('AGV1167', '70745565', 'Mireylla Alexandra', 'Moquillaza Rodriguez', 'mireylla.moquillaza@agrovetmarket.com', '1/12/2026', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = 'Asistente de Dise´┐¢o Gr´┐¢fico'), 21, 1, false, false, true)
ON CONFLICT (dni) DO NOTHING;

-- PASO 3: Actualizar supervisores
DO $$
DECLARE
  emp_record RECORD;
  supervisor_id_var INT;
BEGIN
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41487544';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '09849767';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '02887604';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '09314068';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41487544';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '41118341';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '10545562';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '10184621';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '09310906';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '10545562';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '44409869';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '09351865';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '09310906';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '41300244';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '10184621';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '07097049';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '09310906';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '40123188';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '09310906';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '29672410';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '09310906';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '41866820';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '02887604';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '42705690';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41487544';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '07514765';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '10184621';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '09308424';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41487544';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '43997960';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '29672410';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '08459479';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41487544';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '44671261';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41279012';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '41274325';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '40238779';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '42166202';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '09310906';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '40560230';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '09310906';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '40238779';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41487544';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '47881508';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '29672410';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '44527068';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '40214605';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '44866308';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41866820';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '41361328';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '44943485';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '44065263';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '44409869';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '10120502';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41300244';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '09881789';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '42260711';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '42428258';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41487544';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '44880919';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41361328';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '48170297';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '40238779';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '06812394';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41300244';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '40326738';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41300244';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '44510264';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41300244';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '41279012';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41300244';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '70538548';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '44943485';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '49080294';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '10184621';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '07082032';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '29672410';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '44307069';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41274325';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '47049563';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '44023039';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '46609730';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '44943485';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '72611115';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '42166202';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '46481506';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41487544';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '48138936';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41866820';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '41487544';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '02887604';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '43271693';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '44943485';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '45434771';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '45682368';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '42133895';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '10545562';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '09372197';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41487544';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '48319203';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '40123188';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '09599599';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41274325';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '10095081';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41487544';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '10880202';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '40123188';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '45267996';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '02887604';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '40816315';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '44943485';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '09533163';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41279012';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '44023038';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41300244';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '45340693';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '10184621';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '71066355';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41279012';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '08883259';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41300244';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '47146124';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '40238779';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '45682368';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '44023039';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '46556650';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41274325';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '41126035';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41300244';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '002114405';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '09599599';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '44824879';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41300244';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '47525376';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '45682368';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '71329473';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '40123188';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '44409869';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '42166202';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '46434409';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41300244';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '43978070';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41300244';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '46974645';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '29672410';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '72477744';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '45682368';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '47700102';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '02887604';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '23997723';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '44866308';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '47832678';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '44866308';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '72474117';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '42260711';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '10434281';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41866820';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '42933766';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '10545562';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '42260711';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '10545562';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '44943485';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41300244';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '74176101';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '02887604';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '40252256';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '40238779';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '76163353';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '42260711';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '46462043';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '08883259';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '76845847';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '43431921';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '48517948';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '42260711';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '75096888';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '10184621';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '47566082';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '42260711';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '73362975';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '09599599';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '46594683';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '40238779';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '71337566';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '40238779';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '02887604';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '10184621';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '09597601';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41300244';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '40808976';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '08883259';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '48113547';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '10545562';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '43431921';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41300244';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '70438614';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '44023039';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '73141547';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '40238779';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '75131900';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41487544';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '007080768';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '02887604';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '74390287';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '09599599';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '46554968';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '02887604';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '41967991';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '44023039';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '48248365';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '44023039';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '43967204';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41487544';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '007078460';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '40238779';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '41747025';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '42260711';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '41221724';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '02887604';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '72706327';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '45682368';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '71491227';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41300244';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '74932277';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '06812394';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '48170145';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '46576009';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '72217788';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41487544';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '71618290';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '44943485';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '74205077';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '45682368';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '70993751';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '29672410';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '71747437';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41487544';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '70691089';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41274325';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '70357139';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '09310906';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '40214605';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '02887604';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '09918364';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '45682368';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '73489936';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41361328';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '48340724';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '02887604';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '73134126';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '43431921';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '74123539';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41300244';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '48476040';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '42166202';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '46403531';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '44824879';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '70890247';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41487544';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '41434910';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '46576009';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '71872184';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41300244';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '75994233';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41300244';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '70827118';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41361328';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '72793869';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '45682368';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '47445953';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '44943485';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '70604766';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '43431921';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '41676618';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '43431921';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '74299298';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '43431921';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '75706717';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '44023039';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '76569973';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41300244';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '60789436';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41274325';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '70613872';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '08883259';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '70166395';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '09599599';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '76134040';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41279012';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '40627935';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '45682368';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '72212319';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '45682368';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '75728077';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '44866308';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '43302712';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41274325';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '41352478';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '45682368';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '76605055';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '45682368';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '72181704';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '40238779';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '42039545';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41487544';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '40602403';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '43431921';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '72567118';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41300244';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '73257866';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41300244';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '72168925';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '45682368';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '45263715';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '45682368';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '74096193';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '08883259';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '48395142';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '46576009';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '72802670';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '43431921';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '45672003';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '43431921';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '25773070';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '42933766';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '72188682';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '45682368';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '72193032';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '44943485';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '70885189';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '42166202';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '46373012';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '45682368';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '70112700';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '40560230';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '76749265';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '44409869';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '77025697';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '45682368';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '76217474';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '45682368';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '72522922';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '45682368';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '72839638';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '42933766';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '70982117';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '44023038';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '46753717';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '42166202';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '46455569';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '29672410';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '72644298';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41487544';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '42585020';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '40238779';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '44565606';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '42166202';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '72869070';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '42166202';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '70902987';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '42166202';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '71914533';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '40560230';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '07826393';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '45682368';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '73409693';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '45682368';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '74230044';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '42166202';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '73073054';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '08883259';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '76695340';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '45682368';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '71792073';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '45682368';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '71132558';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '44866308';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '77463557';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '08883259';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '44120590';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41126035';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '40961746';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41866820';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '46576009';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41487544';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '48705619';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41487544';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '62948691';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '46609730';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '75254819';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '44023038';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '70418798';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41487544';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '76490171';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '02887604';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '29631547';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '46434409';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '73199615';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '44824879';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '74220087';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41487544';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '48552044';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '42166202';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '74324450';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '40238779';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '76393671';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '44510264';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '72666791';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '10184621';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '47479678';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '47146124';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '73019940';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '44510264';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '75439270';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '45682368';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '71774340';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41274325';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '47161226';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '41487544';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '006620552';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '46609730';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '41133415';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '46974645';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '73378593';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '73409693';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '72910612';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '40123188';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '46204593';
  END IF;
  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '42166202';
  IF supervisor_id_var IS NOT NULL THEN
    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '70745565';
  END IF;
END $$;

-- PASO 4: Crear usuarios
-- Password hash para 'Agrovet2026!': $2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m
INSERT INTO usuarios (empleado_id, email, password, rol, activo)
VALUES
  ((SELECT id FROM empleados WHERE dni = '09310906'), 'jorge.calderon@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'admin', true),
  ((SELECT id FROM empleados WHERE dni = '09849767'), 'alejandro.vargas@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '09314068'), 'pedro.calderon@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '41118341'), 'dagoberto.salazar@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '10184621'), 'ricardo.calderon@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '10545562'), 'jose.garcia@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'admin', true),
  ((SELECT id FROM empleados WHERE dni = '09351865'), 'ivan.ramirez@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '41300244'), 'giovanna.anchorena@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'admin', true),
  ((SELECT id FROM empleados WHERE dni = '07097049'), 'ana.pieyros@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '40123188'), 'milady.alvarez@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'admin', true),
  ((SELECT id FROM empleados WHERE dni = '29672410'), 'sandra.meneses@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '41866820'), 'johanna.hurtado@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '42705690'), 'alan.tauca@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '07514765'), 'juan.felix@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '09308424'), 'gladis.ojeda@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '43997960'), 'erick.viera@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '08459479'), 'elvis.caceres@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '44671261'), 'jorge.cerda@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '41274325'), 'violeta.balbuena@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '42166202'), 'carmen.morales@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '40560230'), 'alberto.vasquez@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '40238779'), 'jimena.del@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'admin', true),
  ((SELECT id FROM empleados WHERE dni = '47881508'), 'nexar.mundaca@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '44527068'), 'luis.chavez@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '44866308'), 'milagros.huamani@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '41361328'), 'ursula.retuerto@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '44065263'), 'marilia.tinoco@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '10120502'), 'raquel.marcelo@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '09881789'), 'lelia.sanchez@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '42428258'), 'ana.flores@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '44880919'), 'luis.ore@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '48170297'), 'jhosi.miguel@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '06812394'), 'janet.hueza@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '40326738'), 'norma.pizarro@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '44510264'), 'claudia.roman@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '41279012'), 'karen.delgado@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '70538548'), 'yanina.amao@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '49080294'), 'eigly.pereira@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '07082032'), 'segundo.rimarachin@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '44307069'), 'katherine.navarro@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '47049563'), 'lucy.zapata@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '46609730'), 'nataly.valdez@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '72611115'), 'esperanza.alhuay@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '46481506'), 'cenit.diaz@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '48138936'), 'brayan.malca@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '41487544'), 'perci.mondragon@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '43271693'), 'michael.vilchez@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '45434771'), 'kattya.barcena@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '42133895'), 'veronica.campos@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '09372197'), 'raul.marroquin@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '48319203'), 'miguel.molinero@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '09599599'), 'ursula.huamancaja@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'rrhh', true),
  ((SELECT id FROM empleados WHERE dni = '10095081'), 'olga.guerra@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '10880202'), 'julio.camargo@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '45267996'), 'jonas.torres@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '40816315'), 'ivan.ramos@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '09533163'), 'augusto.matto@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '44023038'), 'erick.molleapaza@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '45340693'), 'jose.delgado@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '06605348'), 'jesus.calderon@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '71066355'), 'roldan.manihuari@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '08883259'), 'cesar.morales@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '47146124'), 'diana.cornejo@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '45682368'), 'stefanny.rios@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '46556650'), 'mauricio.porras@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '41126035'), 'beatriz.mayma@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '002114405'), 'jose.pereira@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '44824879'), 'jennyfer.miguel@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '47525376'), 'karen.guerra@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '71329473'), 'erick.arias@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '74581999'), 'camila.calderon@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '44409869'), 'karina.torres@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '46434409'), 'juan.campos@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '43978070'), 'paola.arias@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '46974645'), 'estefani.huamani@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '72477744'), 'vanessa.parker@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '47700102'), 'sharon.francisco@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '23997723'), 'fernando.paredes@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '47832678'), 'giovana.cordova@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '72474117'), 'marcia.palacios@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '10434281'), 'blanca.loayza@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '42933766'), 'carlos.barboza@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '42260711'), 'pamela.torres@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '06605348'), 'jesus.calderon1@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '44943485'), 'jancarlo.pariasca@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '74176101'), 'lucero.flores@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '40252256'), 'rommel.chinchay@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '76163353'), 'flavia.mendoza@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '46462043'), 'anabel.giraldo@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '76845847'), 'jessica.ore@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '48517948'), 'juana.lovaton@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '75096888'), 'melina.cochachin@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '47566082'), 'maria.rodriguez@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '73362975'), 'belinda.santiago@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '46594683'), 'alimao.hinostroza@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'rrhh', true),
  ((SELECT id FROM empleados WHERE dni = '71337566'), 'jonathan.barrera@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '02887604'), 'manuel.bravo@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '09597601'), 'elio.vilchez@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '40808976'), 'beatriz.truel@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '48113547'), 'antonieta.ortiz@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '43431921'), 'ena.fernandez@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '70438614'), 'raquel.arellano@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '73141547'), 'nicolas.ramos@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '75131900'), 'samire.huaman@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '007080768'), 'jonathan.reyes@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '74390287'), 'yohani.mera@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '46554968'), 'jean.romani@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '41967991'), 'jose.quea@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '48248365'), 'nathaly.calderon@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '43967204'), 'miguel.caballero@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '007078460'), 'pedro.otaiza@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '41747025'), 'orlando.jaimes@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '41221724'), 'gisela.reategui@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '72706327'), 'kevin.sanchez@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '71491227'), 'nidia.lope@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '74932277'), 'sandra.krklec@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '48170145'), 'regina.martinez@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '72217788'), 'sebastian.morales@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '71618290'), 'miguel.caycho@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '74205077'), 'angie.gomero@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '70993751'), 'deysi.campo@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '71747437'), 'ariana.carmona@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '70691089'), 'luis.quinteros@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '70357139'), 'gianella.neves@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '40214605'), 'ivonne.riquez@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '09918364'), 'abner.hoyos@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '73489936'), 'anyela.celi@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '48340724'), 'brenda.cupe@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '73134126'), 'irvin.tomas@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '74123539'), 'mariano.polo@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '48476040'), 'maria.cucchi@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '46403531'), 'carolina.tasayco@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '70890247'), 'cristhian.toro@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '41434910'), 'weslie.guanilo@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '71872184'), 'gianella.gutierrez@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '75994233'), 'ximena.portocarrero@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '70827118'), 'eliud.ferrari@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '72793869'), 'christian.santibaez@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '47445953'), 'angela.de@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '70604766'), 'jose.montero@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '41676618'), 'carlos.garcia@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '74299298'), 'miguel.maguia@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '75706717'), 'davis.huaman@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '76569973'), 'alberto.ariza@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '60789436'), 'vannya.aylas@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '70613872'), 'ingrid.poma@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '70166395'), 'juan.galvez@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '76134040'), 'narda.rojas@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '40627935'), 'milagritos.chipa@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '72212319'), 'monica.diaz@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '75728077'), 'keila.zenobio@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '43302712'), 'marlene.bejar@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '41352478'), 'maria.takaeshi@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '76605055'), 'linda.ore@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '72181704'), 'jose.chacaliaza@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '42039545'), 'miguel.hernandez@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '40602403'), 'jimmy.medina@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '72567118'), 'jhon.guerrero@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '73257866'), 'medalith.sierra@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '72168925'), 'andrea.guerreros@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '45263715'), 'zaida.rojas@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '74096193'), 'diana.ballena@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '48395142'), 'ydalia.huallparimachi@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '72802670'), 'yeny.llaccolla@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '45672003'), 'juan.portal@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '25773070'), 'teodoro.balarezo@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '72188682'), 'christian.arista@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '72193032'), 'lesli.galiano@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '70885189'), 'jhosselyn.paliza@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '46373012'), 'samantha.ulloa@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '70112700'), 'jennifer.alvarado@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '76749265'), 'erick.mendoza@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '77025697'), 'ana.gavidia@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '76217474'), 'nayib.ramos@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '72522922'), 'mariapaz.navarro@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '72839638'), 'joseph.tuestas@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '70982117'), 'margiory.tito@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '46753717'), 'diana.cajas@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '46455569'), 'thalia.grillo@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '72644298'), 'andrea.sanchez@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '42585020'), 'martin.curi@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '44565606'), 'stephanie.hiyagon@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '72869070'), 'omar.chavez@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '70902987'), 'americo.reyes@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '71914533'), 'mirtha.huamani@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '07826393'), 'eduardo.chaman@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '73409693'), 'nicole.bendezu@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '74230044'), 'ximena.beltran@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '73073054'), 'valeria.daz@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '76695340'), 'patricia.santander@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '71792073'), 'jean.de@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '71132558'), 'alejandra.corrales@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '77463557'), 'jose.quispe@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '44120590'), 'rosario.manchego@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '40961746'), 'alex.quispe@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '46576009'), 'piere.castillo@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '48705619'), 'gustavo.espinoza@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '62948691'), 'pablo.fajardo@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '75254819'), 'diana.quiquia@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '70418798'), 'juan.nuez@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '76490171'), 'miguel.quispe@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '29631547'), 'jorge.espinoza@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '73199615'), 'diana.escamilo@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '74220087'), 'javier.felix@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '48552044'), 'anthony.vargas@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '74324450'), 'giomar.marin@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '76393671'), 'jeferson.coveas@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '72666791'), 'angela.sanchez@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '47479678'), 'adrian.torres@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '73019940'), 'zizi.vasquez@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '75439270'), 'diego.guerra@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '71774340'), 'severo.nina@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '47161226'), 'nitnay.chuquino@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '006620552'), 'cristian.reyes@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '41133415'), 'edgar.huayanay@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '73378593'), 'carolina.balbuena@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '72910612'), 'cristhy.plasencia@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true),
  ((SELECT id FROM empleados WHERE dni = '46204593'), 'gloria.barba@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'supervisor', true),
  ((SELECT id FROM empleados WHERE dni = '70745565'), 'mireylla.moquillaza@agrovetmarket.com', '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m', 'empleado', true)
ON CONFLICT (email) DO NOTHING;

-- PASO 5: Crear periodos vacacionales 2026
INSERT INTO periodos_vacacionales (empleado_id, anio_generacion, fecha_inicio_periodo, fecha_fin_periodo, dias_totales, dias_disponibles, dias_usados, viernes_usados, tiene_bloque_7dias, estado)
SELECT id, 2026, '2026-01-01'::date, '2026-12-31'::date, 30, 30, 0, 0, false, 'activo'
FROM empleados;

-- Total empleados a cargar: 219
