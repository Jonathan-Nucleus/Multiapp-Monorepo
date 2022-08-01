import * as pdfjs from "pdfjs-dist";
import worker from "pdfjs-dist/build/pdf.worker";

pdfjs.GlobalWorkerOptions.workerSrc = worker;

async function readFile(file: File): Promise<Uint8Array> {
  return new Promise<Uint8Array>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function () {
      const result = this.result;
      if (typeof result === "string") {
        reject("Invalid data type");
        return;
      }

      if (result) {
        resolve(new Uint8Array(result));
      }

      reject("Unable to read PDF file");
    };

    reader.readAsArrayBuffer(file);
  });
}

export async function generateThumbnail(file: File): Promise<File | null> {
  const pdfData = await readFile(file);
  const loadingTask = await pdfjs.getDocument({ data: pdfData });
  const pdf = await loadingTask.promise;
  const firstPage = await pdf.getPage(1);

  const viewport = firstPage.getViewport({ scale: 1 });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  if (context) {
    await firstPage.render({ canvasContext: context, viewport }).promise;
    const mimeType = "image/png";
    const url = canvas.toDataURL(mimeType);

    const res = await fetch(url);
    const blob = await res.blob();

    return new File([blob], "pdf-preview.png", { type: mimeType });
  }

  console.error("Could not render PDF");
  return null;
}
