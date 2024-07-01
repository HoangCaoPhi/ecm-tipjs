#!/bin/bash

# Wait for RabbitMQ server to start
sleep 10

# Add virtual host and set permissions
rabbitmqctl set_permissions -p "rabbitmq" "local" ".*" ".*" ".*"

# Execute the original command
exec rabbitmq-server