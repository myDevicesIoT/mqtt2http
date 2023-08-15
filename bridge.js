require('dotenv').config();
const mqtt = require('mqtt');
const superagent = require('superagent');
const URL = process.env.PROXY_URL || 'http://localhost'

const opts = {
  username: process.env.MQTT_USERNAME || 'DEFAULT_USERNAME',
  password: process.env.MQTT_PASSWORD || 'DEFAULT_PASSWORD',
  clientId: "watermonkey-mydevices-bridge",
  broker: process.env.MQTT_HOST || 'localhost'
};

const client = mqtt.connect("mqtt://" + opts.broker, {
  username: opts.username,
  password: opts.password,
  clientId: opts.clientId,
});

console.log('Connecting to broker...')
// connect and subscribe
client.on('connect', function () {
  const t = new Date().getTime();
  console.log(`${t}: connected to MQTT Broker on ${opts.broker}`)
  client.subscribe(process.env.TOPIC);
});

client.on('error', function(){
  const t = new Date().getTime();
  console.log(`${t}: error with connection to ${opts.broker}`)
})

const config = {
  deviceIdLength: 15,
  topicRegex: /^\/v1\.6\/devices\/(\d{15})\/[\w-]+$/, // regex to match the topic
  endpointUrl: process.env.PROXY_URL,
  payloadFormat: 'json'
};

// consume handler
client.on('message', (topic, payload) => {
  const t = new Date().getTime();
  console.log(`${t}: message received - topic=${topic}, payload=${payload.toString()}`);

  (async () => {
      try {
          if (payload.length === 0) return;

          console.log(process.env.TOPIC_REGEX)
          let match = topic.match(process.env.TOPIC_REGEX || config.topicRegex);

          if (!match) {
            return;
          }
          // Extract device id from topic
          let deviceId = match[1];
          console.log(deviceId)
          if (!isValidDeviceId(deviceId)) return;

          const jsonData = parsePayload(payload);
          if (!jsonData) return;

          const body = { eui: deviceId, format: config.payloadFormat, data: jsonData };
          const req = await superagent.post(config.endpointUrl).send(body);

          const t2 = new Date().getTime();
          console.log(`${t2}: http request - status=${req.statusCode}, body=${JSON.stringify(body)}`);
      } catch (err) {
          const t2 = new Date().getTime();
          console.log(`${t2}: error - message=${err.toString()}`);
      }
  })();
});

function isValidDeviceId(deviceId) {
  return deviceId.length === config.deviceIdLength && !isNaN(deviceId);
}

function parsePayload(payload) {
  if (config.payloadFormat === 'json') {
      return JSON.parse(payload.toString());
  }
  // Add other parsing formats as needed
  return null;
}
