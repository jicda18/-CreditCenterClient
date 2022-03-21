// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from 'src/app/models/environment.model';

export const environment: Environment = {
  production: false,
  api: 'http://creditcenter.cruz/',
  client: 1,
  secret: 'nyn92mR6Evq4SAMjHBGGrj0iMbQIpWiMfBYUEkM9',
  grant: 'password',
  version: '0.5.1',
  name: 'Credit Center',
  biweekly: '4fb798e1-f976-46b7-ac31-9916b680f5dd',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
