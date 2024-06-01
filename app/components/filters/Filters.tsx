import { useQuery } from "@apollo/client";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { SEARCH } from "../../graphql/schemas/queries";
import styles from "../../styles/components/filters.module.scss";
import icons from "../../styles/src";
import FilterLevel from "./FilterLevel";

export let toggleFilters: () => void;

type Data = {
  filters: any[];
  reset?: () => void;
  update: (data: any) => void;
  setFilterIds: ([]: any) => void;
  onSetCategories?: (data: any) => void;
  selectedTags?: any;
  searchValue?: string;
  loading?: boolean;
  onSetLoader?: (data: boolean) => void;
};

export default function Filters({
  filters,
  reset,
  update,
  setFilterIds,
  selectedTags,
  onSetCategories,
  searchValue,
  onSetLoader,
}: Data) {
  const { t } = useTranslation("common");
  const [isOpen, setIsOpen] = useState(false);
  const { refetch } = useQuery(SEARCH);
  const [allFilters, setFilters] = useState(filters);
  const [initialFilter, setInitialFilters] = useState<any[]>([]);
  const [ids, setIds] = useState<string[]>([]);
  const [isReseted, setIsReseted] = useState(false);
  const { pathname } = useRouter();
  const [animated, setAnimated] = useState(false);
  const filtersRef = useRef<any>(null);

  const isMainPage = pathname === "/";

  let newIds: string[] = [];
  let newLabels: string[] = [];

  toggleFilters = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  useEffect(() => {
    setInitialFilters(filters);
  }, []);

  useEffect(() => {
    if (pathname !== "/") {
      setAnimated(false);
      return;
    }
    setAnimated(true);
  }, [pathname]);

  const isMobile = () => {
    return typeof window !== "undefined" && window.innerWidth < 1024;
  };

  useEffect(() => {
    // if (!isOpen) return;
    const handleClick = (ev: any) => {
      if (ev.target.id === "button-filter" || ev.target.id === "filter-img" || ev.target.id === "connected-profile-id")
        return;
      if (filtersRef.current && !filtersRef.current?.contains(ev.target) && isMobile()) {
        // @ts-ignore
        !setIsOpen && setIsOpen(true);
      }
    };
    window.addEventListener("click", handleClick);
    // clean up
    return () => window.removeEventListener("click", handleClick);
    //eslint-disable-next-line
  }, [isOpen]);

  useEffect(() => {
    if (ids.length === 0 && !searchValue && selectedTags?.length === 0) {
      reset?.();
      return;
    }
    setFilterIds(ids);
    if (isMainPage) {
      onSetLoader?.(true);
      let modifiedFilters;

      if (ids.length === 0 && selectedTags.length === 0) {
        modifiedFilters = {};
      }

      if (ids.length === 0 && selectedTags.length > 0) {
        modifiedFilters = {
          tags: selectedTags.map((tag: any) => tag.id),
        };
      }

      if (selectedTags.length > 0 && ids.length > 0) {
        modifiedFilters = {
          categoryItems: ids,
          tags: selectedTags.map((tag: any) => tag.id),
        };
      }

      if (selectedTags.length === 0 && ids.length > 0) {
        modifiedFilters = {
          categoryItems: ids,
        };
      }

      refetch({
        search: searchValue,
        filters: modifiedFilters,
      }).then(res => {
        update(res.data.experts);
        onSetLoader?.(false);
      });
    } else {
      refetch({
        search: searchValue,
        filters: {
          categoryItems: ids,
          tags: selectedTags && selectedTags.map((tag: any) => tag.id),
        },
      }).then(res => {
        update(res.data.experts);
      });
    }
  }, [ids.length, isMainPage]);

  const onResetHandler = () => {
    reset?.();
    setIsReseted(true);
    setFilters(initialFilter);
    setIds([]);
    onSetCategories && onSetCategories([]);
  };

  let labels: any[] = [];

  const getAllLabels = (filters: any[]) => {
    filters.forEach((filter: any) => {
      if (filter.checked) {
        labels.push(filter);
      }
      if (filter.categoryItems) {
        getAllLabels(filter.categoryItems);
      }
    });

    onSetCategories && onSetCategories(labels);
  };

  const getIDs = (filters: any) => {
    // GET THE OBJ WHERE ARRAY HAS LABEL
    getAllLabels(filters);
    filters.map((filter: any) => {
      searchForFilter(filter.categoryItems, "categoryItems", null, "get-id");
    });
  };

  const uncheckParentCheckbox = (el: any, initialFilters: [any]) => {
    if (el.categoryItems.some((filter: any) => !filter.checked)) {
      el.checked = false;
      getIDs(initialFilters);
      setFilters(initialFilters);
      return;
    }
    el.checked = true;
    getIDs(initialFilters);
    setFilters(initialFilters);
  };

  const selectAllInnerCheckboxes = (el: any, initialFilters: [any], key: string, parentIsChecked: boolean) => {
    el.checked = parentIsChecked;
    setFilters(initialFilters);
    if (el[key]) {
      el[key].forEach((e: any) => {
        selectAllInnerCheckboxes(e, initialFilters, key, parentIsChecked);
      });
    }
  };

  const findLabel = (el: any, key: string, filter: any, initialFilters: [any] | any, event: string) => {
    if (event === "onArrowClick") {
      if (!el[key]) return;
      if (el.label === filter.label) {
        el.childrenAreVisible = !el.childrenAreVisible;
        setFilters(initialFilters);
      } else {
        searchForFilter(el[key], filter, initialFilters, event);
      }
    }

    if (event === "onCheckboxClick") {
      if (el.label === filter.label) {
        el.checked = !el.checked;

        if (el[key]) {
          el[key].forEach((e: any) => {
            selectAllInnerCheckboxes(e, initialFilters, key, el.checked);
          });
        }
        setFilters(initialFilters);
        if (!el.checked) {
          setIds(() => []);
        }
        if (!el.id) {
          if (!el.checked) {
            getIDs(initialFilters);
            return;
          }
          getIDs(initialFilters);
        }
        // getIDs(initialFilters);
        return;
      }

      if (el[key]) {
        searchForFilter(el[key], filter, initialFilters, event);
      }

      if (el[key] && el[key].some((f: any) => f.label === filter.label)) {
        uncheckParentCheckbox(el, initialFilters);
      }
    }

    if (event === "get-id") {
      if (el.checked) {
        newIds.push(el.id);
        newLabels.push(el.label);
        setIds(() => [...newIds]);
      }

      if (!el.checked) {
        if (el.categoryItems) {
          el[key].forEach((e: any) => {
            searchForFilter(e[key], "categoryItems", null, "get-id");
            if (e.checked) {
              newIds.push(e.id);
              newLabels.push(e.label);
              setIds(() => [...newIds]);
            }
          });
        }
      }

      if (el[key] && el.checked) {
        el[key].forEach((e: any) => {
          newIds.push(e.id);
          newLabels.push(e.label);
          setIds(() => [...newIds]);
          searchForFilter(e[key], "categoryItems", null, "get-id");
        });
      }
    }
  };

  const searchForFilter = (filters: [any], filter: any, initialFilters: [any] | null, event: string) => {
    if (!filters) return;
    let ids = filters.find(f => findLabel(f, "categoryItems", filter, initialFilters, event));
  };

  const onEventHandler = (filter: any, event: string) => {
    // event !== "onArrowClick" && onSetCategories && onSetCategories(filter.label);
    setIsReseted(false);
    const modifiedFilters = JSON.parse(JSON.stringify(allFilters));
    searchForFilter(modifiedFilters, filter, modifiedFilters, event);
  };

  // const filtersStyleOpen = isOpen ? styles.filters__open : "";
  const filtersStyleOnEditPage = !isMainPage ? styles.filters__onEditProfile : "";
  const filtersStyleOpenOnEditPage = !isMainPage && isOpen ? styles.filters__onEditProfile__open : "";

  return (
    <div
      ref={filtersRef}
      id="filters"
      className={
        isOpen
          ? `${styles.filters} ${styles.filters__open} ${filtersStyleOpenOnEditPage} filter_isLeft`
          : `${styles.filters} ${filtersStyleOnEditPage} filter_isLeft ${
              animated && isMainPage ? styles.filters__initial__open : styles.filters__initial
            }`
      }
    >
      <div className={styles.filters__container}>
        <div className={`${styles.filters__header}`} id="button-filter">
          {isOpen && (
            <div
              style={{
                opacity: ids.length > 0 || !isOpen ? "1" : "0",
                pointerEvents: ids.length > 0 || !isOpen ? "auto" : "none",
                width: ids.length > 0 || !isOpen ? "auto" : "0%",
              }}
              className={`buttonImage ${styles.filters__title} ${isOpen ? styles.filters__buttonOpen : ""} ${
                isMobile() && (!isOpen || ids.length === 0) && "buttonImageNone"
              } `}
              onClickCapture={() => isOpen && onResetHandler()}
            >
              <Image
                onClick={() => {
                  setIsOpen(true);
                }}
                src={icons.reset}
                alt="filters"
                className={`${!isOpen ? styles.filters__button__open : styles.filters__button}`}
              />
              {isOpen && t("Reset")}
            </div>
          )}
          <div
            className={`${
              isMobile() && isOpen && ids.length > 0 ? styles.filters__button__closed__wrapper : styles.filters__button
            } ${!isOpen && styles.filters__button__withMargin}`}
          >
            {isOpen && (
              <Image onClickCapture={toggleFilters} src={icons.closeWhite} alt="filters" id="filter-img-close" />
            )}
            {!isOpen && (
              <Image
                className={!isOpen ? styles.filters__button__filter__img : ""}
                onClickCapture={toggleFilters}
                src={icons.filters}
                alt="filters"
                id="filter-img"
              />
            )}
          </div>
        </div>
        <ul
          className={`${isOpen ? styles.filters__mainList__open : styles.filters__mainList__closed} ${
            styles.filters__mainList
          }`}
        >
          {allFilters?.map(filter => {
            return (
              <FilterLevel
                isMain
                isReseted={isReseted}
                key={filter.label}
                filter={filter}
                onCloseDropdown={onEventHandler}
                onFilterCheck={onEventHandler}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
}
