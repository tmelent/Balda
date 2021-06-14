import router from "next/router";
import * as React from "react";
import { Button } from "src/components/basic/Button";
import { Layout } from "src/components/basic/Layout";
import {
  useCreateGameMutation,
  useCreateInvitationMutation,
  useGenerateMutation,
} from "src/generated/graphql";
import { withApollo } from "src/utils/withApollo";

export const CreateGame: React.FC = () => {
  const [createGame] = useCreateGameMutation();
  const [generateField] = useGenerateMutation();
  const [createInvitation] = useCreateInvitationMutation();
  return (
    <Layout>
      <Button
        onClick={async () => {
          const response = await createGame();
          const { id } = response.data!.createGame!;
          await generateField({
            variables: {
              gameId: id,
            },
          });
          const token = await createInvitation({
            variables: {
              gameId: id,
            },
          });
          router.push({
            pathname: "/game/[id]",
            query: { id },
          });
          alert(
            `Используйте эту ссылку для приглашения другого игрока: localhost:3000/game/join-game/${token.data?.createInvitation}`
          );
        }}
      >
        Создать игру
      </Button>
    </Layout>
  );
};

export default withApollo({ ssr: false })(CreateGame);
