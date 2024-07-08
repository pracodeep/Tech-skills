
const fs =require ("fs");
const PDFDocument=require ("pdfkit");
const path =require ("path");

const generatePdf = async (userData, courseData) => {
  const { fullName, email } = userData;
  const { title, createdBy, category } = courseData;

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const fileName = `certificate_${Date.now()}.pdf`; // Generate a unique file name
    const filePath = path.join("uploads", fileName); // Construct the file path

    // Pipe the PDF output to a file
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Define styles for certificate
    const certificateStyle = {
      titleColor: "#000000", // Black color for normal text
      variableColor: "#000000", // Yellow color for variables (e.g., title, fullName)
      backgroundColor: "#FFB6C1", // Light background color
      borderColor: "#000000", // Black color for border
      borderWidth: 30, // Thick border width
    };

    // Set the background color
    doc.rect(0, 0, 612, 792).fill(certificateStyle.backgroundColor); // A4 size: 612x792 points

    // Add border
    doc
      .rect(0, 0, 612, 792)
      .lineWidth(certificateStyle.borderWidth)
      .stroke(certificateStyle.borderColor);

    // Add side domain name
    doc
      .fillColor("#ff0000")
      .fontSize(12)
      .text("www.devskillz.vercel.app", 30, 30);

    // Add content to the certificate
    doc
      .fillColor(certificateStyle.titleColor)
      .font("Helvetica-Bold")
      .fontSize(18)
      .text("Certificate of Completion", { align: "center", underline: true });

    doc.moveDown();
    doc
      .fillColor(certificateStyle.variableColor)
      .text(
        `This is to certify that ${fullName} has successfully completed the course ${title}.`,
        { align: "center", underline: true }
      );

    doc.moveDown();
    doc.text(`Date of Completion: ${new Date().toDateString()}`, {
      align: "center",
    });

    doc.moveDown();
    doc.text("Course Details:", { align: "center" });
    doc.text(`Title: ${title}`, { align: "center" });
    doc.text(`Category: ${category}`, { align: "center" });
    doc.text(`Instructor: ${createdBy}`, { align: "center" });

    doc.moveDown();
    doc.text("Congratulations on your achievement!", { align: "center" });
    doc.text("Keep up the good work!", { align: "center" });

    // Finalize the document
    doc.end();

    // Handle stream events
    stream.on("finish", () => {
      resolve(filePath); // Resolve with the file path after the stream finishes writing
    });
    stream.on("error", (error) => {
      reject(error); // Reject with the error if there's a stream error
    });
  });
};

module.exports=generatePdf