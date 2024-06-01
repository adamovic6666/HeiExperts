import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useRouter } from "next/router";
import { PROFILE_TYPES } from "../../constants/index";
import styles from "../../styles/components/tags.module.scss";
import icons from "../../styles/src/index";
import { getRandomItems } from "../../utils";
import Tag from "./Tag";

type Data = {
  children?: any;
  onEdit?: (ev: any, data: any) => void;
  tags: any[];
  initialTags?: any[];
  onUpdateTags?: (data: any) => void;
  onClick?: (data: string) => void;
  selectedTags?: any[];
  expertCanEdit?: boolean;
  hoverable?: boolean;
  searchValue?: string;
  activeFilters?: string[];
};

const Tags = ({
  onEdit,
  tags,
  onUpdateTags,
  initialTags,
  onClick,
  selectedTags,
  expertCanEdit,
  hoverable,
  searchValue,
  activeFilters,
}: Data) => {
  // const { data } = useQuery(SEARCH);
  const { t } = useTranslation("common");

  const { pathname } = useRouter();

  const onRefreshHandler = () => {
    if (initialTags?.length === 0 || !initialTags) return;
    if (initialTags?.length < 5 || tags?.length < 5) {
      return;
    }

    const randomTags = getRandomItems(initialTags, selectedTags);
    onUpdateTags && onUpdateTags(randomTags);
  };

  const clickable = !searchValue && activeFilters?.length === 0;

  return (
    <div className={`${styles.tags} ${pathname === "/" ? styles.tags__homePage : ""} step-2`}>
      <h3>
        {pathname === "/" ? t("Tags") : t("Personal Tags")}
        {pathname !== "/" && expertCanEdit && (
          <p className={styles.tags__tooltip}>
            <p className={styles.tags__tooltip__text}>{t("Profile tags tooltip text")}</p>
            <Image src={icons.tooltip} alt="tooltip-icon" />
          </p>
        )}
      </h3>
      {pathname !== "/" && expertCanEdit && (
        <>
          <button className={`editPen ${styles.tags__edit}`} onClick={onEdit?.bind(this, PROFILE_TYPES.TAGS, tags)}>
            <Image src={icons.edit} alt="edit-image" />
            <Image className={`editPen__hover`} src={icons.editHover} alt="edit-image" />
          </button>
        </>
      )}
      {pathname === "/" && (
        <button
          className={`secondaryButton buttonImage ${styles.tags__refresh}`}
          style={{ pointerEvents: clickable ? "auto" : "none", opacity: clickable ? "1" : ".3" }}
          onClick={onRefreshHandler}
        >
          <Image src={icons.refresh} alt="refresh" />
          {t("Refresh")}
        </button>
      )}
      <div className={styles.tags__wrapper}>
        {tags &&
          tags.map((tag, idx) => {
            return (
              <Tag
                key={`TAG_ITEM_${tag.label}_${idx}`}
                tag={tag}
                onClick={onClick}
                hoverable={hoverable}
                selectedTags={selectedTags}
              />
            );
          })}
      </div>
    </div>
  );
};

export default Tags;
