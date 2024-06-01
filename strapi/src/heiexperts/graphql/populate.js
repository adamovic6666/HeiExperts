const { UID } = require("../constants");

const USER = [
  "favorites",
  "tags",
  "connectedTo",
  "connectedTo.tags",
  "connectedTo.avatar",
  "connectedTo.categoryItems",
  "connectedTo.translatableFields",
  "categoryItems",
  "avatar",
  "favorites",
  "favorites.tags",
  "favorites.avatar",
  "favorites.categoryItems",
  "favorites.translatableFields",
  "projects",
  "languages",
  "slug",
  "role",
  "role.type",
  "translatableFields",
  "translatableFields.*",
];

const CATEGORY_ITEM = [
  "category",
  "category.categoryItems",
  "category.categoryItems.users",
  "category.categoryItems.categoryItems",
  "category.categoryItems.categoryItems.users",
  "category.categoryItems.categoryItems.categoryItems",
  "category.categoryItems.categoryItems.categoryItems.users",
  "category.categoryItems.categoryItems.categoryItems.categoryItems",
  "category.categoryItems.categoryItems.categoryItems.categoryItems.users",
];

const CATEGORIES = [
  "categoryItems",
  "categoryItems.users",
  "categoryItems.categoryItems",
  "categoryItems.categoryItems.users",
  "categoryItems.categoryItems.categoryItems",
  "categoryItems.categoryItems.categoryItems.users",
  "categoryItems.categoryItems.categoryItems.categoryItems",
  "categoryItems.categoryItems.categoryItems.categoryItems.users",
];

const FRONT_PAGE = [
  "topJoinUs",
  "topJoinUs.logo",
  "topJoinUs.registerButtons",

  "aboutUs",

  "commonGoal",
  "commonGoal.items",
  "commonGoal.items.logo",

  "bottomJoinUs",
  "bottomJoinUs.logo",
  "bottomJoinUs.registerButtons",
];

const EASY_LANGUAGE = ["body"];

const POPULATION = {
  [UID.USER]: USER,
  [UID.CATEGORY_ITEM]: CATEGORY_ITEM,
  [UID.FRONT_PAGE]: FRONT_PAGE,
  [UID.EASY_LANGUAGE]: EASY_LANGUAGE,
  [UID.CATEGORY]: CATEGORIES,
};

module.exports = {
  POPULATION,
};
