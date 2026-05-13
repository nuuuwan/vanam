import React from "react";
import { Paper, Stack, Box, Typography, Link } from "@mui/material";
import CommonNamesChips from "../atoms/CommonNamesChips";
import TaxonomySection from "./TaxonomySection";
import DatabaseReferencesSection from "./DatabaseReferencesSection";

const getConfidenceColor = (score) => {
  if (score < 0.2) return "error.main";
  if (score < 0.5) return "warning.main";
  return "success.main";
};

const PlantResultItem = ({ result }) => {
  return (
    <Paper elevation={5} sx={{ p: 2, mb: 2 }}>
      <Box>
        <Typography
          variant="caption"
          sx={{ color: getConfidenceColor(result.score), fontSize: "0.75rem" }}
        >
          {Math.round(result.score * 100)}% confidence
        </Typography>
        <Typography variant="subtitle1" fontStyle="italic" sx={{ mb: 1 }}>
          <Link
            href={`https://en.wikipedia.org/wiki/${encodeURIComponent(
              result.species,
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
    </Paper>
  );
};

export default PlantResultItem;
