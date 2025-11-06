import bcrypt from 'bcrypt';

const passwords = {
  'admin123': 'admin@agrovet.com',
  'rrhh123': 'ursula.huamancaja@agrovet.com',
  'jefe123': 'perci.mondragon@agrovet.com',
  'coord123': 'jonathan.cerda@agrovet.com',
  'emp123': 'empleados'
};

async function generateHashes() {
  console.log('Generando hashes de contraseñas...\n');
  
  for (const [password, user] of Object.entries(passwords)) {
    const hash = await bcrypt.hash(password, 10);
    console.log(`-- ${user} (password: ${password})`);
    console.log(`Hash: ${hash}\n`);
  }
}

generateHashes();
