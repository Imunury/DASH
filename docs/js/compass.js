// 나침반

(function () {

    const robotId = "ecobot00008"
    const ecobot00011_mon_ws = new WebSocket(`ws://125.136.64.124:24104/${robotId}`);

    ecobot00011_mon_ws.onmessage = function (event) {
        const msg = JSON.parse(event.data);

        const statusMessage = JSON.parse(event.data);

        if (statusMessage.timestamp) {
            const gpsData = {
                lat: statusMessage.latitude,
                lng: statusMessage.longitude
            };

            document.getElementById('ecobot00011_latitude_value').textContent = gpsData.lat.toFixed(4); // Rounded to 4 decimal places
            document.getElementById('ecobot00011_longitude_value').textContent = gpsData.lng.toFixed(4); // Rounded to 4 decimal places
        }

        // if (statusMessage.velocity) {
        //     const vel = statusMessage.velocity;
        //     document.getElementById('ecobot00011_vel_val').textContent = vel.toFixed(3);
        // }

        // if (statusMessage.current_angular_vel) {
        //     const ang = statusMessage.current_angular_vel;
        //     document.getElementById('ecobot00011_ang').textContent = ang.toFixed(4);
        // }

        // if (statusMessage.depth_data) {
        //     const depth_data = statusMessage.depth_data;
        //     document.getElementById('ecobot00011_depth').textContent = depth_data.toFixed(1);
        // }

        // if (statusMessage.yaw) {
        //     const yaw = statusMessage.yaw;
        //     document.getElementById('ecobot00011_yaw-value').textContent = yaw.toFixed(1);
        //     document.getElementById('ecobot00011-yaw').style.transform = `rotate(${yaw}deg)`;
        // }

        if (statusMessage.bearing) {
            const bearingValue = statusMessage.bearing;
            document.getElementById('ecobot00011-bearing').style.transform = `rotate(${bearingValue}deg)`;
        }

        if (statusMessage.mppt_data) {
            const mpptData = statusMessage.mppt_data;
            document.getElementById('ecobot00011_solar_V').textContent = mpptData[0];
            document.getElementById('ecobot00011_solar_A').textContent = mpptData[1];
            document.getElementById('ecobot00011_bat_Temp').textContent = mpptData[4];
            document.getElementById('ecobot00011_dev_Temp').textContent = mpptData[5];
            document.getElementById('ecobot00011_bat_Soc').textContent = mpptData[6];
            //                document.getElementById('ecobot00011_bat').textContent = mpptData[9];
        }

        // if (statusMessage.other_values) {
        //     const bat = statusMessage.other_values[2];
        //     document.getElementById('ecobot00011_bat').textContent = bat / 100;
        // }
    };
})();