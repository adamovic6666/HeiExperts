import Image from "next/image";
import { useEffect, useRef } from "react";
import styles from "../../styles/components/select.module.scss";
import icons from "../../styles/src";
import { SelectType } from "../../types/index";

const Select = ({
  label,
  allFaculties,
  initiallySelected,
  onChange,
  setIsOpen,
  isOpen,
  onFilterFaculties,
}: SelectType) => {
  const selectRef = useRef<any>(null);
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = ({ target }: any) => {
      if (selectRef.current && !selectRef.current?.contains(target)) {
        setIsOpen && setIsOpen(false);
      }
    };
    window.addEventListener("click", handleClick);
    // clean up
    return () => window.removeEventListener("click", handleClick);
    // eslint-disable-next-line
  }, [isOpen]);

  return (
    <>
      <div className={styles.select} ref={selectRef}>
        <div className={styles.select__value__wrapper} onClickCapture={() => setIsOpen && setIsOpen(true)}>
          <span className={styles.select__label}>{label}</span>
          <div className={styles.select__value}>
            <div>{initiallySelected}</div>
            <Image
              src={icons.arrowDown}
              alt="arrow-down-icon"
              className={`${isOpen ? styles.select__icon__rotate : ""}`}
              onClickCapture={() => setIsOpen && setIsOpen(!isOpen)}
            />
          </div>
        </div>
        {isOpen && (
          <div className={styles.select__dropdown}>
            <input className={styles.select__dropdown__search} type="text" onChange={onFilterFaculties} />
            <div>
              {allFaculties &&
                allFaculties.map((option: any, idx: number) => {
                  return (
                    <div className="formItem formTypeCheckbox" key={idx} onClickCapture={() => onChange(option)}>
                      <label htmlFor="language">{option.label}</label>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Select;
