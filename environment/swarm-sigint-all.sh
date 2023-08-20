#!/bin/bash

# Check if service name is provided
if [ $# -ne 1 ]; then
  echo "Usage: $0 <service-name>"
  exit 1
fi

SERVICE_NAME="$1"

# Fetch the Task IDs for all running instances of the given service
TASK_IDS=$(docker service ps -q --filter 'desired-state=running' "$SERVICE_NAME")

# Iterate through the Task IDs and send the SIGINT signal to each container
for TASK_ID in $TASK_IDS; do
  # Get the Container ID associated with the Task ID
  CONTAINER_ID=$(docker inspect --format '{{.Status.ContainerStatus.ContainerID}}' "$TASK_ID")

  # Send the SIGINT signal to the container
  docker kill --signal=SIGINT "$CONTAINER_ID"

  echo "Sent SIGINT signal to container $CONTAINER_ID"
done

echo "SIGINT signal sent to all containers running the $SERVICE_NAME service."
