-- Actualizar contraseñas con hashes correctos

-- admin@agrovet.com (password: admin123)
UPDATE usuarios 
SET password_hash = '$2b$10$0eUrrlqF4/KlP1rCaJOzgOrL4HWW3n/7lopyS933YkF5p53MOlOp2'
WHERE email = 'admin@agrovet.com';

-- ursula.huamancaja@agrovet.com (password: rrhh123)
UPDATE usuarios 
SET password_hash = '$2b$10$S8NhjDETqtddQHOoo6pwauIBTi53rIIc/Zpprnzz.GD909qkxLu.e'
WHERE email = 'ursula.huamancaja@agrovet.com';

-- perci.mondragon@agrovet.com (password: jefe123)
UPDATE usuarios 
SET password_hash = '$2b$10$OrXSfR/RRDzNsFeLZ.1wx.jrpsm8jtWVJPPyKUPF2sjP33qkVLk2y'
WHERE email = 'perci.mondragon@agrovet.com';

-- jonathan.cerda@agrovet.com (password: coord123)
UPDATE usuarios 
SET password_hash = '$2b$10$gL81VV6H1CqAwKknyR.nNeDSVmmBACIPb/IRGpAMvPSucp4QTN3JS'
WHERE email = 'jonathan.cerda@agrovet.com';

-- Empleados (password: emp123)
UPDATE usuarios 
SET password_hash = '$2b$10$IWNO0E9Myv7hYnFeGPRnZOjnIpRGcmL9WpCHpa2cRAgtNuOBTXIxK'
WHERE email IN (
  'ana.garcia@agrovet.com',
  'carlos.martinez@agrovet.com',
  'laura.rodriguez@agrovet.com',
  'pedro.sanchez@agrovet.com'
);

SELECT 'Contraseñas actualizadas correctamente' as resultado;
