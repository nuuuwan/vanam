import { Grid, Box } from "@mui/material";
import DatabaseLink from "./DatabaseLink";
import IucnCategoryChip from "./IucnCategoryChip";

const DatabaseReferencesSection = ({ gbif, powo, iucn }) => {
  if (!gbif?.id && !powo?.id && !iucn?.id && !iucn?.category) {
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

      {(iucn?.id || iucn?.category) && (
        <Grid item xs={12}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {iucn.id && (
              <DatabaseLink
                label="IUCN Red List"
                href={`https://www.iucnredlist.org/species/${iucn.id}`}
                displayText={iucn.id}
              />
            )}
            {iucn.category && <IucnCategoryChip category={iucn.category} />}
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

export default DatabaseReferencesSection;
