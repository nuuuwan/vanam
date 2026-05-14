import React from "react";
import { Typography, Link } from "@mui/material";

// Known non-italic rank connectors
const CONNECTORS = new Set(["var.", "subsp.", "ssp.", "f.", "nothovar.", "×"]);

/**
 * Tokenises a species name into {text, italic} segments.
 *
 * Rules (per ICN):
 *   - Genus (first capitalised word)   → italic
 *   - Specific/infraspecific epithets  → italic (start with lowercase)
 *   - Rank connectors (var., ×, …)     → upright
 *   - Authority (author abbreviations) → upright (everything after the
 *     last botanical name part, i.e. first token that isn't a connector
 *     and doesn't start with a lowercase letter)
 */
function parseSpeciesName(name) {
  const tokens = name.trim().split(/\s+/);
  const segments = [];
  let genusFound = false;
  let inAuthority = false;

  for (const token of tokens) {
    if (inAuthority) {
      segments.push({ text: token, italic: false, authority: true });
      continue;
    }

    if (CONNECTORS.has(token)) {
      // Rank connector — upright
      segments.push({ text: token, italic: false, authority: false });
    } else if (!genusFound && /^[A-Z]/.test(token)) {
      // Genus — capitalize first letter, lowercase the rest, italic
      genusFound = true;
      const normalized =
        token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
      segments.push({ text: normalized, italic: true, authority: false });
    } else if (/^[a-z]/.test(token)) {
      // Epithet / infraspecific epithet — lowercase, italic
      segments.push({
        text: token.toLowerCase(),
        italic: true,
        authority: false,
      });
    } else {
      // First non-connector, non-epithet token after genus = start of authority
      inAuthority = true;
      segments.push({ text: token, italic: false, authority: true });
    }
  }

  return segments;
}

const SpeciesNameView = ({
  species,
  variant = "body1",
  sx = {},
  noWrap,
  href,
}) => {
  if (!species) return null;

  const segments = parseSpeciesName(species);

  const nodes = segments.map((seg, i) => {
    const prefix = i === 0 ? "" : " ";
    return seg.italic ? (
      <em key={i}>
        {prefix}
        {seg.text}
      </em>
    ) : (
      <span key={i} style={seg.authority ? { opacity: 0.5 } : undefined}>
        {prefix}
        {seg.text}
      </span>
    );
  });

  const content = href ? (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      underline="none"
      sx={{ color: "inherit" }}
    >
      {nodes}
    </Link>
  ) : (
    nodes
  );

  return (
    <Typography variant={variant} sx={sx} noWrap={noWrap}>
      {content}
    </Typography>
  );
};

export default SpeciesNameView;
