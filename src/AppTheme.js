import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#008800",
    },
    secondary: {
      main: "#aaaaaa",
      light: "#dddddd",
    },
  },
  typography: {
    fontFamily: '"Ubuntu Mono", monospace',
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
