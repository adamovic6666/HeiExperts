import { useTranslation } from "next-i18next";
import Image from "next/image";
import styles from "../../styles/components/textAndImageParagraph.module.scss";
import icons from "../../styles/src";

export default function TextAndImageParagraph({ executeScroll }: { executeScroll: () => {} }) {
  const { t } = useTranslation("common");
  return (
    <div className={styles.textAndImageParagraph}>
      <div className={styles.textAndImageParagraph__container}>
        <div className={styles.textAndImageParagraph__image}>
          <Image src={icons.professorsCardImage} width={360} height={360} alt="experts" />
        </div>
        <div className={styles.textAndImageParagraph__content}>
          <h2 className={styles.textAndImageParagraph__title}> {t("Find experts title")}</h2>
          <div className={styles.textAndImageParagraph__text}>
            <p>{t("Find experts body")}</p>
          </div>
          <button className={`button buttonImage ${styles.textAndImageParagraph__button}`} onClick={executeScroll}>
            <Image src={icons.searchWhite} alt="search" />
            {t("Find experts")}
          </button>
        </div>
      </div>
    </div>
  );
}
