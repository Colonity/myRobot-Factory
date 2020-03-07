const axios = require('axios');
const mqtt = require('mqtt');

const main_loop = () => {
    setTimeout(() => {
        let start_time_stamp = new Date();

        axios.get('https://fanuc-robot-http-server.herokuapp.com/')
            .then((res) => {
                const time_stamp = new Date();
                const delta = time_stamp - start_time_stamp;
                start_time_stamp = time_stamp;
                const regexp = 'Joint   [1-6]: *(-?.*)';
                let joints = [];
                let matches = res.data.matchAll(regexp);
                let count = 0;
                for (const match of matches) {
                    count++;
                    if (count > 6) break;
                    const value = parseFloat(match[1]);
                    joints.push(value);
                }
                // let jointti1 = {
                //     name:'Joint 1',
                //     joint:joints[0]
                // }
                let data = {
                    time: time_stamp,
                    joints: joints
                }

                mqtt_client.publish(topic='Joint 1', JSON.stringify(joints[0]));
                mqtt_client.publish(topic='Joint 2', JSON.stringify(joints[1]));
                mqtt_client.publish(topic='Joint 3', JSON.stringify(joints[2]));
                mqtt_client.publish(topic='Joint 4', JSON.stringify(joints[3]));
                mqtt_client.publish(topic='Joint 5', JSON.stringify(joints[4]));
                mqtt_client.publish(topic='Joint 6', JSON.stringify(joints[5]));
                mqtt_client.publish(topic='joints', JSON.stringify(data));
                console.log(start_time_stamp, joints, delta, 'ms');
                main_loop();
            });
    }, 10);
}

const mqtt_client = mqtt.connect('wss://mymqtt-broker.herokuapp.com');
mqtt_client.on('connect', () => {
    console.log('connected');
    main_loop();

});
