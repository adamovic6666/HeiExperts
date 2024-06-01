import Image from "next/image";
import styles from "../../styles/components/filters.module.scss";
import icons from "../../styles/src";

type FilterGrouplData = {
  filter: any;
  onFilterCheck: (filter: any, type: string) => void;
  onCloseDropdown: (filter: any, type: string) => void;
  isReseted: boolean;
  isMain?: boolean;
};

const FilterLevel = ({ filter, onCloseDropdown, onFilterCheck, isReseted, isMain }: FilterGrouplData) => {
  return (
    <li key={filter.label} className={`${styles.filters__mainItem} ${!isMain && styles.filters__subItem}`}>
      <span className={`${styles.filters__mainLabel} ${styles.filterLabel}`}>
        <div className={`formItem formTypeCheckbox ${isMain && "formFilterType"}`}>
          <div
            className={`${styles.filters__mainLabel__inputWrapper}`}
            onClickCapture={ev => {
              !isMain && onFilterCheck(filter, "onCheckboxClick");
            }}
          >
            <input
              type="checkbox"
              onChange={onFilterCheck.bind(this, filter, "onCheckboxClick")}
              checked={filter.checked && !isReseted}
            />
            <label
              htmlFor=""
              className="filter-label"
              onClickCapture={() => isMain && onCloseDropdown(filter, "onArrowClick")}
            >
              {filter.label}
            </label>
          </div>
          {filter.categoryItems && filter.categoryItems.length > 0 && (
            <Image
              src={icons.arrow}
              alt="arrow"
              className={`dropdown ${filter.childrenAreVisible ? styles.filters__arrowFlip : ""}`}
              onClickCapture={() => onCloseDropdown(filter, "onArrowClick")}
            />
          )}
        </div>
      </span>
      {/* {filter.childrenAreVisible && ( */}
      <ul
        className={`${filter.childrenAreVisible ? styles.filters__mainList__open : styles.filters__mainList__closed} ${
          styles.filters__mainList
        }`}
      >
        {filter.categoryItems &&
          filter.categoryItems.map((f: any) => {
            return (
              <FilterLevel
                isMain={false}
                isReseted={isReseted}
                key={f.label}
                filter={f}
                onCloseDropdown={onCloseDropdown}
                onFilterCheck={onFilterCheck}
              />
            );
          })}
      </ul>
      {/* )} */}
    </li>
  );
};

export default FilterLevel;
