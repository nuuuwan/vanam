import { Container, Box } from "@mui/material";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import React, { useState, createContext, useContext } from "react";
import HomePage from "./HomePage";
import GalleryPage from "./GalleryPage";
import MapPage from "./MapPage";
import PlantPhotoPage from "./PlantPhotoPage";
import CustomAppBar from "../moles/CustomAppBar";
import CustomBottomNavigator from "../moles/CustomBottomNavigator";

// Create a context for the app bar title
export const AppBarTitleContext = createContext();

export const useAppBarTitle = () => {
  const context = useContext(AppBarTitleContext);
  if (!context) {
    throw new Error("useAppBarTitle must be used within AppBarTitleProvider");
  }
  return context;
};

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [appBarTitle, setAppBarTitle] = useState("Vanam");

  const getCurrentView = () => {
    if (location.pathname === "/home") return 0;
    if (location.pathname === "/gallery") return 1;
    if (location.pathname === "/map") return 2;
    return -1;
  };

  const handleViewChange = (view) => {
    if (view === 0) navigate("/home");
    if (view === 1) navigate("/gallery");
    if (view === 2) navigate("/map");
  };

  return (
    <AppBarTitleContext.Provider value={{ appBarTitle, setAppBarTitle }}>
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <CustomAppBar title={appBarTitle} />
        <Container maxWidth="lg" sx={{ flexGrow: 1, pb: 10, pt: 2 }}>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/plantPhoto/:imageHash" element={<PlantPhotoPage />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </Container>
        <CustomBottomNavigator
          currentView={getCurrentView()}
          onViewChange={handleViewChange}
        />
      </Box>
    </AppBarTitleContext.Provider>
  );
};

export default AppLayout;
