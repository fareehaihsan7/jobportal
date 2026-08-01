import html2pdf from "html2pdf.js";

const downloadResume = () => {
  const element = document.getElementById("resume-preview");

  const options = {
    margin: 0.4,
    filename: "Resume.pdf",
    image: {
      type: "jpeg",
      quality: 1,
    },
    html2canvas: {
      scale: 2,
      useCORS: true,
    },
    jsPDF: {
      unit: "in",
      format: "a4",
      orientation: "portrait",
    },
  };

  html2pdf().set(options).from(element).save();
};

export default downloadResume;