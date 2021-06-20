import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Button } from "src/components/basic/Button";
import { useIsAuth } from "src/utils/useIsAuth";
import { withApollo } from "src/utils/withApollo";
import { Wrapper } from "../../../components/basic/Wrapper";
import { NavBar } from "../../../components/NavBar";
import { useConnectMutation } from "../../../generated/graphql";
import { toErrorMap } from "../../../utils/toErrorMap";
import styles from "../../../components/styles/joinGame.module.scss";
import { Layout } from "src/components/basic/Layout";
// Change password form. Can be accessed only with correct token
const JoinGame: NextPage = () => {
  const router = useRouter();
  const [connectToGame] = useConnectMutation();
  const [tokenError, setTokenError] = useState("");
  useIsAuth();
  return (
    
      <Layout>
      <Wrapper className={styles.mainWrapper}>
        <h1 className={styles.greetingTitle}>Вас пригласили в игру. Нажмите кнопку ниже, чтобы присоединиться.</h1>
        <Button
        className={styles.joinButton}
          onClick={async () => {
            const response = await connectToGame({
              variables: {
                token:
                  typeof router.query.token === "string"
                    ? router.query.token
                    : "",
              },
            });
            console.log(tokenError, response);
            if (response.data?.connectToGame.errors) {
              const errorMap = toErrorMap(response.data.connectToGame.errors);
              if ("token" in errorMap) {
                setTokenError(errorMap.token);
              }
            } else if (response.data?.connectToGame.game) {
              router.push(`/game/${response.data?.connectToGame.game.id}`);
            }            
          }}
        >
          Присоединиться к игре
        </Button>
        {tokenError ? (
          <div>{tokenError}</div>
        ) : (
          null
        )}
      </Wrapper>
    </Layout>
  );
};

export default withApollo({ ssr: false })(JoinGame);
