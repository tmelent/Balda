import { Link } from "./common/Link";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { Flex } from "./common/Flex";
import {Text} from "./common/Text";
import styles from "./styles/navbar.module.scss";
import utilStyles from "./styles/utility.module.scss";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

export const NavBar: React.FC = () => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({ pause: isServer() });
  const router = useRouter();
  let body = null;
  if (isServer() || fetching) {
  } else if (!data?.me) {
    body = (
      <div className={`${styles.navbarText} ${utilStyles.mlAuto}`}>
        <NextLink href="/login">
          <Link>
            <b>Login</b>
          </Link>
        </NextLink>
        <NextLink href="/register">
          <Link>
            <b>Register</b>
          </Link>
        </NextLink>
      </div>
    );
  } else {
    body = (
      <Flex className={utilStyles.alignCenter}>
        <div className={styles.navbarText}>{data.me.username}</div>
        <Link
          className={`${styles.navbarText} ${utilStyles.btn}`}
          onClick={async () => {
            await logout();
            router.reload();
          }}
          isLoading={logoutFetching}
        >
          logout
        </Link>
      </Flex>
    );
  }
  return (
    <Flex className={styles.navbar}>
      <Flex className={`${utilStyles.mAuto} ${utilStyles.alignCenter}`} style={{maxWidth:'800px'}}>
        <NextLink href="/">
          <Text className={`${styles.logo} ${utilStyles.unselectable}`}>Meowddit</Text>
        </NextLink>
        <div className={utilStyles.mlAuto}>{body}</div>
      </Flex>
    </Flex>
  );
};

export default withUrqlClient(createUrqlClient,{ssr:true})(NavBar);
