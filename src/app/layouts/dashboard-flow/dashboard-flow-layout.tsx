import { logout } from "@/features/auth/api/auth.api";
import { useNavigate } from "react-router-dom";

const DashboardFlowLayout = () => {
  const navigate = useNavigate();

  const logoutHandler = () => {
    logout();
    navigate("/auth/login", { replace: true });
  };
  return (
    <div className="w-full h-svh grid grid-cols-1 place-items-center">
      <h1>در حال احداث داشبورد...</h1>
      <h6 className="text-red-400 cursor-pointer" onClick={logoutHandler}>
        خروج
      </h6>
    </div>
  );
};

export default DashboardFlowLayout;
