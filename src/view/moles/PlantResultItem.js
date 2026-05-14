import React from "react";
import { Paper, Box, Typography } from "@mui/material";
import CommonNamesChips from "../atoms/CommonNamesChips";
import TaxonomySection from "./TaxonomySection";
import DatabaseReferencesSection from "./DatabaseReferencesSection";
import SpeciesNameView from "../atoms/SpeciesNameView";

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
        <SpeciesNameView
          species={result.species}
          variant="subtitle1"
          sx={{ mb: 1 }}
          href={`https://en.wikipedia.org/wiki/${encodeURIComponent(result.species)}`}
        />

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
