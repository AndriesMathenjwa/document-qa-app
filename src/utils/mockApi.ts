import { DocumentItem } from "../types";

export function simulateUpload(
  file: File,
  onProgress: (p: number) => void
): Promise<DocumentItem> {
  return new Promise((resolve, reject) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    let p = 0;
    const iv = setInterval(() => {
      p += Math.floor(Math.random() * 20) + 10;
      if (p >= 100) {
        p = 100;
        onProgress(p);
        clearInterval(iv);
        setTimeout(() => {
          resolve({
            id,
            name: file.name,
            size: file.size,
            uploadedAt: new Date().toISOString(),
            status: "uploaded",
          });
        }, 250);
      } else {
        onProgress(p);
      }
    }, 180);
    
    // tiny chance to fail
    setTimeout(() => {
      if (Math.random() < 0.03) {
        clearInterval(iv);
        reject(new Error("Simulated network error"));
      }
    }, 600);

    // Force a failure
    // setTimeout(() => {
    //   clearInterval(iv);
    //   reject(new Error("Forced network error"));
    // }, 600);
  });
}

export function mockAnswer(question: string, docName: string): Promise<string> {
  const delay = 600 + Math.random() * 1000;
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(
        `Mock answer for "*${question}*"\n\nSource: **${docName}**\n\nThis is a simulated response (delay ${Math.round(
          delay
        )}ms).`
      );
    }, delay)
  );
}
