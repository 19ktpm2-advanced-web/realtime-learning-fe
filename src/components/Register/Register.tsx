// @ts-nocheck
import { useForm, Controller } from "react-hook-form";
import {
  UserOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
  MailOutlined
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { Input, Spin } from "antd";
import styles from "./styles.module.scss";
import React from "react";
import constants from "../../constants";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "helpers/validate";
import { useMutation } from "react-query";
import { failureModal, successModal } from "modals";
function Register() {
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(registerSchema)
  });
  const mutation = useMutation((data) => {
    const { fullName, email, password } = data;
    console.log(fullName, email, password);
    return fetch(
      `${constants.apiConfig.DOMAIN_NAME}${constants.apiConfig.ENDPOINT.register}`,
      {
        method: constants.apiConfig.methods.post,
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({ fullName, email, password })
      }
    ).then((response) => {
      return response.json();
    });
  });
  const onSubmit = (data) => {
    mutation.mutate(data, {
      onSuccess: (data) => {
        console.log("registration ", data);
        if (data?.code === 200 && data?.data?.session) {
          localStorage.setItem("session", JSON.stringify(data?.data?.session));
          successModal(
            "Register successfully",
            `Welcome ${data?.data?.fullName}`
          );
          navigate("/");
        } else {
          failureModal("Register failed", data.message);
        }
      },
      onError: (error) => {
        failureModal("Register failed", error.message);
      }
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formWrapper}>
      <p className={styles.title}>Register Your Information</p>
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
          name="fullName"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              className={styles.input}
              placeholder="Enter your name"
              size="large"
              prefix={<UserOutlined />}
            ></Input>
          )}
        />
        <span className={styles.message}>{errors?.fullName?.message}</span>
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
            Register
          </button>
        </Spin>
        <Link to="/login" className={styles.button}>
          Login
        </Link>
      </div>
    </form>
  );
}
export default Register;
