import "intro.js/introjs.css";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext } from "react";
import TwoColorIcons from "../../components/TwoColorIcons";
import { PROFILE_TYPES } from "../../constants/index";
import { FavoritesContext } from "../../context/favoritesContext";
import styles from "../../styles/components/profileCard.module.scss";
import icons from "../../styles/src/index";
import { ProfileType } from "../../types";
import { getFormatedExpertCategories, tagStrip } from "../../utils";
import ApproachableFor from "./ApproachableFor";

const ProfileCard = ({
  onEdit,
  shortIntro,
  expertCanEdit,
  loading,
  id,
  userDetails,
  expertCanRepeatWalktour,
  onOpenTour,
}: ProfileType) => {
  const { t } = useTranslation("common");
  const { updateFavorites, favorites }: any = useContext(FavoritesContext);
  const { pathname } = useRouter();

  // FORMAT DATA
  const profileData = {
    avatar: userDetails?.avatar?.url,
    title: userDetails?.title,
    firstName: userDetails?.firstName,
    lastName: userDetails?.lastName,
    categoryItems: userDetails?.categoryItems,
    approachableFor: userDetails.approachableFor,
    linktree: userDetails?.linktree,
    instituteType: userDetails?.instituteType,
    email: userDetails?.email,
    gender: userDetails?.gender,
  };

  const checkUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };
  const isFullUrl = checkUrl(userDetails.linktree);

  const onAddToFavorites = (profileId: number) => {
    updateFavorites(profileId);
  };

  const isExpertAndExpertsPage = pathname === "/[slug]" && expertCanRepeatWalktour;

  return (
    <div id="profileCard">
      <div className={`${styles.profileCard} step-1`}>
        <div className={styles.profileCard__image}>
          {profileData.avatar && (
            <Image
              src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${profileData.avatar}`}
              width={400}
              height={400}
              alt="profile"
            />
          )}
          {!profileData.avatar && <Image src={icons.profile} width={400} height={400} alt="profile" />}
        </div>
        <div className={styles.profileCard__profil}>
          <div className={styles.profileCard__titles}>
            <h2 className={styles.profileCard__profil__name}>{`${userDetails?.title ?? ""} ${userDetails.firstName} ${
              userDetails.lastName
            }`}</h2>
            {shortIntro && <h3 className={styles.profileCard__profil__profession}>{shortIntro}</h3>}
          </div>
          {userDetails.categoryItems.length > 0 && (
            <div className={styles.profileCard__profil__categories}>
              <span>{t("Faculty")}:&nbsp;</span>
              {getFormatedExpertCategories(userDetails.categoryItems)}
            </div>
          )}
          {/* {profileData?.gender && <p className={styles.profileCard__profil__gender}>{t(profileData?.gender)}</p>} */}
          {profileData?.approachableFor && tagStrip(profileData?.approachableFor) !== "" && (
            <ApproachableFor data={profileData?.approachableFor} />
          )}

          <div className={styles.profileCard__profil__external__links}>
            {userDetails.linktree && (
              <>
                <a
                  href={isFullUrl ? userDetails.linktree : "https://" + userDetails.linktree}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image src={icons.linktree} alt="linktree-image" />
                </a>
                {isExpertAndExpertsPage && (
                  <>
                    <button
                      onClickCapture={onOpenTour}
                      className={styles.profileCard__profil__external__links__actionButton}
                    >
                      <Image src={icons.questionMarkForTooltip} alt="question-mark" />
                    </button>
                    <div className={styles.profileCard__profil__tooltip__wrapper}>
                      <span className={styles.profileCard__profil__tooltip}>
                        <span className={styles.profileCard__profil__tooltip__text}>
                          {t("Profile card tooltip text")}
                        </span>
                        <Image src={icons.tooltipIconLetter} alt="tooltip-icon" />
                      </span>
                    </div>
                  </>
                )}
              </>
            )}
            {!expertCanEdit && !loading && (
              <div className={styles.profileCard__profil__action__links}>
                <a href={`mailto: ${userDetails.email}`} className="button buttonImage">
                  <Image src={icons.envelope} alt="envelope-image" />
                  {t("Contact")}
                </a>
                <button
                  className={`button secondaryButton${favorites?.includes(+id) ? "--active" : ""} buttonImage`}
                  onClickCapture={() => onAddToFavorites(+id)}
                >
                  <TwoColorIcons name="notice" active={favorites?.includes(+id) ? true : false} />
                  {favorites?.includes(+id) ? t("Unfollow") : t("Follow")}
                </button>
              </div>
            )}
          </div>
        </div>
        {expertCanEdit && (
          <button
            className={`editPen ${styles.profileCard__edit}`}
            onClick={onEdit?.bind(this, PROFILE_TYPES.PERSONAL_DATA, profileData)}
          >
            <Image src={icons.edit} alt="edit-image" />
            <Image className={`editPen__hover`} src={icons.editHover} alt="edit-image" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
