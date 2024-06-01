import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextSeo } from "next-seo";
import { getClient } from "../graphql/client";
import { FAQ, SOCIAL_ICONS } from "../graphql/schemas/queries";

const FaqPage = ({ pageData }: any) => {
  const { faq } = pageData;

  return (
    <>
      <NextSeo title="FAQ Page" description="FAQ description" />
      <div className="easyLanguagePage">
        <div className="container-small">
          <h1>{faq?.title}</h1>
          <div className="content">
            <div dangerouslySetInnerHTML={{ __html: faq?.body }}></div>
          </div>
        </div>
      </div>
    </>
  );
};
export default FaqPage;

export async function getServerSideProps(ctx: any) {
  const { data: pageData } = await getClient().query({
    query: FAQ,
    variables: {
      locale: ctx.locale,
    },
    fetchPolicy: "no-cache",
  });

  if (pageData.faq === null) {
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
