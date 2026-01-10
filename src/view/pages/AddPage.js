import { Box } from "@mui/material";
import WelcomeSection from "../moles/WelcomeSection";
import UploadPhotoButton from "../moles/UploadPhotoButton";

const AddPage = () => {
  return (
    <Box sx={{ maxWidth: 600, mx: "auto", position: "relative" }}>
      <WelcomeSection />
      <UploadPhotoButton />
    </Box>
  );
};

export default AddPage;
