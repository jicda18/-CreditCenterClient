// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from 'src/app/models/environment.model';

// export const environment: Environment = {
//   production: false,
//   api: 'http://creditcenter.cruz/',
//   client: 1,
//   secret: 'uprzthSl5DA0uC0SUzyzPMwAryo5mABudFY20r6JfI925LafzsOFd3pJve7Y9p1i',
//   grant: 'password',
//   version: '0.1.0',
//   company: '26c61870-cf8c-4729-89eb-5962228d7a90',
//   name: 'Credit Center',
//   biweekly: '342c37fe-ef2f-4094-b123-2ec8a00176af',
// };

export const environment: Environment = {
  production: true,
  api: 'https://api.credit-center.net/',
  client: 1,
  secret: '7V6fC4gWb7Y9y6DZXvki2sGDJTarsRl1gR9ubQBrTHbZArhJPXNFhN9S7repNcCO',
  grant: 'password',
  version: '0.8.0-alfa',
  company: '03155138-e07f-4f74-bb94-b59fdc696efa',
  name: 'Credit Center',
  biweekly: 'a3980945-3ae5-4cd6-8898-5ce69f088f59',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
