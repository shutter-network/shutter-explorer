# Shutter Explorer deployment process
## Backend:
- The instance IPs are 167.172.189.30 (staging) and 46.101.167.92 (prod).
- Prod instance is running an observer which is used for staging data as well.
- The backend deployment works automatically when pushed to main for prod and staging branch for staging environment.
- To add or update new environment variables
    - Login to the instance, navigate to /root/shutter-explorer/docker
    - Change the .env file
    - Restart the containers using docker compose up –build -d
## Frontend:
- The frontend is deployed to netlify.
- Any changes to staging branch will get deployed to https://explorer.staging.shutter.network/ and any changes to main branch will get deployed to https://explorer.shutter.network/
- Please ensure that there are no unused variables or imports as netlify build fails with unused variables warning as well.
- Any changes to environment variables can be done via netlify website
    - Navigate to the website
    - Select `Site Configuration` from sidebar 
    - Add new environment variable in the environment variables section.