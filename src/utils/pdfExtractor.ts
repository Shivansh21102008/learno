import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker safely for Vite/browser environments
if (typeof window !== 'undefined') {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.mjs',
      import.meta.url
    ).toString();
  } catch {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  }
}

export interface PDFExtractionResult {
  success: boolean;
  text?: string;
  numPages?: number;
  fileName?: string;
  fileSize?: number;
  errorType?: 'INVALID_FORMAT' | 'NO_QUESTIONS_OR_CONTENT' | 'PARSE_FAILED';
  errorMessage?: string;
}

/**
 * Validates file type and extracts readable text from PDF.
 */
export async function extractTextFromPDF(file: File): Promise<PDFExtractionResult> {
  // 1. File Format Verification: Strictly check for .pdf extension & mime type
  const isPdfExtension = file.name.toLowerCase().endsWith('.pdf');
  const isPdfMime = file.type === 'application/pdf' || file.type === '';

  if (!isPdfExtension || !isPdfMime) {
    const ext = file.name.includes('.') ? file.name.split('.').pop()?.toUpperCase() : 'UNKNOWN';
    return {
      success: false,
      errorType: 'INVALID_FORMAT',
      errorMessage: `Invalid file format detected: [ .${ext} ]. Learno AI strictly requires a valid PDF (.pdf) study document. Non-PDF files are not allowed.`,
    };
  }

  // 2. Read file ArrayBuffer
  let arrayBuffer: ArrayBuffer;
  try {
    arrayBuffer = await file.arrayBuffer();
  } catch (err: any) {
    return {
      success: false,
      errorType: 'PARSE_FAILED',
      errorMessage: `Could not read file data: ${err?.message || 'File read error'}`,
    };
  }

  // 3. Extract text page by page with PDF.js
  try {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true,
    });

    const pdfDocument = await loadingTask.promise;
    const numPages = pdfDocument.numPages;

    if (numPages === 0) {
      return {
        success: false,
        errorType: 'NO_QUESTIONS_OR_CONTENT',
        errorMessage: 'The uploaded PDF document has 0 pages or is corrupted. No questions could be formulated.',
      };
    }

    const pagesText: string[] = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      try {
        const page = await pdfDocument.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageStrings = textContent.items
          .map((item: any) => (item && typeof item.str === 'string' ? item.str : ''))
          .filter(Boolean);
        pagesText.push(pageStrings.join(' '));
      } catch {
        // Continue extracting remaining pages if one page fails
      }
    }

    let fullText = pagesText.join('\n\n').trim();

    // 4. Validate if extractable academic/question content actually exists
    // Strips whitespace and non-alphanumeric characters to check genuine text volume
    const meaningfulCharacters = fullText.replace(/[^a-zA-Z0-9]/g, '');

    if (meaningfulCharacters.length < 50) {
      return {
        success: false,
        errorType: 'NO_QUESTIONS_OR_CONTENT',
        errorMessage:
          'No readable questions, notes, or academic content could be found in this PDF. The document may be blank, scanned without OCR text, or password-protected. Please upload a study PDF with readable text.',
      };
    }

    return {
      success: true,
      text: fullText,
      numPages,
      fileName: file.name,
      fileSize: file.size,
    };
  } catch (err: any) {
    return {
      success: false,
      errorType: 'PARSE_FAILED',
      errorMessage: `Failed to parse PDF: ${err?.message || 'Unsupported PDF structure'}. Please upload a standard study PDF.`,
    };
  }
}
