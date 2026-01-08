import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Container } from "@mui/material";
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
        {currentView === 0 ? (
          <PictureCaptureView
            currentView={currentView}
            onViewChange={setCurrentView}
          />
        ) : (
          <PlantPhotoGallery
            currentView={currentView}
            onViewChange={setCurrentView}
          />
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
