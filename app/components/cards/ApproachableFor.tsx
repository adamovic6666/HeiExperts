import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "../../styles/components/profileCard.module.scss";

const ApproachableFor = ({ data }: any) => {
  const { t } = useTranslation("common");
  const [expandend, setExpandend] = useState(false);
  const approachableForWrapper = useRef<any>(null);

  const toggleExpanded = () => {
    setExpandend(prev => !prev);
  };

  useEffect(() => {
    if (approachableForWrapper.current) {
      const spanElement = approachableForWrapper.current.querySelector("span")! as HTMLElement;
      if (spanElement) {
        spanElement.style.fontSize = "unset";
      }
    }
  }, []);

  return (
    <>
      <div className={`${styles.profileCard__profil__skills} ${expandend && styles.expanded}`}>
        <span>{t("Approachable for")}:&nbsp;</span>
        <div ref={approachableForWrapper} dangerouslySetInnerHTML={{ __html: data ?? "" }}></div>
      </div>
      <div>
        <button className={styles.showMoreLink} style={expandend ? { display: "none" } : {}} onClick={toggleExpanded}>
          {t("Show more")}
        </button>
      </div>
    </>
  );
};

export default ApproachableFor;
