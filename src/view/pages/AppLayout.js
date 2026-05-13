import { Container, Box, CircularProgress, Toolbar } from "@mui/material";
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

const PULL_THRESHOLD = 72;

const AppLayout = () => {
  const [appBarTitle, setAppBarTitle] = useState("Vanam");
  const [pullDistance, setPullDistance] = useState(0);
  const touchStartY = useRef(0);
  const isPulling = useRef(false);
  const { refresh } = useVanamDataContext();

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
    isPulling.current = false;
  };

  const handleTouchMove = (e) => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    if (scrollTop > 0) return;
    const delta = e.touches[0].clientY - touchStartY.current;
    if (delta > 0) {
      isPulling.current = true;
      setPullDistance(Math.min(delta, PULL_THRESHOLD * 1.5));
    }
  };

  const handleTouchEnd = () => {
    if (isPulling.current && pullDistance >= PULL_THRESHOLD) {
      refresh();
    }
    setPullDistance(0);
    isPulling.current = false;
  };

  return (
    <AppBarTitleContext.Provider value={{ appBarTitle, setAppBarTitle }}>
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <CustomAppBar title={appBarTitle} />
        <Toolbar />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            height: pullDistance,
            transition: pullDistance === 0 ? "height 0.3s ease" : "none",
          }}
        >
          {pullDistance > 0 && (
            <CircularProgress
              size={24}
              variant={
                pullDistance >= PULL_THRESHOLD ? "indeterminate" : "determinate"
              }
              value={(pullDistance / PULL_THRESHOLD) * 100}
              color={pullDistance >= PULL_THRESHOLD ? "primary" : "inherit"}
            />
          )}
        </Box>
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
