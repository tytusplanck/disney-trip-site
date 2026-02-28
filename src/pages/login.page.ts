interface MetaContent {
  title: string;
  description: string;
}

interface LoginDetail {
  label: string;
  value: string;
}

interface LoginIntroContent {
  eyebrow: string;
  title: string;
  lede: string;
  detail: string;
}

interface LoginSecurityContent {
  heading: string;
  intro: string;
  details: LoginDetail[];
  notes: string[];
}

interface LoginFormContent {
  eyebrow: string;
  heading: string;
  intro: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  submitLabel: string;
  hint: string;
  errorMessage: string;
}

export interface LoginPage {
  meta: MetaContent;
  intro: LoginIntroContent;
  security: LoginSecurityContent;
  form: LoginFormContent;
}

export const loginPage: LoginPage = {
  meta: {
    title: 'Disney Trip Login',
    description: 'Enter the shared password to access the private Disney trip planning site.',
  },
  intro: {
    eyebrow: 'Private entrance',
    title: 'Enter the trip site.',
    lede: 'The trip site stays sealed until the shared password is accepted.',
    detail:
      'This front page is intentionally light on specifics so trip details stay on the protected side of the auth boundary.',
  },
  security: {
    heading: 'Access overview',
    intro:
      'The login screen shows only general site information without revealing the protected itinerary itself.',
    details: [
      {
        label: 'Access model',
        value: 'Shared password plus signed session cookie',
      },
      {
        label: 'Rendering mode',
        value: 'Server-side Astro pages with protected routes',
      },
      {
        label: 'Content plan',
        value: 'Route-level TypeScript page objects',
      },
    ],
    notes: [
      'Keep personal trip details, confirmation numbers, and family notes behind the password gate.',
      'Update route-level page objects first so layout code stays focused on structure and presentation.',
      'Use class-based CSS only; avoid inline style attributes entirely.',
    ],
  },
  form: {
    eyebrow: 'Authentication',
    heading: 'Unlock the site',
    intro: 'Use the shared password to continue to the protected planning pages.',
    passwordLabel: 'Shared password',
    passwordPlaceholder: 'Enter password',
    submitLabel: 'Enter site',
    hint: 'If the password changes later, only the server environment value needs to be updated.',
    errorMessage: 'That password did not match. Try again.',
  },
};
