import Image from "next/image";
import { useForm } from "react-hook-form";
import Input from "../../../components/input/Input";
import RadioButton from "../../../components/input/RadioButton";
import { FORM_FIELDS, TEXTS } from "../../../constants/index";
import styles from "../../../styles/components/login.module.scss";
import icons from "../../../styles/src/index";
import Form from "../../forms/components/Form";
import { useTranslation } from "next-i18next";

type StudentProfileData = {
  switchCards: (ev: boolean) => void;
  gender: string;
  firstName: string;
  lastName: string;
  email: string;
};

const StudentProfile = ({ switchCards, gender, firstName, lastName, email }: StudentProfileData) => {
  const { t } = useTranslation("common");

  const methods = useForm();
  return (
    <Form {...methods}>
      <div className="radioButtons">
        <span>{t("Gender")}</span>
        <div className="radioButtons_wrap">
          <RadioButton
            htmlFor={gender}
            value={gender}
            label={t(gender) || gender}
            checked
            id={TEXTS.Profile_gender}
            name={TEXTS.Profile_gender}
          />
        </div>
      </div>
      <Input
        name={FORM_FIELDS.firstName.name}
        label={t("Form_first_name") || TEXTS.Profile_name}
        defaultValue={firstName}
        disabled={true}
        required
      />
      <Input
        name={FORM_FIELDS.lastName.name}
        label={t("Form_last_name") || TEXTS.Profile_lastName}
        defaultValue={lastName}
        disabled={true}
        required
      />
      <Input
        name={FORM_FIELDS.email.name}
        type="email"
        label={t("Email") || TEXTS.Profile_email}
        defaultValue={email}
        disabled={true}
        required
      />

      <div className={styles.login__buttons}>
        <button className="button buttonImage editButton" onClick={() => switchCards(true)}>
          <Image src={icons.editWhite} alt="login" /> {t("Edit")}
        </button>
      </div>
    </Form>
  );
};

export default StudentProfile;
