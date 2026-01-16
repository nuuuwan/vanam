import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter } from "react-router-dom";
import React, { useEffect } from "react";
import AppLayout from "./view/pages/AppLayout";
import UserIdentity from "./nonview/core/UserIdentity";

export { AppBarTitleContext, useAppBarTitle } from "./view/pages/AppLayout";

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
