// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from 'src/app/models/environment.model';

// export const environment: Environment = {
//   production: false,
//   api: 'http://creditcenter.cruz/',
//   client: 1,
//   secret: 'EEQ1x6qUcYKcIBapl7XECj9TsNSr3Dvy6pZt2dCwCdeJHmuiBrXgIumjCgOgrrDf',
//   grant: 'password',
//   version: '0.1.0',
//   company: '0fc7a51e-3227-4ab0-ac25-647dc3f8f163',
//   name: 'Credit Center',
//   biweekly: 'd3fc52de-0688-4eac-8eab-9cdeff6a8764',
// };

export const environment: Environment = {
  production: true,
  api: 'https://api.credit-center.net/',
  client: 1,
  secret: 's1MA2b2bOhd0TBjBipo6QvsFU6rnsBr1Pb6J5WFznbcffhGfyUpq6LWhruBZDuH2',
  grant: 'password',
  version: '0.1.0',
  company: '9de94eeb-df56-4d85-b7e8-895eb65c022f',
  name: 'Credit Center',
  biweekly: 'aae6f1b1-d5c3-4559-9aeb-25c7d4dfe1e5',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
