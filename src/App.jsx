import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CitiesProvider } from "./contexts/CitiesContext";
import Product from "./pages/Product";
import Homepage from "./pages/Homepage";
import Pricing from "./pages/Pricing";
import PageNotFound from "./pages/PageNotFound";
import AppLayout from "./pages/AppLayout";
import Login from "./pages/Login";
import CityList from "./components/CityList";
import CountryList from "./components/CountryList";
import City from "./components/City";
import Form from "./components/Form";
import { Navigate } from "react-router-dom";

const App = () => {
  return (
    <CitiesProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<Homepage />} />
          <Route path="app" element={<AppLayout />}>
            {/* localhost:8000/app */}
            {/*
            - nested routes
            -localhost:8000/app/... 
            */}
            <Route index element={<Navigate replace to="cities" />} />
            <Route path="cities" element={<CityList />} />
            <Route path="cities/:id" element={<City />} />
            <Route path="countries" element={<CountryList />} />
            <Route path="form" element={<Form />} />
          </Route>
          <Route path="product" element={<Product />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="login" element={<Login />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </CitiesProvider>
  );
};

export default App;
