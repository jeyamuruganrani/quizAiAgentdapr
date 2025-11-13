#!/bin/bash
cd ~/swarise/swarise_ai_UI/swarise_ai_UI
dapr run \
  --app-id quiz-frontend \
  --app-port 5173 \
  --dapr-http-port 3500 \
  --resources-path ~/.dapr/components \
  -- npm run dev
