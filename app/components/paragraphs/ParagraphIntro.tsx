import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";
import styles from "../../styles/components/paragraphs.module.scss";
import icons from "../../styles/src/index";

const ParagraphIntro = ({ topJoinUs }: any) => {
  const { t } = useTranslation("common");
  return (
    <div className={styles.paragraphIntro}>
      <div>{topJoinUs.title}</div>
      <p>{topJoinUs?.body}</p>
      {topJoinUs.registerButtons && (
        <div className={styles.paragraphIntro__linksWrapper}>
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
  );
};

export default ParagraphIntro;
