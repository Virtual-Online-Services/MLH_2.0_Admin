import { Routes, Route, HashRouter } from "react-router-dom";
import { routes } from "./routing/routes";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import "./styles/global.scss";
import NotFound from "./components/NotFound/NotFound";

function App() {
  return (
    <>
      <HashRouter>
        <Routes>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={
                route.protected ? (
                  <PrivateRoute>{route.element}</PrivateRoute>
                ) : (
                  route.element
                )
              }
            />
          ))}
          <Route path="*" element={<NotFound />} /> {/* Wildcard route */}
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
