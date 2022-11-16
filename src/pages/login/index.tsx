// @ts-nocheck
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {
  EyeTwoTone,
  EyeInvisibleOutlined,
  MailOutlined
} from "@ant-design/icons";
import { Input, Spin } from "antd";
import React from "react";
import constants from "../../constants";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "helpers/validate";
import { failureModal, successModal } from "modals";
import { useMutation } from "react-query";
import "./index.css";

function Login() {
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(loginSchema)
  });
  const mutation = useMutation((data) => {
    const { email, password } = data;
    console.log("Data", {
      email,
      password
    });
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
  const onSubmit = (data) => {
    mutation.mutate(data, {
      onSuccess: (data) => {
        console.log(data);
        if (data?.code === 200 && data?.data?.session) {
          localStorage.setItem("session", JSON.stringify(data?.data?.session));
          successModal("Login successfully", `Welcome ${data?.data?.fullName}`);
          navigate("/");
        } else {
          failureModal("Login failed", data.message);
        }
      },
      onError: (error) => {
        failureModal("Login failed", error.message);
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
          render={({ field }) => (
            <Input
              {...field}
              className={styles.input}
              placeholder="Enter your email"
              size="large"
              prefix={<MailOutlined />}
            ></Input>
          )}
        />
        <span className={styles.message}>{errors?.email?.message}</span>
      </div>
      <div className={styles.inputWrapper}>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input.Password
              className={styles.input}
              {...field}
              placeholder="Enter password"
              size="large"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          )}
        />
        <span className={styles.message}>{errors?.password?.message}</span>
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
