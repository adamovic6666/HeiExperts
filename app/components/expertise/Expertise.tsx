import { useTranslation } from "next-i18next";
import Image from "next/image";
import { PROFILE_TYPES } from "../../constants/index";
import styles from "../../styles/components/expertise.module.scss";
import icons from "../../styles/src/index";

type Data = {
  children?: any;
  onEdit?: (ev: any, data: any) => void;
  experties: string;
  expertCanEdit: boolean;
};

const Expertise = ({ onEdit, experties, expertCanEdit }: Data) => {
  const { t } = useTranslation("common");
  return (
    <div className={`card ${styles.expertise} step-3`}>
      <div className={` title--with-icon  ${styles.network__title}`}>
        <h3>{t("Expertise")}</h3>
      </div>
      <div className={styles.expertise__body} dangerouslySetInnerHTML={{ __html: experties }} />
      {expertCanEdit && (
        <button
          className={`editPen ${styles.expertise__edit}`}
          onClickCapture={onEdit?.bind(this, PROFILE_TYPES.EXPERTISE, experties)}
        >
          <Image src={icons.edit} alt="edit-image" />
          <Image className={`editPen__hover`} src={icons.editHover} alt="edit-image" />
        </button>
      )}
    </div>
  );
};

export default Expertise;
