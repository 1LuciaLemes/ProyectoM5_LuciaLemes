import type {JSX} from "react";
import { ThemeButton } from "./components/changeTheme";
function App(): JSX.Element {
  return (
    <div style={{padding: "2rm"}}>
      <h1>HENRY-Commerce</h1>
      <ThemeButton />
    </div>
  )
}

export default App