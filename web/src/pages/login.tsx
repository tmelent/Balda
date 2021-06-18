import { Form, Formik } from "formik";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { withApollo } from "src/utils/withApollo";
import { Button } from "../components/basic/Button";
import { Link } from "../components/basic/Link";
import { Text } from "../components/basic/Text";
import { Wrapper } from "../components/basic/Wrapper";
import { InputField } from "../components/forms/InputField";
import { NavBar } from "../components/NavBar";
import styles from "../components/styles/login.module.scss";
import utilStyles from "../components/styles/utility.module.scss";
import { MeDocument, MeQuery, useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
export const Login: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [login] = useLoginMutation();
  return (
    <>
      <NavBar />
      <Wrapper variant="small">
        <Formik
          initialValues={{ usernameOrEmail: "", password: "" }}
          onSubmit={async (values, { setErrors }) => {
            const response = await login({
            variables: values,
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: "Query",
                  me: data?.login.user,
                },
              });
              cache.evict({ fieldName: "posts:{}" });
            },
          });
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
      </Wrapper>
    </>
  );
};

export default withApollo({ ssr: false })(Login);
