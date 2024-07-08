const multer =require( "multer");
const path =require ("path");

// Multer disk storage configuration
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    // Specify the destination directory where files will be stored
    cb(null, "uploads/");
  },
  // Generate a unique filename including the original filename and a timestamp
  filename: function (_req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter function to allow specific file types based on fieldname
const fileFilter = (_req, file, cb) => {
  // Get the fieldname from the request body
  const fieldname = file.fieldname;

  // Define allowed extensions based on fieldname
  const extensionsByFieldname = {
    lecture: [".mp4"], // Only allow .mp4 files for 'lecture'
    material: [".pdf", ".docx", ".ppt"], // Allow .pdf, .docx, .ppt for 'material'
    default: [".jpg", ".jpeg", ".webp", ".png"], // Default allowed extensions
  };

  // Determine the allowed extensions based on the fieldname
  const allowedExtensions =
    extensionsByFieldname[fieldname] || extensionsByFieldname.default;

  const ext = path.extname(file.originalname).toLowerCase();

  // Check if the file extension is in the allowed list
  if (allowedExtensions.includes(ext)) {
    cb(null, true); // File is allowed
  } else {
    // File type is not allowed, return an error
    const allowedExtensionsString = allowedExtensions.join(", ");
    cb(
      new Error(
        `Unsupported file type! Allowed types: ${allowedExtensionsString}`
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB file size limit
  fileFilter,
});

module.exports=upload;