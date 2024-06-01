import { useLazyQuery } from "@apollo/client";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import Input from "../../components/input/Input";
import { createToast } from "../../components/toast/Toast";
import { FORM_FIELDS, STRAPI_ERRORS, TEXTS } from "../../constants/index";
import { USER_EXIST } from "../../graphql/schemas/queries";
import styles from "../../styles/components/login.module.scss";
import icons from "../../styles/src/index";
import Form from "./components/Form";

type FormData = {
  email: string;
  password: string;
};

const LogInForm = ({ switchCards, loginFormData, setRegisterFormData }: any) => {
  const { t } = useTranslation("common");
  const { push, query } = useRouter();
  const [userExist, { data, loading, error }] = useLazyQuery(USER_EXIST);

  const methods = useForm();

  const onSubmit = useCallback(
    async ({ email, password }: FormData) => {
      let doesExistOnStrapi;
      await userExist({
        variables: {
          identifier: email,
        },
        onCompleted(data) {
          doesExistOnStrapi = data?.userExist;
        },
        onError(error) {
          // console.log(error);
        },
        fetchPolicy: "no-cache",
      });
      let heiUser;
      // CHECK HEIEXPERTS API
      if (!doesExistOnStrapi)
        await axios
          .post("/api/experts", {
            email,
          })
          .then(response => {
            // USER EXISTS IN DATA BASE
            heiUser = response.data;
            heiUser.password = password;
            if (heiUser) {
              setRegisterFormData(heiUser);
              push({ query: { ...query, login: "false" } }, undefined, { shallow: false });
              return;
            }
          })
          .catch(error => {
            //console.log(error);
          });

      if (heiUser) {
        return;
      }

      // console.log("heiUser", heiUser);
      // NOW, CHECK IF USER IS IN DATABASE ====> IF NOT SEND TO REGISTRATION
      if (!heiUser) {
        axios
          .post(process.env.NEXT_PUBLIC_STRAPI_URL + "/api/auth/local", {
            identifier: email,
            password: password,
          })
          .then(async ({ data }) => {
            if (data) {
              await signIn("credentials", {
                redirect: false,
                user: JSON.stringify(data),
              });
              sessionStorage.removeItem("animation");
              createToast({
                message: data?.user?.firstTimeLogin ? t("Welcome") : t("Welcome back"),
                type: "success",
              });
            }

            data.user.firstTimeLogin && data.user.role.id === 3 ? push(`/${data.user.slug}`) : push("/");
          })
          .catch(({ response }) => {
            if (STRAPI_ERRORS.includes(response?.data?.error.message)) {
              createToast({ message: t(response?.data?.error.message), type: "error" });
            } else {
              createToast({ message: t("Something went wrong"), type: "error" });
            }
          });
      }
      // eslint-disable-next-line;
    },
    [push, query, setRegisterFormData, t, userExist],
  );

  return (
    <Form {...methods}>
      <h3>{t("Auth login title")}</h3>
      <Input
        name={FORM_FIELDS.email.name}
        id={FORM_FIELDS.email.name}
        label={t("Email Adress / UNI ID") || TEXTS.Profile_email}
        // rules={{ validate: FORM_FIELDS.email.validate }}
        required
      />
      <Input
        name={FORM_FIELDS.password.name}
        id={FORM_FIELDS.password.name}
        type="password"
        label={t("Password") || TEXTS.Profile_password}
        // rules={{ validate: FORM_FIELDS.password.validate }}
        required
      />

      <Link href="/user/forgot-password" className={`button ${styles.login__forgotPassword}`}>
        {t("Forgot password?")}
      </Link>
      <div className={styles.login__buttons}>
        <button className="button buttonImage" onClick={methods.handleSubmit(onSubmit as any)}>
          <Image src={icons.loginWhite} alt="login" />
          {t("To Login")}
        </button>
        <p>{t("Don't have an account yet?")}</p>
        <span
          className="button secondaryButton buttonImage"
          onClick={() => {
            push({ query: { ...query, login: "false" } }, undefined, { shallow: true });
          }}
        >
          <Image src={icons.registerRed} alt="login" />
          {t("Register")}
        </span>
      </div>
    </Form>
  );
};

export default LogInForm;

// import { useLazyQuery } from "@apollo/client";
// import axios from "axios";
// import { signIn } from "next-auth/react";
// import { useTranslation } from "next-i18next";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/router";
// import { useCallback } from "react";
// import { useForm } from "react-hook-form";
// import Input from "../../components/input/Input";
// import { createToast } from "../../components/toast/Toast";
// import { FORM_FIELDS, STRAPI_ERRORS, TEXTS } from "../../constants/index";
// import { USER_EXIST } from "../../graphql/schemas/queries";
// import styles from "../../styles/components/login.module.scss";
// import icons from "../../styles/src/index";
// import Form from "./components/Form";

// type FormData = {
//   email: string;
//   password: string;
// };

