import { useTranslation } from "next-i18next";
import Image from "next/image";
import { PROFILE_TYPES } from "../../constants/index";
import styles from "../../styles/components/network-block.module.scss";
import icons from "../../styles/src/index";

type Data = {
  onEdit?: (ev: any, data: any) => void;
  network: string;
  expertCanEdit: boolean;
};

const NetworkBlock = ({ expertCanEdit, onEdit, network }: Data) => {
  const { t } = useTranslation("common");
  return (
    <div className={`card ${styles.network}`}>
      <div className={` title--with-icon  ${styles.network__title}`}>
        <Image src={icons.network} alt="network" />
        <h3>{t("Network")}</h3>
      </div>
      <div className={styles.network__body} dangerouslySetInnerHTML={{ __html: network }} />
      {expertCanEdit && (
        <button
          className={`editPen ${styles.network__edit}`}
          onClick={onEdit?.bind(this, PROFILE_TYPES.NETWORK, network)}
        >
          <Image src={icons.edit} alt="edit-image" />
          <Image className={`editPen__hover`} src={icons.editHover} alt="edit-image" />
        </button>
      )}
    </div>
  );
};

export default NetworkBlock;
