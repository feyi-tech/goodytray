const fs = require('fs-extra')

try {
  fs.copySync('src/public/favicon.ico', 'dist/public/favicon.ico')
  fs.copySync('src/public/res', 'dist/public/res')

  console.log('######## static assets copy: OK ########')
} catch (err) {
  console.error('######## static assets copy: ERROR ########', err.message)
}
