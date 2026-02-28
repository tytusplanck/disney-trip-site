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
  passwordLabel: string;
  passwordPlaceholder: string;
  submitLabel: string;
  errorMessage: string;
}

export interface LoginPage {
  meta: MetaContent;
  intro: LoginIntroContent;
  form: LoginFormContent;
}

export const loginPage: LoginPage = {
  meta: {
    title: 'Disney Trip Login',
    description: 'Enter the shared password to access the private Disney trip planning site.',
  },
  intro: {
    eyebrow: 'Password required',
    title: 'One password opens the whole trip site.',
    quip: "No password, no pixie dust. Even Mickey can't magic this gate open.",
  },
  form: {
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter password',
    submitLabel: 'Enter site',
    errorMessage: 'That password did not match. Try again.',
  },
};
