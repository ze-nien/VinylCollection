import { useNavigate, useLocation } from "react-router";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import api from "../api/axiosInstance";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import { useEffect } from "react";

interface LoginFormInput {
  userName: string;
  password: string;
}

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInput>({
    defaultValues: {
      userName: "",
      password: "",
    },
  });

  const location = useLocation();
  useEffect(() => {
    const message = location.state?.message;
    if (message) toast.error(message, { id: "loginToast" });
  }, [location]);

  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const onSubmit: SubmitHandler<LoginFormInput> = async (data) => {
    try {
      const res = await api.post("/auth/login", data);
      if (res.data.success) {
        login(res.data);
        toast.success("登入成功", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Login組件驗證錯誤:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center gap-2 "
    >
      <div className="flex flex-col items-end h-16">
        <div className="flex items-center gap-2">
          <label>帳號</label>
          <input
            type="text"
            className="text-secondary"
            {...register("userName", { required: "帳號是必填欄位" })}
          />
        </div>
        {errors.userName && (
          <p style={{ color: "red", fontSize: "14px" }}>
            {errors.userName.message}
          </p>
        )}
      </div>
      <div className="flex flex-col items-end h-16">
        <div className="flex items-center gap-2">
          <label>密碼</label>
          <input
            type="password"
            className="text-secondary"
            {...register("password", { required: "密碼是必填欄位" })}
          />
        </div>
        {errors.password && (
          <p style={{ color: "red", fontSize: "14px" }}>
            {errors.password.message}
          </p>
        )}
      </div>
      <button type="submit">登入</button>
    </form>
  );
};

export default Login;
