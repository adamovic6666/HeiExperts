import { useQuery } from "@apollo/client";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useEffect, useState } from "react";
import SelectWithSearch from "../../components/select/SelectWithSearch";
import { GET_CATEGORIES_WITH_FIRST_LEVEL_ITEMS, SEARCH } from "../../graphql/schemas/queries";
import styles from "../../styles/components/homepageFilters.module.scss";
import icons from "../../styles/src/index";

type Data = {
  update: (data: any) => void;
  setFilterIds: ([]: any) => void;
  onSetCategories?: (data: any) => void;
  selectedTags?: any;
  searchValue?: string;
  loading?: boolean;
  onSetLoader?: (data: boolean) => void;
  reset?: () => void;
  isFetching: boolean;
  filters: any;
};

const HomepageFilters = ({
  update,
  setFilterIds,
  selectedTags,
  onSetCategories,
  searchValue,
  onSetLoader,
  reset,
  filters,
}: Data) => {
  const { t } = useTranslation("common");
  const { refetch } = useQuery(SEARCH);
  const { data: allCategories } = useQuery(GET_CATEGORIES_WITH_FIRST_LEVEL_ITEMS);

  const [initialFaculties, setInitialFaculties] = useState<any>([]);
  const [initialInstitutes, setInitialInstitutes] = useState<any>([]);

  const [faculties, setFaculties] = useState<any>([]);
  const [institutes, setInstitutes] = useState<any>([]);

  const [selectedFacultyOptions, setSelectedFacultyOptions] = useState<any>([]);
  const [selectedInstituteOptions, setSelectedInstituteOptions] = useState<any>([]);

  const [filteredInstitutes, setFilteredInstitutes] = useState<any>([]);

  const [facultySearchValue, setFacultySearchValue] = useState("");
  const [instituteSearchValue, setInstituteSearchValue] = useState("");

  const [initial, setInitial] = useState(true);
  const [dropdownIsOpen, setDropdownIsOpen] = useState(true);
  // const [removeInstitutes, setRemoveInstitutes] = useState(false);

  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    let faculties: any[] = [];
    let institutes: any[] = [];
    if (!allCategories) return;
    allCategories.categories.forEach((filter: any, index: number) => {
      faculties.push({ label: filter.label, facultyId: index, isChecked: false });
      filter.categoryItems.forEach((subCategory: any) => {
        institutes.push({ id: subCategory.id, label: subCategory.label, parentID: index, isChecked: false });
      });
    });

    setFaculties(faculties);
    setInitialFaculties(faculties);
    setInstitutes(institutes);
    setInitialInstitutes(institutes);
    setFilteredInstitutes(institutes);
  }, [allCategories]);

  const filterDataAfterSearchAndUpdateState = (
    initialState: any[],
    updateStateFc: any,
    text: string,
    updateSearchTextFc: any,
  ) => {
    const data = initialState.filter((option: any) => {
      return option.label.toLowerCase().includes(text.toLowerCase()) || option.isChecked;
    });
    updateStateFc(data);
    updateSearchTextFc(text);
  };

  useEffect(() => {
    if (ids.length === 0 && !searchValue && selectedTags?.length === 0) {
      reset?.();
      return;
    }

    onSetLoader?.(true);
    setFilterIds(ids);
    let modifiedFilters;
    if (ids.length === 0 && selectedTags.length === 0) {
      searchValue && onSetLoader?.(true);
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
      setDropdownIsOpen(false);
    });
  }, [ids.length]);

  const sortByChecked = (options: any[], searchVal: string) => {
    let modifiedOptions = [...options];
    if (searchVal) {
      modifiedOptions = options.filter(
        (option: any) => option.label.toLowerCase().includes(searchVal.toLowerCase()) || option.isChecked,
      );
    }

    return modifiedOptions.slice().sort((a, b) => {
      if (a.isChecked && !b.isChecked) {
        return -1; // `a` comes before `b`
      } else if (!a.isChecked && b.isChecked) {
        return 1; // `b` comes before `a`
      } else {
        return 0; // Maintain the relative order between other elements
      }
    });
  };

  useEffect(() => {
    if (initial) return;

    if (selectedFacultyOptions.length === 0 && ids.length === 0) {
      setInstitutes(initialInstitutes);
    }
  }, [selectedFacultyOptions, initial, ids, initialInstitutes]);

  useEffect(() => {
    if (initial) return;
    onSetCategories?.(selectedInstituteOptions);
  }, [selectedInstituteOptions, initial, onSetCategories]);

  const setInstituteIDs = ({ id: selectedId }: { id: string }) => {
    setIds(prev =>
      prev.some(id => id === selectedId) ? prev.filter(id => id !== selectedId) : prev.concat(selectedId),
    );
  };

  const setFacultiesIDs = ({ facultyId: selectedId, isChecked }: { facultyId: string; isChecked: boolean }) => {
    // if faculty is checked
    initialInstitutes.forEach((institute: any) => {
      if (institute.parentID === selectedId) {
        if (isChecked) {
          if (!ids.includes(institute.id)) {
            setIds(prev => [...prev, institute.id]);
          }
        } else {
          setIds(prev => prev.filter(id => id !== institute.id));
        }
      }
    });

    // if faculty is checked
    if (isChecked) {
      const institutesWithSameFacultyId = initialInstitutes.filter(
        (institute: any) => institute.parentID === selectedId,
      );
      institutesWithSameFacultyId.forEach((institute: any) => {
        institute.isChecked = true;
      });
      setInitialInstitutes(initialInstitutes);
      setSelectedInstituteOptions((prev: any) => {
        // place only those who are not already in the selectedInstituteOptions
        const filteredInstitutes = institutesWithSameFacultyId.filter(
          (institute: any) => !prev.some((prevInstitute: any) => prevInstitute.id === institute.id),
        );
        return filteredInstitutes.length > 0 ? prev.concat(filteredInstitutes) : prev;
      });
      return;
    }

    // if faculty is unchecked
    if (!isChecked) {
      initialInstitutes.forEach((institute: any) => {
        if (institute.parentID === selectedId) {
          institute.isChecked = false;
        }
      });

      setInitialInstitutes(initialInstitutes);
      setSelectedInstituteOptions((prev: any) => prev.filter((institute: any) => institute.parentID !== selectedId));
    }
  };

  const checkIfFacultyNeedsToBeChecked = (option: any) => {
    const faculty = faculties.find(({ facultyId }: { facultyId: string }) => facultyId === option.parentID);
    if (faculty) {
      // console.log(initialInstitutes, "initialInstitutes");
      const institutesWithSameFacultyId = initialInstitutes.filter(
        (institute: any) => institute.parentID === option.parentID,
      );
      const isAllInstitutesChecked = institutesWithSameFacultyId.every((institute: any) => institute.isChecked);
      // console.log(isAllInstitutesChecked, "isAllInstitutesChecked");
      faculty.isChecked = isAllInstitutesChecked;
      const filteredFaculties = isAllInstitutesChecked
        ? selectedFacultyOptions.concat(faculty)
        : selectedFacultyOptions.filter((faculty: any) => faculty.facultyId !== option.parentID);
      // console.log(filteredFaculties, "filteredFaculties");
      setSelectedFacultyOptions(filteredFaculties);
    }
  };

  const filterDataAfterClickAndUpdateState = (selectedOption: any, updateFn: any, option: any) => {
    if (selectedOption) {
      option.isChecked = false;
      updateFn((prev: any) => prev.filter((options: any) => options.label !== option.label));
    } else {
      option.isChecked = true;
      updateFn((prev: any) => prev.concat(option));
    }
  };

  const onClickHandler = (option: any, label: string) => {
    setInitial(false);
    setDropdownIsOpen(false);
    if (label === "faculty") {
      const selectedOption = selectedFacultyOptions.find(({ label }: { label: string }) => label === option.label);
      filterDataAfterClickAndUpdateState(selectedOption, setSelectedFacultyOptions, option);
      setFacultiesIDs(option);
    } else {
      const selectedOption = selectedInstituteOptions.find(({ label }: { label: string }) => label === option.label);
      filterDataAfterClickAndUpdateState(selectedOption, setSelectedInstituteOptions, option);
      checkIfFacultyNeedsToBeChecked(option);
      setInstituteIDs(option);
    }
  };

  const searchHandler = (text: string, label: string) => {
    if (label === "faculty") {
      filterDataAfterSearchAndUpdateState(initialFaculties, setFaculties, text, setFacultySearchValue);
    } else {
      const dataToFilter = selectedFacultyOptions.length === 0 ? initialInstitutes : filteredInstitutes;
      filterDataAfterSearchAndUpdateState(dataToFilter, setInstitutes, text, setInstituteSearchValue);
    }
  };

  const getAllUnchecked = (options: any) => {
    return options.map((option: any) => {
      return {
        ...option,
        isChecked: false,
      };
    });
  };

  const onResetHandler = () => {
    const allUncheckedFaculties = getAllUnchecked(initialFaculties);
    const allUncheckedInstitutes = getAllUnchecked(initialInstitutes);

    reset?.();
    setFaculties(allUncheckedFaculties);
    setInstitutes(allUncheckedInstitutes);
    setInitialFaculties(allUncheckedFaculties);
    setInitialInstitutes(allUncheckedInstitutes);
    setSelectedFacultyOptions([]);
    setSelectedInstituteOptions([]);
    setIds([]);
  };

  return (
    <div
      style={{ display: filters.length > 0 || searchValue === "" ? "flex" : "none" }}
      className={styles.homepageFilters}
    >
      <SelectWithSearch
        options={sortByChecked(faculties, facultySearchValue)}
        id="faculty"
        label={t("Faculty")}
        onChange={onClickHandler}
        search={searchHandler}
        selectedOptions={selectedFacultyOptions}
        inputValue={facultySearchValue}
        dropdownIsOpen={dropdownIsOpen}
        onDropdownIsOpen={() => setDropdownIsOpen(true)}
      />
      <SelectWithSearch
        options={sortByChecked(institutes, instituteSearchValue)}
        id="institute"
        label={t("Institute")}
        onChange={onClickHandler}
        search={searchHandler}
        selectedOptions={selectedInstituteOptions}
        inputValue={instituteSearchValue}
        dropdownIsOpen={dropdownIsOpen}
        onDropdownIsOpen={() => setDropdownIsOpen(true)}
      />
      <button className={`buttonImage ${styles.filters__title}`} onClickCapture={() => onResetHandler()}>
        <Image src={icons.reset} alt="filters" className={styles.filters__button} />
        {t("Reset")}
      </button>
    </div>
  );
};

export default HomepageFilters;
