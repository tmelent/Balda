import * as React from "react";
import styles from "./styles/footer.module.scss";
import { Text } from "./basic/Text";
import {AiOutlineGithub} from "react-icons/ai";
export const Footer: React.FC = () => {
  return (
    <div className={styles.footerWrap}>
      <Text>balda, 2021      
       
        
        </Text><a href="https://www.github.com/tmelent/balda"><AiOutlineGithub/></a>
    </div>
  );
};
