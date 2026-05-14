import { Box } from "@mui/material";
import DatabaseLink from "../atoms/DatabaseLink";
import IucnCategoryChip from "../atoms/IucnCategoryChip";

const DatabaseReferencesSection = ({ gbif, powo, iucn }) => {
  if (!gbif?.id && !powo?.id && !iucn?.id && !iucn?.category) {
    return null;
  }

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1, mt: 1 }}>
      {gbif?.id && (
        <DatabaseLink
          label="GBIF"
          href={`https://www.gbif.org/species/${gbif.id}`}
          displayText={gbif.id}
        />
      )}
      {powo?.id && (
        <DatabaseLink
          label="POWO"
          href={`https://powo.science.kew.org/taxon/${powo.id}`}
          displayText={powo.id.split(":").pop()}
        />
      )}
      {iucn?.id && (
        <DatabaseLink
          label="IUCN Red List"
          href={`https://www.iucnredlist.org/species/${iucn.id}`}
          displayText={iucn.id}
        />
      )}
      {iucn?.category && <IucnCategoryChip category={iucn.category} />}
    </Box>
  );
};

export default DatabaseReferencesSection;
