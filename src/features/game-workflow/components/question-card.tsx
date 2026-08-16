import type { ReactNode } from "react";

type QuestionCardProps = {
  icon: ReactNode;
  title: string;
  isRequiredField?: boolean;
  children: ReactNode;
};

const QuestionCard = ({
  icon,
  title,
  isRequiredField = false,
  children,
}: QuestionCardProps) => {
  return (
    <div className="bg-[#1C2026] w-full border border-dark rounded-2xl p-4 flex flex-col justify-start items-center gap-4">
      <div className="w-full flex flex-row items-center gap-2">
        {icon && icon}
        <div className="w-full font-peyda font-medium flex flex-row items-center gap-1">
          <label className="text-white text-sm">{title}</label>
          {!isRequiredField && (
            <small className="text-blue-600 text-xs">(اختیاری)</small>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default QuestionCard;
