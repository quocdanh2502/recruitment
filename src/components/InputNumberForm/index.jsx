import { InputNumber } from "antd";
import { useEffect, useState } from "react";

export default function InputNumberForm(props) {
  const { defaultValue, index, enabled, isRollBack, onClick, disabled } = props;
  const [value, setValue] = useState();
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);
  useEffect(() => {
    if (isRollBack === index) {
      setValue(defaultValue);
    }
  }, [defaultValue, index, isRollBack]);
  return (
    <InputNumber
      disabled={disabled}
      onClick={onClick}
      readOnly={enabled !== index}
      style={{ width: "100%" }}
      min={0}
      max={10}
      value={value}
      onChange={(e) => {
        setValue(e);
      }}
    />
  );
}
