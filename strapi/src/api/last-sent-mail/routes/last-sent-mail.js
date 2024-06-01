'use strict';

/**
 * last-sent-mail router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::last-sent-mail.last-sent-mail');
