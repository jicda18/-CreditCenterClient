// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from 'src/app/models/environment.model';

export const environment: Environment = {
  production: false,
  api: 'http://creditcenter.cruz/',
  client: 1,
  secret: 'tJW274xXDKrkrmiNuu33MOboJq2OYSg8FQx40Syo',
  grant: 'password',
  version: '0.3.0',
  name: 'Credit Center',
  biweekly: '65548c5c-698c-4877-8e1c-89e6d9ef9132',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
