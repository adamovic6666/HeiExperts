import Image from "next/image";
import { useEffect, useState } from "react";
import PageParticles from "../../components/particles/PageParticles";
import styles from "../../styles/components/paragraphs.module.scss";
import icons from "../../styles/src";

const ParagraphBeforeAfter = ({ aboutUs }: any) => {
  const { titleLeft, titleRight, previewRight, previewLeft, bodyRight, bodyLeft } = aboutUs;
  const [hovered, setHovered] = useState("");
  const [clicked, setClicked] = useState("");

  const [textSplit, setTextSplit] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 480) {
        setTextSplit(true);
      }
    }
  }, []);

  const setHoveredHandler = (val: string) => {
    if (typeof window !== "undefined" && window.innerWidth < 480) return;
    setHovered(val);
  };

  const splitTextAndConvertToHtml = (text: string) => {
    let splitedText = text.split("|").join("<br>");
    return `<p>${splitedText}</p>`;
  };

  const onClickHandler = (val: string) => {
    setClicked(val);
  };

  const isMobile = () => {
    return typeof window !== "undefined" && window.innerWidth < 1024;
  };

  return (
    <div className={styles.paragraphBeforeAfter}>
      <div
        className={`${hovered === "left" ? styles.paragraphBeforeAfter__left__increase : ""} ${
          hovered === "right" ? styles.paragraphBeforeAfter__left__decrease : ""
        } ${styles.paragraphBeforeAfter__left} `}
        onMouseOverCapture={() => setHoveredHandler("left")}
        onMouseLeave={() => setHoveredHandler("")}
      >
        <button onClickCapture={() => onClickHandler("left")}>
          <Image src={icons.btnArrow} alt="arrow-icon" />
        </button>
        <div
          className={`${clicked === "left" ? styles.paragraphBeforeAfter__left__move : ""} ${
            styles.paragraphBeforeAfter__left__textWrapper
          }`}
        >
          <div>
            <h2>{titleLeft}</h2>
            {textSplit ? (
              <div dangerouslySetInnerHTML={{ __html: splitTextAndConvertToHtml(previewLeft) }}></div>
            ) : (
              <p>{previewLeft}</p>
            )}
          </div>
          <div>
            <p>{bodyLeft}</p>
          </div>
        </div>
        <div className={styles.paragraphBeforeAfter__left__corner}></div>
        <div className={styles.paragraphBeforeAfter__left__particlesWrapper}>
          {/* {!isMobile() && <PageParticles className="page-particles" id="before-after-particles-1" />} */}
          <PageParticles className="page-particles" id="before-after-particles-1" />
        </div>
      </div>
      <div
        className={`${hovered === "right" ? styles.paragraphBeforeAfter__right__increase : ""} ${
          hovered === "left" ? styles.paragraphBeforeAfter__right__decrease : ""
        } ${styles.paragraphBeforeAfter__right}`}
        onMouseLeave={() => setHoveredHandler("")}
        onMouseOverCapture={() => setHoveredHandler("right")}
      >
        <button onClickCapture={() => onClickHandler("right")}>
          <Image src={icons.btnArrow} alt="arrow-icon" />
        </button>

        <div
          className={`${styles.paragraphBeforeAfter__right__textWrapper} ${
            clicked === "right" ? styles.paragraphBeforeAfter__right__move : ""
          }`}
        >
          <div>
            <h2>{titleRight}</h2>
            {textSplit ? (
              <div dangerouslySetInnerHTML={{ __html: splitTextAndConvertToHtml(previewRight) }}></div>
            ) : (
              <p>{previewRight}</p>
            )}
          </div>
          <div>
            <p>{bodyRight}</p>
          </div>
        </div>
        <div className={styles.paragraphBeforeAfter__right__corner}></div>
        <div className={styles.paragraphBeforeAfter__right__particlesWrapper}>
          {/* {!isMobile() && <PageParticles className="page-particles" id="before-after-particles-2" />} */}
          <PageParticles className="page-particles" id="before-after-particles-2" />
        </div>
      </div>
    </div>
  );
};

export default ParagraphBeforeAfter;
