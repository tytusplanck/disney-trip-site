interface MetaContent {
  title: string;
  description: string;
}

interface LoginIntroContent {
  eyebrow: string;
  title: string;
  quip: string;
}

interface LoginFormContent {
  siteKeyLabel: string;
  siteKeyPlaceholder: string;
  submitLabel: string;
  siteKeyErrorMessage: string;
}

export interface LoginPage {
  meta: MetaContent;
  intro: LoginIntroContent;
  form: LoginFormContent;
}

export const loginPage: LoginPage = {
  meta: {
    title: 'Disney Trip Login',
    description: 'Enter the shared site key to access the private Disney trip planning site.',
  },
  intro: {
    eyebrow: 'Private trip planner',
    title: 'Enter the shared site key.',
    quip: 'This unlocks the trip archive, ride priorities, schedule, and traveler notes.',
  },
  form: {
    siteKeyLabel: 'Site key',
    siteKeyPlaceholder: 'Shared site key',
    submitLabel: 'Open planner',
    siteKeyErrorMessage: 'That site key did not match. Check the shared key and try again.',
  },
};
