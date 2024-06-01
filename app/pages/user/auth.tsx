import { getSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import LogInForm from "../../components/forms/LoginForm";
import RegisterForm from "../../components/forms/RegisterForm";
import { TEXTS } from "../../constants/index";
import { getClient } from "../../graphql/client";
import { DATA_PROTECTION_MODAL, RESEARCH_MODAL, SOCIAL_ICONS } from "../../graphql/schemas/queries";
import styles from "../../styles/components/login.module.scss";

type HeiUserApiResponse = {
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  sAMAccountName: string;
  password: string;
  instituteCode: string;
};

export default function Login({ dataProtection, research }: any) {
  const { dataProtectionModal } = dataProtection;
  const { researchModal } = research;

  const { t } = useTranslation("common");
  const [cards, switchCards] = useState(false);
  const [loginFormData, setLoginFormData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    fullName: "",
    sAMAccountName: "",
    newPassword: "",
    instituteCode: "",
  });
  const [loginFormHeight, setLoginFormHeight] = useState(0);
  const loginFormRef = useRef<any>(null);
  const { query, replace } = useRouter();

  const switchCardsHandler = () => {
    replace("/user/auth", undefined, { shallow: true });
    switchCards(!cards);
  };

  useEffect(() => {
    switchCards(query.login === "false");
  }, [query]);

  const onRegisterFormDataHandler = ({ email, password }: any) => {
    setLoginFormData({ email, password });
  };

  const setRegisterFormData = ({
    email,
    firstName,
    lastName,
    fullName,
    sAMAccountName,
    password,
    instituteCode,
  }: HeiUserApiResponse) => {
    setRegisterData({ email, firstName, lastName, fullName, sAMAccountName, newPassword: password, instituteCode });
  };

  const isMobile = () => {
    return typeof window !== "undefined" && window.innerWidth < 1024;
  };

  return (
    <>
      <NextSeo title={TEXTS.Profile_login_title} description={TEXTS.Profile_login_title} />
      <div className={cards ? `${styles.login}  ${styles.login__switch}` : `${styles.login} `}>
        <div className={`container ${styles.login__container}`}>
          <div className={`${cards && styles.login__form__move} ${styles.login__form}`}>
            <div ref={loginFormRef} className={styles.login__form__login}>
              <div className={styles.login__red}>
                <h1>{t("Auth side title")}</h1>
                <p>{t("Login side subtitle")}</p>
              </div>
              <div className={styles.login__form__login__wrap}>
                <LogInForm switchCards={switchCardsHandler} setRegisterFormData={setRegisterFormData} />
              </div>
            </div>
            <div
              style={{ height: !cards && isMobile() ? `${loginFormHeight}px` : "auto" }}
              className={`${!cards && styles.login__form__register__decreaseHeight} ${styles.login__form__register}`}
            >
              <div className={styles.login__red}>
                <h1>{t("Auth side title")}</h1>
                <p>{t("Login side subtitle")}</p>
                <p>{t("Register side body")}</p>
              </div>
              <div className={styles.login__form__register__wrap}>
                <RegisterForm
                  switchCards={switchCardsHandler}
                  registerData={registerData}
                  onRegisterFormData={onRegisterFormDataHandler}
                  dataProtectionModal={dataProtectionModal}
                  researchModal={researchModal}
                />
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

  const { data: dataProtection } = await getClient().query({
    query: DATA_PROTECTION_MODAL,
    variables: {
      locale: ctx.locale,
    },
    fetchPolicy: "no-cache",
  });
  const { data: research } = await getClient().query({
    query: RESEARCH_MODAL,
    variables: {
      locale: ctx.locale,
    },
    fetchPolicy: "no-cache",
  });

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
      dataProtection,
      research,
      icons,
      ...(await serverSideTranslations(ctx.locale, ["common"])),
      // session,
    },
  };
}
