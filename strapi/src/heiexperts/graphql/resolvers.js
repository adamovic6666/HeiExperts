const { HeiExperts } = require("..");
const { UID } = require("../constants");
const { POPULATION } = require("./populate");

const getPossibleFilters = (category) => {
  const filters = [];

  if (category.categoryItems) {
    category.categoryItems.forEach((item) => {
      if (item.users.length && !item.categoryItems.length) {
        filters.push(item);
      } else if (item.categoryItems.length) {
        item.categoryItems = getPossibleFilters(item);

        filters.push(item);
      }
    });

    category.categoryItems = filters;
  }

  return category;
};

/**
 * @param {HeiExperts} apiHelper
 */
const resolvers = (apiHelper) => ({
  Query: {
    categories: {
      async resolve() {
        const categories = await apiHelper.getEntities({
          uid: UID.CATEGORY,
        });

        return categories;
      },
    },
    tags: {
      async resolve() {
        const tags = await apiHelper.getEntities({
          uid: UID.TAG,
        });

        // Create an object to store unique labels
        const uniqueLabels = {};

        // Filter the data array to remove items with duplicate labels
        const filteredData = tags.filter((item) => {
          if (uniqueLabels[item.label]) {
            // Duplicate label found, discard the item
            return false;
          } else {
            // Unique label, store it in the object
            uniqueLabels[item.label] = true;
            return true;
          }
        });

        return filteredData;
      },
    },
    languages: {
      async resolve() {
        const languages = await apiHelper.getEntities({
          uid: UID.LANGUAGE,
        });

        return languages;
      },
    },
    categoryItems: {
      async resolve() {
        const categoryItems = await apiHelper.getEntities({
          uid: UID.CATEGORY_ITEM,
        });
        return categoryItems;
      },
    },
    experts: {
      async resolve(
        _,
        { search = "", pagination, filters: requestFilters = {} }
      ) {
        let searchSplit = search
          .toLowerCase()
          .split(" ")
          .filter((d) => d);

        const filters = {
          $or: [
            {
              tags: {
                label: {
                  $containsi: search,
                },
              },
            },
            {
              fullName: {
                $containsi: searchSplit,
              },
            },
            {
              firstName: {
                $containsi: search,
              },
            },
            {
              lastName: {
                $containsi: search,
              },
            },
            {
              categoryItems: {
                label: {
                  $containsi: search,
                },
              },
            },
            {
              translatableFields: {
                approachableFor: {
                  $containsi: search,
                },
              },
            },
            {
              translatableFields: {
                experties: {
                  $containsi: search,
                },
              },
            },
            {
              translatableFields: {
                education: {
                  $containsi: search,
                },
              },
            },
            {
              translatableFields: {
                skills: {
                  $containsi: search,
                },
              },
            },
            {
              translatableFields: {
                network: {
                  $containsi: search,
                },
              },
            },
          ],
          $and: [
            {
              role: 3,
            },
            requestFilters,
          ],
        };

        const experts = await apiHelper.getEntities({
          uid: UID.USER,
          pagination,
          filters,
        });

        const categoryIds = experts
          .map(({ categoryItems }) => categoryItems.map(({ id }) => id))
          .flat();

        const users = experts.map(({ id }) => id);

        const categories = await apiHelper.getEntities({
          uid: UID.CATEGORY_ITEM,
          filters: {
            $and: [
              {
                id: categoryIds,
              },
            ],
            users: {
              id: {
                $in: users,
              },
            },
          },
        });

        const filterLayout = categories.reduce((obj, { category }) => {
          if (category.id && !obj[category.id]) {
            category.categoryItems = category.categoryItems.reduce(
              (arr, item) => {
                if (!item.hasParent) {
                  const possibleFilter = getPossibleFilters(item);

                  if (possibleFilter) {
                    arr.push(possibleFilter);
                  }
                }

                return arr;
              },
              []
            );

            obj[category.id] = category;
          }

          return obj;
        }, {});

        return {
          experts,
          filters: Object.values(filterLayout),
          tags: experts.map(({ tags }) => tags).flat(),
          meta: {
            total_entries: await apiHelper.countEntities({
              uid: UID.USER,
              filters,
            }),
          },
        };
      },
    },
    expert: {
      async resolve(_, { slug }) {
        const user = await apiHelper.getEntities({
          filters: {
            slug: {
              $eqi: slug,
            },
          },
          uid: UID.USER,
        });

        if (!user[0]) return null;
        // console.log(user);
        return user[0];
      },
    },
    userExist: {
      async resolve(_, { identifier }) {
        const user = await apiHelper.getEntities({
          uid: UID.USER,
          filters: {
            $or: [
              {
                username: {
                  $eqi: identifier,
                },
              },
              {
                email: {
                  $eqi: identifier,
                },
              },
            ],
          },
        });

        // if (!user[0]) return { doesExist: false };
        // if (!user[0]) return { doesExist: false };
        // return {
        //   doesExist: true,
        //   profileType: user[0]?.role?.name,
        // };
        // console.log(user);

        if (!user[0]) return false;

        return true;
      },
    },
    frontPage: {
      async resolve(_, { locale }) {
        const frontPage = await apiHelper.getEntities(
          {
            uid: UID.FRONT_PAGE,
          },
          locale
        );
        return frontPage;
      },
    },
    easyLanguage: {
      async resolve(_, { locale }) {
        const easyLanguage = await apiHelper.getEntities(
          {
            uid: UID.EASY_LANGUAGE,
          },
          locale
        );
        return easyLanguage;
      },
    },
    faq: {
      async resolve(_, { locale }) {
        const faq = await apiHelper.getEntities(
          {
            uid: UID.FAQ,
          },
          locale
        );
        return faq;
      },
    },
    dataProtection: {
      async resolve(_, { locale }) {
        const dataProtection = await apiHelper.getEntities(
          {
            uid: UID.DATA_PROTECTION,
          },
          locale
        );
        return dataProtection;
      },
    },
    socialIcons: {
      async resolve() {
        const socialIcons = await apiHelper.getEntities({
          uid: UID.SOCIAL_ICONS,
        });
        return socialIcons;
      },
    },
    imprint: {
      async resolve(_, { locale }) {
        const imprint = await apiHelper.getEntities(
          {
            uid: UID.IMPRINT,
          },
          locale
        );
        return imprint;
      },
    },
    dataProtectionModal: {
      async resolve(_, { locale = "de" }) {
        const dataProtectionModal = await apiHelper.getEntities(
          {
            uid: UID.DATA_PROTECTION_MODAL,
          },
          locale
        );
        return dataProtectionModal;
      },
    },
    researchModal: {
      async resolve(_, { locale = "de" }) {
        const researchModal = await apiHelper.getEntities(
          {
            uid: UID.RESEARCH_MODAL,
          },
          locale
        );
        return researchModal;
      },
    },
  },
  Mutation: {
    updateUser: {
      async resolve(_, { data, id, locale }) {
        let user;
        let emailCheck;
        if (data.projects) {
          data.projects = data.projects.map((item) => ({
            ...item,
            __component: "project.project",
          }));
        }

        // get
        let userForUpdate = await apiHelper.getEntities({
          filters: {
            id: {
              $eqi: id,
            },
          },
          uid: UID.USER,
        });

        let translateEntityID =
          locale === userForUpdate[0].translatableFields[0].locale
            ? userForUpdate[0].translatableFields[0].id
            : userForUpdate[0].translatableFields[1].id;

        // resolve tags
        if (data.tags) {
          const getNewTags = async (tags) => {
            let newTags = [];
            for (let index = 0; index < tags.newTags.length; index++) {
              newTags.push(
                (
                  await apiHelper.createEntity({
                    data: { label: tags.newTags[index] },
                    uid: UID.TAG,
                  })
                ).id
              );
            }
            combinedTags = tags.oldTags.concat(newTags);
            return combinedTags;
          };
          data.tags = await getNewTags(data?.tags);
        }

        if (data.email) {
          // Does user with this email exist
          emailCheck = await apiHelper.getEntities({
            uid: UID.USER,
            filters: {
              email: data.email,
            },
          });
        }

        let translatableFields = {};
        if (data?.experties) {
          translatableFields.experties = data?.experties;
          delete data.experties;
        }
        if (data?.network) {
          translatableFields.network = data?.network;
          delete data.network;
        }
        if (data?.education) {
          translatableFields.education = data?.education;
          delete data.education;
        }
        if (data?.skills) {
          translatableFields.skills = data?.skills;
          delete data.skills;
        }
        if (data?.approachableFor) {
          translatableFields.approachableFor = data?.approachableFor;
          delete data.approachableFor;
        }

        if (translatableFields.toString() !== "{}") {
          await apiHelper.updateEntity(
            {
              data: translatableFields,
              id: translateEntityID,
              uid: UID.TRANSLATE_USER_FILED,
            },
            locale
          );
        }
        if (!emailCheck?.[0] || Number(emailCheck?.[0]?.id) === Number(id)) {
          user = await apiHelper.updateEntity({
            data,
            id: id,
            uid: UID.USER,
          });
        } else {
          return null;
        }

        return user;
      },
    },
    createTranslatableField: {
      async resolve(_, { user }) {
        const dummyDataEN = {
          user: user,
          experties: "",
          education: "",
          network: "",
          skills: "",
          approachableFor: "",
          locale: "en",
        };
        const dummyDataDE = {
          user: user,
          experties: "",
          education: "",
          network: "",
          skills: "",
          approachableFor: "",
          locale: "de",
        };
        const userDataEN = await apiHelper.createEntity({
          data: dummyDataEN,
          uid: UID.TRANSLATE_USER_FILED,
        });
        const userDataDE = await apiHelper.createEntity({
          data: dummyDataDE,
          uid: UID.TRANSLATE_USER_FILED,
        });

        return [userDataEN, userDataDE];
      },
    },
  },
});

module.exports = {
  resolvers,
};
