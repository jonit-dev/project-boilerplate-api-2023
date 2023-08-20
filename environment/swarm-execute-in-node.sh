#!/bin/bash

# Check if both arguments are provided
if [ $# -ne 2 ]; then
  echo "Usage: $0 <service-name> <command>"
  exit 1
fi

SERVICE_NAME="$1"
COMMAND="$2"

# Fetch the Task IDs for all running instances of the given service
TASK_IDS=$(docker service ps -q --filter 'desired-state=running' "$SERVICE_NAME")

# Iterate through the Task IDs and execute the given command in each container
for TASK_ID in $TASK_IDS; do
  # Get the Container ID associated with the Task ID
  CONTAINER_ID=$(docker inspect --format '{{.Status.ContainerStatus.ContainerID}}' "$TASK_ID")

  # Execute the provided command inside the container
  docker exec -it "$CONTAINER_ID" $COMMAND

  echo "Executed command in container $CONTAINER_ID"
done

echo "Command executed in all containers running the $SERVICE_NAME service."
