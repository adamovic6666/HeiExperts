import axios from "axios";
import { getSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextSeo } from "next-seo";
import Image from "next/image";
import { useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import Form from "../../components/forms/components/Form";
import Input from "../../components/input/Input";
import { createToast } from "../../components/toast/Toast";
import { FORM_FIELDS, STRAPI_ERRORS, TEXTS } from "../../constants/index";
import { getClient } from "../../graphql/client";
import { SOCIAL_ICONS } from "../../graphql/schemas/queries";
import styles from "../../styles/components/login.module.scss";
import icons from "../../styles/src";

export default function Login() {
  const { t } = useTranslation("common");
  const loginFormRef = useRef<any>(null);

  const onSubmit = useCallback(({ email }: { email: string }) => {
    axios
      .post(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/forgot-password`, { email: email })
      .then(resposne => {
        createToast({ message: t("Check your email"), type: "success" });
      })
      .catch(({ response }) => {
        if (STRAPI_ERRORS.includes(response?.data?.error.message)) {
          createToast({ message: t(response?.data?.error.message), type: "error" });
        } else {
          createToast({ message: t("Something went wrong"), type: "error" });
        }
      });
  }, []);

  const methods = useForm();

  return (
    <>
      <NextSeo title={TEXTS.Profile_login_title} description={TEXTS.Profile_login_title} />
      <div className={styles.login}>
        <div className={`container ${styles.login__container}`}>
          <div className={styles.login__form}>
            <div ref={loginFormRef} className={styles.login__form__login}>
              <div className={styles.login__red}>
                <h1>{t("Auth side title")}</h1>
                <p>{t("Login side subtitle")}</p>
              </div>
              <div className={`${styles.login__form__login__wrap} ${styles.login__form__login__wrap__forgotPassword}`}>
                <h3>{t("Forgot password")}</h3>
                <Form {...methods}>
                  <Input
                    name={FORM_FIELDS.email.name}
                    id={FORM_FIELDS.email.name}
                    label={t("Email") || TEXTS.Profile_email}
                    rules={{ validate: FORM_FIELDS.email.validate }}
                    required
                  />

                  <div className={styles.login__buttons}>
                    <button className="button buttonImage" onClick={methods.handleSubmit(onSubmit as any)}>
                      <Image src={icons.loginWhite} alt="login" />
                      {t("Send link")}
                    </button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(ctx: any) {
  const session = await getSession(ctx);

  if (session) {
    return {
      redirect: { destination: "/" },
    };
  }

  const { data: socialIcons } = await getClient().query({
    query: SOCIAL_ICONS,
    variables: {
      locale: ctx.locale,
    },
    fetchPolicy: "no-cache",
  });

  const icons = socialIcons.socialIcons;

  return {
    props: {
      icons,
      ...(await serverSideTranslations(ctx.locale, ["common"])),
      // session,
    },
  };
}
