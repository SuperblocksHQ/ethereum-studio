Superblocks.com Web server
============================

Simple _NodeJS Express_ server used to serve the Superblocks dashboard in a production environment.

## Testing locally (unit tests)

```
npm run test
```

## Testing locally (integration)

### Settings

Enter the _test_ directory:
```
cd test/tools
```

Check the set up is OK by running the verification program:
```
./03_check_test_requirements_ready.sh
```

In case the tests return `NOT FOUND`, then proceed with the steps below. Otherwise, skip to the _Running tests_ sub-section.
Note: it is recommended to work with clean databases to prevent duplicated entries getting on the way of newer registries, which may or may not result in services referencing undesired documents.


```
./00_db_insert_test_organization.sh
```

Example output:
```
[...]
{ "_id" : ObjectId("5d4803774b63a7cd9716533a"), "name" : "badge-feature-test", "description" : null, "displayName" : "BadgeFeatureTest", "members" : [ { "id" : "0", "userId" : "0", "addedAt" : ISODate("2019-07-26T00:00:00Z"), "email" : null, "role" : "OWNER", "state" : "ADDED" } ], "createdAt" : ISODate("2019-07-26T00:00:00Z"), "lastModifiedAt" : ISODate("2019-07-26T00:00:00Z") }
```

Save the `_id` and use it as input to the next command which will create two projects. The first project will be used to store a success badge. The second project will be used to store the failed badge:

```
./01_db_insert_test_project.sh 5d4803774b63a7cd9716533a
```

Example output:
```
[...]
{ "_id" : ObjectId("5d48038a7d36d73c6a010f18"), "name" : "badge-feature-test-local-project-success", "displayName" : "badge-feature-test-local-project", "description" : "A local project to test the badge feature", "ownerId" : "5d4803774b63a7cd9716533a", "ownerType" : "organization", "createdAt" : ISODate("2019-07-26T00:00:00Z"), "lastModifiedAt" : ISODate("2019-07-26T00:00:00Z"), "vcsUrl" : "https://github.com/superblockshq/local-sb-test.git", "vcsType" : "github" }
[...]
{ "_id" : ObjectId("5d48038bd9e353d1d7404418"), "name" : "badge-feature-test-local-project-failed", "displayName" : "badge-feature-test-local-project", "description" : "A local project to test the badge feature", "ownerId" : "5d4803774b63a7cd9716533a", "ownerType" : "organization", "createdAt" : ISODate("2019-07-26T00:00:00Z"), "lastModifiedAt" : ISODate("2019-07-26T00:00:00Z"), "vcsUrl" : "https://github.com/superblockshq/local-sb-test.git", "vcsType" : "github" }
```

Save the projects identifiers (`_id`) `5d48038a7d36d73c6a010f18` and `5d48038bd9e353d1d7404418` for the very last set of commands which are going to create and set the pipeline statuses accordingly. Create and set pipeline status for the first project as success by passing in the organization id and the project id, respectively:

```
./02_db_insert_test_pipeline.sh 5d4803774b63a7cd9716533a 5d48038a7d36d73c6a010f18 success
```

Example output:
```
{ "_id" : ObjectId("5d4803a7e1b70b629b2cb778"), "projectId" : "5d48038a7d36d73c6a010f18", "commit" : { "ownerAvatar" : "", "ownerName" : "SuperblocksHQ", "repository" : { "name" : "local-sb-test", "fullName" : "superblockshq/local-sb-test", "htmlUrl" : "https://github.com/superblockshq/local-sb-test", "cloneUrl" : "https://github.com/superblocks/local-sb-test.git" }, "description" : "Update test", "hash" : "2465719b3290305354ee7093c50a5eee24d0fb50", "branch" : "master", "branchUrl" : "https://github.com/superblocks/local-sb-test/tree/master", "commitUrl" : "https://github.com/superblocks/local-sb-test/commit/2465719b3290305354ee7093c50a5eee24d0fb50", "vcsType" : "github", "vcsData" : { "installationId" : 1111169, "checkRunId" : 178195981 } }, "config" : { "jobs" : [ { "image" : "node", "script" : [ "echo \"OK\"" ], "branch" : "master", "name" : "my custom job" } ], "isValid" : true }, "jobs" : [ { "id" : "5d3b0fbd5a3cd94ebfd1eed5", "status" : null, "duration" : null } ], "createdAt" : ISODate("2019-08-05T10:23:35Z"), "startedAt" : null, "finishedAt" : null, "ownerId" : "5d4803774b63a7cd9716533a", "ownerType" : "organization", "status" : "success" }
```

