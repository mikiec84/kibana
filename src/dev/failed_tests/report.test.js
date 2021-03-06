/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/* eslint-disable max-len */

import { resolve } from 'path';

import vfs from 'vinyl-fs';

import { mapXml, filterFailures } from './report';
import { createPromiseFromStreams } from '../../legacy/utils/streams/promise_from_streams';
import { createConcatStream } from '../../legacy/utils/streams/concat_stream';

console.log = jest.fn();
afterEach(() => jest.resetAllMocks());

describe('irrelevant failure filtering', () => {
  describe('jest report', () => {
    it('allows relevant tests', async () => {
      const failures = await createPromiseFromStreams([
        vfs.src([resolve(__dirname, '__fixtures__/jest_report.xml')]),
        mapXml(),
        filterFailures(),
        createConcatStream(),
      ]);

      expect(console.log.mock.calls).toMatchInlineSnapshot(`
Array [
  Array [
    "Found 1 test failures",
  ],
]
`);
      expect(failures).toMatchInlineSnapshot(`
Array [
  Object {
    "classname": "X-Pack Jest Tests.x-pack/plugins/code/server/lsp",
    "failure": "
        TypeError: Cannot read property '0' of undefined
    at Object.<anonymous>.test (/var/lib/jenkins/workspace/elastic+kibana+master/JOB/x-pack-intake/node/immutable/kibana/x-pack/plugins/code/server/lsp/abstract_launcher.test.ts:166:10)
      ",
    "name": "launcher can reconnect if process died",
    "time": "7.060",
  },
]
`);
    });
  });

  describe('ftr report', () => {
    it('allows relevant tests', async () => {
      const failures = await createPromiseFromStreams([
        vfs.src([resolve(__dirname, '__fixtures__/ftr_report.xml')]),
        mapXml(),
        filterFailures(),
        createConcatStream(),
      ]);

      expect(console.log.mock.calls).toMatchInlineSnapshot(`
Array [
  Array [
    "Ignoring likely irrelevant failure: Chrome X-Pack UI Functional Tests.x-pack/test/functional/apps/maps - maps app \\"after all\\" hook
    
          { NoSuchSessionError: This driver instance does not have a valid session ID (did you call WebDriver.quit()?) and may no longer be used.
      at promise.finally (/var/lib/jenkins/workspace/elastic+kibana+master/JOB/x-pack-ciGroup7/node/immutable/kibana/node_modules/selenium-webdriver/lib/webdriver.js:726:38)
      at Object.thenFinally [as finally] (/var/lib/jenkins/workspace/elastic+kibana+master/JOB/x-pack-ciGroup7/node/immutable/kibana/node_modules/selenium-webdriver/lib/promise.js:124:12)
      at process._tickCallback (internal/process/next_tick.js:68:7) name: 'NoSuchSessionError', remoteStacktrace: '' }
        ",
  ],
  Array [
    "Found 1 test failures",
  ],
]
`);
      expect(failures).toMatchInlineSnapshot(`
Array [
  Object {
    "classname": "Chrome X-Pack UI Functional Tests.x-pack/test/functional/apps/maps/sample_data·js",
    "failure": "
        Error: retry.try timeout: TimeoutError: Waiting for element to be located By(css selector, [data-test-subj~=\\"layerTocActionsPanelToggleButtonRoad_Map_-_Bright\\"])
Wait timed out after 10055ms
    at /var/lib/jenkins/workspace/elastic+kibana+master/JOB/x-pack-ciGroup7/node/immutable/kibana/node_modules/selenium-webdriver/lib/webdriver.js:834:17
    at process._tickCallback (internal/process/next_tick.js:68:7)
    at lastError (/var/lib/jenkins/workspace/elastic+kibana+master/JOB/x-pack-ciGroup7/node/immutable/kibana/test/common/services/retry/retry_for_success.ts:28:9)
    at onFailure (/var/lib/jenkins/workspace/elastic+kibana+master/JOB/x-pack-ciGroup7/node/immutable/kibana/test/common/services/retry/retry_for_success.ts:68:13)
      ",
    "name": "maps app  maps loaded from sample data ecommerce \\"before all\\" hook",
    "time": "154.378",
  },
]
`);
    });
  });

  describe('mocha report', () => {
    it('allows relevant tests', async () => {
      const failures = await createPromiseFromStreams([
        vfs.src([resolve(__dirname, '__fixtures__/mocha_report.xml')]),
        mapXml(),
        filterFailures(),
        createConcatStream(),
      ]);

      expect(console.log.mock.calls).toMatchInlineSnapshot(`
Array [
  Array [
    "Ignoring likely irrelevant failure: X-Pack Mocha Tests.x-pack/plugins/code/server/__tests__/multi_node·ts - code in multiple nodes \\"before all\\" hook
    
          Error: Unable to read artifact info from https://artifacts-api.elastic.co/v1/versions/8.0.0-SNAPSHOT/builds/latest/projects/elasticsearch: Service Temporarily Unavailable
    <html>
  <head><title>503 Service Temporarily Unavailable</title></head>
  <body bgcolor=\\"white\\">
  <center><h1>503 Service Temporarily Unavailable</h1></center>
  <hr><center>nginx/1.13.7</center>
  </body>
  </html>
  
      at Function.getSnapshot (/var/lib/jenkins/workspace/elastic+kibana+master/JOB/x-pack-intake/node/immutable/kibana/packages/kbn-es/src/artifact.js:95:13)
      at process._tickCallback (internal/process/next_tick.js:68:7)
        ",
  ],
  Array [
    "Ignoring likely irrelevant failure: X-Pack Mocha Tests.x-pack/plugins/code/server/__tests__/multi_node·ts - code in multiple nodes \\"after all\\" hook
    
          TypeError: Cannot read property 'shutdown' of undefined
      at Context.shutdown (plugins/code/server/__tests__/multi_node.ts:125:23)
      at process.topLevelDomainCallback (domain.js:120:23)
        ",
  ],
  Array [
    "Found 0 test failures",
  ],
]
`);
      expect(failures).toMatchInlineSnapshot(`Array []`);
    });
  });
});
