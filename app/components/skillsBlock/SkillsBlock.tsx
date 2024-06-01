import { useTranslation } from "next-i18next";
import Image from "next/image";
import { PROFILE_TYPES } from "../../constants/index";
import styles from "../../styles/components/skills-block.module.scss";
import icons from "../../styles/src/index";

type Data = {
  onEdit?: (ev: any, data: any) => void;
  skills: string;
  expertCanEdit: boolean;
};

const SkillsBlock = ({ expertCanEdit, onEdit, skills }: Data) => {
  const { t } = useTranslation("common");
  return (
    <div className={`card ${styles.skills} `}>
      <div className={` title--with-icon  ${styles.network__title} step-6 `}>
        <Image src={icons.logoBlack} alt="network" />
        <h3>{t("Skills")}</h3>
      </div>
      <div className={styles.skills__body} dangerouslySetInnerHTML={{ __html: skills }} />
      {expertCanEdit && (
        <button
          className={`editPen ${styles.network__edit}`}
          onClick={onEdit?.bind(this, PROFILE_TYPES.SKILLS, skills)}
        >
          <Image src={icons.edit} alt="edit-image" />
          <Image className={`editPen__hover`} src={icons.editHover} alt="edit-image" />
        </button>
      )}
    </div>
  );
};

export default SkillsBlock;
