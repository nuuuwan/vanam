import React from "react";
import { Grid, Card, CardContent, Box, Typography, Link } from "@mui/material";

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
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  Genus
                </Typography>
                <Link
                  href={`https://en.wikipedia.org/wiki/${encodeURIComponent(
                    genus.scientificName
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  {genus.scientificName}
                </Link>
              </Box>
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
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  Family
                </Typography>
                <Link
                  href={`https://en.wikipedia.org/wiki/${encodeURIComponent(
                    family.scientificName
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  {family.scientificName}
                </Link>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );
};

export default TaxonomySection;
