import Footer from "./Footer.js";
import Navbar from "./navbar.js";
import MobileFooter from "./MobileFooter.js";
import { useEffect, useState, useContext } from "react";
import { userContext } from "../src/pages/_app.js";

const Layout = ({ children, loader, toaster }) => {
  const [user, setUser] = useContext(userContext);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // initial check
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <div className="fixed top-0 w-full z-50 bg-white">
        <Navbar
          user={user}
          setUser={setUser}
          loader={loader}
          toaster={toaster}
        />
      </div>

      <main className="flex-1 md:pt-20 pt-14 overflow-x-hidden">{children}</main>

      {!isMobile && <Footer loader={loader} toaster={toaster} />}

      {isMobile && (
        <div className="fixed bottom-0 w-full z-50">
          <MobileFooter />
        </div>
      )}

      {isMobile && <div className="h-16" />}
    </div>
  );
};

export default Layout;
