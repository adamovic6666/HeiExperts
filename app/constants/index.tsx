export const PROFILE_TYPES = {
  PERSONAL_DATA: "Persönliche Daten",
  SKILLS: "skills",
  TAGS: "tags",
  EXPERTISE: "experties",
  NETWORK: "network",
  EDUCATION: "education",
  PROJECTS: "forschungsprojekte und wissenstransfer",
  CONNECTED_PROFILE: "connected profile",
};

export const INPUT_TYPES = {
  TEXTAREA: "textArea",
};

export const ERRORS = {
  REQUIRED: "Dieses Feld ist erforderlich",
  TOO_LONG_ERROR: (max: number) => `Zu lang! Muss kürzer sein als ${max} Zeichen.`,
  TOO_SHORT_ERROR: (min: number) => `Zu kurz! Muss mindestens ${min} Zeichen beinhalten`,
  STRING_ERROR: "Nur Zeichenketten sind erlaubt",
  PASSWORD_CHECK_ERROR: "Passwort stimmt nicht überein",
  WEAK_PASSWORD: "Das Passwort muss mindestens eine Nummer und einen Großbuchstaben beinhalten",
  EMAIL_ERROR: "Ungültige E-Mail",
  IMAGE: "Ungültiges Bild!",
  IMAGE_FORMAT: "Ungültige Bilderweiterung!",
  IMAGE_DATA: "Ungültige Bilddaten!",
};

const strongPassRegex = /(?=.*\d)(?=.*[A-Z]).*/;

export const emailRegex =
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

