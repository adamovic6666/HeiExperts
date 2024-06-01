import { useTranslation } from "react-i18next";
import Backdrop from "../../components/backdrop/Backdrop";
import Portal from "../../components/portal/Portal";
import styles from "../../styles/components/termsModal.module.scss";

const TermsModal = ({ onClose, onSetCheckedField, modalData }: any) => {
  const { t } = useTranslation("common");

  return (
    <Portal>
      <Backdrop>
        <div className={styles.termsModal__close} onClick={() => onClose()}></div>
        <div className={styles.termsModal}>
          <h1>{modalData.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: modalData.description ?? "" }}></div>
          <button
            onClick={() => {
              onSetCheckedField(modalData.type);
              onClose();
            }}
            className="button buttonImage"
          >
            {t("Accept")}
          </button>
        </div>
      </Backdrop>
    </Portal>
  );
};

export default TermsModal;
