import React from "react";
import { Grid } from "@mui/material";
import DatabaseLink from "../atoms/DatabaseLink";

const TaxonomySection = ({ genus, family }) => {
  if (!genus && !family) {
    return null;
  }

  return (
    <Grid container spacing={1} sx={{ mt: 1 }}>
      {genus && (
        <Grid item xs={12} sm={6}>
          <DatabaseLink
            label="Genus"
            href={`https://en.wikipedia.org/wiki/${encodeURIComponent(
              genus.scientificName,
            )}`}
            displayText={genus.scientificName}
          />
        </Grid>
      )}
      {family && (
        <Grid item xs={12} sm={6}>
          <DatabaseLink
            label="Family"
            href={`https://en.wikipedia.org/wiki/${encodeURIComponent(
              family.scientificName,
            )}`}
            displayText={family.scientificName}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default TaxonomySection;
