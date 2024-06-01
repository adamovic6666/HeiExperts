import { signOut, useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import TwoColorIcons from "../../components/TwoColorIcons";
import styles from "../../styles/components/header.module.scss";
import icons from "../../styles/src/index";
import Branding from "./Branding";
import ProfilePopup from "./ProfilePopup";

export let updateUserDetails: (newData: any) => void;

const Header = () => {
  const { data, status }: any = useSession();
  const { t } = useTranslation("common");
  const [sticky, setSticky] = useState("");
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [languageSwitcherDropdownIsOpen, setLanguageSwitcherDropdownIsOpen] = useState(false);
  const [profileDropdownIsOpen, setProfileDropdownIsOpen] = useState(false);
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState(router.locale);

  const currentPath = router.asPath.split("?");
  const [user, setUser] = useState<any>({});
  const languageSwitcherRef = useRef<any>(null);
  const profilePopupRef = useRef<any>(null);

  updateUserDetails = useCallback((newData: any) => {
    setUser({ ...user, ...newData });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", isSticky);
    return () => {
      window.removeEventListener("scroll", isSticky);
    };
  }, [sticky]);

  useEffect(() => {
    setIsNavOpen(false);
    document.body.style.overflow = "auto";
  }, []);

  useEffect(() => {
    setUser({
      firstName: data?.user?.user?.firstName,
      lastName: data?.user?.user?.lastName,
      title: data?.user?.user?.title,
      avatar: data?.user?.user?.avatar,
    });
  }, [data]);

  useEffect(() => {
    document.body.style.overflow = isNavOpen ? "hidden" : "auto";
  }, [isNavOpen]);

  const toggleHamburger = () => setIsNavOpen(prev => !prev);

  const languageHandler = (language: string) => {
    setSelectedLanguage(language);
    const [path, query] = router.asPath.split("?");
    router.push({ pathname: path, query }, undefined, {
      locale: language,
    });
    setLanguageSwitcherDropdownIsOpen(!languageSwitcherDropdownIsOpen);
  };

  useEffect(() => {
    if (!languageSwitcherDropdownIsOpen) return;
    const handleClick = ({ target }: any) => {
      if (languageSwitcherRef.current && !languageSwitcherRef.current?.contains(target)) {
        languageSwitcherDropdownIsOpen && setLanguageSwitcherDropdownIsOpen(false);
      }
    };
    window.addEventListener("click", handleClick);
    // clean up
    return () => window.removeEventListener("click", handleClick);
    // eslint-disable-next-line
  }, [languageSwitcherDropdownIsOpen]);

  /* Method that will fix header after a specific scrollable */
  const isSticky = () => {
    const scrollTop = window.scrollY;
    const stickyClass = scrollTop >= 0 ? `${styles.header__sticky}` : ``;
    setSticky(stickyClass);
  };

  const highContrast = () => {
    document.body.classList.toggle("highcontrast");
  };

  useEffect(() => {
    if (!profileDropdownIsOpen) return;
    const handleClick = ({ target }: any) => {
      if (profilePopupRef.current && !profilePopupRef.current?.contains(target)) {
        profileDropdownIsOpen && setProfileDropdownIsOpen(false);
      }
    };
    window.addEventListener("click", handleClick);
    // clean up
    return () => window.removeEventListener("click", handleClick);
    // eslint-disable-next-line
  }, [profileDropdownIsOpen]);

  return (
    <header className={` ${styles.header} ${sticky}`}>
      <div className={styles.header__container}>
        {!data && status !== "loading" && (
          <Link
            onClickCapture={() => {
              router.push({ query: { ...router.query, login: "true" } }, undefined, { shallow: true });
            }}
            className={`${styles.header__menu__item} ${styles.header__menu__item__login}`}
            href="/user/auth?login=true"
          >
            <Image src={icons.loginMenuRed} alt="login" />
            <span>{t("Login")}</span>
          </Link>
        )}
        <div className={styles.header__inner__wrapper}>
          <nav className={styles.header__menu}>
            {data?.user && data?.user?.user?.firstName && (
              <>
                <div
                  ref={profilePopupRef}
                  onClickCapture={() => setProfileDropdownIsOpen(!profileDropdownIsOpen)}
                  className={`${styles.header__profile} ${styles.header__menu__item} ${
                    profileDropdownIsOpen ? styles.header__menu__item__highlighted : ""
                  }`}
                >
                  <div
                    className={`${styles.header__profile} ${styles.header__menu__item__profile} ${
                      currentPath[0] === `${"/" + data?.user?.user?.slug}` ? styles.activePath : styles.inactivePath
                    }`}
                  >
                    <span className={styles.header__profile__avatar}>
                      {user && user?.avatar?.url && (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${user?.avatar?.url}`}
                          width={32}
                          height={32}
                          alt="profile"
                        />
                      )}
                      {!user && !user?.avatar?.url && (
                        <Image src={icons.profile} width={32} height={32} alt="profile" />
                      )}
                      {t("Hello, ")}
                      {user?.firstName}
                      <Image
                        className={profileDropdownIsOpen ? styles.header__language__switch__arrowRotate : ""}
                        src={icons.arrowDownBlack}
                        alt="arrow-down"
                      />
                    </span>
                  </div>
                  {data && data?.user && (
                    <div>
                      <ProfilePopup
                        profileDropdownIsOpen={profileDropdownIsOpen}
                        currentPath={currentPath[0]}
                        slug={data?.user?.user?.slug ?? ""}
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </nav>
          <div className={styles.header__inner__wrapper__actions}>
            <nav role="navigation">
              <div id="menuToggle">
                <input type="checkbox" checked={isNavOpen} onChange={() => {}} onClick={toggleHamburger} />
                <span></span>
                <span></span>
                <span></span>
              </div>

              <ul className={`${styles.header__mobileMenu} ${isNavOpen ? styles.header__mobileMenu__open : ""}`}>
                <li>
                  {data ? (
                    <div>
                      <Link
                        className={`buttonImage ${styles.header__mobileMenu__myProfile} ${
                          currentPath[0] === `${"/" + data?.user?.user?.slug}` ? styles.activePath : styles.inactivePath
                        }`}
                        href={{ pathname: "/[slug]", query: { slug: data?.user?.user?.slug } }}
                        onClickCapture={() => {
                          toggleHamburger();
                        }}
                      >
                        {user?.avatar?.url && (
                          <Image
                            src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${user?.avatar?.url}`}
                            width={32}
                            height={32}
                            alt="profile"
                          />
                        )}
                        {!user?.avatar?.url && <Image src={icons.profile} width={32} height={32} alt="profile" />}
                        {t("My Profile")}
                      </Link>
                      <Link
                        className={`buttonImage ${styles.header__mobileMenu__myFavorites} ${
                          currentPath[0] === `${"/" + data?.user?.user?.slug}/favorites`
                            ? styles.activePath
                            : styles.inactivePath
                        }`}
                        href={{
                          pathname: `/[slug]/favorites`,
                          query: { slug: data?.user?.user?.slug },
                        }}
                        onClickCapture={() => {
                          toggleHamburger();
                        }}
                      >
                        <TwoColorIcons
                          name="heart"
                          active={currentPath[0] === `${"/" + data?.user?.user?.slug}/favorites` ? true : false}
                        />
                        {t("My favorite list")}
                      </Link>
                      <div
                        className={`buttonImage ${styles.header__mobileMenu__logout}`}
                        onClickCapture={() => {
                          typeof window !== "undefined" && sessionStorage.removeItem("animation");
                          toggleHamburger();
                          signOut({
                            callbackUrl: `${router.locale === "en" ? "/en" : "/"}`,
                          });
                        }}
                      >
                        <Image src={icons.loginMenu} alt="logo-image" />
                        {t("Logout")}
                      </div>
                    </div>
                  ) : (
                    <Link
                      href="/user/auth?login=true"
                      onClickCapture={() => {
                        toggleHamburger();
                      }}
                    >
                      <Image src={icons.loginMenu} alt="login" />
                      <span>{t("Login")}</span>
                    </Link>
                  )}
                </li>
                <li>
                  <button onClick={highContrast}>
                    <Image src={icons.themeSwitcher} alt="theme-switcher-image-icon" />
                    {t("Contrast")}
                  </button>
                </li>
                <li>
                  <Link
                    className={`${currentPath[0] === "/easy-language" ? styles.activePath : styles.inactivePath}`}
                    href="/easy-language"
                    onClickCapture={() => {
                      toggleHamburger();
                    }}
                  >
                    <TwoColorIcons name="easyLanguage" active={currentPath[0] === "/easy-language" ? true : false} />
                    {t("Easy languages")}
                  </Link>
                </li>
              </ul>
            </nav>
            <Branding onClick={() => setIsNavOpen(false)} />

            <div
              ref={languageSwitcherRef}
              className={`${styles.header__language__switch} ${
                languageSwitcherDropdownIsOpen && styles.header__language__switch__open
              }`}
              defaultValue={router.locale}
              // onChange={e => languageHandler(e.target.value)}
            >
              <div
                className={styles.header__language__switch__selectedOption}
                onClickCapture={() => setLanguageSwitcherDropdownIsOpen(!languageSwitcherDropdownIsOpen)}
              >
                {selectedLanguage === "de" && (
                  <span>
                    <Image src={icons.germanyFlag} alt="german-flag" /> DE
                  </span>
                )}
                {selectedLanguage === "en" && (
                  <span>
                    <Image src={icons.ukFlag} alt="uk-flag" /> EN
                  </span>
                )}
                <Image
                  className={languageSwitcherDropdownIsOpen ? styles.header__language__switch__arrowRotate : ""}
                  src={icons.arrowDownBlack}
                  alt="arrow-down"
                />
              </div>
              {languageSwitcherDropdownIsOpen && (
                <div className={styles.header__language__switch__dropdown}>
                  {selectedLanguage === "de" && (
                    <span onClickCapture={() => languageHandler("en")}>
                      <Image src={icons.ukFlag} alt="uk-flag" /> EN
                    </span>
                  )}
                  {selectedLanguage === "en" && (
                    <span
                      onClickCapture={() => {
                        languageHandler("de");
                      }}
                    >
                      <Image src={icons.germanyFlag} alt="german-flag" /> DE
                    </span>
                  )}
                </div>
              )}
            </div>
            <button onClick={highContrast}>
              <Image src={icons.themeSwitcher} alt="theme-switcher-image-icon" />
            </button>
            <Link href="/easy-language">
              <TwoColorIcons name="easyLanguage" active={currentPath[0] === "/easy-language" ? true : false} />
            </Link>
            {/* <Branding onClick={() => setIsNavOpen(false)} /> */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
