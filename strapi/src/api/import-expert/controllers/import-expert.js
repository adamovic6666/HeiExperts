"use strict";

/**
 * import-expert controller
 */

const axios = require("axios");

module.exports = {
  async index(ctx, next) {
    // GET DATA WITH LDAP
    // axios.get("https://dummyjson.com/products").then((response) => {
    //   console.log(response.data);
    // });

    //

    await strapi.db.query("plugin::users-permissions.user").createMany({
      data: [
        {
          username: "ABCD",
          email: "test1@test.com",
          firstName: "fName2",
          lastName: "lName2",
          gender: "Male",
        },
        {
          username: "EFGH",
          email: "test12@test.com",
          firstName: "fName1",
          lastName: "lName1",
          gender: "Male",
        },
      ],
    });
  },
};
