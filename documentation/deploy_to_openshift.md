# How to deploy to OpenShift

This guide explains how to deploy the application to OpenShift and configure the required secrets.

## 1. Prerequisites

Before you begin, make sure you are logged in to the correct OpenShift cluster at https://api.ocp-prod-0.k8s.it.helsinki.fi:6443 and that the `ohtuprojekti-staging` project is selected. The manifests assume that the application is deployed to this cluster and project.

## 2. Create the Secret

Run the following command to create a secret:

```bash
oc create secret generic rate-repository-api --dry-run=client -o yaml | oc apply -f -
```

This creates a Secret named _rate-repository-api_ if it does not already exist.

## 3. Configure the required secrets

Set a value for `JWT_SECRET`:

```bash
oc set data secret/rate-repository-api JWT_SECRET='<some-value>'
```

Replace `<some-value>` with any non-empty string of your choice. In this project, the SQLite database is recreated when the container is restarted, so existing tokens will become invalid anyway. Because of that, `JWT_SECRET` does not need to be as persistent here as it would in a real production deployment.

To use the GitHub API with a higher rate limit, also set `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`, as described in the [Getting started](../README.md#-getting-started) section of the README. You can use `fullstack-hy` organization's existing OAuth App credentials for `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`. You will find them in GitHub page of `fullstack-hy` organization under Settings > Developer settings > OAuth Apps > Rate Repository API.

To set values, run:

```bash
oc set data secret/rate-repository-api GITHUB_CLIENT_ID='<client-id>'
```

```bash
oc set data secret/rate-repository-api GITHUB_CLIENT_SECRET='<client-secret>'
```

## 4. Apply the OpenShift resources

From the repository root, apply the manifests with:

```bash
oc apply -f manifests/
```

This deploys the required OpenShift resources, including the Service, Route, ImageStream, Deployment, and CronJob.

## 5. Verify application availability

The Rate Repository API should now be configured correctly, and it should be available through the created OpenShift Route at https://rate-repository-api.ext.ocp-prod-0.k8s.it.helsinki.fi/.

# Automatic image builds in GitHub Actions

This repository uses GitHub Actions for continuous integration on every push. Linting and tests are run automatically for each push, and when a commit is pushed to the `master` branch, the Docker image is built and pushed automatically.

The Docker account to be used is defined using the GitHub secrets `DOCKER_PASSWORD` and `DOCKER_USERNAME`.
