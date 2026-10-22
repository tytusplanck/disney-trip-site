export interface TripPrintCopy {
  buttonLabel: string;
  documentTitle: string;
}

/** Browsers use the document title as the default PDF file name when saving a printout. */
export function getPrintDocumentTitle(
  tripTitle: string,
  copy: Pick<TripPrintCopy, 'documentTitle'>,
  scope?: string | null,
): string {
  const title = `${tripTitle} – ${copy.documentTitle}`;
  return scope ? `${title} (${scope})` : title;
}
