import { useQuery } from "@apollo/client";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PROFILE_TYPES } from "../../constants/index";
import { SEARCH } from "../../graphql/schemas/queries";
import styles from "../../styles/components/editModal.module.scss";
import icons from "../../styles/src/index";
import { EditModalType } from "../../types/index";
import EditConnectedProfiles from "./EditConnectedProfiles";
import EditEducation from "./EditEducation";
import EditExpertise from "./EditExpertise";
import EditNetwork from "./EditNetwork";
import EditPersonalData from "./EditPersonalData";
import EditProjects from "./EditProjects";
import EditSkills from "./EditSkills";
import EditTags from "./EditTags";

const EditModal = ({
  onClose,
  editComponentType,
  data,
  onUpdateProfile,
  onUpdateClient,
  allTags,
  categories,
  allCategoriesWithFirstLevelSubs,
}: EditModalType) => {
  const { t } = useTranslation("common");
  const editModalButtons = useRef<any>(null);
  let modalData;
  const { data: searchData, loading } = useQuery(SEARCH);
  const [toEditData, setToEditData] = useState({});
  const [clientData, setClientData] = useState({});
  const [editData, setEditData] = useState(data);
  const [mobileButtonsVisible, setMobileButtonVisible] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);

  const isInViewport = () => {
    const rect = editModalButtons && editModalButtons?.current?.getBoundingClientRect();
    if (rect)
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight + 180 || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
  };

  useEffect(() => {
    document.addEventListener("scroll", () => {
      const isOnScreen = isInViewport();
      setMobileButtonVisible(!isOnScreen);
    });
    return () => document.removeEventListener("scroll", isInViewport);
  }, []);

  useEffect(() => {
    if (editComponentType === PROFILE_TYPES.PROJECTS) {
      setIsDisabled(true);
    }
  }, [editComponentType]);

  const updateData = (key: string, value: any) => {
    let modifiedValue;
    if (key === "categoryItems") {
      modifiedValue = value.map((l: any) => +l.id);
    } else {
      modifiedValue = value;
    }

    setEditData({ ...editData, [key]: value });
    setToEditData({ ...toEditData, [key]: modifiedValue });
    key !== "connectedTo" && setClientData({ ...clientData, [key]: value });
  };

  const onUpdateHandler = () => {
    onUpdateProfile(toEditData);
    onUpdateClient(clientData);
  };

  const modifiedLabel = (key: string) => {
    if (key === "title") return t("Form_title_label");
    if (key === "firstName") return t("Form_first_name");
    if (key === "lastName") return t("Form_last_name");
    if (key === "linktree") return t("Linktr.Ee Link");
    if (key === "email") return t("Email");
    if (key === "approachableFor") return t("Approachable for");
    if (key === "categoryItems") return t("Institution/Faculty");
    if (key === "expertise") return t("Expertise");
    if (key === "experties") return t("Expertise");
    if (key === "network") return t("Network");
    if (key === "education") return t("Education");
    if (key === "connected profile") return t("Connected Profiles");
    if (key === "skills") return t("Skills");

    return key;
  };

  if (editComponentType === PROFILE_TYPES.PERSONAL_DATA) {
    modalData = (
      <EditPersonalData
        allCategoriesWithFirstLevelSubs={allCategoriesWithFirstLevelSubs}
        data={data}
        onClose={onClose}
        categories={categories}
        onUpdate={(data: any) => {
          let modifiedData = { ...data, categoryItems: data.categoryItems.map((item: any) => item.id) };
          onUpdateProfile(modifiedData);
          onUpdateClient(data);
        }}
      />
    );
  }

  if (editComponentType === PROFILE_TYPES.TAGS) {
    modalData = (
      <div className={styles.editModal__tags__wrapper}>
        <EditTags
          data={data}
          allTags={allTags}
          updateClient={(allTags: any) => {
            setClientData({ tags: allTags });
          }}
          onUpdate={ids => {
            if (ids.every((t: any) => typeof t === "number")) {
              setToEditData({ tags: { oldTags: ids, newTags: [] } });
            } else {
              let numbers: any = [];
              let strings: any = [];

              ids.forEach((t: any) => {
                if (typeof t === "number") {
                  numbers.push(t);
                } else {
                  strings.push(t);
                }
              });

              setToEditData({ tags: { oldTags: numbers, newTags: strings } });
            }
          }}
        />
      </div>
    );
  }

  if (editComponentType === PROFILE_TYPES.EXPERTISE) {
    modalData = (
      <EditExpertise
        data={data}
        updateClient={(expertise: any) => {
          setClientData({ expertise: expertise });
        }}
        onUpdate={expertise => updateData("experties", expertise)}
      />
    );
  }

  if (editComponentType === PROFILE_TYPES.NETWORK) {
    modalData = (
      <EditNetwork
        updateClient={(network: any) => {
          setClientData({ network: network });
        }}
        data={data}
        onUpdate={network => updateData("network", network)}
      />
    );
  }

  if (editComponentType === PROFILE_TYPES.EDUCATION) {
    modalData = (
      <EditEducation
        updateClient={(education: any) => {
          setClientData({ education: education });
        }}
        data={data}
        onUpdate={education => updateData("education", education)}
      />
    );
  }

  if (editComponentType === PROFILE_TYPES.SKILLS) {
    modalData = (
      <EditSkills
        updateClient={(skills: any) => {
          setClientData({ skills: skills });
        }}
        data={data}
        onUpdate={skills => updateData("skills", skills)}
      />
    );
  }

  if (editComponentType === PROFILE_TYPES.PROJECTS) {
    modalData = (
      <div className={styles.editModal__projects__wrapper}>
        <EditProjects
          data={data}
          onUpdate={projects => {
            setToEditData({ projects });
          }}
          updateClient={(projects: any) => {
            setIsDisabled(false);
            setClientData({ projects: projects });
          }}
        />
      </div>
    );
  }

  if (editComponentType === PROFILE_TYPES.CONNECTED_PROFILE) {
    modalData = (
      <EditConnectedProfiles
        updateClient={(connectedTo: any) => {
          setClientData({ connectedTo: connectedTo });
        }}
        data={data}
        loading={loading}
        filters={searchData?.experts?.filters && searchData?.experts?.filters}
        onUpdate={profiles => updateData("connectedTo", profiles)}
        onClose={() => {
          onClose?.();
        }}
      />
    );
  }

  return (
    <div
      className={`${editComponentType === PROFILE_TYPES.PERSONAL_DATA && styles.editModal__personalDetails} ${
        editComponentType === PROFILE_TYPES.CONNECTED_PROFILE && styles.editModal__connectedProfiles
      } ${styles.editModal}`}
    >
      <h3>{modifiedLabel(editComponentType)}</h3>
      {modalData}
      {editComponentType !== PROFILE_TYPES.PERSONAL_DATA && (
        <div
          className={`${!mobileButtonsVisible && styles.editModal__buttons__mobile__hidden} ${
            styles.editModal__buttons__mobile
          }`}
        >
          <button className={`button secondaryButton buttonImage`} onClick={onClose}>
            <Image src={icons.close} alt="close-image" />
          </button>
          <button
            className="button buttonImage"
            onClick={() => {
              onUpdateHandler();
              onClose?.();
            }}
          >
            <Image src={icons.success} alt="success-image" />
          </button>
        </div>
      )}
      {editComponentType !== PROFILE_TYPES.PERSONAL_DATA && (
        <div className={styles.editModal__buttons} ref={editModalButtons}>
          <button className={`button secondaryButton buttonImage`} onClick={onClose}>
            <Image src={icons.close} alt="close-image" />
            {t("Cancel")}
          </button>
          <button
            disabled={isDisabled}
            className="button buttonImage"
            onClick={() => {
              onUpdateHandler();
              onClose?.();
            }}
          >
            <Image src={icons.success} alt="success-image" /> {t("Save")}
          </button>
        </div>
      )}
    </div>
  );
};

export default EditModal;
