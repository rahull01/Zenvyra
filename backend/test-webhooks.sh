#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:8080/api}"
ENDPOINT="${ENDPOINT:-$BASE_URL/payments/dodo-webhook}"

post_event() {
  local event_type="$1"
  local subscription_id="$2"
  local payload
  payload=$(cat <<EOF
{
  "type": "$event_type",
  "data": {
    "subscription_id": "$subscription_id",
    "customer_id": "cust_test_local",
    "product_id": "test_pro_product",
    "status": "active",
    "metadata": {
      "userId": "local-test-user",
      "plan": "pro"
    }
  }
}
EOF
)

  echo "Posting $event_type to $ENDPOINT"
  curl -i -X POST "$ENDPOINT" \
    -H "Content-Type: application/json" \
    -H "webhook-id: wh_test_${event_type}_$(date +%s)" \
    -H "webhook-timestamp: $(date +%s)" \
    -H "webhook-signature: v1,fake-local-signature" \
    -H "X-Dodo-Signature: fake-local-signature" \
    --data "$payload"
  echo
}

post_event "subscription.created" "sub_test_created"
post_event "subscription.cancelled" "sub_test_cancelled"
