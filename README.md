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
node bridge.js
```

## Run as a docker container

```shell
docker run -it -e MQTT_HOST=159.65.38.90 -e MQTT_USERNAME=globalsense -e MQTT_PASSWORD=Password1 -e PROXY_URL=https://lora-az-prod-eastus.mydevices.com/v1/networks/iotinabox/uplink mydevices/mqtt-bridge:latest
```

## Deploy in Kubernetes

Copy deploy/configmap.example.yaml to deploy/configmap.yaml and fill in the values.

```shell
kubectl -n integrations apply -f deploy/configmap.yaml
```

```shell
kubectl -n integrations apply -f deploy/deployment.yaml
```

This will create a deployment with one replica. You can scale it up to more replicas if you want to run more instances of the bridge.

```
kubectl -n integrations scale deployment NAME_OF_DEPLOYMENT --replicas=3
```

## Re-install deployment
```
kubectl -n integrations delete deployment NAME_OF_DEPLOYMENT
```