import { useMutation } from "@apollo/client";
import axios from "axios";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useRouter } from "next/router";
import { SetStateAction, useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { updateUserDetails } from "../../../components/header/Header";
import Input from "../../../components/input/Input";
import RadioButton from "../../../components/input/RadioButton";
import { FORM_FIELDS, TEXTS } from "../../../constants/index";
import { registerFormGender } from "../../../formData/registerData";
import { UPDATE_USER } from "../../../graphql/schemas/mutations";
import styles from "../../../styles/components/login.module.scss";
import icons from "../../../styles/src/index";
import Form from "../../forms/components/Form";

type EditStudentProfileData = {
  email: string;
  firstName: string;
  lastName: string;
  switchCards: (ev: boolean) => void;
  profileGender: string;
  id: string;
};

const EditStudentProfile = ({ email, profileGender, firstName, lastName, id }: EditStudentProfileData) => {
  const { t } = useTranslation("common");

  const { push } = useRouter();
  // const methods = useForm();
  const [updateUser, { data, error }] = useMutation(UPDATE_USER);
  const { locale } = useRouter();
  const [gender, setGender] = useState(profileGender ?? "Female");

  const onSubmit = useCallback(
    (input: any) => {
      const newData: any = {
        gender,
        firstName: input.firstName,
        lastName: input.lastName,
      };
      if (!!input.newPassword.trim()) {
        newData.password = input.newPassword;
      }
      updateUser({ variables: { data: newData, id: id, locale: locale } });

      axios.get("/api/auth/session?update=true", {
        params: { editedData: JSON.stringify(newData) },
      });

      if (input.firstName || input.lastName) {
        updateUserDetails({ ...input });
      }

      push("/");
    },
    [gender, id, updateUser, locale],
  );

  const onChangeGenderHandler = (e: { target: { value: SetStateAction<string> } }) => {
    setGender(e.target.value);
  };

  const methods = useForm({
    defaultValues: useMemo(() => {
      return {
        [FORM_FIELDS.gender.name]: profileGender ?? "Female",
        [FORM_FIELDS.firstName.name]: firstName ?? "",
        [FORM_FIELDS.lastName.name]: lastName ?? "",
        [FORM_FIELDS.email.name]: email ?? "",
        [FORM_FIELDS.newPassword.name]: "",
        [FORM_FIELDS.repeatPassword.name]: "",
      };
    }, [email, firstName, lastName, profileGender]),
  });

  return (
    <Form {...methods}>
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
        name={FORM_FIELDS.firstName.name}
        id={FORM_FIELDS.firstName.name}
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
        name={FORM_FIELDS.email.name}
        label={t("Email") || TEXTS.Profile_email}
        rules={{ validate: FORM_FIELDS.email.validate }}
        required
        disabled
      />
      <Input
        rules={{ validate: FORM_FIELDS.newPassword.validate }}
        required
        name={FORM_FIELDS.newPassword.name}
        type="password"
        // isPassword
        label={t("Password") || TEXTS.Profile_password}
      />
      <Input
        rules={{
          validate: (v: string | null | undefined) => FORM_FIELDS.repeatPassword.validate?.(v, methods),
        }}
        required
        name={FORM_FIELDS.repeatPassword.name}
        type="password"
        // isPassword
        label={t("Password confirm") || TEXTS.Profile_password_confirm}
      />

      <div className={styles.login__buttons}>
        <button className="button buttonImage confirmButton" onClick={methods.handleSubmit(onSubmit)}>
          <Image src={icons.check} alt="login" />
          {t("Save")}
        </button>
      </div>
    </Form>
  );
};

export default EditStudentProfile;
