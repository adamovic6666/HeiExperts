const { UID } = require("./constants");
const { POPULATION } = require("./graphql/populate");
const axios = require("axios");
const { ApolloError } = require("apollo-server-errors");

const ErrorResponse = ({ details, message }) => {
  let messages;

  if (details?.errors) {
    messages = details?.errors.map(({ message }) => message) ?? message;
  }

  throw new ApolloError(message, null, { messages });
};

class HeiExperts {
  #strapi;

  constructor(strapi) {
    this.#strapi = strapi;
  }

  async getEntityById({
    id,
    uid,
    populate = POPULATION[uid] ?? [],
    fields = "*",
  }) {
    return await this.#strapi.entityService.findOne(uid, id, {
      fields,
      populate,
    });
  }

  async countEntities({ uid, filters = {} }) {
    return await this.#strapi.db.query(uid).count({ where: { ...filters } });
  }

  async getEntities(
    {
      uid,
      pagination = {},
      filters = {},
      sort = {},
      fields = "*",
      populate = POPULATION[uid] ?? [],
    },
    locale = "en"
  ) {
    return await this.#strapi.entityService.findMany(uid, {
      populate,
      filters,
      ...pagination,
      locale,
      fields,
      sort,
    });
  }

  async updateEntity(
    { id, data, uid, populate = POPULATION[uid] ?? [] },
    locale = "de"
  ) {
    return await this.#strapi.entityService
      .update(uid, id, { locale, data, populate })
      .catch(({ details }) =>
        ErrorResponse({ details, message: "Entity update failed!" })
      );
  }

  async createEntity({ data, uid }) {
    return await this.#strapi.entityService
      .create(uid, {
        data,
        populate: POPULATION[uid],
      })
      .catch(({ details }) =>
        ErrorResponse({ details, message: "Entity creation failed!" })
      );
  }

  async deleteEntity({ id, uid }) {
    return await this.#strapi.entityService.delete(uid, id);
  }
}

const triggerConfigInvalidate = async () => {
  const url = new URL(process.env.APP_URL);

  url.pathname = "/api/config-invalidate";

  await axios.get(url.toString());
};

module.exports = {
  HeiExperts,
  triggerConfigInvalidate,
};
