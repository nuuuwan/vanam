export default class PlantNetPrediction {
  constructor(
    confidence,
    species,
    genus,
    family,
    commonNames,
    gbifId,
    powoId,
    iucnId,
    iucnCategory
  ) {
    this.confidence = confidence;
    this.species = species;
    this.genus = genus;
    this.family = family;
    this.commonNames = commonNames;
    this.gbifId = gbifId;
    this.powoId = powoId;
    this.iucnId = iucnId;
    this.iucnCategory = iucnCategory;
  }
}
