import { Form, Formik } from "formik";
import React, { useState } from "react";
import { withApollo } from "src/utils/withApollo";
import { Button } from "../components/basic/Button";
import { Wrapper } from "../components/basic/Wrapper";
import { InputField } from "../components/forms/InputField";
import { NavBar } from "../components/NavBar";
import styles from "../components/styles/login.module.scss";
import { useForgotPasswordMutation } from "../generated/graphql";
export const ForgotPassword: React.FC<{}> = ({}) => {
  const [complete, setComplete] = useState(false);
  const [forgotPassword] = useForgotPasswordMutation();
  return (
    <>
      <NavBar />
      <Wrapper variant="small">
        <Formik
          initialValues={{ email: "" }}
          onSubmit={async (values) => {
            await forgotPassword({variables: values});
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

export default withApollo({ssr: false})(ForgotPassword);
