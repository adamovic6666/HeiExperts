import { useEffect, useState } from "react";
import { INPUT_TYPES } from "../../constants/index";
import styles from "../../styles/components/input.module.scss";

type InputData = {
  id?: string;
  type?: string;
  name: string;
  placeholder?: string;
  label: string | undefined;
  onClick?: (ev: any) => void;
  onChange?: (ev: any) => void;
  inputType?: string;
  value?: any;
  error?: boolean;
  disabled?: boolean;
  defaultValue?: string;
  rules?: any;
  required?: boolean;
  maxLength?: number;
  transition?: boolean;
};

const Input = ({
  id,
  type,
  name,
  label,
  placeholder,
  onClick,
  inputType,
  onChange,
  value,
  error,
  disabled,
  defaultValue,
  rules,
  required,
  maxLength,
  transition = true,
}: InputData) => {
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    const inputValue = value;
    if (!value && !defaultValue) {
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
    }
  }, [value, defaultValue]);

  return (
    <div
      className={isEmpty ? `formText ${styles.input}` : `formText formText__value ${styles.input}`}
      onClickCapture={onClick}
    >
      <label
        htmlFor={id}
        className={`${error && "formLabel__error"} formLabel ${transition && "formLabel--with-transition "}  `}
      >
        {label}
        {required && <span>*</span>}
      </label>
      {error && <span className="errorMessage">{error}</span>}
      {inputType === INPUT_TYPES.TEXTAREA ? (
        <textarea id={id} name={name} value={name} />
      ) : (
        <input
          className="formTextInput"
          onChange={onChange}
          id={id}
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          defaultValue={defaultValue}
          maxLength={maxLength}
        />
      )}
      {error && <span className="errorMessage">{error}</span>}
    </div>
  );
};

export default Input;
