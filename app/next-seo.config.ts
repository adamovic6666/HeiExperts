import { DefaultSeoProps } from "next-seo";

const config: DefaultSeoProps = {
  title: undefined,
  titleTemplate: "%s | HeiExperts",
  defaultTitle: "HeiExperts",

  additionalLinkTags: [
    {
      rel: "icon",
      href: "/favicon.ico",
    },
  ],
  openGraph: {
    type: "website",
    locale: "en_IE",
    url: "https://www.studiopresent.com/",
    siteName: "SiteName",
  },
  twitter: {
    handle: "@handle",
    site: "@site",
    cardType: "summary_large_image",
  },
};

export default config;
