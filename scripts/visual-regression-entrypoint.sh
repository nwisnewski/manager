#!/bin/bash
sleep 30s
yarn e2e:wait-for-manger-local
yarn e2e --visual --log
