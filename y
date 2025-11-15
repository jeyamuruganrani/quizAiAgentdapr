apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: flowise-binding
spec:
  type: bindings.http/v1
  version: v1
  metadata:
    - name: url
      value: "https://swariseai.swarise.com"

