#!/bin/bash
cd /home/kavia/workspace/code-generation/network-web-application-5261-5573/FrontendContainer
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

