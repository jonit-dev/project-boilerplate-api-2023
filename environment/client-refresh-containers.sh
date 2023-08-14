# Additional deployment steps (if required)
echo "Re-building client..."
cd ~/definya/client
npm run build
docker-compose restart

echo "Deployment complete."
