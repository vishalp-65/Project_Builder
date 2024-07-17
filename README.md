# Project Builder

This project streamlines front-end deployments. Connect your GitHub or Upload the link, and get your website live in seconds.  Simple controls let you manage settings and track performance - focus on building, we'll handle the launch.

Note: **Due to cost issue I'm not uploading it to anywhere, just watch video for demo** -> [Demo](https://drive.google.com/file/d/1Bhjo2iPgWPHCduJ4dr4U6N3qybeuvbJ9/view?usp=sharing)
### Setup Guide

This Project contains following services and folders:

- `api-server`: HTTP API Server for REST API's
- `build-server`: Docker Image code which clones, builds and pushes the build to S3
- `proxy-server`: Reverse Proxy the subdomains and domains to s3 bucket static assets
- `fronted`: Fronted UI for interaction with user

## Features

### User Management and Authentication
- **User Registration and Login**: Users can create accounts, register with their GitHub credentials, and securely store their information.
- **Authorization**: User roles and access control mechanisms restrict access to specific functionalities based on user permissions.

### GitHub Integration
- **GitHub Apps Authentication**: Users can securely connect their GitHub accounts and authorize access to their repositories using GitHub Apps.
- **Deployment Options**: Users can deploy by either uploading a GitHub link or by connecting their GitHub account.
- **Automatic Deployment**: Upon connecting your account, our service automatically triggers deployment, streamlining the process and ensuring your latest code is always live.

### Environment Variables Management
- **Stage-Specific Variables**: Users can provide environment variables for their projects, segmented into different stages such as build and production.

### Rollback
- **Versioning**: Different deployment versions are tracked using timestamps, commit hashes, or snapshots.
- **Rollback Functionality**: Users can rollback to previous deployment versions, restoring previous configurations and project states.

### Analytics
- **Real-Time Data**: Users have access to real-time analytics for their deployments.
- **Detailed Insights**: Users can gain insights into performance metrics, user behavior, and more.
- **Logging:**  Provides detailed logs for deployment processes, including build output, errors, and success messages. Users can access these logs for troubleshooting and monitoring purposes. 

### Architecture
<img width="670" alt="Vercel-design" src="https://github.com/VisHaL0023/vercel-clone/assets/73978467/39b8258a-99ca-4c38-b51f-f18cc6a39bec">

