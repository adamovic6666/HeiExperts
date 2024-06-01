import { useTranslation } from "react-i18next";

type RadioButtonData = {
  id: string;
  htmlFor: string;
  name: string;
  checked?: boolean;
  onChange?: (ev: any) => void;
  value: string | number;
  label?: string | number;
};

const RadioButton = ({ id, name, checked, onChange, value, label }: RadioButtonData) => {
  const { t } = useTranslation("common");

  return (
    <div className="formItem formTypeRadio">
      <input type="radio" name={name} id={id} onChange={onChange} checked={checked} value={value} />
      <label htmlFor={id}>{label && t(label?.toString())}</label>
    </div>
  );
};

export default RadioButton;
