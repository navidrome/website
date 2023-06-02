---
title: "Monitoring Navidrome"
linkTitle: "Monitoring"
date: 2017-01-03
weight: 50
description: >
  How to monitor status of your navidrome instance
draft: false
---

Currently, navidrome supports monitoring and alerting using
Prometheus/[OpenMetrics](https://github.com/OpenObservability/OpenMetrics/blob/main/specification/OpenMetrics.md)
standard. Example Grafana dashboard:

<p align="center">
<img width="1000" src="/screenshots/grafana-example.png">
</p>


### Configuration
You need to set `ND_PROMETHEUS_ENABLED` to enable Prometheus metrics endpoint.
Setting custom `ND_PROMETHEUS_METRICSPATH` is highly recommended if your Navidrome
instance is publicly available.

Minimal docker compose example file with metrics enabled:

```yml
version: '3'
services:
  navidrome:
    image: deluan/navidrome
    user: 1000:1000 # should be owner of volumes
    ports:
      - "4533:4533"
    environment:
      ND_PROMETHEUS_ENABLED: "true"
      ND_PROMETHEUS_METRICSPATH: "/metrics_SOME_SECRET_KEY"
    volumes:
      - "./data:/data"
      - "./music:/music"
```

Example `prometheus.yml` config to parse this instance:
```yml
global:
  scrape_interval: 10s
scrape_configs:
  - job_name: 'navidrome'
    metrics_path: /metrics_SOME_SECRET_KEY
    scheme: http
    static_configs:
      - targets: ['YOUR_IP_HERE:4533']
```

### Dashboard
Grafana dashboard available here: [#18038](https://grafana.com/grafana/dashboards/18038-navidrome/).

Simple to install but fully fledged Grafana docker compose configuration
can be found [here](https://github.com/Einsteinish/Docker-Compose-Prometheus-and-Grafana).
