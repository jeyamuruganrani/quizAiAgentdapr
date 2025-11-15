Quiz AI Agent — Full Setup Guide (From Zero to Working System)

This guide explains everything from the very beginning:

✔ How to install Dapr
✔ How to install Node, React
✔ How to create the project
✔ How to add the Flowise binding file
✔ How to modify React to use Dapr
✔ How to run everything successfully
✔ How communication works

This README contains EVERY step you actually did.

📌 1. Install Prerequisites
✅ Install Node.js & npm
sudo apt update
sudo apt install nodejs npm -y


Verify:

node -v
npm -v

✅ Install Dapr CLI
wget -q https://raw.githubusercontent.com/dapr/cli/master/install/install.sh -O - | /bin/bash


Check:

dapr --version

✅ Initialize Dapr (Standalone Mode)
dapr init


This installs:

Dapr runtime




Inside your working folder:

clone :


Go inside the folder:

cd swarise_ai_UI


Start the app normally (test only):
npm install 
npm run dev


It runs on: http://localhost:3000

📌 3. Add Dapr Flowise Binding Component

Create folder:

mkdir -p ~/.dapr/components


Create the binding file:

nano ~/.dapr/components/flowise-binding.yaml


Paste this:

apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: flowise-binding
spec:
  type: bindings.http
  version: v1
  metadata:
    - name: url
      value: "https://swariseai.swarise.com/api/v1/prediction"
    - name: method
      value: POST
    - name: headers
      value: |
        {
          "Authorization": "Bearer uApDLOVpEi4cwWyWGnCzasU0uVBkEVEoqNAXMtcaDGw",
          "Content-Type": "application/json"
        }


✔ This hides your token inside Dapr
✔ React never touches the Flowise server directly

📌 4. Configure React to Talk Only to Dapr

Open your quiz component:

app/components/FlowiseButtonQuiz.tsx


Replace API_HOST:

const API_HOST = "http://localhost:3600/v1.0/bindings/flowise-binding";


Modify sendQuiz:

const res = await fetch(API_HOST, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    operation: "post",
    data: {
      question: finalAnswer ? finalAnswer : `Start ${topic} quiz.`,
      chatId: CHAT_ID,
      flowId: flowId
    }
  })
});


✔ No Flowise URL inside frontend
✔ No API key exposed
✔ No CORS issue
✔ Dapr forwards the request to actual Flowise flow

📌 5. Start the App WITH Dapr (Very Important)

This is the correct way:

dapr run \
  --app-id quiz-frontend \
  --app-port 3001 \
  --dapr-http-port 3600 \
  --resources-path ~/.dapr/components \
  -- npm run dev


If everything works, Dapr shows:

Component loaded: flowise-binding
HTTP server is running on port 3600


Your app will run at:

👉 http://localhost:3001

Dapr will run at:

👉 http://localhost:3600

📌 6. Testing the Dapr Binding (Optional)

You can test Dapr directly:

curl -X POST http://localhost:3600/v1.0/bindings/flowise-binding \
  -H "Content-Type: application/json" \
  -d '{
        "operation": "post",
        "data": {
          "question": "Hello!",
          "chatId": "chem-1",
          "flowId": "9147521d-82ba-4e49-8086-1376a16c7da3"
        }
      }'


If you get a JSON response → Success.

📌 7. How Everything Works (Simple Explanation)
🔹 React UI

Shows subjects → sends question → receives quiz text.

🔹 Dapr (Port 3600)

Acts as middleware.
React → Dapr → Flowise (securely).

🔹 Flowise

Your AI quiz flows.

🔹 Binding File

Stores:

API URL

Authorization token

Method

Headers

Dapr uses this automatically.

📌 8. Folder Structure
quizAiAgentdapr/
│
├── app/
│   ├── components/
│   │   └── FlowiseButtonQuiz.tsx
│   ├── api/
│   │   └── quiz/route.js (optional)
│
├── package.json
├── next.config.js
├── README.md  <-- place this file here
│
└── ~/.dapr/components/flowise-binding.yaml

📌 9. Advantages of This Architecture

✔ Flowise API key is hidden
✔ No CORS errors
✔ Very secure
✔ Easy maintain
✔ FlowId can change anytime — React no changes
✔ React talks only to Dapr (local & safe)

📌 10. Commands Summary
Start React with Dapr:
dapr run --app-id quiz-frontend --app-port 3001 --dapr-http-port 3600 --resources-path ~/.dapr/components -- npm run dev

Test Dapr:
curl http://localhost:3600/v1.0/healthz

Check Components:
dapr list

🎉 Final Notes

You now have a production-grade architecture:

React → Dapr → Flowise