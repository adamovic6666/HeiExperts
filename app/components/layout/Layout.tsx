import { useRouter } from "next/router";
import Footer from "../footer/Footer";
import Header from "../header/Header";

type Data = {
  children?: any;
  icons?: any;
};

const Layout = ({ children, icons }: Data) => {
  const { pathname } = useRouter();
  const isErrorPage = pathname === "/_error";
  return (
    <>
      <Header />
      <main>{children}</main>
      {!isErrorPage && <Footer icons={icons} />}
    </>
  );
};

export default Layout;
