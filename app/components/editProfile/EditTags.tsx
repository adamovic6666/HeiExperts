import { useTranslation } from "next-i18next";
import { useState } from "react";
import styles from "../../styles/components/tagEdit.module.scss";
import { Tag as TagType } from "../../types/index";
import Tag from "../tags/Tag";
import TagSearch from "../tags/TagSearch";
type EditTagsData = {
  data: any[];
  onUpdate: ([]: any) => void;
  updateClient: ([]: any) => void;
  allTags: any;
};

const EditTags = ({ data, onUpdate, updateClient, allTags: allSearchTags }: EditTagsData) => {
  const { t } = useTranslation("common");
  const [selectedTags, setSelectedTags] = useState(data);
  const [disableAdding, setDisableAdding] = useState(false);
  const [suggestions, setSuggestions] = useState<string[] | null>(null);
  const [allTags, setAllTags] = useState(
    allSearchTags && allSearchTags.filter((tag: TagType) => !data.some(selectedTag => tag.label === selectedTag.label)),
  );
  const [searchTags, setSearchTags] = useState<any>(
    allSearchTags && allSearchTags.filter((tag: TagType) => !data.some(selectedTag => tag.label === selectedTag.label)),
  );

  const updateTagsHandler = (tag: any, toDelete = false) => {
    const modifiedTags = [...selectedTags];
    const modifiedAllTags = [...allTags];
    const updatedTags = toDelete ? selectedTags.filter(t => t.label !== tag.label) : modifiedTags.concat(tag);

    const tagsForMutation = updatedTags.map(tag => {
      if (!tag.id) {
        return tag.label;
      }
      return +tag.id;
    });
    const updatedAllTags = toDelete ? allTags.concat(tag) : modifiedAllTags.filter(t => t.label !== tag.label);
    setSelectedTags(updatedTags);
    setAllTags(updatedAllTags);
    // setSearchTags(updatedAllTags);
    setSearchTags(updatedAllTags);
    onUpdate(tagsForMutation);
    updateClient(updatedTags);
  };

  const onDeleteTagHandler = (tag: any) => {
    updateTagsHandler(tag, true);
  };

  const onAddTagHandler = (tag: any) => {
    const searchedTag = allTags.find((sTag: any) => sTag.label === tag.label);
    updateTagsHandler(searchedTag ? searchedTag : tag);
  };

  const onSearchUpdateTagsHandler = (val: string) => {
    setDisableAdding(selectedTags.some(tag => tag.label.toLowerCase() === val.toLowerCase()));

    const currentTags = allTags;
    const includedTags = currentTags?.filter((tag: any) =>
      tag?.label?.toLowerCase().includes(val?.trim().toLowerCase()),
    );
    setSearchTags(includedTags);
  };

  const onUpdateSearchDropdownHandler = () => {
    let res =
      allSearchTags &&
      allSearchTags?.filter(
        (tag: TagType) => !selectedTags.some((selectedTag: any) => tag.label === selectedTag.label),
      );

    setAllTags(res);
  };

  return (
    <div className={styles.tagsEdit}>
      <p>{t("Tags1")}</p>
      <p>{t("Maximum number of tags: {{number}}", { number: 20 })}</p>
      {selectedTags.length > 0 && (
        <div className={styles.tagsEdit__wrapper}>
          <div className={styles.tagsEdit__wrapper}>
            {selectedTags.map((tag: any, idx) => {
              return <Tag toDeleteTag={true} key={`TAG_${tag.label}_${idx}`} tag={tag} onClick={onDeleteTagHandler} />;
            })}
          </div>
        </div>
      )}
      <TagSearch
        allTags={searchTags}
        selectedTags={selectedTags}
        onAddTag={onAddTagHandler}
        onSearchUpdateTags={onSearchUpdateTagsHandler}
        onUpdateSearchDropdown={onUpdateSearchDropdownHandler}
        disableAdding={disableAdding}
        onSetSuggestions={suggestions => setSuggestions(suggestions)}
        suggestions={suggestions}
        resetSuggestions={() => setSuggestions(null)}
      />
    </div>
  );
};

export default EditTags;
