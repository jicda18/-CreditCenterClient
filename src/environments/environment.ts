// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from 'src/app/models/environment.model';

export const environment: Environment = {
  production: false,
  api: 'http://creditcenter.cruz/',
  client: 1,
  secret: 'nNxPvHKTkmyDwXwmv97UrjDpR5Mb96807UpiKbI8',
  grant: 'password',
  version: '0.1.0',
  name: 'Credit Center',
  biweekly: 'ddc4b465-d23b-438b-b778-f8dc69a6e12c',
};

// export const environment: Environment = {
//   production: true,
//   api: 'https://api.credit-center.net/',
//   client: 1,
//   secret: '7V6fC4gWb7Y9y6DZXvki2sGDJTarsRl1gR9ubQBrTHbZArhJPXNFhN9S7repNcCO',
//   grant: 'password',
//   version: '0.8.0-alfa',
//   name: 'Credit Center',
//   biweekly: 'a3980945-3ae5-4cd6-8898-5ce69f088f59',
// };

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
