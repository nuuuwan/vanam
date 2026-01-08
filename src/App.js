import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Container } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PictureCaptureView from "./view/moles/PictureCaptureView";
import PlantPhotoGallery from "./view/pages/PlantPhotoGallery";
import PlantPhotoDetail from "./view/pages/PlantPhotoDetail";

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
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter basename="/vanam">
        <Container maxWidth="lg" sx={{ pb: 8 }}>
          <Routes>
            <Route path="/" element={<PictureCaptureView />} />
            <Route path="/gallery" element={<PlantPhotoGallery />} />
            <Route path="/:imageHash" element={<PlantPhotoDetail />} />
          </Routes>
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
