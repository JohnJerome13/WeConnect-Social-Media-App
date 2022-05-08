const multer = require('multer')
// const { v4: uuidv4 } = require('uuid');

// const storage = multer.memoryStorage({
//     destination: (req, file, callback) => {
//       callback(null, 'frontend/public/uploads/')
//     },
//     filename: (req, file, callback) => {
//       callback(null, uuidv4() + '-' + Date.now() +file.originalname)
//     }
//   })
  
const storage = multer.memoryStorage();

const upload = multer({storage: storage})

module.exports = { upload }