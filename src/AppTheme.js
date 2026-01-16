import { createTheme } from "@mui/material/styles";

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

export default theme;
