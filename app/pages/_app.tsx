import { ApolloProvider } from "@apollo/client";
import { SessionProvider } from "next-auth/react";
import { appWithTranslation } from "next-i18next";
import { DefaultSeo } from "next-seo";
import type { AppProps } from "next/app";
import Layout from "../components/layout/Layout";
import Toast from "../components/toast/Toast";
import FavoriteContextProvider from "../context/favoritesContext";
import { getClient } from "../graphql/client";
import SEO from "../next-seo.config";
import "../styles/global.scss";

// export let translationConfig;

// export default function MainApp({ Component, pageProps, session, config, translations }: AppProps) {
function MainApp({ Component, pageProps }: AppProps) {
  // console.log(pageProps);
  // setConfig(config);
  // translationConfig = translations;

  return (
    <SessionProvider session={pageProps?.session?.user}>
      <ApolloProvider client={getClient(pageProps?.session?.user?.jwt)}>
        <Layout icons={pageProps?.icons}>
          <FavoriteContextProvider session={pageProps?.session}>
            <DefaultSeo {...SEO} />
            <Component {...pageProps} />
            <Toast />
          </FavoriteContextProvider>
        </Layout>
      </ApolloProvider>
    </SessionProvider>
  );
}

export default appWithTranslation(MainApp);
