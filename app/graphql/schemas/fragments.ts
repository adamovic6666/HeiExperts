import { gql } from "@apollo/client";

export const CATEGORY_FRAGMENT = gql`
  fragment Category on CategoryItemResponse {
    id
    label
    categoryItemId
  }
`;

export const EXPERT_FRAGMENT = gql`
  fragment Expert on ExpertResponse {
    id
    email
    tags {
      label
    }
  }
`;

export const EXPERT_TEASER_FRAGMENT = gql`
  fragment Expert on ExpertResponse {
    id
    slug
    email
    shortIntro
    categoryItems {
      id
      label
    }
    translatableFields {
      locale
      approachableFor
      experties
      education
      skills
      network
    }
    avatar {
      url
    }
    tags {
      label
    }
    firstName
    lastName
  }
`;
