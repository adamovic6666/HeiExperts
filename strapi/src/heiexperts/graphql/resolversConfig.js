const { API_ACCESS } = require("../constants");

const resolversConfig = {
  "Query.experts": {
    auth: {
      scope: [API_ACCESS.USER_FIND],
    },
  },
  "Query.languages": {
    auth: {
      scope: [API_ACCESS.LANGUAGE_FIND],
    },
  },
  "Query.tags": {
    auth: {
      scope: [API_ACCESS.TAG_FIND],
    },
  },
  "Query.categoryItems": {
    auth: {
      scope: [API_ACCESS.CATEGORY_ITEM_FIND],
    },
  },
  "Query.categories": {
    auth: {
      scope: [API_ACCESS.CATEGORY_ITEM_FIND],
    },
  },
  "Query.expert": {
    auth: {
      scope: [API_ACCESS.USER_FINDONE],
    },
  },
  "Query.userExist": {
    auth: {
      scope: [API_ACCESS.USER_FINDONE],
    },
  },
  "Query.frontPage": {
    auth: {
      scope: [API_ACCESS.FRONT_PAGE_FIND],
    },
  },
  "Query.easyLanguage": {
    auth: {
      scope: [API_ACCESS.EASY_LANGUAGE_FIND],
    },
  },
  "Query.faq": {
    auth: {
      scope: [API_ACCESS.FAQ_FIND],
    },
  },
  "Query.dataProtection": {
    auth: {
      scope: [API_ACCESS.DATA_PROTECTION_FIND],
    },
  },
  "Query.imprint": {
    auth: {
      scope: [API_ACCESS.IMPRINT_FIND],
    },
  },
  "Query.dataProtectionModal": {
    auth: {
      scope: [API_ACCESS.DATA_PROTECTION_MODAL_FIND],
    },
  },
  "Query.socialIcons": {
    auth: {
      scope: [API_ACCESS.SOCIAL_ICONS_FIND],
    },
  },
  "Query.researchModal": {
    auth: {
      scope: [API_ACCESS.RESEARCH_MODAL_FIND],
    },
  },
  "Mutation.updateUser": {
    auth: {
      scope: [API_ACCESS.USER_UPDATE],
    },
  },
  "Mutation.createTranslatableField": {
    auth: {
      scope: [API_ACCESS.TRANSLATE_USER_FILED_CREATE],
    },
  },
};

module.exports = {
  resolversConfig,
};
