import Button from "@/shared/base-components/button";
import { PiHouse } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div
      className="
        compact:w-full
        tablet:w-3/5
        laptop:w-2/5
        desktop:w-1/3
        mx-auto
        flex
        h-dvh
        flex-col
        items-center
        justify-start
        overflow-hidden
        bg-darker-blue-200
        py-3
        px-2.5
      "
    >
      <div className="flex-1 flex flex-col justify-center items-center gap-12">
        <h1 className="compact:text-3xl fold:text-4xl laptop:text-5xl text-white font-peyda font-extrabold">
          متاسفم این آدرس پیدا نشد!
        </h1>
        <img
          src="/public/pwa/404.webp"
          alt="not-found"
          className="compact:size-80 laptop:size-96 pointer-events-none select-none"
        />
      </div>
      <Button
        classes="btn btn-primary-green"
        title="برگشت به صفحه اصلی"
        icon={
          <PiHouse className="text-black compact:text-4xl fold:text-5xl laptop:text-6xl" />
        }
        itemsGap={12}
        onClick={() => navigate("/dashboard")}
      />
    </div>
  );
};

export default NotFoundPage;
