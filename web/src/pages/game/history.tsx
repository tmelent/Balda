import React from "react";
import { Layout } from "../../components/basic/Layout";
import { withApollo } from "src/utils/withApollo";
import { useGetGameHistoryQuery, useMeQuery } from "src/generated/graphql";
import styles from "../../components/styles/history.module.scss";
import { Flex } from "../../components/basic/Flex";
import { Text } from "../../components/basic/Text";

const History: React.FC = ({}) => {
  const games = useGetGameHistoryQuery();
  return <Layout>
    {games.data?.getGameHistory?.map(i => {
        <Flex className={styles.gameBar}>
            <Text className={styles.gameId}>{i.id}</Text>
            <Text className={styles.initialWord}>{i.initialWord}</Text>
            <Text className={styles.score}>{i.scoreP1} - {i.scoreP2}</Text>
        </Flex>
    })}      
  </Layout>;
};

export default withApollo({ ssr: true })(History);
