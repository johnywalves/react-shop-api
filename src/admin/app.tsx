import MenuLogo from './extensions/logo.png'
import favicon from './extensions/favicon.png'

export default {
  config: {
    // Replace the Strapi logo in auth (login) views
    auth: {
      logo: MenuLogo
    },
    // Replace the favicon
    head: {
      favicon: favicon
    },
    // Add a new locale, other than 'en'
    locales: [],
    translations: {
      en: {
        'Auth.form.welcome.title': 'Welcome to Won Games',
        'Auth.form.welcome.subtitle': 'Log in to your account',
        'app.components.LeftMenu.navbrand.title': 'Dashboard'
      }
    },
    menu: {
      logo: MenuLogo
    },
    // Override or extend the theme
    theme: {
      light: {
        colors: {
          primary600: '#f231a5',
          primary700: '#f231a5'
        }
      },
      dark: {
        colors: {
          primary100: '#030415',
          primary600: '#f231a5',
          primary700: '#f231a5'
        }
      }
    },
    // Toggles displaying the video tutorials
    tutorials: false,
    notifications: {
      releases: false
    }
  },
  bootstrap(app) {
    console.log(app)
  }
}
