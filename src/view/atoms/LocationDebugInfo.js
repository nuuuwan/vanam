import React, { useState, useEffect } from "react";
import { Alert, Box, Typography, Button } from "@mui/material";

const LocationDebugInfo = () => {
  const [debugInfo, setDebugInfo] = useState(null);
  const [testing, setTesting] = useState(false);
  const [permissionState, setPermissionState] = useState(null);

  const checkPermission = async () => {
    // Check if Permissions API is available
    if (navigator.permissions && navigator.permissions.query) {
      try {
        const result = await navigator.permissions.query({
          name: "geolocation",
        });
        setPermissionState(result.state); // 'granted', 'denied', or 'prompt'
        return result.state;
      } catch (e) {
        console.log("Permissions API not fully supported", e);
      }
    }
    return null;
  };

  const testLocation = async () => {
    setTesting(true);

    // First check permission state
    const permState = await checkPermission();

    const info = {
      userAgent: navigator.userAgent,
      isHTTPS: window.location.protocol === "https:",
      hasGeolocation: !!navigator.geolocation,
      url: window.location.href,
      permissionState: permState,
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
    // Check permission on mount
    checkPermission();

    // Don't auto-run on iOS - Safari requires user gesture
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    if (!isIOS) {
      testLocation();
    }
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
              Permission:{" "}
              {debugInfo.permissionState || permissionState || "unknown"}
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
                      <strong style={{ color: "orange" }}>
                        {debugInfo.permissionState === "denied"
                          ? "⚠ Safari has BLOCKED this site"
                          : "Permission Error"}
                      </strong>
                      <br />
                      <br />
                      {debugInfo.permissionState === "denied" ? (
                        <>
                          Safari remembers you denied permission.
                          <br />
                          <strong>To reset:</strong>
                          <br />
                          1. Tap "AA" in address bar
                          <br />
                          2. Tap "Website Settings"
                          <br />
                          3. Change Location to "Ask" or "Allow"
                          <br />
                          4. Reload page & tap "Test Location"
                          <br />
                          <br />
                          If "AA" icon doesn't work:
                          <br />
                          Settings → Safari → Clear History
                        </>
                      ) : (
                        <>
                          Other apps work, so your iPhone is OK.
                          <br />
                          Safari blocked this specific website.
                          <br />
                          <br />
                          Quick fix:
                          <br />
                          1. Tap "AA" icon in Safari address bar
                          <br />
                          2. Tap "Website Settings"
                          <br />
                          3. Set Location to "Allow"
                          <br />
                          4. Tap "Test Location" below
                        </>
                      )}
                    </>
                  )}
                </>
              )}
              <br />
              iOS: {/iPhone|iPad|iPod/.test(debugInfo.userAgent) ? "✓" : "✗"}
            </>
          ) : (
            <>
              {/iPhone|iPad|iPod/.test(navigator.userAgent)
                ? "iOS: Tap 'Test Location' button below"
                : "Loading..."}
            </>
          )}
        </Typography>
        <Button
          size="small"
          onClick={testLocation}
          disabled={testing}
          sx={{ mt: 1 }}
          variant="contained"
          color="primary"
        >
          {testing ? "Testing..." : debugInfo ? "Test Again" : "Test Location"}
        </Button>
      </Alert>
    </Box>
  );
};

export default LocationDebugInfo;
