import MenuLogo from './extensions/logo.png';
import favicon from './extensions/favicon.png';

export default {
  config: {
    // Replace the Strapi logo in auth (login) views
    auth: {
      logo: MenuLogo,
    },
    // Replace the favicon
    head: {
      favicon: favicon,
    },
    // Add a new locale, other than 'en'
    locales: [
      'pt-BR',
    ],
    menu: {
      logo: MenuLogo,
    },
    // Override or extend the theme
    theme: {
      colors: {
        primary200: '#e784bd',
        primary500: '#dd0075',
        primary600: '#cc0071',
        primary700: '#b6006a',
        danger700: '#de1226'
      },
    },
  },
  bootstrap(app) {
    console.log(app);
  },
};
