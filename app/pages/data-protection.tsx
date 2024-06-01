import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextSeo } from "next-seo";
import { getClient } from "../graphql/client";
import { DATA_PROTECTION, SOCIAL_ICONS } from "../graphql/schemas/queries";

const DataProtection = ({ pageData }: any) => {
  const { dataProtection } = pageData;

  return (
    <>
      <NextSeo title="Datenschutz Page" description="Datenschutz description" />
      <div className="easyLanguagePage">
        <div className="container-small">
          <h1>{dataProtection?.title}</h1>
          <div className="content">
            <div dangerouslySetInnerHTML={{ __html: dataProtection?.body }}></div>
          </div>
        </div>
      </div>
    </>
  );
};
export default DataProtection;

export async function getServerSideProps(ctx: any) {
  const { data: pageData } = await getClient().query({
    query: DATA_PROTECTION,
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

  if (pageData.dataProtection === null) {
    return {
      notFound: true,
    };
  }

  return {
    props: { ...(await serverSideTranslations(ctx.locale, ["common"])), pageData, icons },
  };
}
