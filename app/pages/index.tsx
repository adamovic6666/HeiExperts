import { useQuery } from "@apollo/client";
// import Filters from "components/filters/Filters";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextSeo } from "next-seo";
import { useContext, useEffect, useRef, useState } from "react";
import Backdrop from "../components/backdrop/Backdrop";
import HomepageFilters from "../components/filters/HomepageFilters";
import ParagraphBeforeAfter from "../components/paragraphs/ParagraphBeforeAfter";
import ParagraphContactUs from "../components/paragraphs/ParagraphContactUs";
import ParagraphGoal from "../components/paragraphs/ParagraphGoal";
import ParagraphIntro from "../components/paragraphs/ParagraphIntro";
import ProfileTeaser from "../components/profileTeaser/ProfileTeaser";
import Search from "../components/search/Search";
import Spinner from "../components/spinner/Spinner";
import Tags from "../components/tags/Tags";
import { FavoritesContext } from "../context/favoritesContext";
import { getClient } from "../graphql/client";
import { FRONTPAGE_DATA, SEARCH, SOCIAL_ICONS } from "../graphql/schemas/queries";
import { getFormatedText, sortedAndFilteredTags } from "../utils";

const Experts = ({ experts, selectedTags, favoritesIds, onUpdate, searchVal }: any) => {
  const modified = experts.map((e: any) => {
    let counter = 0;
    e.tags.filter((expertTag: any) => {
      selectedTags.filter((tag: any) => {
        if (expertTag.label === tag.label) {
          counter = counter + 1;
        }
      });
    });
    let obj = {
      ...e,
      numberOfSelectedTags: counter,
    };
    return obj;
  });

  const sorted = modified.sort((a: any, b: any) => a.numberOfSelectedTags - b.numberOfSelectedTags).reverse();

  const session: any = useSession();
  let myId = session?.data?.user?.user?.id;
  return (
    sorted
      // .filter((exp: any) => exp?.id?.toString() !== myId?.toString())
      .map((expertProfile: any, idx: number) => {
        return (
          <ProfileTeaser
            myId={myId}
            key={idx}
            favoritesIds={favoritesIds}
            profile={expertProfile}
            selectedTags={selectedTags}
            onFollow={profile => onUpdate(+profile.id)}
            searchVal={searchVal}
          />
        );
      })
  );
};

