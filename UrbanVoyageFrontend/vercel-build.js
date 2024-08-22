const { execSync } = require('child_process');

try {
  execSync('ng build --configuration production', { stdio: 'inherit' });
} catch (error) {
  console.error('Build failed');
  process.exit(1);
}
