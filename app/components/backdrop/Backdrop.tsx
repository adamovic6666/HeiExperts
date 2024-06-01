import styles from "../../styles/components/backdrop.module.scss";
import { BackdropType } from "../../types/index";

const Backdrop = ({ children, background, desktopOnly, onClose }: BackdropType) => {
  return (
    <div
      onClickCapture={onClose}
      className={`${styles.backdrop} ${desktopOnly ? styles.backdrop__desktopOnly : ""} ${
        background ? styles.backdrop__background : ""
      }`}
    >
      {children}
    </div>
  );
};

export default Backdrop;
