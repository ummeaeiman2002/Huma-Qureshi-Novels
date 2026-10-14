const fs = require('fs');
const path = require('path');

const novelPath = path.join(__dirname, 'src', 'app', '(premium)', 'novel');
const pdfPath = path.join(__dirname, 'src', 'app', '(premium)', 'pdf');

try {
  if (fs.existsSync(novelPath)) {
    fs.rmSync(novelPath, { recursive: true, force: true });
    console.log('Deleted:', novelPath);
  }
  if (fs.existsSync(pdfPath)) {
    fs.rmSync(pdfPath, { recursive: true, force: true });
    console.log('Deleted:', pdfPath);
  }
  console.log('Cleanup complete!');
} catch (error) {
  console.error('Error:', error.message);
}
