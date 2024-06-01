import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toggleFilters } from "../../components/filters/Filters";
import styles from "../../styles/components/search.module.scss";
import icons from "../../styles/src";
import { debounce } from "../../utils/index";

type Data = {
  reFetch: ({}: any) => void;
  updateSearchValue: (val: string) => void;
  onFetching: () => void;
  isClearButtonVisible: boolean;
  setIsClearButtonVisible: (isVisilbe: boolean) => void;
};

export default function Search({
  reFetch,
  updateSearchValue,
  onFetching,
  isClearButtonVisible,
  setIsClearButtonVisible,
}: Data) {
  const { t } = useTranslation("common");
  const searchRef = useRef<any>();
  const dropdownRef = useRef<any>();
  // const { refetch } = useQuery(SEARCH);
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
  const [searchData, setSearchData] = useState<any>([]);
  const handleFilters = () => {
    toggleFilters();
  };

  const searchHistory = typeof window !== "undefined" && localStorage.getItem("search-history");

  const getSearchHistory = () => searchHistory && JSON.parse(searchHistory);

  const getLocalStorageSearchHistory = () => {
    setDropdownIsOpen(true);
    const history = getSearchHistory();
    setSearchData(history || []);
  };

  const setSearchHistory = (value: any) => {
    localStorage.setItem("search-history", JSON.stringify(value));
  };

  const updateHistoryAndSearchData = (searchedData: any[]) => {
    setSearchHistory(searchedData);
    setSearchData(searchedData);
  };

  const setInputValueToLocalStorage = () => {
    // IF NO HISTORY
    if (!searchHistory && searchRef.current) {
      setSearchHistory([searchRef.current.value]);
    }

    if (searchHistory && searchRef.current) {
      const history = getSearchHistory();

      // CHECK IF VALUE IN HISTORY ALREADY EXISTS
      if (history.includes(searchRef.current.value)) {
        const updatedHistory = history.filter(
          (value: string) => searchRef.current && value !== searchRef.current.value,
        );
        updateHistoryAndSearchData([searchRef.current.value, ...updatedHistory]);
        return;
      }

      if (history.length >= 10) {
        const slicedSerachHistory = history.slice(0, 9);
        updateHistoryAndSearchData([searchRef.current.value, ...slicedSerachHistory]);
        return;
      }
      updateHistoryAndSearchData([searchRef.current.value, ...history]);
    }
  };

  useEffect(() => {
    if (!dropdownIsOpen) return;
    const handleClick = ({ target }: any) => {
      if (dropdownRef.current && !dropdownRef.current?.contains(target) && !searchRef.current?.contains(target)) {
        setDropdownIsOpen(false);
      }
    };
    window.addEventListener("click", handleClick);
    // clean up
    return () => window.removeEventListener("click", handleClick);
    // eslint-disable-next-line
  }, [dropdownIsOpen]);

  return (
    <div className={styles.search} id="search_bar">
      <div className={styles.search__container}>
        <input
          ref={searchRef}
          onClick={getLocalStorageSearchHistory}
          onKeyDownCapture={ev => {
            if (ev.key === "Enter") {
              searchRef.current.value.trim() !== "" && setInputValueToLocalStorage();
              setDropdownIsOpen(false);
              onFetching();
              reFetch(searchRef.current.value);
            }
          }}
          onChange={e =>
            debounce(async () => {
              onFetching();
              reFetch(e.target.value);
              updateSearchValue(e.target.value);
              setDropdownIsOpen(false);
            }, 500)
          }
          className={`${styles.search__input}`}
          placeholder={`${t("Keywords")}...`}
          type="text"
        />
        {isClearButtonVisible && (
          <button className={`button buttonImage ${styles.search__button__close}`}>
            <Image
              src={icons.close}
              alt="close"
              onClickCapture={() => {
                onFetching();
                reFetch("");
                if (searchRef.current) {
                  searchRef.current.value = "";
                }
                setIsClearButtonVisible(false);
                updateSearchValue("");
              }}
            />
          </button>
        )}
        <button className={`button buttonImage ${styles.search__button}`}>
          <Image
            src={icons.search}
            alt="search"
            onClickCapture={() => {
              if (!searchRef.current.value) return;
              onFetching();
              reFetch(searchRef.current.value);
              updateSearchValue(searchRef.current.value);
              setDropdownIsOpen(false);
            }}
          />
        </button>
        {dropdownIsOpen && (
          <ul className={styles.search__dropdown} ref={dropdownRef}>
            {searchData.map((d: string, idx: number) => {
              return (
                <li key={idx}>
                  <div
                    onClick={async () => {
                      if (searchRef.current) {
                        setDropdownIsOpen(false);
                        searchRef.current.value = d;
                        updateSearchValue(d);
                        reFetch(d);
                        setInputValueToLocalStorage();
                        onFetching();
                      }
                    }}
                  >
                    <Image src={icons.refresh} alt="icon-close" />
                    <span>{d}</span>
                  </div>
                  <Image
                    src={icons.arrowDiagonal}
                    alt="icon-arrow"
                    onClickCapture={() => {
                      setDropdownIsOpen(false);
                      searchRef.current.value = d;
                      searchRef.current.focus();
                    }}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
