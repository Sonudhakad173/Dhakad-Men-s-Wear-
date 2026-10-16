import { Outlet } from "react-router-dom";
import { ToastViewport } from "../../store/ToastStore";
import { Footer } from "../../components/common/Footer";
import { Header } from "../../components/common/Header";
import { ScrollToTop } from "../../components/common/ScrollToTop";

export function RootLayout() {
  return (
    <div className="appShell">
      <ScrollToTop />
      <Header />
      <main className="siteMain">
        <Outlet />
      </main>
      <Footer />
      <ToastViewport />
    </div>
  );
}
