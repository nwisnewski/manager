#!/bin/bash
export REACT_APP_LOGIN_ROOT="https://login.linode.com"
export REACT_APP_API_ROOT="https://api.linode.com/v4"
export REACT_APP_APP_ROOT="https://manager-local:3000"
export REACT_APP_CLIENT_ID="3da29f0f52359f85b9d4"
export MANAGER_USER="prod-test-010"
export MANAGER_PASS="S83oz1kawzR03LGe81nbcziHFFXxuJV6"
export MANAGER_OAUTH="c34fb621bbbc21cc4dc5d4b308debda5380303c7a058192123b2c2030eb9600a"
export MANAGER_USER_2="prod-test-012"
export MANAGER_PASS_2="S83oz1kawzR03LGe81nbcziHFFXxuJV6"
export MANAGER_OAUTH_2="fa3e363f8473a5dfb8525733a3353134a59340d24f8abd3761a4051dc8d8c2e2"
docker-compose -f integration-test.yml up --build --scale chrome=2 --exit-code-from manager-e2e
