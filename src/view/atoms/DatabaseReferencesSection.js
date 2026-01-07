import { Grid, Box, Chip } from "@mui/material";
import DatabaseLink from "./DatabaseLink";

const DatabaseReferencesSection = ({ gbif, powo, iucn }) => {
  if (!gbif?.id && !powo?.id && !iucn) {
    return null;
  }

  return (
    <Grid container spacing={1} sx={{ mt: 1 }}>
      {gbif && gbif.id && (
        <Grid item xs={12} sm={6}>
          <DatabaseLink
            label="GBIF"
            href={`https://www.gbif.org/species/${gbif.id}`}
            displayText={gbif.id}
          />
        </Grid>
      )}

      {powo && powo.id && (
        <Grid item xs={12} sm={6}>
          <DatabaseLink
            label="POWO"
            href={`https://powo.science.kew.org/taxon/${powo.id}`}
            displayText={powo.id.split(":").pop()}
          />
        </Grid>
      )}

      {iucn && (
        <Grid item xs={12}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <DatabaseLink
              label="IUCN Red List"
              href={
                iucn.id
                  ? `https://www.iucnredlist.org/species/${iucn.id}`
                  : null
              }
              displayText={iucn.id}
            />
            {iucn.category && (
              <Chip label={iucn.category} size="small" variant="outlined" />
            )}
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

export default DatabaseReferencesSection;
