/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import { mirrorPluginStatus } from '../../server/lib/mirror_plugin_status';
import { fileDataVisualizerRoutes } from './server/routes/file_data_visualizer';

export const fileUpload = kibana => {
  return new kibana.Plugin({
    require: ['elasticsearch', 'xpack_main'],
    name: 'file_upload',
    id: 'file_upload',

    init(server) {
      const { xpack_main: xpackMainPlugin } = server.plugins;

      mirrorPluginStatus(xpackMainPlugin, this);
      fileDataVisualizerRoutes(server);
    }
  });
};