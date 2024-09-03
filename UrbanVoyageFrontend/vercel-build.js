const { execSync } = require('child_process');
const path = require('path');

const projectDir = path.resolve(__dirname, 'dist/urban-voyage-frontend');
execSync('ng build --configuration production', { stdio: 'inherit' });
