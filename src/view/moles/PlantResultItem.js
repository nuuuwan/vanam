import React from "react";
import { Paper, Stack, Box, Typography, Link } from "@mui/material";
import { Gauge } from "@mui/x-charts/Gauge";
import CommonNamesChips from "../atoms/CommonNamesChips";
import TaxonomySection from "../atoms/TaxonomySection";
import DatabaseReferencesSection from "../atoms/DatabaseReferencesSection";

const PlantResultItem = ({ result }) => {
  return (
    <Paper elevation={1} sx={{ p: 2, mb: 2, backgroundColor: "#f5f5f5" }}>
      <Stack direction="row" spacing={2} alignItems="flex-start">
        {result.images && result.images[0] && (
          <Box
            component="img"
            src={result.images[0].url}
            alt={
              result.species.commonNames?.[0] || result.species.scientificName
            }
            sx={{
              width: 80,
              height: 80,
              borderRadius: 1,
              objectFit: "cover",
            }}
          />
        )}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              fontStyle: "italic",
              mb: 1,
            }}
          >
            <Link
              href={`https://en.wikipedia.org/wiki/${encodeURIComponent(
                result.species.scientificNameWithoutAuthor ||
                  result.species.scientificName
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "inherit",
                textDecoration: "none",
              }}
            >
              {result.species.scientificName ||
                result.species.scientificNameWithoutAuthor}
            </Link>
          </Typography>

          <CommonNamesChips commonNames={result.species.commonNames} />

          <TaxonomySection
            genus={result.species.genus}
            family={result.species.family}
          />

          <DatabaseReferencesSection
            gbif={result.gbif}
            powo={result.powo}
            iucn={result.iucn}
          />
        </Box>
        <Gauge
          width={100}
          height={100}
          value={result.score * 100}
          valueMin={0}
          valueMax={100}
          text={({ value }) => `${Math.round(value)}%\nConf.`}
          sx={{
            [`& .MuiGauge-valueArc`]: {
              fill: "#666",
            },
          }}
        />
      </Stack>
    </Paper>
  );
};

export default PlantResultItem;
