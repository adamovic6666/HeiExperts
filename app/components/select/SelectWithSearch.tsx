import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "../../styles/components/select.module.scss";
import icons from "../../styles/src";

type Data = {
  options: any;
  onChange: (data: string, label: string) => void;
  label: string;
  search: (data: string, id: string) => void;
  id: string;
  selectedOptions: any[];
  inputValue: string;
  dropdownIsOpen: boolean;
  onDropdownIsOpen: (isOpen: boolean) => void;
};

const SelectWithSearch = ({
  options,
  onChange,
  label,
  search,
  id,
  selectedOptions,
  inputValue,
  dropdownIsOpen,
  onDropdownIsOpen,
}: Data) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation("common");

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

  // console.log(selectedOptions, "selectedOptions");

  return (
    <div className={styles.select} ref={selectRef}>
      {/* <div className={styles.select} ref={selectRef}> */}
      <div
        className={styles.select__value__wrapper}
        onClickCapture={() => {
          setIsOpen && setIsOpen(true);
          onDropdownIsOpen(true);
        }}
      >
        {/* <div>{initiallySelected ?? "Selected"}</div> */}
        {/* <span>nest</span> */}
        <div className={styles.select__value}>
          <span
            className={
              selectedOptions.length > 0 ? styles.select__withSearch__labelPostion : styles.select__withSearch__label
            }
          >
            {label}
          </span>

          {selectedOptions.length > 0 && (
            <span>
              {selectedOptions.length} {t("Selected")}
            </span>
          )}
          <Image
            src={icons.arrowDown}
            alt="arrow-down-icon"
            className={`${isOpen && dropdownIsOpen ? styles.select__icon__rotate : ""}`}
            onClickCapture={() => {
              setIsOpen && setIsOpen(!isOpen);
              onDropdownIsOpen(true);
            }}
          />
        </div>
      </div>
      {isOpen && dropdownIsOpen && (
        <div className={styles.select__dropdown__withSearch}>
          <input
            className={styles.select__dropdown__search}
            type="text"
            onChange={({ target }) => search(target.value, id)}
            placeholder="Search..."
            value={inputValue}
          />
          <div>
            {options &&
              options.map((option: any, idx: number) => {
                return (
                  <div className="formItem formTypeCheckbox" key={idx}>
                    <label htmlFor="language">
                      <input
                        id={label + idx}
                        onChange={() => onChange(option, id)}
                        type="checkbox"
                        name={option.label}
                        checked={selectedOptions.some((o: any) => o.isChecked === option.isChecked)}
                      />
                      <span onClickCapture={() => onChange(option, id)}> {option.label}</span>
                    </label>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectWithSearch;
