curl -X 'POST' \
  'http://127.0.0.1:8002/select-free-form' \
  -H 'accept: application/json' \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@resources/wohnzimmer.jpeg' \
  --output 'extracted.jpeg'