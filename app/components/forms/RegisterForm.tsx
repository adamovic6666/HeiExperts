import { useMutation } from "@apollo/client";
import axios from "axios";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import Input from "../../components/input/Input";
import RadioButton from "../../components/input/RadioButton";
import TermsModal from "../../components/modal/TermsModal";
import { createToast } from "../../components/toast/Toast";
import { FORM_FIELDS, STRAPI_ERRORS, TEXTS } from "../../constants/index";
import { registerFormGender, registerFormUser } from "../../formData/registerData";
import { CREATE_USER_TRANSLATIONS, UPDATE_USER } from "../../graphql/schemas/mutations";
import styles from "../../styles/components/login.module.scss";
import icons from "../../styles/src/index";
import Form from "./components/Form";

const RegisterForm = ({ switchCards, onRegisterFormData, registerData, dataProtectionModal, researchModal }: any) => {
  const { t } = useTranslation("common");
  const methods = useForm({
    defaultValues: useMemo(() => {
      return {
        [FORM_FIELDS.gender.name]: registerFormGender[3].value,
        [FORM_FIELDS.title.name]: "",
        [FORM_FIELDS.firstName.name]: registerData.firstName ?? "",
        [FORM_FIELDS.lastName.name]: registerData.lastName ?? "",
        role: registerData.linktree ?? "",
        categoryItems: null,
        [FORM_FIELDS.email.name]: registerData.email ?? "",
      };
    }, [registerData]),
  });
  const [gender, setGender] = useState(registerFormGender[3].value);
  const [role, setRole] = useState(registerFormUser[0].value);
  const [modalData, setModalData] = useState({});
  const [categoryItemsId, setCategoryItemsId] = useState(null);

  const [isModalOpen, onIsModalOpen] = useState(false);
  const [createUserTranslations] = useMutation(CREATE_USER_TRANSLATIONS);
  const [updateUser] = useMutation(UPDATE_USER);
  const { push, query } = useRouter();
  const [privacyCheckboxIsChecked, setPrivacyCheckboxIsChecked] = useState(false);
  const [reserachCheckboxIsChecked, setReserachCheckboxIsChecked] = useState(false);
  const [agreementError, setAgreementError] = useState(false);

  const setData = useCallback(() => {
    if (registerData?.email) methods.setValue(FORM_FIELDS.email.name, registerData?.email);
    if (registerData?.firstName) methods.setValue(FORM_FIELDS.firstName.name, registerData?.firstName);
    if (registerData?.lastName) methods.setValue(FORM_FIELDS.lastName.name, registerData?.lastName);
    if (registerData?.newPassword) methods.setValue(FORM_FIELDS.newPassword.name, registerData?.newPassword);
  }, [methods, registerData?.email, registerData?.firstName, registerData?.lastName, registerData?.newPassword]);

  useEffect(() => {
    setData();
  }, [registerData, setData]);

  useEffect(() => {
    if (registerData.instituteCode) {
      //get data
      //hardcoded for now
      axios
        .get(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/category-items?filters[categoryItemId][$eq]=${registerData.instituteCode}`,
        )
        .then(({ data }) => {
          setCategoryItemsId(data.data[0].id);
        });
    }
  }, [registerData.instituteCode]);

  const onSubmit = useCallback(
    (input: any) => {
      if (!privacyCheckboxIsChecked || !reserachCheckboxIsChecked) {
        setAgreementError(true);
        return;
      }

      axios
        .post(process.env.NEXT_PUBLIC_STRAPI_URL + "/api/auth/local/register", {
          identifier: registerData.sAMAccountName || input.email,
          title: input.title,
          username: registerData.sAMAccountName || input.email,
          password: input.newPassword,
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          gender: gender,
          role: role,
          categoryItems: categoryItemsId,
        })
        .then(async ({ data }) => {
          if (data) {
            push({ query: { ...query, login: "true" } }, undefined, { shallow: true });
            setCategoryItemsId(null);
            createToast({
              message: t("You have successfully registered. An email has been sent to you to confirm your account."),
              type: "success",
            });
          }
          // push("/user/auth");
          onRegisterFormData({ email: input.email, password: input.newPassword });
        })
        .catch(({ response }) => {
          if (STRAPI_ERRORS.includes(response?.data?.error.message)) {
            createToast({ message: t(response?.data?.error.message), type: "error" });
          } else {
            createToast({ message: t("Something went wrong"), type: "error" });
          }
        });
    },
    [
      privacyCheckboxIsChecked,
      reserachCheckboxIsChecked,
      registerData.sAMAccountName,
      registerData.instituteCode,
      gender,
      role,
      onRegisterFormData,
      push,
      query,
      t,
    ],
  );

  const onChangeGenderHandler = (e: any) => {
    setGender(e.target.value);
  };

  const onChangeUserHandler = (e: any) => {
    setRole(e.target.value);
  };

  useEffect(() => {
    if (reserachCheckboxIsChecked && privacyCheckboxIsChecked) {
      setAgreementError(false);
    }
  }, [reserachCheckboxIsChecked, privacyCheckboxIsChecked]);

  return (
    <Form {...methods}>
      <h3>{t("Register")}</h3>
      <div className="radioButtons">
        <span>{t("Gender")}</span>
        <span className="required">*</span>
        <div className="radioButtons_wrap">
          {registerFormGender.map((input, idx) => {
            return (
              <RadioButton
                key={idx}
                {...input}
                checked={input.value === gender}
                label={t(input.value) || input.value}
                onChange={onChangeGenderHandler}
              />
            );
          })}
        </div>
      </div>
      <Input
        name={FORM_FIELDS.title.name}
        id={FORM_FIELDS.title.name}
        label={t("Form_title_label") || TEXTS.Profile_title}
      />
      <Input
        name={FORM_FIELDS.firstName.name}
        label={t("Form_first_name") || TEXTS.Profile_name}
        rules={{ validate: FORM_FIELDS.firstName.validate }}
        required
      />
      <Input
        name={FORM_FIELDS.lastName.name}
        label={t("Form_last_name") || TEXTS.Profile_lastName}
        rules={{ validate: FORM_FIELDS.lastName.validate }}
        required
      />
      <Input
        rules={{ validate: FORM_FIELDS.email.validate }}
        name={FORM_FIELDS.email.name}
        label={t("Email") || TEXTS.Profile_email}
        required
      />
      <Input
        rules={{ validate: FORM_FIELDS.newPassword.validate }}
        name={FORM_FIELDS.newPassword.name}
        type="password"
        label={t("Password") || TEXTS.Profile_password}
        required
      />
      <Input
        rules={{ validate: (v: string) => FORM_FIELDS.repeatPassword.validate(v, methods.getValues()) }}
        name={FORM_FIELDS.repeatPassword.name}
        type="password"
        label={t("Password confirm") || TEXTS.Profile_password_confirm}
        required
      />

      <div className="radioButtons">
        <span>{t("I am")}</span>
        <span className="required">*</span>
        <div className="radioButtons_wrap">
          {registerFormUser.map((input, idx) => {
            return (
              <RadioButton
                key={idx}
                {...input}
                checked={input.value === Number(role)}
                label={t(input.label) || input.label}
                onChange={onChangeUserHandler}
              />
            );
          })}
        </div>
      </div>
      <div className={styles.login__dataProtection}>
        <p>
          {t("I agree to the following terms")}:<span>*</span>
        </p>
        <div>
          <div className="formItem formTypeCheckbox">
            <label htmlFor="privacy">
              <input
                id="privacy"
                onChange={() => {
                  !privacyCheckboxIsChecked && onIsModalOpen(true);
                  privacyCheckboxIsChecked && setPrivacyCheckboxIsChecked(!privacyCheckboxIsChecked);
                  !privacyCheckboxIsChecked &&
                    setModalData({
                      title: t(dataProtectionModal.title),
                      description: t(dataProtectionModal.body),
                      type: "privacy",
                    });
                }}
                type="checkbox"
                name="label"
                checked={privacyCheckboxIsChecked}
                className={`${agreementError && !privacyCheckboxIsChecked && styles.login__input__error}`}
              />
              {t("Privacy")}
            </label>
          </div>
          <div className="formItem formTypeCheckbox">
            <label htmlFor="research">
              <input
                id="research"
                onChange={() => {
                  !reserachCheckboxIsChecked && onIsModalOpen(true);
                  reserachCheckboxIsChecked && setReserachCheckboxIsChecked(!reserachCheckboxIsChecked);
                  !reserachCheckboxIsChecked &&
                    setModalData({
                      title: t(researchModal.title),
                      description: t(researchModal.body),
                      type: "research",
                    });
                }}
                type="checkbox"
                name="label"
                checked={reserachCheckboxIsChecked}
                className={`${agreementError && !reserachCheckboxIsChecked && styles.login__input__error}`}
              />
              {t("Research")}
            </label>
          </div>
        </div>
      </div>

      <div className={styles.login__buttons}>
        <button className="button buttonImage" onClick={methods.handleSubmit(onSubmit)}>
          <Image src={icons.loginWhite} alt="login" /> {t("Register")}
        </button>
        <p>{t("Already have account?")}</p>
        <span
          className="button secondaryButton buttonImage"
          onClick={() => {
            push({ query: { ...query, login: "true" } }, undefined, { shallow: true });
          }}
        >
          <Image src={icons.registerRed} alt="login" />
          {t("To Login")}
        </span>
      </div>
      {isModalOpen && (
        <TermsModal
          modalData={modalData}
          onClose={() => onIsModalOpen(false)}
          onSetCheckedField={(type: string) => {
            if (type === "privacy") {
              setPrivacyCheckboxIsChecked(true);
            } else {
              setReserachCheckboxIsChecked(true);
            }
          }}
        />
      )}
    </Form>
  );
};

export default RegisterForm;
