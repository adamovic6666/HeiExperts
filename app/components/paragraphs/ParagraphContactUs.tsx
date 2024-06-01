import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";
import styles from "../../styles/components/paragraphs.module.scss";
import icons from "../../styles/src";

const ParagraphContactUs = ({ bottomJoinUs }: any) => {
  const { t } = useTranslation("common");
  const { title, body, registerButtons } = bottomJoinUs;
  return (
    <div className={styles.paragraphContactUs}>
      <div>
        <div className={styles.paragraphContactUs__textWrapper}>
          <h2>{title}</h2>
          <p>{body}</p>
          {registerButtons && (
            <div className={styles.paragraphContactUs__linksWrapper}>
              <Link href="/user/auth?login=true" className="button buttonImageTransparent">
                <Image src={icons.loginMenu} alt="login" />
                <span>{t("To Login")}</span>
              </Link>
              <Link href="/user/auth?login=false" className="button buttonImage">
                <Image src={icons.loginWhite} alt="registrieren" /> {t("Register")}
              </Link>
            </div>
          )}
        </div>
        <div className={styles.paragraphContactUs__corner}></div>
      </div>
    </div>
  );
};

export default ParagraphContactUs;
