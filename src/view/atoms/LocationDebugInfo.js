import React, { useState, useEffect } from "react";
import { Alert, Box, Typography, Button } from "@mui/material";

const LocationDebugInfo = () => {
  const [debugInfo, setDebugInfo] = useState(null);
  const [testing, setTesting] = useState(false);

  const testLocation = () => {
    setTesting(true);
    const info = {
      userAgent: navigator.userAgent,
      isHTTPS: window.location.protocol === "https:",
      hasGeolocation: !!navigator.geolocation,
      url: window.location.href,
    };

    if (!navigator.geolocation) {
      setDebugInfo({ ...info, error: "Geolocation not supported" });
      setTesting(false);
      return;
    }

    const startTime = Date.now();
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const endTime = Date.now();
        setDebugInfo({
          ...info,
          success: true,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          time: endTime - startTime,
        });
        setTesting(false);
      },
      (error) => {
        const endTime = Date.now();
        let errorMsg = "";
        switch (error.code) {
          case 1:
            errorMsg = "Permission denied";
            break;
          case 2:
            errorMsg = "Position unavailable";
            break;
          case 3:
            errorMsg = "Timeout";
            break;
          default:
            errorMsg = error.message;
        }
        setDebugInfo({
          ...info,
          success: false,
          error: errorMsg,
          errorCode: error.code,
          time: endTime - startTime,
        });
        setTesting(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 60000,
        maximumAge: 600000,
      }
    );
  };

  useEffect(() => {
    // Auto-run on mount
    testLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ mb: 2 }}>
      <Alert severity="info" sx={{ mb: 1 }}>
        <Typography
          variant="caption"
          component="div"
          sx={{ fontFamily: "monospace", fontSize: "0.7rem" }}
        >
          <strong>Debug Info:</strong>
          <br />
          {debugInfo ? (
            <>
              HTTPS: {debugInfo.isHTTPS ? "✓" : "✗"}
              <br />
              Geolocation API: {debugInfo.hasGeolocation ? "✓" : "✗"}
              <br />
              {debugInfo.success ? (
                <>
                  <strong style={{ color: "green" }}>
                    ✓ Location Retrieved
                  </strong>
                  <br />
                  Lat: {debugInfo.latitude?.toFixed(6)}
                  <br />
                  Lng: {debugInfo.longitude?.toFixed(6)}
                  <br />
                  Accuracy: ±{Math.round(debugInfo.accuracy)}m<br />
                  Time: {debugInfo.time}ms
                </>
              ) : (
                <>
                  <strong style={{ color: "red" }}>✗ Location Failed</strong>
                  <br />
                  Error: {debugInfo.error} (code: {debugInfo.errorCode})<br />
                  Time: {debugInfo.time}ms
                  <br />
                  <br />
                  {debugInfo.errorCode === 1 && (
                    <>
                      <strong>Fix for iOS:</strong>
                      <br />
                      1. Tap Safari's "AA" icon in address bar
                      <br />
                      2. Tap "Website Settings"
                      <br />
                      3. Set Location to "Allow"
                      <br />
                      4. Tap "Test Again" below
                      <br />
                      <br />
                      OR clear & retry:
                      <br />
                      Settings → Safari → Advanced → Website Data → Remove this site
                    </>
                  )}
                </>
              )}
              <br />
              iOS: {/iPhone|iPad|iPod/.test(debugInfo.userAgent) ? "✓" : "✗"}
            </>
          ) : (
            "Loading..."
          )}
        </Typography>
        <Button
          size="small"
          onClick={testLocation}
          disabled={testing}
          sx={{ mt: 1 }}
        >
          {testing ? "Testing..." : "Test Again"}
        </Button>
      </Alert>
    </Box>
  );
};

export default LocationDebugInfo;
