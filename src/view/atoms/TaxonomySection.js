import React from "react";
import { Grid, Card, CardContent } from "@mui/material";
import DatabaseLink from "./DatabaseLink";

const TaxonomySection = ({ genus, family }) => {
  if (!genus && !family) {
    return null;
  }

  return (
    <Grid container spacing={1} sx={{ mt: 1 }}>
      {genus && (
        <Grid item xs={12} sm={6}>
          <Card
            variant="outlined"
            sx={{
              bgcolor: "#f5f5f5",
              borderLeft: "4px solid #999",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: 2,
              },
            }}
          >
            <CardContent
              sx={{
                p: 1.5,
                "&:last-child": { pb: 1.5 },
              }}
            >
              <DatabaseLink
                label="Genus"
                href={`https://en.wikipedia.org/wiki/${encodeURIComponent(
                  genus.scientificName
                )}`}
                displayText={genus.scientificName}
              />
            </CardContent>
          </Card>
        </Grid>
      )}
      {family && (
        <Grid item xs={12} sm={6}>
          <Card
            variant="outlined"
            sx={{
              bgcolor: "#f5f5f5",
              borderLeft: "4px solid #999",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: 2,
              },
            }}
          >
            <CardContent
              sx={{
                p: 1.5,
                "&:last-child": { pb: 1.5 },
              }}
            >
              <DatabaseLink
                label="Family"
                href={`https://en.wikipedia.org/wiki/${encodeURIComponent(
                  family.scientificName
                )}`}
                displayText={family.scientificName}
              />
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );
};

export default TaxonomySection;
