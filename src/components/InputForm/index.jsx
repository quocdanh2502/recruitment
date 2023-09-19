import TextArea from "antd/es/input/TextArea";
import { useEffect, useRef, useState } from "react";

export default function InputForm(props) {
  const { defaultValue, index, enabled, isRollBack } = props;
  const defaultValueRef = useRef(defaultValue);
  const keyRef = useRef(index);
  const [value, setValue] = useState();
  useEffect(() => {
    if (isRollBack === keyRef.current) {
      setValue(defaultValueRef.current);
    }
  }, [isRollBack]);
  return (
    <TextArea
      readOnly={enabled !== index}
      autoSize={{
        minRows: 3,
        maxRows: 10,
      }}
      style={{ width: "10rem", height: "100%", cursor: "unset" }}
      defaultValue={defaultValue}
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
      }}
    />
  );
}
