'use strict';

const {
  resolvers,
  resolversConfig,
  typeDefs,
} = require("./heiexperts/graphql");
const { HeiExperts } = require("./heiexperts");

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    const apiHelper = new HeiExperts(strapi);

    const extension = () => ({
      typeDefs,
      resolversConfig,
      resolvers: resolvers(apiHelper),
    });

    strapi.plugin("graphql").service("extension").use(extension);
  },


  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/*{ strapi }*/) {},
};
