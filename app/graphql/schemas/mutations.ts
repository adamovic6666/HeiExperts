import { gql } from "@apollo/client";

export const UPDATE_USER = gql`
  mutation updateUser($data: UserInput!, $id: ID!, $locale: String) {
    updateUser(data: $data, id: $id, locale: $locale) {
      id
      firstName
      lastName
      email
      gender
      linktree
      instituteType
      firstTimeLogin
      title
      avatar {
        id
      }
      tags {
        id
      }
      translatableFields {
        experties
        education
        network
        skills
        approachableFor
      }
    }
  }
`;

export const CREATE_USER_TRANSLATIONS = gql`
  mutation userTranslation($user: ID) {
    createTranslatableField(user: $user) {
      id
      experties
      education
      network
      skills
      approachableFor
    }
  }
`;
