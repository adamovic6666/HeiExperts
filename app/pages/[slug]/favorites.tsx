import { getSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextSeo } from "next-seo";
import { useContext, useState } from "react";
import ProfileTeaser from "../../components/profileTeaser/ProfileTeaser";
import { FavoritesContext } from "../../context/favoritesContext";
import { getClient } from "../../graphql/client";
import { GET_ALL_FAVORITES, SOCIAL_ICONS } from "../../graphql/schemas/queries";
import styles from "../../styles/components/favorites.module.scss";

const Experts = ({ experts }: any) => {
  const modifiedData = experts.map((e: any) => {
    return { ...e, following: true };
  });
  const [allExperts] = useState(modifiedData);
  const { updateFavorites, favorites } = useContext(FavoritesContext);
  const onFollowHandler = (profile: any) => updateFavorites(+profile.id);

  return (
    allExperts &&
    allExperts.map((expertProfile: any, idx: number) => (
      <ProfileTeaser key={idx} favoritesIds={favorites} profile={expertProfile} onFollow={onFollowHandler} />
    ))
  );
};

const FavoriteList = ({ data }: any) => {
  const { t } = useTranslation("common");

  return (
    <>
      <NextSeo title="Favorite list" description="HeiExpert" />
      <div className={`container ${styles.favorites}`}>
        <h2 className={`titleCenter ${styles.favorites__title}`}>{t("My favorite list")}</h2>
        {data?.expert?.favorites && data?.expert?.favorites?.length > 0 && (
          <div className={styles.favorites__profiles}>
            <div className="experts__wrap">
              <Experts experts={data?.expert?.favorites} />
            </div>
          </div>
        )}
        {data?.expert?.favorites?.length === 0 && <p>{t("You dont have profiles in favorites")}</p>}
      </div>
    </>
  );
};

export async function getServerSideProps(ctx: any) {
  const session = await getSession(ctx);
  // @ts-ignore
  if (!session || session.user.user.slug !== ctx.params.slug) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const { data } = await getClient().query({
    query: GET_ALL_FAVORITES,
    variables: {
      slug: ctx.params.slug,
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
      icons,
      // session,
    },
  };
}

export default FavoriteList;