const Home = ({ frontPageData }: any) => {
  const { title, aboutUs, bottomJoinUs, commonGoal, topJoinUs } = frontPageData.frontPage;
  const { t } = useTranslation("common");

  const session: any = useSession();
  const authenticated = session.status !== "unauthenticated";
  const { data, refetch } = useQuery(SEARCH);
  const [initalExperts] = useState([]);
  const [initialTags, setInitialTags] = useState(data?.experts?.tags);
  const [tags, setTags] = useState(sortedAndFilteredTags(data?.experts?.tags));
  const [experts, setExperts] = useState<any[]>([]);
  const [selectedTags, setSelectedTags] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<any>([]);
  const [filters, setFilters] = useState(data?.experts?.filters);
  const [activeFilters, setActiveFilters] = useState<any[]>([]);
  const [searchVal, setSearchVal] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const { updateFavorites, favorites } = useContext(FavoritesContext);
  const [totalResults, setTotalResults] = useState<any>(null);
  const myRef = useRef<any>(null);
  const [isClearButtonVisible, setIsClearButtonVisible] = useState(false);

  // const { data: institutes } = useQuery(GET_CATEGORIES_WITH_FIRST_LEVEL_ITEMS);

  const onSelectTagHandler = async (tag: any) => {
    const modifiedSelectedTags = [...selectedTags];
    let updatedTags: any[] = [];
    if (!modifiedSelectedTags.some(({ id }) => id === tag.id)) {
      updatedTags = [...modifiedSelectedTags, { ...tag }];
    } else {
      updatedTags = modifiedSelectedTags.filter(({ id }) => id !== tag.id);
    }

    setSelectedTags(updatedTags);

    if (updatedTags.length === 0) {
      setTags(sortedAndFilteredTags(initialTags));
      if (activeFilters.length > 0 || searchVal) {
        setIsFetching(true);
        refetch({
          filters: activeFilters.length > 0 ? { categoryItems: activeFilters } : {},
          search: searchVal ?? "",
        }).then(({ data }) => {
          setExperts(data.experts.experts);
          setTags(sortedAndFilteredTags(data.experts.tags));
          setTotalResults(data.experts.meta.total_entries);
          setIsFetching(false);
        });
        return;
      }

      !searchVal && setExperts(initalExperts);
      return;
    }
    const tagsIds = updatedTags.map(tag => tag.id);
    setIsFetching(true);
    refetch(
      activeFilters.length > 0
        ? { filters: { tags: tagsIds, categoryItems: activeFilters }, search: searchVal }
        : { filters: { tags: tagsIds }, search: searchVal },
    ).then(({ data }) => {
      setExperts(data.experts.experts);
      setTags(sortedAndFilteredTags(data.experts.tags));
      setTotalResults(data.experts.meta.total_entries);
      setIsFetching(false);
    });
  };

  const reFetchHandler = async (val: string) => {
    const tagsIds = selectedTags.map(tag => tag.id);
    if (val.trim() === "") {
      setSearchVal("");

      if (tagsIds.length > 0 || activeFilters.length > 0) {
        let filters;

        if (tagsIds.length > 0) {
          filters = { tags: tagsIds };
        }

        if (activeFilters.length > 0) {
          filters = { categoryItems: activeFilters };
        }

        if (activeFilters.length > 0 && tagsIds.length > 0) {
          filters = { tags: tagsIds, categoryItems: activeFilters };
        }

        const data = await refetch({
          search: "",
          filters: tagsIds.length === 0 && activeFilters.length === 0 ? {} : filters,
        });
        setIsFetching(false);
        setExperts(data.data.experts.experts);
        setTags(sortedAndFilteredTags(data.data.experts.tags));
        setFilters(data.data.experts.filters);
        setTotalResults(data.data.experts.meta.total_entries);
      }

      if (selectedTags.length === 0 && activeFilters.length === 0) {
        setTags(sortedAndFilteredTags(initialTags));
        setInitialTags(sortedAndFilteredTags(initialTags));
        setExperts(initalExperts);
        setTotalResults(0);
        return;
      }
      return;
    }

    let filters;

    if (tagsIds.length > 0) {
      filters = { tags: tagsIds };
    }

    if (activeFilters.length > 0) {
      filters = { categoryItems: activeFilters };
    }

    if (activeFilters.length > 0 && tagsIds.length > 0) {
      filters = { tags: tagsIds, categoryItems: activeFilters };
    }

    const data = await refetch({
      search: val,
      filters: tagsIds.length === 0 && activeFilters.length === 0 ? {} : filters,
    });
    setIsFetching(false);
    setExperts(data.data.experts.experts);
    setTags(sortedAndFilteredTags(data.data.experts.tags));
    setFilters(data.data.experts.filters);
    setTotalResults(data.data.experts.meta.total_entries);
  };

  useEffect(() => {
    if (!!searchVal) {
      setIsClearButtonVisible(true);
    }
  }, [searchVal]);

  return (
    <>
      <NextSeo title="HeiExpert" description="Page description" />

      {/* {authenticated && (
        <Filters
          filters={filters}
          selectedTags={selectedTags}
          searchValue={searchVal}
          reset={() => {
            setActiveFilters([]);
            if (selectedTags.length > 0) {
              refetch({
                filters: { tags: selectedTags.map((tag: any) => tag.id) },
              }).then(({ data }) => {
                setExperts(data.experts.experts);
              });
              return;
            }
            setExperts(initalExperts);
            setTags(sortedAndFilteredTags(initialTags));
          }}
          update={data => {
            setTotalResults(data?.meta?.total_entries);
            setExperts(data.experts);
            setTags(sortedAndFilteredTags(data.tags));
          }}
          setFilterIds={ids => {
            setActiveFilters([...ids]);
          }}
          onSetCategories={(cat: any) => {
            setSelectedCategories(cat);
          }}
          onSetLoader={fetching => setIsFetching(fetching)}
        />
      )} */}

      <div className="container">
        <h1 className={`titleLeft gradientTitle mainTitle`} ref={myRef}>
          {title}
        </h1>
        {!authenticated && <ParagraphIntro topJoinUs={topJoinUs} />}
        {authenticated && (
          <Search
            reFetch={reFetchHandler}
            onFetching={() => setIsFetching(true)}
            isClearButtonVisible={isClearButtonVisible}
            setIsClearButtonVisible={isVisible => setIsClearButtonVisible(isVisible)}
            updateSearchValue={(val: string) => {
              if (val.trim() === "") {
                setIsFetching(false);
                return;
              }
              setSearchVal(val);
            }}
          />
        )}
        {authenticated && (
          <HomepageFilters
            update={data => {
              setTotalResults(data?.meta?.total_entries);
              setExperts(data.experts);
              setTags(sortedAndFilteredTags(data.tags));
            }}
            setFilterIds={ids => {
              setActiveFilters([...ids]);
            }}
            onSetCategories={(cat: any) => {
              setSelectedCategories(cat);
            }}
            filters={filters}
            isFetching={isFetching}
            selectedTags={selectedTags}
            searchValue={searchVal}
            reset={() => {
              setActiveFilters([]);
              if (selectedTags.length > 0) {
                refetch({
                  filters: { tags: selectedTags.map((tag: any) => tag.id) },
                }).then(({ data }) => {
                  setExperts(data.experts.experts);
                });
                return;
              }
              setExperts(initalExperts);
              setTags(sortedAndFilteredTags(initialTags));
            }}
            onSetLoader={fetching => setIsFetching(fetching)}
          />
        )}
        {authenticated &&
          totalResults === 0 &&
          !isFetching &&
          typeof totalResults == "number" &&
          (!!searchVal || selectedCategories.length > 0 || selectedTags.length > 0) && (
            <p className={`noResults`}>{t("No results found")}</p>
          )}

        {authenticated && tags.length > 0 && (
          <Tags
            tags={tags}
            initialTags={initialTags}
            onUpdateTags={tags => {
              setTags([...tags]);
            }}
            onClick={onSelectTagHandler}
            selectedTags={selectedTags}
            hoverable={true}
            searchValue={searchVal}
            activeFilters={activeFilters}
          />
        )}
        {experts && experts?.length > 0 && (
          <div className="experts">
            <div className="searchResult">
              <div className="searchResult__result">
                <strong>
                  {experts.length} {t("Experts")}
                </strong>{" "}
                {t("found")} <span>{selectedCategories.length > 0 && t("for ")}</span>
                <span className="searchResult__category"> {getFormatedText(selectedCategories)}</span>
              </div>
            </div>
            <div className="experts__wrap">
              <Experts
                experts={experts}
                favoritesIds={favorites}
                selectedTags={selectedTags}
                searchVal={searchVal}
                onUpdate={(id: number) => {
                  updateFavorites(id);
                }}
              />
            </div>
          </div>
        )}
      </div>
      {!authenticated && <ParagraphBeforeAfter aboutUs={aboutUs} />}
      {!authenticated && <ParagraphGoal commonGoal={commonGoal} />}
      {!authenticated && <ParagraphContactUs bottomJoinUs={bottomJoinUs} />}
      {isFetching && (
        <Backdrop background>
          <Spinner />
        </Backdrop>
      )}
    </>
  );
};

export default function HomeWrapper({ data, frontPageData }: any) {
  const client = getClient();

  client.cache.writeQuery({
    query: SEARCH,
    data,
  });

  return <Home frontPageData={frontPageData} />;
}

export async function getServerSideProps(ctx: any) {
  const { data } = await getClient().query({
    query: SEARCH,
    variables: {
      search: "",
    },
    fetchPolicy: "no-cache",
  });

  const { data: frontPageData } = await getClient().query({
    query: FRONTPAGE_DATA,
    variables: {
      locale: ctx.locale,
    },
    fetchPolicy: "no-cache",
  });

  const { data: socialIcons } = await getClient().query({
    query: SOCIAL_ICONS,
    variables: {
      locale: ctx.locale,
    },
    fetchPolicy: "no-cache",
  });

  const icons = socialIcons.socialIcons;

  return {
    props: {
      ...(await serverSideTranslations(ctx.locale, ["common"])),
      data,
      frontPageData,
      icons,
    },
  };
}
