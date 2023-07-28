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
# Server

# Mongodb url
MONGO_URL = ''
# Url for default profile picture
DEFAULT_PROFILE_AVATAR_URL = 'defaultprofileavatarurl'

# S3 Bucket access key
AWS_KEY = ''
# S3 Bucket secret access key
AWS_SECRET_KEY = ''
# S3 Bucket region
AWS_REGION = 'eu-central-2'
# S3 Bucket url. Example below is for when your bucket region is set in eu-central-2
S3_BUCKET_URL = 'https://s3.eu-central-2.wasabisys.com'
# S3 Bucket name
S3_BUCKET_NAME = 'heimdall-osiris'
# Used when creating bucket urls. Either cdn / wasabi ex: https://s3.eu-central-2.wasabisys.com/[BUCKET NAME]/
S3_BUCKET_ENDPOINT = 'https://s3.eu-central-2.wasabisys.com/heimdall-osiris/'
# Resolutions ex 1080x1920. Separated by a space
COMPRESSION_TYPES = '1080x1920'

# Client

# Firebase api key
FIREBASE_API_KEY = ''
# Firebase Auth domain (Url shown when signing in with google ect)
FIREBASE_AUTH_DOMAIN = 'heimdall-lavish.firebaseapp.com'
# Firebase project Id
FIREBASE_PROJECT_ID = 'heimdall-lavish'

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
```ts
// Text message:
  export interface Alert {
    type: 'error' | 'success' | 'warning' | 'info';
    icon: Your icon;
    message: 'Your message'
  }

// Button with a function callback:
  export interface Alert {
    type: 'error' | 'success' | 'warning' | 'info',
    icon: Your icon,
    message: {
      prepend: 'Text before button',
      button:{
          type: 'button-callback',
          to: Your Function,
          text: Button text,
        }
      append: 'Text after button',
    },
  }

// Button with href:
  export interface Alert {
    type: 'error' | 'success' | 'warning' | 'info',
    icon: Your icon,
    message: {
      prepend: 'Text before button',
      button:{
          type: 'button-link',
          to: Your href,
          text: Button text,
        }
      append: 'Text after button',
    },
  }

// Underlined text with title:
  export interface Alert {
    type: 'error' | 'success' | 'warning' | 'info',
    icon: Your icon,
    message: {
      prepend: 'Text before button',
      button:{
        type: 'button-title';
        title: Your title,
        text: Button text;
      };
      append: 'Text after button',
    },
  }
```

### Error handling
```ts
  export interface Throw_Error {
    message: Error message,
  // section/error
  // example: auth/user_db-fetch-failed
    code: Error code,
  // 1: Sent to sentry + console.error and alert
  // 2: console.error and alert
  // 3: console.warning and alert
  // 4: console.warning
    severity: 1 | 2 | 3 | 4,
    type: 'client' | 'server',
    server_error?: Error from server,
  }
```

### Typescript
 - When adding new Composables typescript will sometimes mark these as "Cannot find name" and try and import it. This will create a Nuxt 3 error. Make sure there isnt a composable import and then clear TS cache by pressing opening the command palette and searching for "Reload Project". If this command doesnt exist make sure you have the Volar extension installed
