import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Button } from "../components/basic/Button";
import { Layout } from "../components/basic/Layout";
import { Link } from "../components/basic/Link";
import { InputField } from "../components/forms/InputField";
import styles from "../components/styles/login.module.scss";
import utilStyles from "../components/styles/utility.module.scss";
import { useLoginMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { toErrorMap } from "../utils/toErrorMap";
import { Text } from "../components/basic/Text";
export const Login: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [, login] = useLoginMutation();
  return (
    <Layout>
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login(values);
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
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
              name="usernameOrEmail"
              placeholder="логин или e-mail"
              label="логин или e-mail"
            />
            <div className={utilStyles.mt4} />
            <InputField
              name="password"
              placeholder="пароль"
              label="пароль"
              type="password"
            />
            <div className={styles.submitSection}>
              <NextLink href="/forgot-password">
                <Link>
                  <Text className={styles.forgot}>Забыли пароль?</Text>
                </Link>
              </NextLink>

              <Button isLoading={isSubmitting} className={styles.submitBtn}>
                Войти
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
