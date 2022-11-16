import { useForm, Controller, FieldErrorsImpl } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { MailOutlined } from "@ant-design/icons";
import { Input, Spin } from "antd";
import React from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "react-query";
import constants from "../../constants";
import styles from "./styles.module.scss";
import EyeIcon from "../../icons/EyeIcon";
import { loginSchema } from "../../helpers/validate";
import { failureModal, successModal } from "../../modals";

type LoginFormValues = {
  email: string;
  password: string;
};
type Error = {
  message: string;
};
type ErrorSchema = Record<string, string>;
function Login() {
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(loginSchema)
  });
  const errorSchema = errors as Partial<FieldErrorsImpl<ErrorSchema>>;
  const mutation = useMutation((data: LoginFormValues) => {
    const { email, password } = data;
    return fetch(
      `${constants.apiConfig.DOMAIN_NAME}${constants.apiConfig.ENDPOINT.login}`,
      {
        method: constants.apiConfig.methods.post,
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({ email, password })
      }
    ).then((response) => {
      return response.json();
    });
  });
  const onSubmit = (data: LoginFormValues) => {
    mutation.mutate(data, {
      onSuccess: (successResult) => {
        if (successResult?.code === 200 && successResult?.data?.session) {
          localStorage.setItem(
            "session",
            JSON.stringify(successResult?.data?.session)
          );
          successModal(
            "Login successfully",
            `Welcome ${successResult?.data?.fullName}`
          );
          navigate("/");
        } else {
          failureModal("Login failed", successResult.message);
        }
      },
      onError: (error: Error) => {
        failureModal("Login failed", error?.message);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formWrapper}>
      <p className={styles.title}>Welcome To Authentication App</p>
      <div className={styles.inputWrapper}>
        <Controller
          name="email"
          control={control}
          render={({ field: { onChange, onBlur, value, name, ref } }) => (
            <Input
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              name={name}
              ref={ref}
              className={styles.input}
              placeholder="Enter your email"
              size="large"
              prefix={<MailOutlined />}
            />
          )}
        />
        <span className={styles.message}>{errorSchema?.email?.message}</span>
      </div>
      <div className={styles.inputWrapper}>
        <Controller
          name="password"
          control={control}
          render={({ field: { onChange, onBlur, value, name, ref } }) => (
            <Input.Password
              className={styles.input}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              name={name}
              ref={ref}
              placeholder="Enter password"
              size="large"
              iconRender={EyeIcon}
            />
          )}
        />
        <span className={styles.message}>{errorSchema?.email?.message}</span>
      </div>
      <div className={styles.btnWrapper}>
        <Spin spinning={mutation.isLoading}>
          <button type="submit" className={styles.button}>
            Login
          </button>
        </Spin>
        <Link to="/register" type="submit" className={styles.button}>
          Register
        </Link>
      </div>
    </form>
  );
}
export default Login;
