import { useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";

const OtpBox = () => {
  const [values, setValues] = useState<string[]>(["", "", "", ""]);
  const inputsRef = useRef<HTMLInputElement[]>([]);

  // useEffect(() => {
  //     inputsRef.current[0].focus();
  // }, []);

  const onChangeInput = (
    event: ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = event.target.value;

    if (!/^\d*$/.test(value)) return;

    setValues((prev) => {
      const updated = [...prev];

      if (value.length > 1) {
        const chars = value.split("");

        chars.forEach((char, i) => {
          if (index + i < updated.length) {
            updated[index + i] = char;
          }
        });

        const nextIndex = index + chars.length;
        if (inputsRef.current[nextIndex]) {
          inputsRef.current[nextIndex].focus();
        } else {
          inputsRef.current[index].blur();
        }
      } else {
        updated[index] = value;
        if (value) {
          if (inputsRef.current[index + 1]) {
            inputsRef.current[index + 1].focus();
          } else {
            inputsRef.current[index].blur();
          }
        }
      }

      return updated;
    });
  };

  const onKeyDownInput = (
    event: KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (event.key === "Backspace" && !values[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };
  return (
    <div className="flex flex-col justify-start items-center gap-4 select-none">
      <div className="flex flex-col items-start w-full mb-1 justify-center">
        <label
          htmlFor="name"
          className="shrink-0 compact:text-xl mobile-lg::text-2xl font-yekan font-extrabold text-xl self-start text-white"
        >
          کد تایید را وارد کنید
        </label>
        <small className="font-peyda compact:text-xs mobile-lg:text-sm font-medium text-blue-500">
          کد تایید به شماره 09333593301 ارسال کردیم
        </small>
      </div>
      <div className="w-full flex flex-row-reverse justify-evenly items-center gap-3 compact:px-8 mobile:px-12 mobile-lg:px-20 fold:px-36 tablet:px-20 laptop:px-14">
        {values.map((value, index) => (
          <input
            key={index}
            ref={(el) => {
              if (el) inputsRef.current[index] = el;
            }}
            className="
                w-full
              bg-[#1B1A20] 
                text-blue-800
                text-xl
                rounded-2xl
                border
              border-darker-blue-100 
              focus:border-blue-400
                py-2
                text-center
                outline-none"
            type="text"
            inputMode="numeric"
            maxLength={4}
            value={value}
            onFocus={(e) => e.target.select()}
            onChange={(e) => onChangeInput(e, index)}
            onKeyDown={(e) => onKeyDownInput(e, index)}
            dir="ltr"
          />
        ))}
      </div>
    </div>
  );
};

export default OtpBox;
