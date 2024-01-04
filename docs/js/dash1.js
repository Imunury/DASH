// 모터 정도

(function () {

    const robotId = "ecobot00011"
    const ecobot00011_mon_ws = new WebSocket(`ws://125.136.64.124:24104/${robotId}`);

    ecobot00011_mon_ws.onmessage = function (event) {
        const msg = JSON.parse(event.data);

        const statusMessage = JSON.parse(event.data);
        if (statusMessage.current_speeds) {
            const speeds = statusMessage.current_speeds;
            document.getElementById('ecobot00011_current_fwd_speed').textContent = speeds[0];
            document.getElementById('ecobot00011_current_bwd_speed').textContent = speeds[1];
            document.getElementById('ecobot00011_current_shift_speed').textContent = speeds[2];
            document.getElementById('ecobot00011_current_turn_speed').textContent = speeds[3];
        }
    };

})();



// 조종 버튼

(function () {
    const robotId = "ecobot00011"; // 이 값을 해당 패널의 에코봇 ID로 변경

    function sendMqttMessageToAPI(messageValue) {
        const topicSuffix = "mtr_ctrl";
        const topics = [{
            topic: topicSuffix,
            payload: messageValue
        }];

        fetch('http://125.136.64.124:24001/send-mqtt/' + robotId, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    topics: topics
                }) // "topics"를 배열의 배열로 전송
            })
            .then(response => response.text())
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error('Error sending request to API:', error);
            });
    }
    document.querySelectorAll('#ecobot00011-man-ctrl button').forEach(function (button) {
        button.onclick = function () {
            sendMqttMessageToAPI(button.value);
        }
    });

})();




