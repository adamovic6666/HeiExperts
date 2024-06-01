'use strict';

/**
 * last-sent-mail service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::last-sent-mail.last-sent-mail');
