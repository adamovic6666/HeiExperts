import Image from "next/image";
import { SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Form from "../../components/forms/components/Form";
import Input from "../../components/input/Input";
import RadioButton from "../../components/input/RadioButton";
import SelectFaculty from "../select/SelectFaculty";

import SelectInstitute from "../../components/select/SelectInstitute";
import { FORM_FIELDS, TEXTS } from "../../constants/index";
import { registerFormGender } from "../../formData/registerData";
import styles from "../../styles/components/editModal.module.scss";
import icons from "../../styles/src";
import EditApproachableFor from "./EditApproachableFor";

const EditPersonalData = ({ data, categories, onClose, onUpdate, allCategoriesWithFirstLevelSubs }: any) => {
  const [allInstitutes, setAllInstitutes] = useState<any>([]);
  const [avatarUrl, setAvatarUrl] = useState(data?.avatar);
  const { t } = useTranslation("common");
  const [institutesDropdownIsOpen, setInstitutesDropdownIsOpen] = useState(false);
  const [facultiesDropdownIsOpen, setFacutltiesDropdownIsOpen] = useState(false);
  const editModalButtons = useRef<any>(null);
  const [mobileButtonsVisible, setMobileButtonVisible] = useState(true);
  const [selectedFacultie, setSelectedFacultie] = useState(allCategoriesWithFirstLevelSubs.categories[0]);
  const [allFaculties, setAllFacutiles] = useState(allCategoriesWithFirstLevelSubs.categories);
  const [transition, setTransition] = useState(false);

  const [gender, setGender] = useState(data?.gender);
  const [rest, setRest] = useState({
    approachableFor: data.approachableFor,
    avatar: {},
    categoryItems: data.categoryItems,
    insituteType: data.insituteType,
  });

  const onSubmit = useCallback(
    (input: any) => {
      let modifiedRest =
        Object.keys(rest.avatar).length === 0
          ? { approachableFor: rest.approachableFor, categoryItems: rest.categoryItems }
          : rest;

      let data = {
        ...input,
        gender: gender,
        ...modifiedRest,
      };

      if (data.firstName.trim() === "" || data.lastName.trim() === "") {
        return;
      }

      onClose();
      onUpdate(data);
    },
    [gender, onUpdate, rest, onClose],
  );

  useEffect(() => {
    setAllInstitutes(allCategoriesWithFirstLevelSubs.categories[0].categoryItems);
  }, [allCategoriesWithFirstLevelSubs]);

  const onChangeGenderHandler = (e: { target: { value: SetStateAction<string> } }) => {
    setGender(e.target.value);
  };

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
    facultiesDropdownIsOpen && setAllFacutiles(allCategoriesWithFirstLevelSubs.categories);
  }, [facultiesDropdownIsOpen]);

  const onChangeInstitutesHandler = (selectedOption: any) => {
    setInstitutesDropdownIsOpen(false);
    let updateCategories;
    if (rest.categoryItems.some(({ label }: any) => label === selectedOption.label)) {
      updateCategories = rest.categoryItems.filter(({ label }: any) => label !== selectedOption.label);
    } else {
      updateCategories = [selectedOption, ...rest.categoryItems];
    }
    setRest({ ...rest, categoryItems: updateCategories });
  };

  const onChangeFacultieHandler = (selectedOption: any) => {
    setSelectedFacultie(selectedOption);
    setFacutltiesDropdownIsOpen(false);
    setAllInstitutes(selectedOption.categoryItems);
  };

  const onFilterFacultiesHandler = ({ target: { value } }: { target: { value: string } }) => {
    const filteredFaculties = allCategoriesWithFirstLevelSubs.categories.filter((cat: any) =>
      cat.label.toLowerCase().includes(value.toLowerCase()),
    );
    setAllFacutiles(filteredFaculties);
  };

  const onFilterInstitutesHandler = ({ target: { value } }: { target: { value: string } }) => {
    const selectedFacultieObj = allCategoriesWithFirstLevelSubs.categories.find(
      (fac: any) => fac.label === selectedFacultie.label,
    );
    const filteredInstitutes = selectedFacultieObj.categoryItems.filter((inst: any) =>
      inst.label.toLowerCase().includes(value.toLowerCase()),
    );

    setAllInstitutes(filteredInstitutes);
  };

  const setAvatarHandler = async (file: any) => {
    const formData = new FormData();
    formData.append("files", file[0]);
    formData.append("field", "avatar");
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/upload`, {
      method: "post",
      body: formData,
    });
    const data = await res.json();
    setAvatarUrl(data[0]?.url);
    setRest({ ...rest, avatar: { ...data[0] } });
  };

  useEffect(() => {
    const id = setTimeout(() => {
      setTransition(true);
    }, 30);

    return () => clearTimeout(id);
  }, []);

  const methods = useForm({
    defaultValues: useMemo(() => {
      return {
        [FORM_FIELDS.gender.name]: data.gender ?? "Female",
        [FORM_FIELDS.title.name]: data.title ?? "",
        [FORM_FIELDS.firstName.name]: data.firstName ?? "",
        [FORM_FIELDS.lastName.name]: data.lastName ?? "",
        [FORM_FIELDS.linktree.name]: data.linktree ?? "",
        [FORM_FIELDS.email.name]: data.email ?? "",
        [FORM_FIELDS.instituteType.name]: data.instituteType ?? "",
      };
    }, [data.firstName, data.lastName, data.email, data.title, data.linktree, data.instituteType]),
  });

  return (
    <div className={styles.editModal__content__wrapper}>
      <Form {...methods}>
        <div className={styles.editModal__profileCard__image}>
          {avatarUrl && (
            <Image src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${avatarUrl}`} width={400} height={400} alt="profile" />
          )}
          {!avatarUrl && <Image src={icons.profile} width={400} height={400} alt="profile" />}
          <div className={styles.editModal__image__upload}>
            <label htmlFor="file-input">
              <Image src={icons.uploadIcon} alt="upload-icon" />
            </label>
            <input id="file-input" type="file" onChange={e => setAvatarHandler(e.target.files)} />
          </div>
        </div>
        <div className="radioButtons">
          <span>{t("Gender")}</span>
          <span className="required">*</span>

          <div className="radioButtons_wrap">
            {registerFormGender.map((input, idx) => {
              return (
                <RadioButton key={idx} {...input} checked={input.value === gender} onChange={onChangeGenderHandler} />
              );
            })}
          </div>
        </div>
        <Input
          name={FORM_FIELDS.title.name}
          id={FORM_FIELDS.title.name}
          label={t("Form_title_label") || TEXTS.Profile_name}
          rules={{ validate: FORM_FIELDS.firstName.validate }}
          transition={transition}
        />
        <Input
          name={FORM_FIELDS.firstName.name}
          id={FORM_FIELDS.firstName.name}
          label={t("Form_first_name") || TEXTS.Profile_name}
          rules={{ validate: FORM_FIELDS.firstName.validate }}
          transition={transition}
        />
        <Input
          name={FORM_FIELDS.lastName.name}
          label={t("Form_last_name") || TEXTS.Profile_lastName}
          rules={{ validate: FORM_FIELDS.lastName.validate }}
          transition={transition}
        />

        <SelectFaculty
          label={t("Institution/Faculty")}
          onChange={onChangeFacultieHandler}
          initiallySelected={selectedFacultie.label}
          isOpen={facultiesDropdownIsOpen}
          allFaculties={allFaculties}
          setIsOpen={isOpen => setFacutltiesDropdownIsOpen(isOpen)}
          onFilterFaculties={onFilterFacultiesHandler}
        />

        <SelectInstitute
          label={t("Department/Institute")}
          onChange={onChangeInstitutesHandler}
          initiallySelected={rest.categoryItems}
          isOpen={institutesDropdownIsOpen}
          allOptions={allInstitutes}
          setIsOpen={setInstitutesDropdownIsOpen}
          onFilterInstitutes={onFilterInstitutesHandler}
        />
        <Input
          name={FORM_FIELDS.instituteType.name}
          id={FORM_FIELDS.instituteType.name}
          label={t("Institute type") || TEXTS.Profile_instituteType}
          transition={transition}
        />
        <EditApproachableFor
          data={rest.approachableFor}
          onUpdate={approchableFor => setRest({ ...rest, approachableFor: approchableFor })}
        />
        <Input
          name={FORM_FIELDS.email.name}
          label={t("Email") || TEXTS.Profile_email}
          rules={{ validate: FORM_FIELDS.email.validate }}
          transition={transition}
        />
        <Input
          name={FORM_FIELDS.linktree.name}
          label={t("Linktree Link") || TEXTS.Profile_password}
          transition={transition}
        />

        <div
          className={`${!mobileButtonsVisible && styles.editModal__buttons__mobile__hidden} ${
            styles.editModal__buttons__mobile
          }`}
        >
          <button className={`button secondaryButton buttonImage`} onClick={onClose}>
            <Image src={icons.close} alt="close-image" />
          </button>
          <button className="button buttonImage" onClick={methods.handleSubmit(onSubmit)}>
            <Image src={icons.success} alt="success-image" />
          </button>
        </div>
      </Form>
      <div className={styles.editModal__buttons} ref={editModalButtons}>
        <button className={`button secondaryButton buttonImage`} onClickCapture={onClose}>
          <Image src={icons.close} alt="close-image" />
          {t("Cancel")}
        </button>
        <button onClick={methods.handleSubmit(onSubmit)} className="button buttonImage">
          <Image src={icons.success} alt="success-image" /> {t("Save")}
        </button>
      </div>
    </div>
  );
};

export default EditPersonalData;
