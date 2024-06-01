import { getSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { NextSeo } from "next-seo";
import { useEffect, useRef, useState } from "react";
import { TEXTS } from "../../../constants/index";
import styles from "../../../styles/components/login.module.scss";
import EditStudentProfile from "./EditStudentProfile";
import StudentProfile from "./StudentProfile";

type StudentData = {
  email: string;
  gender: string;
  firstName: string;
  lastName: string;
  id: string;
};

export default function Student({ email, gender, firstName, lastName, id }: StudentData) {
  const [cards, switchCards] = useState(false);
  const editFormRef = useRef<any>(null);
  const [editFormHeight, setEditFormHeight] = useState(0);

  useEffect(() => {
    setEditFormHeight(editFormRef.current.offsetHeight);
  }, []);

  const isMobile = () => {
    return typeof window !== "undefined" && window.innerWidth < 1024;
  };
  const { t } = useTranslation("common");
  return (
    <>
      <NextSeo title={TEXTS.Profile_login_title} description={TEXTS.Profile_login_title} />
      <div className={cards ? `${styles.login}  ${styles.login__switch}` : `${styles.login} `}>
        <div className={`container ${styles.login__container}`}>
          <div className={`${cards && styles.login__form__move} ${styles.login__form}`}>
            <div className={styles.login__form}>
              <div ref={editFormRef} className={styles.login__form__login}>
                <div className={styles.login__red}>
                  <h1>{t("heiEXPERT")}</h1>
                  <p>{t("Grow together with the greatest experts at your side.")}</p>
                </div>
                <div className={styles.login__form__login__wrap}>
                  <h3>
                    {t("Hi, ")}
                    {firstName}
                  </h3>
                  <StudentProfile
                    switchCards={switchCards}
                    email={email}
                    gender={gender}
                    firstName={firstName}
                    lastName={lastName}
                  />
                </div>
              </div>
              <div
                style={{ height: !cards && isMobile() ? `${editFormHeight}px` : "auto" }}
                className={styles.login__form__register}
              >
                <div className={styles.login__red}>
                  <h1>{t("heiEXPERT")}</h1>
                  <p>{t("Grow together with the greatest experts at your side.")}</p>
                </div>
                <div className={styles.login__form__register__wrap}>
                  <h3>{t("Edit Profile")}</h3>
                  <EditStudentProfile
                    switchCards={switchCards}
                    email={email}
                    profileGender={gender}
                    firstName={firstName}
                    lastName={lastName}
                    id={id}
                  />
                </div>
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

  return {
    props: {
      session,
    },
  };
}