Then, create and set pipeline status of the first project to failed:
```
./02_db_insert_test_pipeline.sh 5d4803774b63a7cd9716533a 5d48038bd9e353d1d7404418 failed
```
Example output:
```
{ "_id" : ObjectId("5d4803b7945b7178e3fd7976"), "projectId" : "5d48038bd9e353d1d7404418", "commit" : { "ownerAvatar" : "", "ownerName" : "SuperblocksHQ", "repository" : { "name" : "local-sb-test", "fullName" : "superblockshq/local-sb-test", "htmlUrl" : "https://github.com/superblockshq/local-sb-test", "cloneUrl" : "https://github.com/superblocks/local-sb-test.git" }, "description" : "Update test", "hash" : "2465719b3290305354ee7093c50a5eee24d0fb50", "branch" : "master", "branchUrl" : "https://github.com/superblocks/local-sb-test/tree/master", "commitUrl" : "https://github.com/superblocks/local-sb-test/commit/2465719b3290305354ee7093c50a5eee24d0fb50", "vcsType" : "github", "vcsData" : { "installationId" : 1111169, "checkRunId" : 178195981 } }, "config" : { "jobs" : [ { "image" : "node", "script" : [ "echo \"OK\"" ], "branch" : "master", "name" : "my custom job" } ], "isValid" : true }, "jobs" : [ { "id" : "5d3b0fbd5a3cd94ebfd1eed5", "status" : null, "duration" : null } ], "createdAt" : ISODate("2019-08-05T10:23:51Z"), "startedAt" : null, "finishedAt" : null, "ownerId" : "5d4803774b63a7cd9716533a", "ownerType" : "organization", "status" : "failed" }
```

Finally, check the set up was successful by running a verification:
```
./03_check_test_requirements_ready.sh
```

Expected output:
```
badge-feature-test organization: OK
badge-feature-test-local-project-success: OK
badge-feature-test-local-project-failed: OK
```

### Running tests
```
npm run test:integration
```

Example output:
```
Superblocks Dashboard is listening on port 8080
Public directory path set to [...]/superblocks-client/packages/dashboard/public
  Test /:organizationName/projects/:projectName.svg
getBuildStatus for organization badge-feature-test(5d480a8f765142cbc2743cba) project badge-feature-test-local-project-success(5d480aa5418f9938ef2040ab) branch master: success
    ✓ Should successfully retrieve a success badge: GET /badge-feature-test/projects/badge-feature-test-local-project-success.svg (73ms)
getBuildStatus for organization badge-feature-test(5d480a8f765142cbc2743cba) project badge-feature-test-local-project-success(5d480aa5418f9938ef2040ab) branch master: success
    ✓ Should successfully retrieve a success badge for specific branch (master): GET /badge-feature-test/projects/badge-feature-test-local-project-success.svg
    ✓ Should fail to retrieve a success badge due to missing branch query string: GET /badge-feature-test/projects/badge-feature-test-local-project-success.svg
    ✓ Should successfully retrieve an unknown badge for invalid branch (gukybsh): GET /badge-feature-test/projects/badge-feature-test-local-project-success.svg
getBuildStatus for organization badge-feature-test(5d480a8f765142cbc2743cba) project badge-feature-test-local-project-failed(5d480aa5340c94b8697b0a0e) branch master: failed
    ✓ Should successfully retrieve a failed badge: GET /badge-feature-test/projects/badge-feature-test-local-project-failed.svg
    ✓ Should successfully retrieve an unknown badge for invalid project (badge-feature-test/ykepqhesyb): GET /badge-feature-test/projects/ykepqhesyb.svg
    ✓ Should successfully retrieve an unknown badge for invalid organization (kihrut/ykepqhesyb): GET /kihrut/projects/ykepqhesyb.svg


  7 passing (197ms)

Done in 4.46s.
```

## Run local environment

### Settings
Customize the `.env` file if necessary.

### Run
```
npm i && npm run start
```
