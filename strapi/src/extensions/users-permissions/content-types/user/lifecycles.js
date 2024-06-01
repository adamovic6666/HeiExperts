const { UID } = require("../../../../heiexperts/constants");
const { HeiExperts } = require("../../../../heiexperts");

module.exports = {
  async beforeCreate(event) {
    if (event.params.data.firstName && event.params.data.lastName) {
      let username =
        event.params.data.firstName + " " + event.params.data.lastName;
      event.params.data.slug = await strapi
        .plugin("content-manager")
        .service("uid")
        .generateUIDField({
          contentTypeUID: UID.USER,
          field: "slug",
          data: { username },
        });
      event.params.data.fullName = username.toLowerCase();
    }
  },
  async afterCreate(event) {
    const dummyDataEN = {
      user: event.result.id,
      experties: "",
      education: "",
      network: "",
      skills: "",
      approachableFor: "",
      locale: "en",
    };
    const dummyDataDE = {
      user: event.result.id,
      experties: "",
      education: "",
      network: "",
      skills: "",
      approachableFor: "",
      locale: "de",
    };
    let prevodiEN = await strapi.entityService.create(
      "api::translatable-user-field.translatable-user-field",
      {
        data: dummyDataEN,
      }
    );
    let prevodiDE = await strapi.entityService.create(
      "api::translatable-user-field.translatable-user-field",
      {
        data: dummyDataDE,
      }
    );
  },
  // async beforeUpdate(event) {
  //   const apiHelper = new HeiExperts(strapi);
  //   const { id } = event.params.where;
  //   if (event?.params?.data?.firstName || event?.params?.data?.lastName) {
  //     const user = await apiHelper.getEntityById({ uid: UID.USER, id });
  //     let fn = event?.params?.data?.firstName || user.firstName;
  //     let ln = event?.params?.data?.lastName || user.lastName;
  //     if (fn && ln) {
  //       let username = fn + " " + ln;
  //       event.params.data.fullName = username;
  //       event.params.data.slug = await strapi
  //         .plugin("content-manager")
  //         .service("uid")
  //         .generateUIDField({
  //           contentTypeUID: UID.USER,
  //           field: "slug",
  //           data: { username },
  //         });
  //     }
  //   }
  // },
};
