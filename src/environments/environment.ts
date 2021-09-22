// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from 'src/app/models/environment.model';

export const environment: Environment = {
  production: false,
  api: 'http://creditcenter.cruz/',
  client: 1,
  secret: 'EEQ1x6qUcYKcIBapl7XECj9TsNSr3Dvy6pZt2dCwCdeJHmuiBrXgIumjCgOgrrDf',
  grant: 'password',
  version: '0.1.0',
  company: '0fc7a51e-3227-4ab0-ac25-647dc3f8f163',
  name: 'Credit Center',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
