'use strict';

/**
 * import-expert service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::import-expert.import-expert');
