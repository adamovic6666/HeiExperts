let timer: NodeJS.Timeout;

export const getFormatedText = (languages: any) => {
  return languages.map((lang: any, idx: string | number, arr: any[]) => {
    return (
      <span key={idx}>
        {lang?.label}
        {idx === arr.length - 1 ? "" : ", "}
      </span>
    );
  });
};

export const getFormatedExpertCategories = (categories: any) => {
  const categoryLabels = categories?.map(({ label }: any) => label);
  let categoryText;
  if (categoryLabels?.length > 2) {
    let lastItem = categoryLabels[categoryLabels.length - 1];
    let slicedArr = categoryLabels.slice(0, -1);
    categoryText = `${slicedArr.join(", ")} und ${lastItem}`;
  }

  if (categoryLabels?.length === 2) {
    categoryText = `${categoryLabels[0]} und ${categoryLabels[1]}`;
  }

  if (categoryLabels?.length === 1) {
    categoryText = `${categoryLabels[0]}`;
  }

  return categoryText;
};

export const debounce = (func: () => void, timeout = 1500) => {
  clearTimeout(timer);

  timer = setTimeout(() => {
    func();
  }, timeout);
};

export const sortedAndFilteredTags = (tags: any[]) => {
  const key = "label";
  return [...new Map(tags?.map(tag => [tag[key], tag])).values()];
};

export const getRandomItems = (arr: any[], selectedTags: any) => {
  let newArr: any[] = [];
  let modifiedArr = sortedAndFilteredTags(arr);

  if (selectedTags?.length > 0) {
    modifiedArr.forEach(tag =>
      selectedTags.forEach((t: any) => {
        if (tag.id === t.id) {
          newArr.push(tag);
        }
      }),
    );
  } else {
    newArr = [];
  }

  let numberOfTagsToWatch = arr?.length <= 10 ? arr?.length : 10;
  const maxNumberOfTags = selectedTags?.length === 0 ? numberOfTagsToWatch : numberOfTagsToWatch - selectedTags?.length;
  let index = 0;

  while (index < maxNumberOfTags) {
    const randomIndex = Math.floor(Math.random() * modifiedArr.length);
    const item = modifiedArr[randomIndex];
    if (newArr.some(tag => tag?.id === item?.id)) {
      index = index;
    } else {
      newArr.push(item);
      index++;
    }
  }
  return newArr;
};

export const getRestOfExperts = (arr1: any[], arr2: any[]) => {
  return arr1?.filter(
    (e: any) => !arr2.some((exp: any) => e.firstName === exp.firstName && e.lastName === exp.lastName),
  );
};

export const tagStrip = (val: string) => {
  const regex = /<[^>]+>/g;
  return val.replace(regex, "");
};
