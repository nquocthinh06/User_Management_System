# Check if port 3306 is in use
$conn = Get-NetTCPConnection -LocalPort 3306 -ErrorAction SilentlyContinue
if ($conn) {
    exit 0  # Port is in use
} else {
    exit 1  # Port is available
}