export const FORM_FIELDS = {
  email: {
    name: "email",
    validate: (v: string | null | undefined) => {
      if (v === null || v === undefined) {
        return ERRORS.REQUIRED;
      }
      if (typeof v !== "string") {
        return ERRORS.STRING_ERROR;
      }
      if (!emailRegex.test(v)) {
        return ERRORS.EMAIL_ERROR;
      }
      return true;
    },
  },
  gender: {
    name: "gender",
    validate: (v: string | null | undefined) => {
      if (v === null || v === undefined) {
        return ERRORS.REQUIRED;
      }
      if (typeof v !== "string") {
        return ERRORS.STRING_ERROR;
      }
      if (v !== "Male" && v !== "Female" && v !== "Other") {
        return "Wrong gender";
      }
      return true;
    },
  },
  name: {
    name: "name",
    validate: (v: string | null | undefined) => {
      if (v === null || v === undefined) {
        return ERRORS.REQUIRED;
      }
      if (typeof v !== "string") {
        return ERRORS.STRING_ERROR;
      }
      if (v?.length < 2) {
        return ERRORS.TOO_SHORT_ERROR(2);
      }
      if (v?.length > 64) {
        return ERRORS.TOO_LONG_ERROR(64);
      }
      return true;
    },
  },
  firstName: {
    name: "firstName",
    validate: (v: string | null | undefined) => {
      if (v === null || v === undefined) {
        return ERRORS.REQUIRED;
      }
      if (typeof v !== "string") {
        return ERRORS.STRING_ERROR;
      }
      if (v?.length < 2) {
        return ERRORS.TOO_SHORT_ERROR(2);
      }
      return true;
    },
  },
  title: {
    name: "title",
    validate: (v: string | null | undefined) => {
      if (v === null || v === undefined) {
        return ERRORS.REQUIRED;
      }
      if (typeof v !== "string") {
        return ERRORS.STRING_ERROR;
      }
      if (v?.length < 2) {
        return ERRORS.TOO_SHORT_ERROR(2);
      }
      return true;
    },
  },
  lastName: {
    name: "lastName",
    validate: (v: string | null | undefined) => {
      if (v === null || v === undefined) {
        return ERRORS.REQUIRED;
      }
      if (typeof v !== "string") {
        return ERRORS.STRING_ERROR;
      }
      if (v?.length < 2) {
        return ERRORS.TOO_SHORT_ERROR(2);
      }
      return true;
    },
  },
  username: {
    name: "username",
    validate: (v: string | null | undefined) => {
      if (v === null || v === undefined) {
        return ERRORS.REQUIRED;
      }
      if (typeof v !== "string") {
        return ERRORS.STRING_ERROR;
      }
      if (v?.length < 2) {
        return ERRORS.TOO_SHORT_ERROR(2);
      }
      return true;
    },
  },
  newPassword: {
    name: "newPassword",
    validate: (v: string | null | undefined) => {
      if (v === null || v === undefined || v === "") {
        return true;
      }
      if (typeof v !== "string") {
        return ERRORS.STRING_ERROR;
      }
      if (v?.length < 6) {
        return ERRORS.TOO_SHORT_ERROR(6);
      }
      if (!strongPassRegex.test(v)) {
        return ERRORS.WEAK_PASSWORD;
      }

      return true;
    },
  },
  webNewPassword: {
    name: "profileNewPassword",
    validate: (v: string | null | undefined) => {
      if (v === null || v === undefined || v === "") {
        return true;
      }
      if (typeof v !== "string") {
        return ERRORS.STRING_ERROR;
      }
      if (v?.length < 6) {
        return ERRORS.TOO_SHORT_ERROR(6);
      }
      if (!strongPassRegex.test(v)) {
        return ERRORS.WEAK_PASSWORD;
      }

      return true;
    },
  },
  linktree: {
    name: "linktree",
    validate: (v: string | null | undefined) => {
      if (v === null || v === undefined || v === "") {
        return true;
      }
      if (typeof v !== "string") {
        return ERRORS.STRING_ERROR;
      }
      if (v?.length < 6) {
        return ERRORS.TOO_SHORT_ERROR(6);
      }
      if (!strongPassRegex.test(v)) {
        return ERRORS.WEAK_PASSWORD;
      }

      return true;
    },
  },

  instituteType: {
    name: "instituteType",
  },

  repeatPassword: {
    name: "repeatPassword",
    validate: (v: string | null | undefined, values: any) => {
      if (typeof v !== "string") {
        return ERRORS.STRING_ERROR;
      }

      if (typeof values?.[FORM_FIELDS.newPassword.name] === "string") {
        if (v !== values?.[FORM_FIELDS.newPassword.name]) {
          return ERRORS.PASSWORD_CHECK_ERROR;
        }
      }

      return true;
    },
  },
  confirmNewPassword: {
    name: "confirmNewPassword",
    validate: (v: string | null | undefined, values: any) => {
      if (v === null || v === undefined) {
        return ERRORS.REQUIRED;
      }
      if (typeof v !== "string") {
        return ERRORS.STRING_ERROR;
      }
      if (v?.length < 6) {
        return ERRORS.TOO_SHORT_ERROR(6);
      }
      if (typeof values?.[FORM_FIELDS.webNewPassword.name] === "string") {
        if (v !== values?.[FORM_FIELDS.webNewPassword.name]) {
          return ERRORS.PASSWORD_CHECK_ERROR;
        }
      }

      return true;
    },
  },
  password: {
    name: "password",
    validate: (v: string | null | undefined) => {
      if (v === null || v === undefined) {
        return true;
      }
      if (typeof v !== "string") {
        return ERRORS.STRING_ERROR;
      }
      if (v?.length < 6) {
        return ERRORS.TOO_SHORT_ERROR(6);
      }
      return true;
    },
  },
  oldPassword: {
    name: "oldPassword",
    validate: (v: string | null | undefined) => {
      if (v === null || v === undefined) {
        return true;
      }
      if (typeof v !== "string") {
        return ERRORS.STRING_ERROR;
      }
      if (v?.length < 6) {
        return ERRORS.TOO_SHORT_ERROR(6);
      }
      return true;
    },
  },
  values: {
    name: "values",
  },
};

export const TEXTS = {
  Profile_title: "Title",
  Profile_username: "username",
  Profile_name: "First name",
  Profile_lastName: "Last name",
  Profile_password: "Password",
  Profile_login_title: "Login",
  Profile_email: "E-mail",
  Profile_ID: "UNI ID",
  Profile_password_confirm: "Password confirm",
  Profile_gender: "gender",
  Profile_instituteType: "Institute type",
};

export const URL_KEYS = {
  LIMIT: "limit",
  UPDATE: "update",
  USERNAME: "username",
  ROW: "row",
  FILTER_TYPE: "filterType",
  URL: "url",
  SEARCH: "textSearch",
};

export const STRAPI_ERRORS = [
  "Register action is currently disabled",
  "Email is already taken",
  "Invalid identifier or password",
  "Your account email is not confirmed",
  "Your account has been blocked by an administrator",
  "Passwords do not match",
  "Incorrect code provided",
  "Code Expired",
];
