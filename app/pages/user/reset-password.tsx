import axios from "axios";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextSeo } from "next-seo";
import Image from "next/image";
import { useRouter } from "next/router";
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
  const { push, query } = useRouter();

  const onSubmit = useCallback(
    (input: any) => {
      let code = query.code;
      axios
        .post(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/reset-password`, {
          password: input.newPassword,
          passwordConfirmation: input.repeatPassword,
          code: code,
        })
        .then(resposne => {
          createToast({ message: t("Password changed successfully"), type: "success" });
          push("/user/auth");
        })
        .catch(({ response }) => {
          if (STRAPI_ERRORS.includes(response?.data?.error.message)) {
            createToast({ message: t(response?.data?.error.message), type: "error" });
          } else {
            createToast({ message: t("Something went wrong"), type: "error" });
          }
        });
    },
    [push, query.code],
  );

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
                <h3>{t("Reset password")}</h3>
                <Form {...methods}>
                  <Input
                    rules={{ validate: FORM_FIELDS.newPassword.validate }}
                    required
                    name={FORM_FIELDS.newPassword.name}
                    type="password"
                    label={t(TEXTS.Profile_password) || "Password"}
                  />
                  <Input
                    rules={{
                      validate: (v: string | null | undefined) => FORM_FIELDS.repeatPassword.validate?.(v, methods),
                    }}
                    required
                    name={FORM_FIELDS.repeatPassword.name}
                    type="password"
                    label={t(TEXTS.Profile_password_confirm) || "Password confirm"}
                  />

                  <div className={styles.login__buttons}>
                    <button className="button buttonImage" onClick={methods.handleSubmit(onSubmit as any)}>
                      <Image src={icons.loginWhite} alt="login" />
                      {t("Confirm")}
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
    },
  };
}
