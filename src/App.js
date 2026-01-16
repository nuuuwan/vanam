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
import React, { useState, createContext, useContext, useEffect } from "react";
import HomeIcon from "@mui/icons-material/Home";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import AddPage from "./view/pages/AddPage";
import GalleryPage from "./view/pages/GalleryPage";
import PlantPhotoPage from "./view/pages/PlantPhotoPage";
import CustomAppBar from "./view/moles/CustomAppBar";
import CustomBottomNavigator from "./view/moles/CustomBottomNavigator";
import UserIdentity from "./nonview/core/UserIdentity";

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
    fontFamily: '"Recursive", "Roboto", "Helvetica", "Arial", sans-serif',
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
        <CustomAppBar title={appBarTitle} />
        <Container maxWidth="lg" sx={{ flexGrow: 1, pb: 10, pt: 2 }}>
          <Routes>
            <Route path="/" element={<Navigate to="/add" replace />} />
            <Route path="/add" element={<AddPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/plantPhoto/:imageHash" element={<PlantPhotoPage />} />
          </Routes>
        </Container>
        <CustomBottomNavigator>
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
        </CustomBottomNavigator>
      </Box>
    </AppBarTitleContext.Provider>
  );
};

function App() {
  // Initialize user identity on app startup
  useEffect(() => {
    UserIdentity.getInstance();
  }, []);

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
