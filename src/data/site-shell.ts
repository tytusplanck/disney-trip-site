export interface SiteShellData {
  brandEyebrow: string;
  brandTitle: string;
  brandLinkLabel: string;
  mastheadNote: string;
  footerNote: string;
  skipLinkLabel: string;
  defaultDescription: string;
}

export const siteShellData: SiteShellData = {
  brandEyebrow: 'Private Site',
  brandTitle: 'Disney Trip Planner',
  brandLinkLabel: 'Go to the private Disney trip home page',
  mastheadNote:
    'A password-protected planning shell for itinerary details, reservations, logistics, and notes.',
  footerNote:
    'Keep narrative copy in route-level TypeScript page objects and protected trip details out of /public.',
  skipLinkLabel: 'Skip to main content',
  defaultDescription: 'Private Disney trip planning site.',
};
