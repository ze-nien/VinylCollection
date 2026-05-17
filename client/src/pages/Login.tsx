import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import api from "../api/axiosInstance";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

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

  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const onSubmit: SubmitHandler<LoginFormInput> = async (data) => {
    try {
      const res = await api.post("/auth/login", data);
      if (res.data.success) {
        toast.success("登入成功");
        login(res.data.token);
        navigate("/");
      }
    } catch (error) {
      toast.error("登入失敗");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="ml-5 flex flex-col gap-2 w-max "
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
