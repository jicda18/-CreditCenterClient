// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from 'src/app/models/environment.model';

export const environment: Environment = {
  production: false,
  api: 'http://creditcenter.cruz/',
  client: 1,
  secret: '92jHl8RbHeQ6ncJPV97IDQSwgHKLq1hOAXfq6iUx',
  grant: 'password',
  version: '0.2.0',
  name: 'Credit Center',
  biweekly: 'ca559255-1848-407d-9144-8e249441a855',
};

// export const environment: Environment = {
//   production: true,
//   api: 'https://api.credit-center.net/',
//   client: 1,
//   secret: '64QbYrwXz1Gp912BF6Zf8zOxetXdlboBYdJJrLCG',
//   grant: 'password',
//   version: '0.2.0-alfa',
//   name: 'Credit Center',
//   biweekly: '9b23d87f-fa16-4f8a-a475-404c51ded61b',
// };

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
