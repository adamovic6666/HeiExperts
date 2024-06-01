import { signOut, useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../../styles/components/profile-popup.module.scss";
import icons from "../../styles/src/index";

type Data = {
  slug: string;
  currentPath: string;
  profileDropdownIsOpen: boolean;
};

const ProfilePopup = ({ slug, currentPath, profileDropdownIsOpen }: Data) => {
  const { t } = useTranslation("common");
  const { data }: any = useSession();
  const { locale } = useRouter();

  return (
    <div className={`${styles.profilePopup} ${profileDropdownIsOpen ? styles.profilePopup__show : ""}`}>
      {/* <div className={styles.profilePopup__menu}> */}
      <Link
        className={`buttonImage ${styles.profilePopup__menu__item} ${
          currentPath === `${"/" + slug}` ? styles.activePath : styles.inactivePath
        }`}
        href={`/${slug}`}
      >
        {t("My Profile")}
      </Link>

      <Link
        className={`${styles.profilePopup__menu__item} ${
          currentPath === `${"/" + data?.user?.user?.slug}/favorites` ? styles.activePath : styles.inactivePath
        }`}
        href={{
          pathname: `/[slug]/favorites`,
          query: { slug: data?.user?.user?.slug },
        }}
      >
        {t("My favorite list")}
      </Link>
      {/* </div> */}
      <div className={` ${styles.profilePopup__logout}`}>
        {data && (
          <div
            className={`button secondaryButton buttonImage`}
            onClickCapture={() => {
              signOut({
                callbackUrl: `${locale === "en" ? "/en" : "/"}`,
              });
            }}
          >
            <Image src={icons.login} alt="logo-image" />
            {t("Logout")}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePopup;
