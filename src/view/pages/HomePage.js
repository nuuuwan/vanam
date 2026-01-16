import { Box } from "@mui/material";
import { useEffect } from "react";
import WelcomeSection from "../moles/WelcomeSection";
import UploadPhotoButton from "../moles/UploadPhotoButton";
import { useAppBarTitle } from "./AppLayout";

const HomePage = () => {
  const { setAppBarTitle } = useAppBarTitle();

  useEffect(() => {
    setAppBarTitle("Home");
  }, [setAppBarTitle]);

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", position: "relative" }}>
      <WelcomeSection />
      <UploadPhotoButton />
    </Box>
  );
};

export default HomePage;
