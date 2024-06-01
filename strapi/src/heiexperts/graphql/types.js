const queries = `
  type MediaResponse {
    id: ID
    name: String
    url: String
  }

  type MetaResponse {
    total_entries: Int,
  }

  input PaginationInput {
    start: Int!
    limit: Int!
  }

  input ExpertsFilterInput {
    tags: [ID]
    categoryItems: [ID]
  }

  type CategoryItemResponse {
    id: ID
    label: String
    categoryItems: [CategoryItemResponse]
  }

  type CategoryResponse {
    id: ID
    label: String
    categoryItems: [CategoryItemResponse]
  }

  type ExpertsQueryResponse {
    experts: [ExpertResponse]
    tags: [TagResponse]
    filters: [CategoryResponse]
    meta: JSON
  }

  type LanguageResponse {
    label: String
    id: ID
  }

  type CommonGoalItem {
    logo: MediaResponse
    title: String
    body: String
  }

  type CommonGoal {
    title: String
    items: [CommonGoalItem]
  }

  type JoinUs {
    title: String
    body: String
    registerButtons: Boolean
    logo: MediaResponse
  }

  type AboutUs {
    titleLeft: String
    titleRight: String
    previewLeft: String
    previewRight: String
    bodyLeft: String
    bodyRight: String
  }

  type FrontPage {
    title: String
    topJoinUs: JoinUs
    aboutUs: AboutUs
    commonGoal: CommonGoal 
    bottomJoinUs: JoinUs
  }

  type BasicPage {
    title: String
    body: String
  }

  type BooleanResponse {
    response: Boolean
  }

  type UserExistResponse {
    doesExist: Boolean
    profileType: String
  }

  type SocialIcons {
    facebookLink: String
    linkedinLink: String
    instagramLink: String
  }

  type Query {
    experts(
      search: String
      filters: ExpertsFilterInput
      pagination: PaginationInput
      locale: String
    ): ExpertsQueryResponse
    expert(slug: String!, locale: String): ExpertResponse
    userExist(identifier: String!): Boolean
    languages: [LanguageResponse]
    categoryItems: [CategoryItemResponse]
    categories: [CategoryResponse]
    tags: [TagResponse]
    frontPage(locale: String): FrontPage
    easyLanguage(locale: String): BasicPage
    faq(locale: String): BasicPage
    dataProtection(locale: String): BasicPage
    imprint(locale: String): BasicPage
    dataProtectionModal(locale: String): BasicPage
    researchModal(locale: String): BasicPage
    socialIcons(local: String): SocialIcons
  }
`;

const mutations = `
  type EducationResponse {
    middle_school: String
    university: String
    doctorate: String
  }

  type TagResponse {
    id: ID
    label: String
  }

  type ProjectsResponse {
    label: String
    link: String
  }

  type LanguageResponse {
    id: ID
    label: String
  }

  type CategoryItemResponse {
    id: ID
    label: String
    categoryItemId: String
  }

  type ExpertResponse {
    id: ID
    email: String
    tags: [TagResponse]
    avatar: MediaResponse
    shortIntro: String
    languages: [LanguageResponse]
    publishing: String
    experties: String
    network: String
    wikipediaLink: String
    firstName: String
    lastName: String
    gender: String
    categoryItems: [CategoryResponse]
    connectedTo: [ExpertResponse]
    favorites: [ExpertResponse]
    projects: [ProjectsResponse]
    education: String
    skills: String
    slug: String
    linktree: String
    instituteType: String
    title: String
    firstTimeLogin: Boolean
    password: String
    translatableFields: [TranslatableUserField]
  }

  type TranslatableUserField {
    id: ID
    locale: String
    user: String
    experties: String
    education: String
    network: String
    skills: String
    approachableFor: String
  }


  input ProjectInput {
    label: String
    link: String
  }

  input TagInput {
    oldTags: [ID]
    newTags: [String]
  }

  input UserInput {
    id: ID
    favorites: [ID]
    tags: TagInput
    experties: String
    network: String
    education: String
    skills: String
    connectedTo: [ID]
    wikipediaLink: String
    approachableFor: String
    gender: String
    categoryItems: [ID]
    firstName: String
    lastName: String
    shortIntro: String
    publishing: String
    linktree: String
    instituteType: String
    languages: [ID]
    avatar: ID
    firstTimeLogin: Boolean
    projects: [ProjectInput]
    password: String
    email: String
    title: String
    translatableFields: ID
  }

  type Mutation {
    updateUser(
      data: UserInput! 
      id: ID!
      locale: String
      ): ExpertResponse
    createTranslatableField(user: ID): [TranslatableUserField]
  }
`;

module.exports = {
  typeDefs: queries + mutations,
};
