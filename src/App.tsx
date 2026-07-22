import type { JSX } from "react";
import { AppRoutes } from "./routes/AppRoutes";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

function App(): JSX.Element {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}

export default App;
