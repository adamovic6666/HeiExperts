import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextSeo } from "next-seo";
import { getClient } from "../graphql/client";
import { EASY_LANGUE_DATA, SOCIAL_ICONS } from "../graphql/schemas/queries";

const EasyLanguage = ({ pageData }: any) => {
  const { easyLanguage } = pageData;

  return (
    <>
      <NextSeo title="Easy Language Page" description="Page description" />
      <div className="easyLanguagePage">
        <div className="container-small">
          <h1>{easyLanguage?.title}</h1>
          <div className="content">
            <div dangerouslySetInnerHTML={{ __html: easyLanguage?.body }}></div>
          </div>
        </div>
      </div>
    </>
  );
};
export default EasyLanguage;

export async function getServerSideProps(ctx: any) {
  const { data: pageData } = await getClient().query({
    query: EASY_LANGUE_DATA,
    variables: {
      locale: ctx.locale,
    },
    fetchPolicy: "no-cache",
  });

  if (pageData.easyLanguage === null) {
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
