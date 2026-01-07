import React from "react";
import { Paper, Stack, Box, Typography, Link, useTheme } from "@mui/material";
import { Gauge } from "@mui/x-charts/Gauge";
import CommonNamesChips from "../atoms/CommonNamesChips";
import TaxonomySection from "../atoms/TaxonomySection";
import DatabaseReferencesSection from "../atoms/DatabaseReferencesSection";

const PlantResultItem = ({ result }) => {
  const theme = useTheme();
  const scorePercent = result.score * 100;
  const getGaugeColor = (score) => {
    if (score > 75) return theme.palette.success.main;
    if (score > 50) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  return (
    <Paper elevation={5} sx={{ p: 2, mb: 2 }}>
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
          <Typography variant="subtitle1" fontStyle="italic" sx={{ mb: 1 }}>
            <Link
              href={`https://en.wikipedia.org/wiki/${encodeURIComponent(
                result.species.scientificNameWithoutAuthor ||
                  result.species.scientificName
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              underline="none"
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
          value={scorePercent}
          valueMin={0}
          valueMax={100}
          text={({ value }) => `${Math.round(value)}%\nConf.`}
          sx={{
            [`& .MuiGauge-valueArc`]: {
              fill: getGaugeColor(scorePercent),
            },
          }}
        />
      </Stack>
    </Paper>
  );
};

export default PlantResultItem;
