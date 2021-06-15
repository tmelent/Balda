import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { Flex } from "./basic/Flex";
import styles from "./styles/navbar.module.scss";
import utilStyles from "./styles/utility.module.scss";
import {Link} from "./basic/Link";
import {Text} from "./basic/Text";
import CreateGame from "./game/CreateGame";

export const NavBar: React.FC = () => {
  const [logout, {loading: logoutFetching }] = useLogoutMutation();
  const { data, loading } = useMeQuery({ skip: isServer() });
  const router = useRouter();
  let body = null;
  if (isServer() || loading) {
  } else if (!data?.me) {
    body = (
      <div className={`${styles.navbarText} ${utilStyles.mlAuto} ${utilStyles.gap4}`}>
        <NextLink href="/login" passHref>
          <Link>
            <Text>Войти</Text>
          </Link>
        </NextLink>
        <NextLink href="/register" passHref>
          <Link>
            <Text>Регистрация</Text>
          </Link>
        </NextLink>
      </div>
    );
  } else {
    body = (
      <Flex className={`${utilStyles.alignCenter} ${utilStyles.gap4}`}>
        <CreateGame/>
        <Text className={styles.navbarText}>{data.me.username}</Text>
        <Link                    
          onClick={async () => {
            await logout();
            router.reload();
          }}
          isLoading={logoutFetching}
        >
          <Text className={`${styles.navbarText} ${utilStyles.pointer}`}>выйти</Text>
        </Link>
      </Flex>
    );
  }
  return (
    <Flex className={`${styles.navbar} ${utilStyles.w100}`}>
      <Flex className={`${utilStyles.mAuto} ${styles.navWrap} ${utilStyles.alignCenter}`} style={{maxWidth:'800px'}}>
        <div className={styles.brand}><NextLink href="/" passHref>
          <Link>
            <Text className={`${styles.logo} ${utilStyles.unselectable}`}>Балда</Text>
            </Link>
        </NextLink>
        </div>
        <div className={`${utilStyles.mlAuto}`}>{body}</div>
      </Flex>
    </Flex>
  );
};

