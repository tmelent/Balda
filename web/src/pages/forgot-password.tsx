import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { InputField } from "../components/forms/InputField";
import { Wrapper } from "../components/basic/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import styles from "../components/styles/login.module.scss";
import { Button } from "../components/basic/Button";
import { NavBar } from "../components/NavBar";
export const ForgotPassword: React.FC<{}> = ({}) => {
  const [complete, setComplete] = useState(false);
  const [, forgotPassword] = useForgotPasswordMutation();
  return (
    <>
      <NavBar />
      <Wrapper variant="small">
        <Formik
          initialValues={{ email: "" }}
          onSubmit={async (values) => {
            await forgotPassword(values);
            setComplete(true);
          }}
        >
          {({ isSubmitting }) =>
            complete ? (
              <div>
                Если аккаунт на этот e-mail зарегистрирован, Вы получите письмо
                с ссылкой на форму смены пароля.
              </div>
            ) : (
              <Form className={styles.form}>
                <InputField
                  name="email"
                  placeholder="email"
                  label="Email"
                  type="email"
                />
                <div className={styles.submitSection}>
                  <Button isLoading={isSubmitting} className={styles.submitBtn}>
                    Отправить
                  </Button>
                </div>
              </Form>
            )
          }
        </Formik>
      </Wrapper>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
