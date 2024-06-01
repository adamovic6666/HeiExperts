import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Input from "../../components/input/Input";
import styles from "../../styles/components/tagsSearch.module.scss";
import icons from "../../styles/src";

type Data = {
  allTags: any[];
  selectedTags: any[];
  onAddTag: (val: string) => void;
  onSearchUpdateTags: (val: string) => void;
  onUpdateSearchDropdown: () => void;
  disableAdding?: boolean;
  onSetSuggestions?: (data: string[]) => void;
  suggestions: string[] | null;
  resetSuggestions: () => void;
};

const TagSearch = ({
  allTags,
  selectedTags,
  onAddTag,
  onSearchUpdateTags,
  onUpdateSearchDropdown,
  disableAdding,
  onSetSuggestions,
  suggestions,
  resetSuggestions,
}: Data) => {
  const { t } = useTranslation("common");
  const [isOpen, setIsOpen] = useState(false);
  const [tagSearchValue, setTagSearchValue] = useState("");
  const [tag, setTag] = useState<any>(null);
  // const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<any>(null);
  const { locale } = useRouter();

  // const language = locale === "de" ? "german" : "english";

  const onChangeHandler = async (val: string) => {
    onSearchUpdateTags(val);
    setTagSearchValue(val);
    setTag({ label: val, __typename: "TagResponse" });
  };

  // THIS IS THE PART OF THE CODE THAT HANDLES SUGGESTIONS FROM OPEN AI ( API KEY IS MISSING )
  // const getSuggestions = (val: string) => {
  //   axios.post("/api/suggestions", { messages: val, lang: language }).then(({ data }) => {
  //     setIsLoading(false);
  //     onSetSuggestions?.(JSON.parse(data.suggestions));
  //   });
  // };

  const setNewTagHandler = (tag: any) => {
    //get suggestions
    // setIsLoading(true);
    //getSuggestions(tag.label);
    setTagSearchValue(tag.label);
    setTag(tag);
    setIsOpen(false);
  };

  const onAddNewTag = () => {
    onAddTag(tag);
    setTagSearchValue("");
    setIsOpen(true);
  };

  useEffect(() => {
    if (allTags.length === 0 && tagSearchValue.trim() === "") {
      setIsOpen(true);
      onUpdateSearchDropdown();
    }
  }, [allTags, tagSearchValue]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClick = ({ target }: any) => {
      if (target.id === "tags") return;
      if (dropdownRef.current && !dropdownRef.current?.contains(target)) {
        setIsOpen(false);
      }
    };
    window.addEventListener("click", handleClick);
    // clean up
    return () => window.removeEventListener("click", handleClick);
  }, [isOpen]);

  const onAddSuggestion = (suggestion: string) => {
    setTag({ label: suggestion, __typename: "TagResponse" });
    setTagSearchValue(suggestion);
  };

  return (
    <div className={styles.tagsSearch}>
      <span>#</span>
      <Input
        label={t("New tag") || "New tag"}
        name="tags"
        id="tags"
        type="text"
        onClick={() => {
          setIsOpen(true);
          resetSuggestions();
        }}
        onChange={e => {
          onChangeHandler(e.target.value);
          // debounce(async () => {
          //   if (e.target.value.length && e.target.value.length > 2) {
          //     setIsLoading(true);
          //     getSuggestions(e.target.value);
          //   }
          // }, 1000);
        }}
        value={tagSearchValue}
        maxLength={40}
      />
      {isOpen && (
        <div className={styles.tagsSearch__dropdown} ref={dropdownRef}>
          <ul>
            {allTags.map((tag: any, idx) => {
              return (
                <li
                  key={tag.label + idx}
                  onClick={() => {
                    setNewTagHandler(tag);
                  }}
                >
                  {tag.label}
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {selectedTags.length < 20 && tagSearchValue.trim() !== "" && !disableAdding && (
        <button className="secondaryButton" onClick={onAddNewTag}>
          <Image src={icons.addIcon} alt="add-icon" /> {t("Add")}
        </button>
      )}
      {suggestions && (
        <div className={styles.tagsSearch__suggestions}>
          <p>Suggested tags:</p>
          <ul>
            {suggestions?.map(s => {
              return (
                <li onClick={() => onAddSuggestion(s)} key={s}>
                  + {s}
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {/* {isLoading && (
        <div className={styles.tagsSearch__spinnerWrapper}>
          <Spinner />
        </div>
      )} */}
    </div>
  );
};

export default TagSearch;
