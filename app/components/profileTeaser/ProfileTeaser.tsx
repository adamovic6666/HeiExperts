import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import HeadSvg from "../../components/svgs/HeadSvg";
import Tag from "../../components/tags/Tag";
import styles from "../../styles/components/profile.module.scss";
import icons from "../../styles/src/index";
import { getFormatedExpertCategories } from "../../utils";

type TagType = {
  label: string;
  id: string;
};

type ProfileTeaserProps = {
  profile: {
    title?: string;
    tags?: TagType[];
    description?: string;
    firstName?: string;
    lastName?: string;
    id?: string;
    shortIntro: string;
    experties?: string;
    avatar?: { url: string };
    slug?: string;
    following?: boolean;
    translatableFields?: any;
    categoryItems?: any[];
  };
  searchVal?: string;
  toUnfollow?: boolean;
  selectedTags?: any[];
  animationDelay?: number;
  animate?: boolean;
  toAdd?: boolean;
  toRemove?: boolean;
  onUpdateConnectedProfiles?: (action: string, profile: any) => void;
  onFollow?: (ev: any) => void;
  favoritesIds?: any[];
  myId?: any;
  onClose?: () => void;
};

export default function ProfileTeaser({
  profile,
  toAdd,
  toRemove,
  onUpdateConnectedProfiles,
  selectedTags,
  onFollow,
  favoritesIds,
  myId,
  onClose,
  searchVal,
}: ProfileTeaserProps) {
  const { t } = useTranslation("common");
  const { pathname } = useRouter();
  const [hoveredCardId, setHoveredCardId] = useState<any>("");
  const [hoveredId, setHoveredId] = useState<any>("");
  const [isScrollable, setIsScrollable] = useState<any>(false);

  const isFollowing = favoritesIds?.includes(profile.id && +profile?.id);
  const [initiallyUnfollow, setInitiallyUnfollow] = useState<any>(pathname === "/[slug]/favorites");
  const approachableForRef = useRef<any>(null);
  const descriptionRef = useRef<any>(null);

  const sortTagsBySelected = (tags: any, selectedTags: any) => {
    return tags.slice().sort((a: any, b: any) => {
      // Find the indices of a and b in the selectedTags array
      const aIndex = selectedTags.findIndex((tag: any) => tag.label === a.label);
      const bIndex = selectedTags.findIndex((tag: any) => tag.label === b.label);

      if (aIndex !== -1 && bIndex === -1) {
        return -1; // `a` comes before `b`
      } else if (aIndex === -1 && bIndex !== -1) {
        return 1; // `b` comes before `a`
      } else {
        return 0; // Maintain the relative order between other elements
      }
    });
  };

  let sortedTags = profile.tags && pathname === "/" ? sortTagsBySelected(profile?.tags, selectedTags) : profile?.tags;
  const modifiedTags = sortedTags.slice(0, 8);
  const { locale } = useRouter();
  const approchableFor = profile?.translatableFields?.find((field: any) => field.locale === locale);

  const getHighlightedText = (text: any, higlight: any) => {
    if (!text) return;
    const parts = text?.split(new RegExp(`(${higlight})`, "gi"));

    if (higlight) {
      return (
        higlight &&
        parts.map((part: any, idx: any) => (
          <span key={`SEARCH_TEXT_HIGHLIGHTED${text}__${text + idx}`}>
            {part.toLowerCase() === higlight.toLowerCase() ? (
              <span className={`highlighted-text highlighted`}>{part}</span>
            ) : (
              part
            )}
          </span>
        ))
      );
    }

    return text;
  };

  const getHighlightedTextFromHtml = (html: string, highlight: string | undefined) => {
    if (!html) return null;

    const highlightedHtml = html.replace(
      new RegExp(`(${highlight})`, "gi"),
      match => `<span class="highlighted-text">${match}</span>`,
    );

    return (
      <div
        ref={descriptionRef}
        className={`${styles.profileTeaser__description} ${
          isScrollable && styles.profileTeaser__description__scrollable
        }`}
        dangerouslySetInnerHTML={{ __html: highlight ? highlightedHtml : html }}
      />
    );
  };

  useEffect(() => {
    approachableForRef.current?.classList.remove("transform-highlighted-text-wrapper");
    let text = approachableForRef.current.querySelector(".faculties")! as HTMLElement;
    text.style.transform = "unset";
    if (!searchVal) return;

    const id = setTimeout(() => {
      let wrapperElPosition = approachableForRef.current.offsetTop;
      let spanEl = approachableForRef.current.querySelector(".highlighted")! as HTMLElement;
      let spanElPosition = spanEl?.offsetTop;

      if (spanElPosition - wrapperElPosition > 38 && spanEl) {
        approachableForRef.current?.classList.add("transform-highlighted-text-wrapper");
        let text = approachableForRef.current.querySelector(".faculties")! as HTMLElement;
        text.style.transform = `translateY(-${spanElPosition - wrapperElPosition}px)`;
      }
    }, 300);

    return () => clearTimeout(id);
  }, [searchVal]);

  return (
    <div
      className={`card ${styles.profileTeaser} ${
        hoveredCardId === profile.id ? styles.profileTeaser__hovered : styles.profileTeaser__non__hovered
      }`}
    >
      <div className={styles.profileTeaser__top}>
        {myId != profile.id && (
          <div className={`${styles.profileTeaser__top__favorite} favoriteProfile`}>
            {
              <button
                onMouseEnter={() => setHoveredId(profile.id)}
                onMouseLeave={() => setHoveredId("")}
                className={`linkButton ${
                  !isFollowing && !initiallyUnfollow ? "linkButtonFollow" : "linkButtonUnfollow"
                }`}
                onClickCapture={() => {
                  onFollow && onFollow(profile);
                  setInitiallyUnfollow("");
                }}
              >
                <HeadSvg
                  isFollowing={isFollowing}
                  initiallyUnfollow={initiallyUnfollow}
                  hoveredId={hoveredId}
                  profileId={profile.id}
                />
                <span>{isFollowing || initiallyUnfollow ? t("Unfollow") : t("Follow")}</span>
              </button>
            }
          </div>
        )}
        <div className={styles.profileTeaser__left}>
          <Link href={`/${profile?.slug}`} onClickCapture={onClose}>
            {profile.avatar ? (
              <Image
                onMouseEnter={() => setHoveredCardId(profile?.id)}
                onMouseLeave={() => setHoveredCardId("")}
                src={`${profile.avatar ? process.env.NEXT_PUBLIC_STRAPI_URL + profile.avatar?.url : icons.profile} `}
                alt="profile"
                width={400}
                height={400}
              />
            ) : (
              <Image
                src={icons.profile}
                alt="profile"
                onMouseEnter={() => setHoveredCardId(profile?.id)}
                onMouseLeave={() => setHoveredCardId("")}
              />
            )}
          </Link>
        </div>
        <div className={styles.profileTeaser__right}>
          <div className={styles.profileTeaser__right__actions}>
            {toRemove && (
              <span
                className="buttonImage"
                onClick={() => {
                  onUpdateConnectedProfiles && onUpdateConnectedProfiles("remove", profile);
                }}
              >
                <Image src={icons.trashIcon} alt="trash" /> {t("Remove")}
              </span>
            )}
            {toAdd && (
              <span
                className="buttonImage"
                onClick={() => onUpdateConnectedProfiles && onUpdateConnectedProfiles("add", profile)}
              >
                <Image src={icons.addIcon} alt="add" /> {t("Add to")}
              </span>
            )}
          </div>

          <Link href={`/${profile?.slug}`} onClickCapture={onClose}>
            <h4
              className={styles.profileTeaser__name}
              onMouseEnter={() => setHoveredCardId(profile?.id)}
              onMouseLeave={() => setHoveredCardId("")}
            >
              {profile?.title && profile?.title + " "}
              {profile?.firstName + " " + profile?.lastName}
            </h4>
          </Link>
          <div className={styles.profileTeaser__profession}>
            <div className={styles.profileTeaser__approachableFor} ref={approachableForRef}>
              {profile?.categoryItems && (
                <p className="faculties">
                  {getHighlightedText(getFormatedExpertCategories(profile?.categoryItems), searchVal)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      {pathname !== "/[slug]" && (
        <div className={styles.profileTeaser__bottom}>
          <div>
            {approchableFor?.approachableFor &&
              approchableFor.approachableFor.trim() !== "<p></p>" &&
              getHighlightedTextFromHtml(approchableFor?.approachableFor, searchVal)}
          </div>
          {!(approchableFor?.approachableFor && approchableFor.approachableFor.trim() !== "<p></p>") && (
            <div className={styles.profileTeaser__description}></div>
          )}
          {approchableFor?.approachableFor && approchableFor.approachableFor.trim() !== "<p></p>" && (
            <button
              style={{ opacity: isScrollable ? "0" : "1" }}
              onClickCapture={() => setIsScrollable(true)}
              className={styles.profileTeaser__showMore}
            >
              {t("Show more")}
            </button>
          )}
          {!toRemove && !toAdd && (
            <div className={styles.profileTeaser__tags}>
              {modifiedTags &&
                modifiedTags.map((tag: any, idx: number) => {
                  return (
                    <Tag
                      key={`USER_TAG_ITEM_${idx}`}
                      tag={tag}
                      cardTagSelected={selectedTags && selectedTags.some(({ label }) => label === tag.label)}
                    />
                  );
                })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
