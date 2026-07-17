import type {JSX} from "react";
import { AppRoutes } from "./routes/AppRoutes";
import { Header } from "./components/Header";

function App(): JSX.Element {
  return (
    <div style={{padding: "2rm"}}>
      <Header />
      <AppRoutes />
    </div>
  )
}

export default App