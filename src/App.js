import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter } from "react-router-dom";
import React, { useEffect } from "react";
import AppLayout from "./view/pages/AppLayout";
import UserIdentity from "./nonview/core/UserIdentity";
import { VanamDataProvider } from "./nonview/core/VanamDataContext";
import theme from "./AppTheme";

export { AppBarTitleContext, useAppBarTitle } from "./view/pages/AppLayout";

function App() {
  useEffect(() => {
    UserIdentity.getInstance();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <VanamDataProvider>
        <BrowserRouter basename="/vanam">
          <AppLayout />
        </BrowserRouter>
      </VanamDataProvider>
    </ThemeProvider>
  );
}

export default App;
