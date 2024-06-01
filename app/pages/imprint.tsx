import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextSeo } from "next-seo";
import { getClient } from "../graphql/client";
import { IMPRINT, SOCIAL_ICONS } from "../graphql/schemas/queries";

const Imprint = ({ pageData }: any) => {
  const { imprint } = pageData;

  return (
    <>
      <NextSeo title="Imprint Page" description="Imprint description" />
      <div className="easyLanguagePage">
        <div className="container-small">
          <h1>{imprint?.title}</h1>
          <div className="content">
            <div dangerouslySetInnerHTML={{ __html: imprint?.body }}></div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Imprint;

export async function getServerSideProps(ctx: any) {
  const { data: pageData } = await getClient().query({
    query: IMPRINT,
    variables: {
      locale: ctx.locale,
    },
    fetchPolicy: "no-cache",
  });

  if (pageData.imprint === null) {
    return {
      notFound: true,
    };
  }

  const { data: socialIcons } = await getClient().query({
    query: SOCIAL_ICONS,
    variables: {
      locale: ctx.locale,
    },
    fetchPolicy: "no-cache",
  });

  const icons = socialIcons.socialIcons;

  return {
    props: { ...(await serverSideTranslations(ctx.locale, ["common"])), pageData, icons },
  };
}
