## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install
```

Create a .env file and fill it from .env.example:

```.env
MONGO_URL = ''
FIREBASE_API_KEY = ''
FIREBASE_AUTH_DOMAIN = ''
FIREBASE_PROJECT_ID = ''

DEFAULT_PROFILE_AVATAR_URL = ''
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev
```

## Documentation

### Icon library:
  - Font-Awesome:
    - [Solid icons](https://fontawesome.com/search?o=r&m=free&s=solid)
    - [Brand icons](https://fontawesome.com/search?o=r&m=free&f=brands)
  - [Material Design Icons](https://pictogrammers.com/library/mdi/)

### Alerts: 
```js
/* Text message: */
  Alert {
    type: 'error' | 'success' | 'warning' | 'info';
    icon: Your icon;
    message: 'Your message'
  }

/* Button with a function callback: */
  Alert {
    type: 'error' | 'success' | 'warning' | 'info',
    icon: Your icon,
    message: {
      prepend: 'Text before button',
      button:{
          type: 'button-link',
          to: Your href,
          text: 'Button text',
        }
      append: 'Text after button',
    },
  }

/* Button with href: */
  Alert {
    type: 'error' | 'success' | 'warning' | 'info',
    icon: Your icon,
    message: {
      prepend: 'Text before button',
      button:{
          type: 'button-link',
          to: Your Function,
          text: 'Button text',
        }
      append: 'Text after button',
    },
  }
```

### Typescript
 - When adding new Composables typescript will sometimes mark these as "Cannot find name" and try and import it. This will create a Nuxt 3 error. Make sure there isnt a composable import and then clear TS cache by pressing opening the command palette and searching for "Reload Project". If this command doesnt exist make sure you have the Volar extension installed
