import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  Container,
  BottomNavigation,
  BottomNavigationAction,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import { useState } from "react";
import PictureCaptureView from "./view/moles/PictureCaptureView";
import PlantPhotoGallery from "./view/pages/PlantPhotoGallery";

const theme = createTheme({
  palette: {
    primary: {
      main: "#000000",
    },
    secondary: {
      main: "#888888",
    },
  },
  typography: {
    fontFamily: '"Urbanist", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiLink: {
      defaultProps: {
        underline: "none",
      },
    },
  },
});

function App() {
  const [currentView, setCurrentView] = useState(0);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ pb: 8 }}>
        {currentView === 0 ? <PictureCaptureView /> : <PlantPhotoGallery />}
      </Container>

      <BottomNavigation
        value={currentView}
        onChange={(event, newValue) => {
          setCurrentView(newValue);
        }}
        showLabels
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
      >
        <BottomNavigationAction label="Camera" icon={<CameraAltIcon />} />
        <BottomNavigationAction label="Gallery" icon={<PhotoLibraryIcon />} />
      </BottomNavigation>
    </ThemeProvider>
  );
}

export default App;
