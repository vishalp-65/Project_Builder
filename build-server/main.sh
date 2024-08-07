#!/bin/bash
export GIT_REPOSITORY_URL="$REPOSITORY_URL"
export GIT_ACCESS_TOKEN="$GIT_ACCESS_TOKEN"
export GIT_USERNAME="$GIT_USERNAME"
export GIT_REPO="$GIT_REPO"
export GIT_COMMIT_HASH="$GIT_COMMIT_HASH"

# Checking if either repo url or username and access token are provided
if [ -n "$REPOSITORY_URL" ]; then
  # Cloning the repository using the provided URL directly
  git clone "$REPOSITORY_URL" /home/app/output

  # Checking whether the clone was successful
  if [ $? -ne 0 ]; then
    echo "Error: Failed to clone the repository."
    exit 1
  fi
elif [ -n "$GIT_USERNAME" ] && [ -n "$GIT_ACCESS_TOKEN" ] && [ -n "$GIT_REPO" ]; then

  AUTHENTICATED_URL="https://$GIT_USERNAME:$GIT_ACCESS_TOKEN@github.com/$GIT_USERNAME/$GIT_REPO.git"
  
  # Clone the repository using the authenticated URL
  git clone "$AUTHENTICATED_URL" /home/app/output

  if [ -n "$GIT_COMMIT_HASH" ]; then
    
    cd /home/app/output && git checkout "$GIT_COMMIT_HASH"
    if [ $? -ne 0 ]; then
      echo "Error: Failed to checkout to commit $COMMIT_HASH."
      exit 1
    fi
    cd ../
  fi
  # Check if the clone was successful
  if [ $? -ne 0 ]; then
    echo "Error: Failed to clone the repository."
    exit 1
  fi
else
  echo "Error: Neither REPOSITORY_URL nor GIT_USERNAME, GIT_ACCESS_TOKEN, and GIT_REPO were provided."
  exit 1
fi


exec node script.js

