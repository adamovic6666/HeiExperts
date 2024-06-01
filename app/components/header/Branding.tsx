import Image from "next/image";
import Link from "next/link";
import icons from "../../styles/src/index";
import { useRouter } from "next/router";

const Branding = ({ onClick }: any) => {
  const router = useRouter();

  const reloadIfNeeded = () => {
    if (router.pathname === "/") {
      router.reload();
    }
  };

  return (
    <div className="logo" onClick={onClick}>
      <Link href="/">
        <Image onClick={reloadIfNeeded} src={icons.heidelbergBlack} alt="logo-image" />
      </Link>
    </div>
  );
};

export default Branding;
