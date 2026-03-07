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
    eyebrow: 'Site key required',
    title: 'One site key opens the whole trip site.',
    quip: "No site key, no pixie dust. Even Mickey can't magic this gate open.",
  },
  form: {
    siteKeyLabel: 'Site key',
    siteKeyPlaceholder: 'Enter site key',
    submitLabel: 'Enter site',
    siteKeyErrorMessage: 'That site key did not match. Try again.',
  },
};
