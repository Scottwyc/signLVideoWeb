# Video Upload Portal

This repository contains a bilingual video submission portal for collecting participant information and guiding users to upload videos through Google Drive.

## What This Project Does

The current implementation uses the simplest deployment architecture:

```text
Static frontend on GitHub Pages
-> Google Apps Script Web App
-> Google Sheet for submission records
-> Google Drive folders for user video uploads
```

Users fill in required information on the webpage:

- Name
- Organization
- Email
- Countries / regions
- Other notes

After submitting the form, the page requests Google Apps Script to:

- create a unique submission ID,
- create a dedicated Google Drive upload folder,
- append the submission information to Google Sheet,
- return the upload folder link to the frontend.

Users then open the Drive folder link and upload one or more video files. After they confirm completion, Apps Script updates the corresponding Google Sheet row and can annotate/rename uploaded Drive files with submission metadata.

## Repository Structure

```text
public/                 Static frontend deployed to GitHub Pages
public/config.js         Frontend Apps Script Web App URL config
apps-script/Code.gs      Google Apps Script backend
docs/                    Chinese documentation in Markdown and Word formats
.github/workflows/       GitHub Actions deployment workflow
```

## Deployment

The frontend is deployed from the `public/` directory to the `gh-pages` branch by GitHub Actions.

GitHub Pages should be configured as:

```text
Source: Deploy from a branch
Branch: gh-pages
Folder: / root
```

After Pages is enabled, the site URL should be:

```text
https://scottwyc.github.io/signLVideoWeb/
```

## Google Apps Script Setup

The Apps Script code is in:

```text
apps-script/Code.gs
```

It must be copied into a Google Apps Script project and deployed as a Web App.

Required IDs are configured at the top of `Code.gs`:

```javascript
const SPREADSHEET_ID = '...';
const ROOT_FOLDER_ID = '...';
```

After deploying the Web App, paste the `/exec` URL into:

```text
public/config.js
```

## Notes

- The Google Drive upload itself happens on Google Drive, not through this static frontend.
- The frontend does not store Google credentials.
- Google Sheet acts as the submission database.
- Google Drive stores each user's uploaded videos in a dedicated folder.
- Do not commit private keys or `.env` files.
