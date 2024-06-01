import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";
import Input from "../../components/input/Input";
import styles from "../../styles/components/login.module.scss";
import icons from "../../styles/src";

export default function LoginForm({ switchCards }: any) {
  const { t } = useTranslation("common");
  return (
    <form>
      <Input label={t("Email") || "Email"} name="" id="email" type="email" />
      <Input label={t("Password") || "Password"} name="" id="password" type="password" />
      <Link href="/user/forgot-password" className={`button ${styles.login__forgotPassword}`}>
        {t("Forgot password?")}
      </Link>

      <div className={styles.login__buttons}>
        <button className="button buttonImage">
          <Image src={icons.loginWhite} alt="login" /> {t("To Login")}
        </button>
        <p>{t("Don't have an account yet?")}</p>
        <span className="button secondaryButton buttonImage" onClick={() => switchCards(true)}>
          <Image src={icons.registerRed} alt="login" />
          {t("Register")}
        </span>
      </div>
    </form>
  );
}
