import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";
import styles from "../../styles/components/footer.module.scss";
import icons from "../../styles/src";

export default function Footer({ icons: socialIcons }: any) {
  const { t } = useTranslation("common");
  return (
    <footer className={styles.footer}>
      <div className={styles.footer__container}>
        <ul className={styles.footer__socialMenu}>
          <li className={styles.footer__socialMenu__item}>
            {socialIcons?.instagramLink && (
              <a href={socialIcons?.instagramLink} target="_blank" rel="noreferrer">
                <Image src={icons.instagram} alt="instagram" />
              </a>
            )}
          </li>
          <li>
            {socialIcons?.facebookLink && (
              <a href={socialIcons?.facebookLink} target="_blank" rel="noreferrer">
                <Image src={icons.facebook} alt="facebook" />
              </a>
            )}
          </li>
          <li>
            {socialIcons?.linkedinLink && (
              <a href={socialIcons?.linkedinLink} target="_blank" rel="noreferrer">
                <Image src={icons.linkedin} alt="linkedin" />
              </a>
            )}
          </li>
        </ul>
        <div className={styles.footer__linksWrapper}>
          <Link href="/faq">FAQs</Link>
          <Link href="/imprint">Impressum</Link>
          <Link href="/data-protection">Datenschutz</Link>
        </div>
        <p>
          {t("Designed and developed by")}
          <a href="https://www.studiopresent.de/" target="_blank" rel="noreferrer">
            Studio Present
          </a>
        </p>
      </div>
    </footer>
  );
}
