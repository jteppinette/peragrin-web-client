let os = "";

function initializeOS() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/windows phone/i.test(userAgent)) {
        return os = "Windows Phone";
    }

    if (/android/i.test(userAgent)) {
        return os = "Android";
    }

    if (window.chrome) {
        return os = "Chrome";
    }

    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return os = "iOS";
    }

    if (/^((?!chrome|android).)*safari/i.test(userAgent)) {
        return os = "Safari";
    }

    return os = "unknown";
}

export function generateLink(lon, lat) {
    if (!os) initializeOS();

    if (os == "iOS" || os == "Safari") {
        return `https://maps.apple.com/?daddr=(${lat},%20${lon})&dirflg=d`;
    }

    // default to google maps
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
}
