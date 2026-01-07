import { Chip } from "@mui/material";

const IucnCategoryChip = ({ category }) => {
  if (!category) return null;

  const getCategoryColor = (cat) => {
    const categoryMap = {
      NA: { bg: "#C1B5A5", text: "#000000" }, // Not Applicable
      NE: { bg: "#FFFFFF", text: "#000000" }, // Not Evaluated
      DD: { bg: "#D1D1C6", text: "#000000" }, // Data Deficient
      LC: { bg: "#60C659", text: "#000000" }, // Least Concern
      NT: { bg: "#CCE226", text: "#000000" }, // Near Threatened
      VU: { bg: "#F9E814", text: "#000000" }, // Vulnerable
      EN: { bg: "#FC7F3F", text: "#000000" }, // Endangered
      CR: { bg: "#D81E05", text: "#FFFFFF" }, // Critically Endangered
      RE: { bg: "#9B4F96", text: "#FFFFFF" }, // Regionally Extinct
      EW: { bg: "#542344", text: "#FFFFFF" }, // Extinct in the Wild
      EX: { bg: "#000000", text: "#FFFFFF" }, // Extinct
    };

    return categoryMap[cat] || { bg: "#D1D1C6", text: "#000000" };
  };

  const colors = getCategoryColor(category);

  return (
    <Chip
      label={category}
      size="small"
      sx={{
        backgroundColor: colors.bg,
        color: colors.text,
        fontWeight: "bold",
        borderColor: colors.bg,
      }}
    />
  );
};

export default IucnCategoryChip;
