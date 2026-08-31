import { CgInfinity } from "react-icons/cg";
import { PiAlarm, PiCoins, PiHeartbeat, PiPlant } from "react-icons/pi";

const InventoryBox = () => {
  return (
    <ul className="w-full grid grid-cols-2 items-center gap-2">
      <li className="w-full border border-blue-900 rounded-full p-1.5 flex flex-row items-center gap-2">
        <div className="bg-[#FFB7BC] rounded-full compact:p-1 mobile:p-2">
          <PiHeartbeat className="compact:text-2xl fold:text-3xl laptop:text-4xl" />
        </div>
        <div className="flex-1 font-peyda flex flex-col justify-center items-start">
          <h2 className="compact:text-sm fold:text-base laptop:text-lg text-white font-bold">
            سلامتی
          </h2>
          <small className="compact:text-[7px] mobile:text-xxs fold:text-xs laptop:text-sm text-gray-200">
            تأثیر بر سلامت بدن
          </small>
        </div>
        <CgInfinity className="text-blue-400 compact:text-2xl mobile:text-3xl fold:text-4xl laptop:text-5xl mobile:ml-1" />
      </li>
      <li className="w-full border border-blue-900 rounded-full p-1.5 flex flex-row items-center gap-2">
        <div className="bg-[#FCECAD] rounded-full compact:p-1 mobile:p-2">
          <PiCoins className="compact:text-2xl fold:text-3xl laptop:text-4xl" />
        </div>
        <div className="flex-1 font-peyda flex flex-col justify-center items-start">
          <h2 className="compact:text-sm fold:text-base laptop:text-lg text-white font-bold">
            هزینه
          </h2>
          <small className="compact:text-[7px] mobile:text-xxs fold:text-xs laptop:text-sm text-gray-200">
            مقدار بودجه لازم
          </small>
        </div>
        <CgInfinity className="text-blue-400 compact:text-2xl mobile:text-3xl fold:text-4xl laptop:text-5xl mobile:ml-1" />
      </li>
      <li className="w-full border border-blue-900 rounded-full p-1.5 flex flex-row items-center gap-2">
        <div className="bg-[#C8E0FF] rounded-full compact:p-1 mobile:p-2">
          <PiAlarm className="compact:text-2xl fold:text-3xl laptop:text-4xl" />
        </div>
        <div className="flex-1 font-peyda flex flex-col justify-center items-start">
          <h2 className="compact:text-sm fold:text-base laptop:text-lg text-white font-bold">
            سهولت تهیه
          </h2>
          <small className="compact:text-[7px] mobile:text-xxs fold:text-xs laptop:text-sm text-gray-200">
            سختی و زمان تهیه
          </small>
        </div>
        <CgInfinity className="text-blue-400 compact:text-2xl mobile:text-3xl fold:text-4xl laptop:text-5xl mobile:ml-1" />
      </li>
      <li className="w-full border border-blue-900 rounded-full p-1.5 flex flex-row items-center gap-2">
        <div className="bg-[#AAFFC9] rounded-full compact:p-1 mobile:p-2">
          <PiPlant className="compact:text-2xl fold:text-3xl laptop:text-4xl" />
        </div>
        <div className="flex-1 font-peyda flex flex-col justify-center items-start">
          <h2 className="compact:text-sm fold:text-base laptop:text-lg text-white font-bold">
            محیط‌زیست
          </h2>
          <small className="compact:text-[7px] mobile:text-xxs fold:text-xs laptop:text-sm text-gray-200">
            میزان آسیب به طبیعت
          </small>
        </div>
        <CgInfinity className="text-blue-400 compact:text-2xl mobile:text-3xl fold:text-4xl laptop:text-5xl mobile:ml-1" />
      </li>
    </ul>
  );
};

export default InventoryBox;
