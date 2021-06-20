import router from "next/router";
import * as React from "react";

import { Button } from "src/components/basic/Button";
import {
  useCreateGameMutation,
  useGenerateMutation,
} from "src/generated/graphql";
import { useIsAuth } from "src/utils/useIsAuth";
import { withApollo } from "src/utils/withApollo";
import styles from "../../components/styles/utility.module.scss";
export const CreateGame: React.FC = () => {
  const [createGame] = useCreateGameMutation();
  const [generateField] = useGenerateMutation();
  return (    
      <Button
        onClick={async () => {
          const response = await createGame();
          const { id } = response.data!.createGame!;
          await generateField({
            variables: {
              gameId: id,
            },
          });          
          router.push({
            pathname: "/game/[id]",
            query: { id },
          }).then(() => router.reload());          
     
        }}
        className={styles.createGameBtn}
      >
        Создать игру
      </Button>    
  );
};

export default withApollo({ ssr: false })(CreateGame);
