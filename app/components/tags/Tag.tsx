import Image from "next/image";
import styles from "../../styles/components/tags.module.scss";
import icons from "../../styles/src";
import { LabelData } from "../../types/index";

const Tag = ({ tag, toDeleteTag, onClick, selectedTags, cardTagSelected, hoverable, animate }: LabelData) => {
  return (
    <div
      className={`${styles.tags__item} ${hoverable && styles.tags__item__hoverable} ${
        selectedTags?.some(({ id }) => id === tag?.id) ? styles.tags__item__selected : ""
      } ${cardTagSelected ? styles.tags__item__selected : ""} ${
        cardTagSelected && animate ? styles.tags__item__selected__animate : ""
      }`}
      onClickCapture={() => onClick && onClick(tag)}
    >
      {toDeleteTag && (
        <span className={styles.tags__item__remove} onClickCapture={() => onClick && onClick(tag)}>
          <Image src={icons.remove} alt="remove" />
          &nbsp;
        </span>
      )}
      <span className={styles.tags__sym}>#</span>
      {tag?.label}
    </div>
  );
};

export default Tag;
