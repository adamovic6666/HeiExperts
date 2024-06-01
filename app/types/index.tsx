type ReactNode = string | number | boolean | null | undefined;

export interface ObjectOfAny {
  [key: string]: any;
}

export type toastType = "success" | "error" | "info" | "notification";

export type ShowToastOptions = {
  type: toastType;
  text1?: string;
  text2?: string;
  visibilityTime?: number;
  autoHide?: boolean;
};

export type LanguageType = {
  label: string;
  __typename: string;
};

export type BackdropType = {
  children?: any;
  onClose?: (ev: any) => void;
  background?: boolean;
  desktopOnly?: boolean;
};

export type ProfileType = {
  children?: any;
  onEdit?: (ev: any, data: any) => void;
  onUpdateIds?: (ev: any) => void;
  email?: string;
  wikipediaLink: string;
  firstName?: string;
  lastName?: string;
  avatar: { url: string };
  languages?: [LanguageType];
  publishing: string;
  shortIntro: string;
  expertCanEdit: boolean;
  gender?: string;
  categoryItems?: any[];
  linktree?: string;
  instituteType?: string;
  title?: string;
  favoriteIds?: [number];
  id: string;
  userDetails?: any;
  loading?: boolean;
  userApprochableFor?: string;
  expertCanRepeatWalktour?: boolean;
  onOpenTour?: () => void;
};

export type ConnectedProfilesSlider = {
  onEdit?: (ev: any, data: any) => void;
  connectedTo: any[];
  expertCanEdit: boolean;
};

export type EditModalType = {
  children?: any;
  onClose?: (ev?: any) => void;
  editComponentType: string;
  data: any;
  onUpdateProfile: (newProfileData?: any) => void;
  onUpdateClient: (newProfileData?: any) => void;
  categories: any[];
  filters?: any[];
  tags?: any[];
  allTags?: any[];
  approchableFor?: any;
  allCategoriesWithFirstLevelSubs: any[];
};

export type SelectType = {
  label?: string | undefined | any;
  allFaculties?: any;
  allOptions?: any;
  dropdownIsOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  initiallySelected: any[] | any;
  isOpen: boolean;
  onChange: (ev: any) => void;
  onFilterFaculties?: (ev: any) => void;
  onFilterInstitutes?: (ev: any) => void;
};

export type EditProfileType = {
  onClose?: (ev: any) => void;
  editComponentType: string;
  data: any;
  onUpdateProfile: (newProfileData?: any) => void;
  filters?: any[];
  allCategories: any;
  allTags: any;
  onUpdateClient: (data: any) => void;
  userApprochableFor?: any;
  allCategoriesWithFirstLevelSubs: any[];
};

export type ProjectType = {
  toDeleteTag?: boolean;
  project: { label: string; link: string };
  onClick?: (label: string) => void;
};

export type ProjectsType = {
  children?: any;
  onEdit?: (ev: any, data: any) => void;
  projects?: [];
  onClick?: (label: string) => void;
  expertCanEdit: boolean;
};

export type FormDependencyType = { name: string; visibleWhen: (v: any) => boolean };

export type FormProps<T> =
  // @ts-ignore
  UseFormReturn<T> & {
    isNotModal?: boolean;
    children: ReactNode;
    onDone?: (values: any) => void;
    uri?: any;
    _id?: string;
    type?: any;
    successToastOptions?: (changes: ObjectOfAny, result: any) => ShowToastOptions;
    errorToastOptions?: (changes: ObjectOfAny, result: any) => ShowToastOptions;

    /**
     *
     * a function that is called before the data is send to the backend, the return value will be sent to the backend directly without validation
     */
    transformFields?: (changes: ObjectOfAny) => ObjectOfAny;

    /**
     * callback that is triggered after the response is received
     *
     */
    onResponse?: (response: any) => void;

    /**
     *
     * when set to false the the data will contain the whole form, otherwise it will contain only the chagned values
     * set this to false when creating an entity
     * DEFAULTS TO TRUE
     * @type {boolean}
     */
    dirtyFieldsOnly?: boolean;

    /**
     * the style of the view that wraps the childrens
     *
     * @type {BasicStyleProp}
     */
    containerStyle?: any;
  };

export type Tag = {
  label: string | number;
  id: string;
};

export type LabelData = {
  tag?: Tag;
  toDeleteTag?: boolean;
  onClick?: (ev: any) => void;
  selectedTags?: any[];
  cardTagSelected?: boolean;
  hoverable?: boolean;
  animate?: boolean;
};
