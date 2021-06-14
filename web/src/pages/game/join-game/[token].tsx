import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Button } from "src/components/basic/Button";
import { withApollo } from "src/utils/withApollo";
import { Wrapper } from "../../../components/basic/Wrapper";
import { NavBar } from "../../../components/NavBar";
import { useConnectMutation } from "../../../generated/graphql";
import { toErrorMap } from "../../../utils/toErrorMap";

// Change password form. Can be accessed only with correct token
const ChangePassword: NextPage = () => {
  const router = useRouter();
  const [connectToGame] = useConnectMutation();
  const [tokenError, setTokenError] = useState("");

  return (
    <>
      <NavBar />

      <Wrapper variant="small">
        <Button
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
            console.log(tokenError, response);
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
    </>
  );
};

export default withApollo({ ssr: false })(ChangePassword);
