import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker for web environment
const initializePDFJS = () => {
  try {
    // Use the bundled worker from the npm package
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.js',
      import.meta.url
    ).toString();
  } catch (error) {
    console.warn('Failed to set worker from URL, trying CDN fallback');
    // Fallback to CDN
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.js';
  }
};

// Initialize PDF.js when the module loads
initializePDFJS();

export const parsePDF = async (file: File): Promise<string> => {
  try {
    // Validate file
    if (!file) {
      throw new Error('No file provided');
    }

    if (file.type !== 'application/pdf') {
      throw new Error('File must be a PDF');
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      throw new Error('File size too large (max 10MB)');
    }

    console.log('Starting PDF parsing for file:', file.name, 'Size:', file.size);

    // Convert file to array buffer
    const arrayBuffer = await file.arrayBuffer();
    console.log('File converted to array buffer, size:', arrayBuffer.byteLength);

    // Create a more robust loading configuration
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      verbosity: 0,
      // Disable worker if it's causing issues
      useWorkerFetch: false,
      isEvalSupported: false,
      // Add timeout
      httpHeaders: {},
      withCredentials: false
    });

    // Add timeout to the loading task
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('PDF loading timeout')), 30000); // 30 second timeout
    });

    const pdf = await Promise.race([loadingTask.promise, timeoutPromise]) as any;
    console.log('PDF loaded successfully, pages:', pdf.numPages);
    
    let fullText = '';
    const maxPages = Math.min(pdf.numPages, 20); // Limit to 20 pages for performance
    
    // Extract text from each page
    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      try {
        console.log(`Processing page ${pageNum}/${maxPages}`);
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        // Extract text items and join them
        const pageText = textContent.items
          .filter((item: any) => item.str && typeof item.str === 'string')
          .map((item: any) => item.str.trim())
          .filter((text: string) => text.length > 0)
          .join(' ');
        
        if (pageText.trim()) {
          fullText += pageText + '\n\n';
        }
        
        // Clean up page resources
        page.cleanup();
      } catch (pageError) {
        console.warn(`Error processing page ${pageNum}:`, pageError);
        // Continue with other pages
      }
    }
    
    // Clean up the document
    pdf.destroy();
    
    const cleanedText = fullText
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n\s*\n/g, '\n') // Replace multiple newlines with single newline
      .trim();
    
    console.log('PDF parsing completed, extracted text length:', cleanedText.length);
    
    if (!cleanedText || cleanedText.length < 10) {
      throw new Error('No readable text found in PDF. The PDF might be image-based or corrupted.');
    }
    
    return cleanedText;
    
  } catch (error) {
    console.error('PDF parsing error:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('Invalid PDF')) {
        throw new Error('Invalid PDF file. Please ensure the file is not corrupted.');
      } else if (error.message.includes('password')) {
        throw new Error('Password-protected PDFs are not supported.');
      } else if (error.message.includes('timeout')) {
        throw new Error('PDF processing timed out. Please try a smaller file.');
      } else if (error.message.includes('worker')) {
        throw new Error('PDF processing service is temporarily unavailable. Please try again.');
      } else if (error.message.includes('network')) {
        throw new Error('Network error while processing PDF. Please check your connection.');
      } else {
        throw new Error(`PDF parsing failed: ${error.message}`);
      }
    }
    
    throw new Error('Failed to parse PDF file. Please try a different file or check if the PDF is readable.');
  }
};

// Alternative text extraction method as fallback
export const extractTextFromPDFAlternative = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        
        // Simple text extraction attempt
        const uint8Array = new Uint8Array(arrayBuffer);
        const decoder = new TextDecoder('utf-8', { fatal: false });
        let text = decoder.decode(uint8Array);
        
        // Basic PDF text extraction (very limited)
        const textMatches = text.match(/\(([^)]+)\)/g);
        if (textMatches) {
          const extractedText = textMatches
            .map(match => match.slice(1, -1))
            .filter(text => text.length > 2)
            .join(' ');
          
          if (extractedText.length > 50) {
            resolve(extractedText);
            return;
          }
        }
        
        reject(new Error('Could not extract readable text from PDF'));
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};

// Helper function to validate PDF file before parsing
export const validatePDFFile = (file: File): { isValid: boolean; error?: string } => {
  if (!file) {
    return { isValid: false, error: 'No file selected' };
  }

  if (file.type !== 'application/pdf') {
    return { isValid: false, error: 'Please select a PDF file' };
  }

  if (file.size === 0) {
    return { isValid: false, error: 'File appears to be empty' };
  }

  if (file.size > 10 * 1024 * 1024) {
    return { isValid: false, error: 'File size too large (maximum 10MB)' };
  }

  return { isValid: true };
};

// Test if PDF.js is working
export const testPDFJSAvailability = async (): Promise<boolean> => {
  try {
    // Create a minimal PDF to test parsing
    const testPDF = new Uint8Array([
      0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34, // %PDF-1.4
      0x0a, 0x25, 0xc4, 0xe5, 0xf2, 0xe5, 0xeb, 0xa7, 0xf3, 0xa0, 0xd0, 0xc4, 0xc6, 0x0a
    ]);
    
    const loadingTask = pdfjsLib.getDocument({ data: testPDF });
    await loadingTask.promise;
    return true;
  } catch (error) {
    console.warn('PDF.js availability test failed:', error);
    return false;
  }
};