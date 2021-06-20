import router from "next/router";
import * as React from "react";
import { Button } from "src/components/basic/Button";
import { useIsAuth } from "src/utils/useIsAuth";
import { withApollo } from "src/utils/withApollo";
import styles from "../../components/styles/utility.module.scss";

export const GameHistoryButton: React.FC = () => {
  useIsAuth();
  return (
    <Button
      onClick={async () => {
        router.push({
          pathname: "/game/history",
        });
      }}
      className={styles.createGameBtn}
    >
      Мои игры
    </Button>
  );
};

export default withApollo({ ssr: false })(GameHistoryButton);
