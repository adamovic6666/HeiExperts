const { UID } = require("../../heiexperts/constants");
const { POPULATION } = require("../../heiexperts/graphql/populate");
const user = require("./content-types/user");
const crypto = require("crypto");

const utils = require("@strapi/utils");
const { getService } = require("@strapi/plugin-users-permissions/server/utils");

const _ = require("lodash");
const {
  validateCallbackBody,
  validateRegisterBody,
  validateForgotPasswordBody,
  validateResetPasswordBody,
} = require("@strapi/plugin-users-permissions/server/controllers/validation/auth");
const emailRegExp =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const { getAbsoluteAdminUrl, getAbsoluteServerUrl, sanitize } = utils;
const { ApplicationError, ValidationError } = utils.errors;

const sanitizeUser = (user, ctx) => {
  const { auth } = ctx.state;
  const userSchema = strapi.getModel(UID.USER);

  return sanitize.contentAPI.output(user, userSchema, { auth });
};

module.exports = (plugin) => {
  // ------------------------- REGISTER -------------------------
  plugin.controllers.auth.register = async (ctx) => {
    const pluginStore = await strapi.store({
      type: "plugin",
      name: "users-permissions",
    });

    const settings = await pluginStore.get({ key: "advanced" });

    if (!settings.allow_register) {
      throw new ApplicationError("Register action is currently disabled");
    }

    const params = {
      ..._.omit(ctx.request.body, [
        "confirmed",
        "blocked",
        "confirmationToken",
        "resetPasswordToken",
        "provider",
        "id",
        "createdAt",
        "updatedAt",
        "createdBy",
        "updatedBy",
      ]),
      provider: "local",
    };

    await validateRegisterBody(params);

    let giveRole = Number(params.role) === 3 ? "expert" : "authenticated";
    const role = await strapi
      .query("plugin::users-permissions.role")
      .findOne({ where: { type: giveRole } });
    if (!role) {
      throw new ApplicationError("Impossible to find the default role");
    }

    const { email, username, provider } = params;

    const identifierFilter = {
      $or: [
        { email: email.toLowerCase() },
        { username: email.toLowerCase() },
        { username },
        { email: username },
      ],
    };

    const conflictingUserCount = await strapi
      .query("plugin::users-permissions.user")
      .count({
        where: { ...identifierFilter, provider },
      });

    if (conflictingUserCount > 0) {
      throw new ApplicationError("Email is already taken");
    }

    if (settings.unique_email) {
      const conflictingUserCount = await strapi
        .query("plugin::users-permissions.user")
        .count({
          where: { ...identifierFilter },
        });

      if (conflictingUserCount > 0) {
        throw new ApplicationError("Email is already taken");
      }
    }

    const newUser = {
      ...params,
      role: role.id,
      email: email.toLowerCase(),
      username,
      confirmed: !settings.email_confirmation,
    };

    const user = await getService("user").add(newUser);

    const sanitizedUser = await sanitizeUser(user, ctx);

    if (settings.email_confirmation) {
      try {
        await getService("user").sendConfirmationEmail(sanitizedUser);
      } catch (err) {
        throw new ApplicationError(err.message);
      }

      return ctx.send({ user: sanitizedUser });
    }

    const jwt = getService("jwt").issue(_.pick(user, ["id"]));

    return ctx.send({
      jwt,
      user: sanitizedUser,
    });
  };

  // for lifecycle
  plugin.contentTypes.user = user;

  // ------------------------- LOGIN -------------------------
  plugin.controllers.auth.callback = async (ctx) => {
    const provider = ctx.params.provider || "local";
    const params = ctx.request.body;

    const store = strapi.store({ type: "plugin", name: "users-permissions" });

    if (provider === "local") {
      if (!_.get(await store.get({ key: "grant" }), "email.enabled")) {
        throw new ApplicationError("This provider is disabled");
      }

      await validateCallbackBody(params);

      const query = { provider };

      // Check if the provided identifier is an email or not.
      const isEmail = emailRegExp.test(params.identifier);

      // Set the identifier to the appropriate query field.
      if (isEmail) {
        query.email = params.identifier.toLowerCase();
      } else {
        query.username = params.identifier;
      }

      // Check if the user exists.
      const user = await strapi
        .query(UID.USER)
        .findOne({ where: query, populate: [...POPULATION[UID.USER], "role"] });

      if (!user) {
        throw new ValidationError("Invalid identifier or password");
      }

      if (
        _.get(await store.get({ key: "advanced" }), "email_confirmation") &&
        user.confirmed !== true
      ) {
        throw new ApplicationError("Your account email is not confirmed");
      }

      if (user.blocked === true) {
        throw new ApplicationError(
          "Your account has been blocked by an administrator"
        );
      }

      // The user never authenticated with the `local` provider.
      if (!user.password) {
        throw new ApplicationError("Invalid identifier or password");
      }

      const validPassword = await getService("user").validatePassword(
        params.password,
        user.password
      );

      if (!validPassword) {
        throw new ValidationError("Invalid identifier or password");
      } else {
        const sanitizedUser = await sanitizeUser(user, ctx);
        sanitizedUser.role = user.role;

        const gender = user.gender === "Female";

        // first time login
        if (user.firstTimeLogin)
          if (gender) {
            // female
            let lastMail;
            // get last email id from database
            try {
              lastMail = await strapi.query(UID.LAST_SENT_MAIL).findOne({
                field: ["lastId"],
              });
            } catch (error) {
              strapi.log.debug("📺: ", err);
            }
            // send mail
            //console.log("lastId", lastMail);
            try {
              await strapi
                .plugin("email-designer")
                .service("email")
                .sendTemplatedEmail(
                  {
                    // required
                    to: user.email,
                  },
                  {
                    // required - Ref ID defined in the template designer (won't change on import)
                    templateReferenceId: lastMail.lastId === 1 ? 2 : 1,
                    // If provided here will override the template's subject.
                    // Can include variables like `Thank you for your order {{= USER.firstName }}!`
                    // subject: `Thank you for your order {{= USER.firstName }}!`,
                  }
                );

              try {
                let response = await strapi.query(UID.LAST_SENT_MAIL).update({
                  where: { id: 1 },
                  data: { lastId: lastMail.lastId === 1 ? 2 : 1 },
                });

                await strapi.query(UID.USER).update({
                  where: { id: user.id },
                  data: { firstTimeLogin: false },
                });
              } catch (error) {
                strapi.log.debug("📺: ", error);
              }
            } catch (err) {
              strapi.log.debug("📺: ", err);
              return ctx.badRequest(null, err);
            }
          } else {
            // it is male or others
            try {
              await strapi
                .plugin("email-designer")
                .service("email")
                .sendTemplatedEmail(
                  {
                    // required
                    to: user.email,
                  },
                  {
                    // required - Ref ID defined in the template designer (won't change on import)
                    templateReferenceId: 3,
                    // If provided here will override the template's subject.
                    // Can include variables like `Thank you for your order {{= USER.firstName }}!`
                    // subject: `Thank you for your order {{= USER.firstName }}!`,
                  }
                );

              try {
                await strapi.query(UID.USER).update({
                  where: { id: user.id },
                  data: { firstTimeLogin: false },
                });
              } catch (error) {
                strapi.log.debug("📺: ", error);
              }
            } catch (err) {
              strapi.log.debug("📺: ", err);
              return ctx.badRequest(null, err);
            }
          }

        ctx.send({
          jwt: getService("jwt").issue({
            id: user.id,
          }),
          user: sanitizedUser,
        });
      }
    } else {
      if (!_.get(await store.get({ key: "grant" }), [provider, "enabled"])) {
        throw new ApplicationError("This provider is disabled");
      }

      // Connect the user with the third-party provider.
      try {
        const user = await getService("providers").connect(provider, ctx.query);
        ctx.send({
          jwt: getService("jwt").issue({ id: user.id }),
          user: await sanitizeUser(user, ctx),
        });
      } catch (error) {
        throw new ApplicationError(error.message);
      }
    }
  };

  // ------------------------- FORGOT-PASSWORD -------------------------
  plugin.controllers.auth.forgotPassword = async (ctx) => {
    const { email } = await validateForgotPasswordBody(ctx.request.body);

    const pluginStore = await strapi.store({
      type: "plugin",
      name: "users-permissions",
    });

    const emailSettings = await pluginStore.get({ key: "email" });
    const advancedSettings = await pluginStore.get({ key: "advanced" });

    // Find the user by email.
    const user = await strapi
      .query("plugin::users-permissions.user")
      .findOne({ where: { email: email.toLowerCase() } });

    if (!user || user.blocked) {
      return ctx.send({ ok: true });
    }

    // Generate random token.
    const userInfo = await sanitizeUser(user, ctx);

    const resetPasswordToken = crypto.randomBytes(64).toString("hex");
    const currentDateTime = new Date().toISOString();

    // Encrypt the current date
    const cipher = crypto.createCipher("aes-256-cbc", "encryptionKey");
    let encryptedDateTime = cipher.update(currentDateTime, "utf8", "hex");
    encryptedDateTime += cipher.final("hex");

    const resetPasswordSettings = _.get(
      emailSettings,
      "reset_password.options",
      {}
    );
    const emailBody = await getService("users-permissions").template(
      resetPasswordSettings.message,
      {
        URL: advancedSettings.email_reset_password,
        SERVER_URL: getAbsoluteServerUrl(strapi.config),
        ADMIN_URL: getAbsoluteAdminUrl(strapi.config),
        USER: userInfo,
        TOKEN: resetPasswordToken + "__hei__" + encryptedDateTime,
      }
    );

    const emailObject = await getService("users-permissions").template(
      resetPasswordSettings.object,
      {
        USER: userInfo,
      }
    );

    const emailToSend = {
      to: user.email,
      from:
        resetPasswordSettings.from.email || resetPasswordSettings.from.name
          ? `${resetPasswordSettings.from.name} <${resetPasswordSettings.from.email}>`
          : undefined,
      replyTo: resetPasswordSettings.response_email,
      subject: emailObject,
      text: emailBody,
      html: emailBody,
    };

    // NOTE: Update the user before sending the email so an Admin can generate the link if the email fails
    await getService("user").edit(user.id, {
      resetPasswordToken: resetPasswordToken + "__hei__" + encryptedDateTime,
    });

    // Send an email to the user.
    await strapi.plugin("email").service("email").send(emailToSend);

    ctx.send({ ok: true });
  };

  // ------------------------- RESET-PASSWORD -------------------------
  plugin.controllers.auth.resetPassword = async (ctx) => {
    const { password, passwordConfirmation, code } =
      await validateResetPasswordBody(ctx.request.body);

    if (password !== passwordConfirmation) {
      throw new ValidationError("Passwords do not match");
    }

    const user = await strapi
      .query("plugin::users-permissions.user")
      .findOne({ where: { resetPasswordToken: code } });

    if (!user) {
      throw new ValidationError("Incorrect code provided");
    }

    let [partOne, encDateTime] = code.split("__hei__");
    // Decrypt the encrypted date-time
    const decipher = crypto.createDecipher("aes-256-cbc", "encryptionKey");
    let decryptedDateTime = decipher.update(encDateTime, "hex", "utf8");
    decryptedDateTime += decipher.final("utf8");
    let codeDateTimeObject = new Date(decryptedDateTime);
    let currentDateTime = new Date();

    const timeDifferenceInMs = currentDateTime - codeDateTimeObject;
    const timeDifferenceInHours = timeDifferenceInMs / (1000 * 60 * 60);

    if (timeDifferenceInHours > 1) {
      throw new ValidationError("Code Expired");
    }

    await getService("user").edit(user.id, {
      resetPasswordToken: null,
      password,
    });

    // Update the user.
    ctx.send({
      jwt: getService("jwt").issue({ id: user.id }),
      user: await sanitizeUser(user, ctx),
    });
  };

  return plugin;
};