// const LogInForm = ({ switchCards, loginFormData, setRegisterFormData }: any) => {
//   const { t } = useTranslation("common");
//   const { push, query } = useRouter();
//   const [userExist, { data, loading, error }] = useLazyQuery(USER_EXIST);

//   const methods = useForm();

//   const login = (identifier: string, password: string) => {
//     axios
//       .post(process.env.NEXT_PUBLIC_STRAPI_URL + "/api/auth/local", {
//         identifier: identifier,
//         password: password,
//       })
//       .then(async ({ data }) => {
//         if (data) {
//           await signIn("credentials", {
//             redirect: false,
//             user: JSON.stringify(data),
//           });
//           sessionStorage.removeItem("animation");
//           createToast({
//             message: data?.user?.firstTimeLogin ? t("Welcome") : t("Welcome back"),
//             type: "success",
//           });
//         }

//         data.user.firstTimeLogin && data.user.role.id === 3 ? push(`/${data.user.slug}`) : push("/");
//       })
//       .catch(({ response }) => {
//         if (STRAPI_ERRORS.includes(response?.data?.error.message)) {
//           createToast({ message: t(response?.data?.error.message), type: "error" });
//         } else {
//           createToast({ message: t("Something went wrong"), type: "error" });
//         }
//       });
//   };

//   const onSubmit = useCallback(
//     async ({ email, password }: FormData) => {
//       let doesExistOnStrapi: any;
//       let loginIdentifier: any;
//       await userExist({
//         variables: {
//           identifier: email,
//         },
//         onCompleted(data) {
//           doesExistOnStrapi = data?.userExist;
//           loginIdentifier = data.userExist.uniID;
//         },
//         onError(error) {
//           console.log(error);
//         },
//         fetchPolicy: "no-cache",
//       });
//       let heiUser;

//       // CHECK HEIEXPERTS API

//       if (doesExistOnStrapi?.profileType === "Expert" || !doesExistOnStrapi.doesExist) {
//         // SITUATION WHERE USER IS EXPERT OT IS NOT PART OF STRAPI

//         await axios
//           .post("/api/experts", {
//             email: !doesExistOnStrapi.doesExist ? email : loginIdentifier,
//           })
//           .then(response => {
//             // USER EXISTS IN DATA BASE
//             heiUser = response.data;
//             heiUser.password = password;
//             if (heiUser && !doesExistOnStrapi?.doesExist) {
//               // IS PART OF LDAP, BUT NOT IN STRAPI, SO FORWARD TO REGISTER PART
//               setRegisterFormData(heiUser);
//               push({ query: { ...query, login: "false" } }, undefined, { shallow: false });
//               return;
//             }
//           })
//           .catch(error => {
//             console.log(error);
//           });
//       } else {
//         // SITUATION WHERE USER IS STUDENT
//         login(loginIdentifier, password);
//       }

//       if (heiUser && !doesExistOnStrapi?.doesExist) {
//         return;
//       }
//       // let eldap = false;
//       // NOW, CHECK IF USER IS IN DATABASE ====> IF NOT SEND TO REGISTRATION
//       if ((heiUser && doesExistOnStrapi?.profileType === "Expert") || !doesExistOnStrapi?.doesExist) {
//         login(email, password);
//       } else {
//         doesExistOnStrapi?.profileType === "Expert" &&
//           createToast({ message: t("You are not employed at the university"), type: "error" });
//       }
//       // eslint-disable-next-line;
//     },
//     [push, query, setRegisterFormData, t, userExist],
//   );

//   return (
//     <Form {...methods}>
//       <Input
//         name={FORM_FIELDS.email.name}
//         id={FORM_FIELDS.email.name}
//         label={t("Email Adress / UNI ID") || TEXTS.Profile_email}
//         // rules={{ validate: FORM_FIELDS.email.validate }}
//         required
//       />
//       <Input
//         name={FORM_FIELDS.password.name}
//         id={FORM_FIELDS.password.name}
//         type="password"
//         label={t("Password") || TEXTS.Profile_password}
//         // rules={{ validate: FORM_FIELDS.password.validate }}
//         required
//       />

//       <Link href="/user/forgot-password" className={`button ${styles.login__forgotPassword}`}>
//         {t("Forgot password?")}
//       </Link>
//       <div className={styles.login__buttons}>
//         <button className="button buttonImage" onClick={methods.handleSubmit(onSubmit as any)}>
//           <Image src={icons.loginWhite} alt="login" />
//           {t("To Login")}
//         </button>
//         <p>{t("Don't have an account yet?")}</p>
//         <span
//           className="button secondaryButton buttonImage"
//           onClick={() => {
//             push({ query: { ...query, login: "false" } }, undefined, { shallow: true });
//           }}
//         >
//           <Image src={icons.registerRed} alt="login" />
//           {t("Register")}
//         </span>
//       </div>
//     </Form>
//   );
// };

// export default LogInForm;
