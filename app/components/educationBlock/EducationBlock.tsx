import { useTranslation } from "next-i18next";
import Image from "next/image";
import { PROFILE_TYPES } from "../../constants/index";
import styles from "../../styles/components/education-block.module.scss";
import icons from "../../styles/src/index";

type Data = {
  onEdit?: (ev: any, data: any) => void;
  education: string;
  expertCanEdit: boolean;
};

const EducationBlock = ({ expertCanEdit, onEdit, education }: Data) => {
  const { t } = useTranslation("common");
  return (
    <div className={`card ${styles.education} step-5`}>
      <div className={` title--with-icon  ${styles.network__title}`}>
        <Image src={icons.hat} alt="network" />
        <h3>{t("Education")}</h3>
      </div>
      <div className={styles.education__body} dangerouslySetInnerHTML={{ __html: education }} />
      {expertCanEdit && (
        <button
          className={`editPen ${styles.network__edit}`}
          onClick={onEdit?.bind(this, PROFILE_TYPES.EDUCATION, education)}
        >
          <Image src={icons.edit} alt="edit-image" />
          <Image className={`editPen__hover`} src={icons.editHover} alt="edit-image" />
        </button>
      )}
    </div>
  );
};

export default EducationBlock;
