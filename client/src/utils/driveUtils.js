// Utility to convert Google Drive share/view links into embeddable /preview links
export const convertToDrivePreview = (url) => {
  if (!url) return '';
  const trimmed = url.trim();

  // Match standard /file/d/FILE_ID/...
  const fileIdMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileIdMatch && fileIdMatch[1]) {
    return 'https://drive.google.com/file/d/' + fileIdMatch[1] + '/preview';
  }

  // Match ?id=FILE_ID or &id=FILE_ID
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) {
    return 'https://drive.google.com/file/d/' + idMatch[1] + '/preview';
  }

  // Match /folders/ID (drive folders)
  const folderMatch = trimmed.match(/\/drive\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch && folderMatch[1]) {
    return 'https://drive.google.com/embeddedfolderview?id=' + folderMatch[1] + '#grid';
  }

  // If already preview URL
  if (trimmed.includes('/preview')) {
    return trimmed;
  }

  return trimmed;
};

// Check if string looks like a Google Drive or cloud document link
export const isValidDriveLink = (url) => {
  if (!url) return false;
  const trimmed = url.trim();
  return (
    trimmed.includes('drive.google.com') ||
    trimmed.includes('docs.google.com') ||
    Boolean(trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)) ||
    Boolean(trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/))
  );
};