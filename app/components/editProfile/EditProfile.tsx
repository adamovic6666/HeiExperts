import Backdrop from "../../components/backdrop/Backdrop";
import styles from "../../styles/components/editProfile.module.scss";
import { EditProfileType } from "../../types/index";
import EditModal from "./EditModal";

const EditProfile = ({
  onClose,
  editComponentType,
  data,
  onUpdateProfile,
  allCategories,
  onUpdateClient,
  allTags,
  allCategoriesWithFirstLevelSubs,
}: EditProfileType) => {
  return (
    <Backdrop desktopOnly>
      <div className={styles.editProfile__close} onClick={onClose}></div>
      <EditModal
        editComponentType={editComponentType}
        onClose={onClose}
        data={data}
        onUpdateProfile={onUpdateProfile}
        categories={allCategories?.categoryItems}
        allTags={allTags?.tags}
        onUpdateClient={onUpdateClient}
        allCategoriesWithFirstLevelSubs={allCategoriesWithFirstLevelSubs}
      />
    </Backdrop>
  );
};

export default EditProfile;
