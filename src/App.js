import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Container, Box, IconButton, Tooltip } from "@mui/material";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import React, { useState, createContext, useContext } from "react";
import HomeIcon from "@mui/icons-material/Home";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import PictureCaptureView from "./view/moles/PictureCaptureView";
import PlantPhotoGallery from "./view/pages/PlantPhotoGallery";
import PlantPhotoDetail from "./view/pages/PlantPhotoDetail";
import AppBarComponent from "./view/atoms/AppBarComponent";
import BottomNavigator from "./view/atoms/BottomNavigator";

// Create a context for the app bar title
export const AppBarTitleContext = createContext();

export const useAppBarTitle = () => {
  const context = useContext(AppBarTitleContext);
  if (!context) {
    throw new Error("useAppBarTitle must be used within AppBarTitleProvider");
  }
  return context;
};

const theme = createTheme({
  palette: {
    primary: {
      main: "#008800",
    },
    secondary: {
      main: "#aaaaaa",
    },
  },
  typography: {
    fontFamily: '"Voltaire", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiLink: {
      defaultProps: {
        underline: "none",
      },
    },
  },
});

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [appBarTitle, setAppBarTitle] = useState("Vanam");

  const getCurrentView = () => {
    if (location.pathname === "/add") return 0;
    if (location.pathname === "/gallery") return 1;
    return -1;
  };

  const handleViewChange = (view) => {
    if (view === 0) navigate("/add");
    if (view === 1) navigate("/gallery");
  };

  return (
    <AppBarTitleContext.Provider value={{ appBarTitle, setAppBarTitle }}>
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <AppBarComponent title={appBarTitle} />
        <Container maxWidth="lg" sx={{ flexGrow: 1, pb: 10, pt: 2 }}>
          <Routes>
            <Route path="/" element={<Navigate to="/add" replace />} />
            <Route path="/add" element={<PictureCaptureView />} />
            <Route path="/gallery" element={<PlantPhotoGallery />} />
            <Route path="/:imageHash" element={<PlantPhotoDetail />} />
          </Routes>
        </Container>
        <BottomNavigator>
          <Tooltip title="Home">
            <IconButton
              color={getCurrentView() === 0 ? "primary" : "default"}
              onClick={() => handleViewChange(0)}
              size="large"
            >
              <HomeIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Gallery View">
            <IconButton
              color={getCurrentView() === 1 ? "primary" : "default"}
              onClick={() => handleViewChange(1)}
              size="large"
            >
              <PhotoLibraryIcon />
            </IconButton>
          </Tooltip>
        </BottomNavigator>
      </Box>
    </AppBarTitleContext.Provider>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter basename="/vanam">
        <AppLayout />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
