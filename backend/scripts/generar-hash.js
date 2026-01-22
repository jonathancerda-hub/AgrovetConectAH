import bcrypt from 'bcrypt';

const password = 'Agrovet2026!';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  console.log('Contraseña:', password);
  console.log('Hash bcrypt:', hash);
  
  // Verificar que funciona
  bcrypt.compare(password, hash, (err, result) => {
    if (err) {
      console.error('Error verificando:', err);
      return;
    }
    console.log('Verificación:', result ? '✓ CORRECTO' : '✗ INCORRECTO');
  });
});
