# MQTT to HTTP Bridge

## Requirements
- NodeJS v11+
- NPM


## Install and Run
```
cp .env.sample .env
```

```
MQTT_USERNAME=CAYENNE_USER
MQTT_PASSWORD=CAYENNE_PASSWORD
PROXY_URL=https://requestvin.herokuapp.com/11w4pea1
TOPIC="/v1.6/devices/#"
TOPIC_REGEX="\/v1.6\/devices\/(.*)\/up\/(.*)"
```

Fill `.env` with appropriate values. 

** Note: `TOPIC_REGEX` is a regex that will be used to extract the device id and channel from the MQTT topic. The first group is the device id and the second group is the value. **

```
npm install
node subscriber.js
```

```shell
docker run -it -e MQTT_HOST=159.65.38.90 -e MQTT_USERNAME=globalsense -e MQTT_PASSWORD=Password1 -e PROXY_URL=https://lora-az-prod-eastus.mydevices.com/v1/networks/iotinabox/uplink mydevices/mqtt-bridge:latest
```

```shell
docker run -it --network mqtt-bridge -e MQTT_USERNAME=globalsense -e MQTT_PASSWORD=Password1 -e PROXY_URL=https://lora-az-prod-eastus.mydevices.com/v1/networks/iotinabox/uplink mydevices/mqtt-bridge:latest
```