import React from "react";
import { Layout } from "../../components/basic/Layout";
import { withApollo } from "src/utils/withApollo";
import { useGetGameHistoryQuery, useMeQuery } from "src/generated/graphql";
import styles from "../../components/styles/history.module.scss";
import { Flex } from "../../components/basic/Flex";
import { Text } from "../../components/basic/Text";
import { isServer } from "src/utils/isServer";
import NextLink from "next/link";
const History: React.FC = ({}) => {
  const games = useGetGameHistoryQuery();
  const me = useMeQuery({
    skip: isServer(),
  });
  return (
    <Layout>
      <div className={styles.historyWrap}>
        <h1 className={styles.title}>История игр</h1>
        {games.data?.getGameHistory?.map((i) => {
          return (
            <NextLink key={`game-${i.id}`} href={`/game/${i.id}`}>
              <a className={styles.link}>
                <Flex className={styles.gameBar}>
                  <Text className={styles.gameId}>{i.id}</Text>
                  <Text className={styles.username}>
                    {i.players!.find(
                      (i) => i.username !== me.data?.me?.username
                    )?.username ?? "ожидается игрок..."}
                  </Text>
                  <Text className={styles.initialWord}>{i.initialWord}</Text>
                  <Text className={styles.score}>
                    {i.scoreP1} - {i.scoreP2}
                  </Text>
                </Flex>
              </a>
            </NextLink>
          );
        })}
      </div>
    </Layout>
  );
};

export default withApollo({ ssr: true })(History);
