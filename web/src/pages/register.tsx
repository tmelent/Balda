import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { Button } from "../components/basic/Button";
import { Wrapper } from "../components/basic/Wrapper";
import { InputField } from "../components/forms/InputField";
import { NavBar } from "../components/NavBar";
import styles from "../components/styles/login.module.scss";
import utilStyles from "../components/styles/utility.module.scss";
import { useRegisterMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { toErrorMap } from "../utils/toErrorMap";
export const Register: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [, register] = useRegisterMutation();
  return (
    <>
      <NavBar />
      <Wrapper variant="small">
        <Formik
          initialValues={{ email: "", username: "", password: "" }}
          onSubmit={async (values, { setErrors }) => {
            const response = await register({ options: values });
            if (response.data?.register.errors) {
              setErrors(toErrorMap(response.data.register.errors));
            } else if (response.data?.register.user) {
              if (typeof router.query.next === "string") {
                router.push(router.query.next);
              } else {
                router.push("/");
              }
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className={styles.form}>
              <InputField
                name="username"
                placeholder="логин"
                label="логин или e-mail"
              />
               <div className={utilStyles.mt4} />
              <InputField
                name="email"
                placeholder="e-mail"
                label="e-mail"
                type="email"
              />
              <div className={utilStyles.mt4} />
              <InputField
                name="password"
                placeholder="пароль"
                label="пароль"
                type="password"
              />
             
              <div className={styles.submitSection}>
                <Button isLoading={isSubmitting} className={styles.submitBtn}>
                  Отправить
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(Register);
