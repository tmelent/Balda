import { Form, Formik } from "formik";
import { NextPage } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { withApollo } from "src/utils/withApollo";
import { Button } from "../../components/basic/Button";
import { Link } from "../../components/basic/Link";
import { Wrapper } from "../../components/basic/Wrapper";
import { InputField } from "../../components/forms/InputField";
import { NavBar } from "../../components/NavBar";
import { useChangePasswordMutation } from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";
import styles from "../components/styles/login.module.scss";

// Change password form. Can be accessed only with correct token
const ChangePassword: NextPage = () => {
  const router = useRouter();
  const [changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState("");
  return (
    <>
      <NavBar />
      <Wrapper variant="small">
        <Formik
          initialValues={{ newPassword: "" }}
          onSubmit={async (values, { setErrors }) => {
            const response = await changePassword({
              variables: {
                newPassword: values.newPassword,
                token:
                  typeof router.query.token === "string"
                    ? router.query.token
                    : "",
              },
            });
            if (response.data?.changePassword.errors) {
              const errorMap = toErrorMap(response.data.changePassword.errors);
              if ("token" in errorMap) {
                setTokenError(errorMap.token);
              }
              setErrors(errorMap);
            } else if (response.data?.changePassword.user) {
              router.push("/");
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField
                name="newPassword"
                placeholder="new password"
                label="New Password"
                type="password"
              />
              {tokenError ? (
                <div>
                  <div color="red">{tokenError}</div>
                  <NextLink href="/forgot-password">
                    <Link>Get new token</Link>
                  </NextLink>
                </div>
              ) : null}
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

export default withApollo({ ssr: false })(ChangePassword);
