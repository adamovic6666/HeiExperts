import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";

const cache = new InMemoryCache();

export let client: any;

/**
 *
 * @returns {ApolloClient} client
 */
export const getClient = (jwt?: string) => {
  if (!client) {
    const strapiUrl = process.env.STRAPI_URL_INTERNAL || process.env.NEXT_PUBLIC_STRAPI_URL;
    client = new ApolloClient({
      ssrMode: true,
      cache,
      link: createHttpLink({
        uri: `${strapiUrl}/graphql`,
        headers: jwt
          ? {
              authorization: `Bearer ${jwt}`,
            }
          : {},
      }),
    });
  }

  return client;
};

export const mutate = async ({ mutation = false, variables = {} }) => {
  try {
    const { data } = await getClient().mutate({
      mutation,
      variables,
    });

    return { data };
  } catch (err: any) {
    return {
      error: {
        statusCode: err.networkError?.statusCode ?? 500,
        message: err.message,
      },
    };
  }
};
