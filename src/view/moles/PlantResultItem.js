import React from "react";
import { Paper, Stack, Box, Typography, Link, useTheme } from "@mui/material";
import { Gauge } from "@mui/x-charts/Gauge";
import CommonNamesChips from "../atoms/CommonNamesChips";
import TaxonomySection from "./TaxonomySection";
import DatabaseReferencesSection from "./DatabaseReferencesSection";

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
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="subtitle1"
            fontStyle="italic"
            sx={{ mb: 1, color: getGaugeColor(scorePercent) }}
          >
            <Link
              href={`https://en.wikipedia.org/wiki/${encodeURIComponent(
                result.species
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              underline="none"
              sx={{ color: "inherit" }}
            >
              {result.species}
            </Link>
          </Typography>

          <CommonNamesChips commonNames={result.commonNames} />

          <TaxonomySection
            genus={result.genus ? { scientificName: result.genus } : null}
            family={result.family ? { scientificName: result.family } : null}
          />

          <DatabaseReferencesSection
            gbif={{ id: result.gbif_id }}
            powo={{ id: result.powo_id }}
            iucn={{ id: result.iucn_id, category: result.iucn_category }}
          />
        </Box>
        <Box sx={{ position: "relative", width: 100, height: 100 }}>
          <Gauge
            width={100}
            height={100}
            value={scorePercent}
            valueMin={0}
            valueMax={100}
            text={({ value }) => `${Math.round(value)}%`}
            sx={{
              [`& .MuiGauge-valueArc`]: {
                fill: getGaugeColor(scorePercent),
              },
            }}
          />
          <Typography
            variant="caption"
            sx={{
              position: "absolute",
              bottom: 28,
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: "0.5rem",
              color: theme.palette.text.secondary,
              fontWeight: 300,
            }}
          >
            Conf.
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

export default PlantResultItem;
