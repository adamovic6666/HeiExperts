'use strict';

/**
 * easy-language service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::easy-language.easy-language');
