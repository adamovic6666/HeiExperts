/*
 * UIDs of the APIs
 */
const UID = {
  USER: "plugin::users-permissions.user",
  CATEGORY_ITEM: "api::category-item.category-item",
  CATEGORY: "api::category.category",
  LANGUAGE: "api::language.language",
  TAG: "api::tag.tag",
  FRONT_PAGE: "api::front-page.front-page",
  EASY_LANGUAGE: "api::easy-language.easy-language",
  FAQ: "api::faq.faq",
  DATA_PROTECTION: "api::data-protection.data-protection",
  IMPRINT: "api::imprint.imprint",
  DATA_PROTECTION_MODAL: "api::data-protection-modal.data-protection-modal",
  RESEARCH_MODAL: "api::research-modal.research-modal",

  LAST_SENT_MAIL: "api::last-sent-mail.last-sent-mail",
  TRANSLATE_USER_FILED: "api::translatable-user-field.translatable-user-field",

  NAVIGATION_ADMIN: "plugin::navigation.admin",
  NAVIGATION_CLIENT: "plugin::navigation.client",

  SOCIAL_ICONS: "api::social-icon.social-icon",
};

const API_ACCESS = {
  USER_FIND: "plugin::users-permissions.user.find",
  USER_FINDONE: "plugin::users-permissions.user.findOne",
  USER_CREATE: "plugin::users-permissions.user.create",
  USER_UPDATE: "plugin::users-permissions.user.update",
  USER_DELETE: "plugin::users-permissions.user.destroy",

  FRONT_PAGE_FIND: "api::front-page.front-page.find",
  EASY_LANGUAGE_FIND: "api::easy-language.easy-language.find",
  FAQ_FIND: "api::faq.faq.find",
  DATA_PROTECTION_FIND: "api::data-protection.data-protection.find",
  IMPRINT_FIND: "api::imprint.imprint.find",

  DATA_PROTECTION_MODAL_FIND:
    "api::data-protection-modal.data-protection-modal.find",
  RESEARCH_MODAL_FIND: "api::research-modal.research-modal.find",

  CATEGORY_ITEM_FIND: "api::category-item.category-item.find",

  LANGUAGE_FIND: "api::language.language.find",

  TAG_FIND: "api::tag.tag.find",

  TRANSLATE_USER_FILED_FINDONE:
    "api::translatable-user-field.translatable-user-field.findOne",
  TRANSLATE_USER_FILED_FIND:
    "api::translatable-user-field.translatable-user-field.find",
  TRANSLATE_USER_FILED_CREATE:
    "api::translatable-user-field.translatable-user-field.create",
  TRANSLATE_USER_FILED_UPDATE:
    "api::translatable-user-field.translatable-user-field.update",
  SOCIAL_ICONS_FIND: "api::social-icon.social-icon.find",
};

module.exports = {
  UID,
  API_ACCESS,
};
