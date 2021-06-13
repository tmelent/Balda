import React from "react";
import { Footer } from "../Footer";
import {NavBar} from "../NavBar";
import { Wrapper, WrapperVariant } from "./Wrapper";
import styles from "../styles/layout.module.scss";
interface LayoutProps {
  variant?: WrapperVariant;
}

export const Layout: React.FC<LayoutProps> = ({ children, variant }) => {
  return (<>
    <div className={styles.layout}>
      <NavBar />
      <Wrapper variant={variant}>{children}</Wrapper>
      
    </div>
    <Footer />
  </>  );
};