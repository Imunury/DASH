// map

(function () {
    var ws;
    var map;
    var robotMarkers = []; // For robot path
    var courseMarkers = []; // For course
    var robotPathCoordinates = [];
    var coursePathCoordinates = [];
    var robotPathLine;
    var coursePathLine;
    var isInitialLocationSet = false;
    const API_BASE = "http://125.136.64.124:24002";
    var markers = []; // For course details
    var lines = []; // For course lines

    window.initMap = function () {
        robotPathLine = new naver.maps.Polyline({
            path: robotPathCoordinates,
            geodesic: true,
            strokeColor: '#ffff00',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });

        coursePathLine = new naver.maps.Polyline({
            path: coursePathCoordinates,
            geodesic: true,
            strokeColor: '#ff0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });

        initializeMapAtLocation(new naver.maps.LatLng(35.2234, 126.8417)); // 기본 위치를 (0, 0)으로 설정

        const robotId = 'ecobot00011'; // 이 로봇 ID는 실제 사용하는 로봇 ID로 변경해야 합니다.
        fetchTracks(robotId); // 로봇 ID를 인자로 전달

        ws_00008_tracking_map = new WebSocket(`ws://125.136.64.124:24104/${robotId}`);
        ws_00008_tracking_map.onmessage = function (event) {
            const msg = JSON.parse(event.data);

            const gpsMessage = JSON.parse(event.data);
            const gpsData = {
                lat: gpsMessage.latitude,
                lng: gpsMessage.longitude
            };
            updateRobotMarkersAndPath(gpsData);

            const messageElement = document.createElement('p');
            messageElement.textContent = `${msg.topic}: ${JSON.stringify(msg.message)}`;
            // document.getElementById('messages').appendChild(messageElement);
        };
    }

    // Robot's path and marker functions
    function updateRobotMarkersAndPath(gpsData) {
        if (typeof gpsData.lat === "number" && typeof gpsData.lng === "number") {
            const latestLocation = new naver.maps.LatLng(gpsData.lat, gpsData.lng);

            if (!isInitialLocationSet) {
                initializeMapAtLocation(latestLocation);
                isInitialLocationSet = true;
            }

            if (robotMarkers.length % 30 !== 0 && robotMarkers.length > 0) {
                robotMarkers[0].setMap(null);
                robotMarkers.shift();
            }

            placeRobotMarker(latestLocation);
            robotPathCoordinates.push(latestLocation);

            if (robotPathCoordinates.length % 30 === 0) {
                robotPathLine.setPath(robotPathCoordinates);
            }
        } else {
            console.error("Invalid GPS data received:", gpsData);
        }
    }

    function placeRobotMarker(location) {
        var marker = new naver.maps.Circle({
            center: location,
            map: map,
            path: naver.maps.SymbolPath.CIRCLE,
            scale: 1,
            radius: 2.5,
            fillOpacity: 1,
            fillColor: '#ffff00',
            strokeColor: '#ffff00',
            strokeWeight: 1
        });
        robotMarkers.push(marker);
    }


    function initializeMapAtLocation(location) {
        map = new naver.maps.Map(document.getElementById("ecobot00011_map"), {
            zoom: 19,
            center: location,
            disableDefaultUI: true,
            mapTypeId: 'satellite'
        });

        robotPathLine.setMap(map);
        coursePathLine.setMap(map);
    }

    function fetchTracks(robotId) {

        fetch(`${API_BASE}/get-courses?robotId=${robotId}`)
            .then(res => res.json())
            .then(data => {
                data.forEach(item => {
                    // For Dropdown
                    const option = document.createElement('option');
                    option.value = item.trackId;
                    option.textContent = item.trackId;

                    // For Track List
                });
            });
    }

})();