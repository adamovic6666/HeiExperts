import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useContext, useEffect, useMemo, useState } from "react";
import ProfileTeaser from "../../components/profileTeaser/ProfileTeaser";
import Slider from "../../components/slider/Slider";
import { PROFILE_TYPES } from "../../constants/index";
import { FavoritesContext } from "../../context/favoritesContext";
import styles from "../../styles/components/connectedProfiles.module.scss";
import icons from "../../styles/src/index";
import { ConnectedProfilesSlider } from "../../types/index";

const ConnectedProfiles = ({ onEdit, connectedTo, expertCanEdit }: ConnectedProfilesSlider) => {
  const { t } = useTranslation("common");
  const { updateFavorites, favorites } = useContext(FavoritesContext);
  const [isSlider, setIsSlider] = useState(false);
  const { data: sessionData }: any = useSession();
  const filteredData = connectedTo?.filter(profile => profile?.id != sessionData?.user.user.id);

  const isMobile = () => {
    return typeof window !== "undefined" && window.innerWidth < 1024;
  };

  useEffect(() => {
    if ((isMobile() && filteredData.length > 1) || (!isMobile() && filteredData.length > 2)) {
      setIsSlider(true);
    } else {
      setIsSlider(false);
    }
  }, [filteredData.length, favorites]);

  const memoizedSlider = useMemo(
    () => <Slider slides={filteredData} onFollow={({ id }: any) => updateFavorites(+id)} favoritesIds={favorites} />,
    [filteredData, favorites, updateFavorites],
  );

  return (
    <div className={`${styles.ctdProfiles} step-8`}>
      <div className={styles.ctdProfiles__title}>
        <h3>{t("Connected Profiles")}</h3>
      </div>
      {isSlider ? (
        memoizedSlider
      ) : (
        <div className={styles.ctdProfiles__teaser__wrapper}>
          {filteredData.map((profile, key) => (
            <ProfileTeaser
              profile={profile}
              key={key}
              toUnfollow={true}
              favoritesIds={favorites}
              onFollow={({ id }) => updateFavorites(+id)}
            />
          ))}
        </div>
      )}
      {expertCanEdit && (
        <button
          className={`editPen ${styles.ctdProfiles__edit}`}
          onClick={onEdit?.bind(this, PROFILE_TYPES.CONNECTED_PROFILE, filteredData)}
        >
          <Image src={icons.edit} alt="edit-image" />
          <Image className={`editPen__hover`} src={icons.editHover} alt="edit-image" />
        </button>
      )}
    </div>
  );
};

export default ConnectedProfiles;
