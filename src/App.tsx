import { Route, Switch } from "wouter"
import TeoriaScreen from "./screens/teoria"
import { Navbar } from "./components/NavBar";
import { ThemeProvider } from "@/components/theme-provider"
import { Footer } from "./components/Footer";
import IndexScreen from "./screens";

export default function App() {

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="bg-background">
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" />
          <Navbar />
          <Switch>
            <Route path="/minimos-cuadrados" component={IndexScreen} />
            <Route path="/gauss-seidel/teoria" component={TeoriaScreen} />
            <Route>404: No such page!</Route>
          </Switch>
          <Footer />
        </div>
      </ThemeProvider>
    </>
  );
}