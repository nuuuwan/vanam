import { Container, Box, CircularProgress } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";
import React, { useState, createContext, useContext, useRef } from "react";
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
  const [appBarTitle, setAppBarTitle] = useState("Vanam");

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
        <CustomBottomNavigator />
      </Box>
    </AppBarTitleContext.Provider>
  );
};

export default AppLayout;
