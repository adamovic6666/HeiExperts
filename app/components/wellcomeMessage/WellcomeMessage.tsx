import { useTranslation } from "next-i18next";
import Image from "next/image";
import styles from "../../styles/components/wellcomeMessage.module.scss";
import icons from "../../styles/src";

const WellcomeMessage = () => {
  const { t } = useTranslation("common");

  return (
    <>
      <div className={styles.wellcomeMessage}>
        {/* <Image src={icons.arrowUp} alt="arrow-up" /> */}
        <span className="arrow-up"></span>
        <div>
          <Image src={icons.warning} alt="warrning-image" />
          <span>{t("First step")}</span>
        </div>
        <div>
          <p>{t("You must complete your profile so that you can also be found as an expert.")}</p>
        </div>
      </div>
    </>
  );
};

export default WellcomeMessage;
