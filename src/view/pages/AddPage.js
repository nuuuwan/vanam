import { Box } from "@mui/material";
import WelcomeSection from "../atoms/WelcomeSection";
import UploadPhotoButton from "../atoms/UploadPhotoButton";

const AddPage = () => {
  return (
    <Box sx={{ maxWidth: 600, mx: "auto", position: "relative" }}>
      <WelcomeSection />
      <UploadPhotoButton />
    </Box>
  );
};

export default AddPage;
