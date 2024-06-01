import { gql } from "@apollo/client";
import { CATEGORY_FRAGMENT, EXPERT_TEASER_FRAGMENT } from "./fragments";

export const SEARCH = gql`
  query Search($search: String, $filters: ExpertsFilterInput) {
    experts(search: $search, filters: $filters) {
      experts {
        ...Expert
      }
      tags {
        id
        label
      }
      filters {
        label
        categoryItems {
          ...Category
          categoryItems {
            ...Category
            categoryItems {
              ...Category
              categoryItems {
                ...Category
              }
            }
          }
        }
      }
      meta
    }
  }

  ${CATEGORY_FRAGMENT}
  ${EXPERT_TEASER_FRAGMENT}
`;

export const GET_EXPERT = gql`
  query Expert($slug: String!) {
    expert(slug: $slug) {
      id
      title
      firstName
      lastName
      linktree
      instituteType
      email
      gender
      categoryItems {
        id
        label
      }
      connectedTo {
        id
        title
        firstName
        lastName
        categoryItems {
          id
          label
        }
        translatableFields {
          locale
          approachableFor
          experties
        }
        slug
        tags {
          label
        }
        avatar {
          url
        }
      }
      wikipediaLink
      tags {
        label
        id
      }
      favorites {
        id
      }
      avatar {
        url
      }
      projects {
        label
        link
      }
      languages {
        id
        label
      }
      publishing
      slug
      translatableFields {
        locale
        experties
        network
        education
        skills
        approachableFor
      }
    }
  }
`;

export const LANGUAGES = gql`
  query {
    languages {
      id
      label
    }
  }
`;

export const GET_CATEGORY_ITEMS = gql`
  query {
    categoryItems {
      id
      label
      categoryItemId
    }
  }
`;

export const GET_CATEGORIES_WITH_FIRST_LEVEL_ITEMS = gql`
  query {
    categories {
      id
      label
      categoryItems {
        id
        label
      }
    }
  }
`;

export const GET_EXPERTS = gql`
  query {
    experts {
      experts {
        firstName
        lastName
        categoryItems {
          id
          label
        }
        id
        translatableFields {
          locale
          approachableFor
        }
        avatar {
          url
        }
      }
    }
  }
`;

export const TAGS = gql`
  query {
    tags {
      id
      label
    }
  }
`;

export const EXPERTS = gql`
  query Search($search: String) {
    experts(search: $search) {
      experts {
        ...Expert
      }
    }
  }

  ${EXPERT_TEASER_FRAGMENT}
`;

export const GET_ALL_FAVORITES = gql`
  query GetAllFavorites($slug: String!) {
    expert(slug: $slug) {
      favorites {
        id
        tags {
          id
          label
        }
        firstName
        lastName
        id
        categoryItems {
          id
          label
        }
        translatableFields {
          locale
          approachableFor
          experties
        }
        avatar {
          name
          url
        }
        slug
      }
    }
  }
`;

export const FRONTPAGE_DATA = gql`
  query FrontPage($locale: String = "en") {
    frontPage(locale: $locale) {
      title
      topJoinUs {
        title
        body
        registerButtons
        logo {
          name
          url
        }
      }
      aboutUs {
        titleLeft
        titleRight
        previewLeft
        previewRight
        bodyLeft
        bodyRight
      }
      commonGoal {
        title
        items {
          title
          body
          logo {
            name
            url
          }
        }
      }
      bottomJoinUs {
        title
        body
        registerButtons
        logo {
          name
          url
        }
      }
    }
  }
`;

export const EASY_LANGUE_DATA = gql`
  query EasyLanguage($locale: String) {
    easyLanguage(locale: $locale) {
      title
      body
    }
  }
`;

export const FAQ = gql`
  query Faq($locale: String) {
    faq(locale: $locale) {
      title
      body
    }
  }
`;

export const DATA_PROTECTION = gql`
  query dataProtection($locale: String) {
    dataProtection(locale: $locale) {
      title
      body
    }
  }
`;

export const SOCIAL_ICONS = gql`
  query socialIcons {
    socialIcons {
      facebookLink
      linkedinLink
      instagramLink
    }
  }
`;

export const IMPRINT = gql`
  query imprint($locale: String) {
    imprint(locale: $locale) {
      title
      body
    }
  }
`;

export const USER_EXIST = gql`
  query UserExist($identifier: String!) {
    userExist(identifier: $identifier)
  }
`;

export const DATA_PROTECTION_MODAL = gql`
  query DPM($locale: String) {
    dataProtectionModal(locale: $locale) {
      title
      body
    }
  }
`;

export const RESEARCH_MODAL = gql`
  query RM($locale: String) {
    researchModal(locale: $locale) {
      title
      body
    }
  }
`;
