import React from "react";
import { Box } from "@mui/material";
import DatabaseLink from "../atoms/DatabaseLink";

const TaxonomySection = ({ genus, family }) => {
  if (!genus && !family) {
    return null;
  }

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
      {genus && (
        <DatabaseLink
          label="Genus"
          href={`https://en.wikipedia.org/wiki/${encodeURIComponent(genus.scientificName)}`}
          displayText={genus.scientificName}
        />
      )}
      {family && (
        <DatabaseLink
          label="Family"
          href={`https://en.wikipedia.org/wiki/${encodeURIComponent(family.scientificName)}`}
          displayText={family.scientificName}
        />
      )}
    </Box>
  );
};

export default TaxonomySection;
