import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useContext } from "react";
import TwoColorIcons from "../../components/TwoColorIcons";
import { FavoritesContext } from "../../context/favoritesContext";
import styles from "../../styles/components/profileCard.module.scss";
import icons from "../../styles/src/index";
import { tagStrip } from "../../utils";

type Data = {
  email: string;
  firstName: string;
  lastName: string;
  avatar: { url: string };
  id: string;
  userDetails?: any;
  profileCardFixed?: boolean;
};

const ProfileCardFixed = ({ email, firstName, lastName, avatar, id, userDetails, profileCardFixed }: Data) => {
  const { t } = useTranslation("common");

  // const [scrollDirection, setScrollDirection] = useState("");
  const { updateFavorites, favorites }: any = useContext(FavoritesContext);

  const onAddToFavorites = (profileId: number) => {
    updateFavorites(profileId);
  };

  return (
    <div
      className={`${
        profileCardFixed ? `${styles.profileCardFixed__show} ${styles.profileCardFixed}` : `${styles.profileCardFixed}`
      }`}
      id="profileCardFixed"
    >
      <div className={styles.profileCardFixed__container}>
        <div className={styles.profileCardFixed__image}>
          {avatar && avatar?.url && (
            <Image src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${avatar?.url}`} width={54} height={54} alt="profile" />
          )}
          {!avatar?.url && <Image src={icons.profile} width={54} height={54} alt="profile" />}
        </div>
        <div className={styles.profileCardFixed__profil}>
          <div className={styles.profileCardFixed__titles}>
            <h2 className={styles.profileCardFixed__profil__name}>{`${firstName} ${lastName}`}</h2>
            <div className={styles.profileCardFixed__profil__approchableFor}>
              {userDetails?.approachableFor && tagStrip(userDetails?.approachableFor) !== "" && (
                <>
                  <span>{t("Approachable for")}:&nbsp;</span>
                  <div
                    className={styles.profileCardFixed__profil__profession}
                    dangerouslySetInnerHTML={{ __html: userDetails?.approachableFor }}
                  ></div>
                </>
              )}
            </div>
          </div>
          <div className={styles.profileCardFixed__profil__action__links}>
            <a href={`mailto: ${email}`} className="button buttonImage">
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
        </div>
      </div>
    </div>
  );
};

export default ProfileCardFixed;
