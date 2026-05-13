import { Container, Box } from "@mui/material";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import React, { useState, createContext, useContext } from "react";
import { useVanamDataContext } from "../../nonview/core/VanamDataContext";
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

  const { plantPhotos, userIdentity } = useVanamDataContext();
  const pendingCount = plantPhotos.filter(
    (p) => p.pending && p.userId === userIdentity?.userId,
  ).length;

  const getCurrentView = () => {
    if (location.pathname === "/plants") return 1;
    if (location.pathname === "/map") return 2;
    return -1;
  };

  const handleViewChange = (view) => {
    if (view === 1) navigate("/plants");
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
            <Route path="/" element={<Navigate to="/plants" replace />} />
            <Route path="/home" element={<Navigate to="/plants" replace />} />
            <Route path="/plants" element={<GalleryPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/plant/:imageHash" element={<PlantPhotoPage />} />
            <Route path="*" element={<Navigate to="/plants" replace />} />
          </Routes>
        </Container>
        <CustomBottomNavigator
          currentView={getCurrentView()}
          onViewChange={handleViewChange}
          pendingCount={pendingCount}
        />
      </Box>
    </AppBarTitleContext.Provider>
  );
};

export default AppLayout;
