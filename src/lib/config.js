/**
 * config.js
 * Central configuration for the uninstall feedback experience.
 * Adjust variant, copy, and reasons to match your product.
 */

// â”€â”€â”€ Variant System â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// 'professional' | 'emotional' | 'minimal'
export const VARIANT = 'professional';

// â”€â”€â”€ Product Branding â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const PRODUCT = {
  name: 'Acme',
  logoEmoji: 'âš¡',
  supportEmail: 'support@acme.com',
  homepageUrl: 'https://acme.com',
};

// â”€â”€â”€ Feedback Reasons â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const FEEDBACK_REASONS = [
  {
    id: 'missing_features',
    label: "It's missing features I need",
    description: 'The product doesn\'t do what I was hoping for',
  },
  {
    id: 'too_complex',
    label: "It's too complex or hard to use",
    description: 'The learning curve felt steeper than expected',
  },
  {
    id: 'too_expensive',
    label: "It's too expensive for my budget",
    description: 'The pricing doesn\'t match the value I\'m getting',
  },
  {
    id: 'found_alternative',
    label: 'I found a better alternative',
    description: 'Another tool fits my workflow better',
  },
  {
    id: 'not_using_enough',
    label: "I'm not using it enough to justify it",
    description: 'Great product, just not the right time for me',
  },
  {
    id: 'other',
    label: 'Something else',
    description: 'Tell us in your own words',
    isOther: true,
  },
];

// â”€â”€â”€ Copy Variants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const COPY = {
  professional: {
    eyebrow: 'Account Cancelled',
    headline: 'Before you go,\nhelp us improve.',
    subheadline:
      'Your account has been deactivated. We\'d genuinely appreciate a moment of your time â€” this goes straight to our product team.',
    sectionLabel: 'What was the primary reason for leaving?',
    submitLabel: 'Submit Feedback',
    submitLoadingLabel: 'Sendingâ€¦',
    otherPlaceholder: 'Tell us what happened. We read every response (seriously).',
    microcopy: 'We promise we\'ll take this seriously ðŸ™‚',
    successHeadline: 'Thank you, truly.',
    successBody:
      'Your feedback has been received and will be reviewed by our product team. We\'re sorry to see you go â€” and we hope to see you again someday.',
    successCta: 'Visit our homepage',
  },
  emotional: {
    eyebrow: 'Goodbye for now',
    headline: 'We\'re sad to\nsee you go.',
    subheadline:
      'It means a lot that you gave us a shot. If there\'s something we could have done better, we\'d love to know.',
    sectionLabel: 'What was the main reason you decided to leave?',
    submitLabel: 'Send My Feedback',
    submitLoadingLabel: 'Sendingâ€¦',
    otherPlaceholder: 'Your words matter to us. Share whatever\'s on your mind.',
    microcopy: 'Every response is read by a real human on our team.',
    successHeadline: 'You made our day a little better.',
    successBody:
      'Thank you for taking a moment to share your thoughts. We\'ll use this to improve for the people who come next.',
    successCta: 'Visit our homepage',
  },
  minimal: {
    eyebrow: 'Uninstall Complete',
    headline: 'Quick feedback?',
    subheadline: 'Optional. One question. Takes 20 seconds.',
    sectionLabel: 'Why did you uninstall?',
    submitLabel: 'Submit',
    submitLoadingLabel: 'â€¦',
    otherPlaceholder: 'Type here.',
    microcopy: '',
    successHeadline: 'Got it. Thanks.',
    successBody: 'Your response has been logged.',
    successCta: 'Back to homepage',
  },
};

// â”€â”€â”€ API Endpoints â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const API = {
  saveEmail: '/api/save-email',
  updateFeedback: '/api/update-feedback',
};
