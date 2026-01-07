import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Box,
  Typography,
  Link,
  Stack,
  Chip,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";

const DatabaseReferencesSection = ({ gbif, powo, iucn }) => {
  if (!gbif?.id && !powo?.id && !iucn) {
    return null;
  }

  return (
    <Grid container spacing={1} sx={{ mt: 1 }}>
      {gbif && gbif.id && (
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
                  GBIF
                </Typography>
                <Link
                  href={`https://www.gbif.org/species/${gbif.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  {gbif.id}
                </Link>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      )}

      {powo && powo.id && (
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
                  POWO
                </Typography>
                <Link
                  href={`https://powo.science.kew.org/taxon/${powo.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  {powo.id.split(":").pop()}
                </Link>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      )}

      {iucn && (
        <Grid item xs={12}>
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
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="space-between"
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <WarningIcon
                    sx={{
                      color: "#666",
                      fontSize: 20,
                    }}
                  />
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      IUCN Red List
                    </Typography>
                    {iucn.id && (
                      <Link
                        href={`https://www.iucnredlist.org/species/${iucn.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          fontSize: "0.875rem",
                          fontWeight: 500,
                        }}
                      >
                        {iucn.id}
                      </Link>
                    )}
                  </Box>
                </Stack>
                {iucn.category && (
                  <Chip
                    label={iucn.category}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontWeight: 600,
                      borderColor: "#666",
                      color: "#333",
                    }}
                  />
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );
};

export default DatabaseReferencesSection;
