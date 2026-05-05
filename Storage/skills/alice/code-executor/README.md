# Python Code Executor

A secure environment for running generated Python code. It uses Docker to spin up an isolated container for each execution to prevent any malicious operations.

## Security Features

- Network access disabled by default
- 10-second timeout
- Maximum memory limit of 256MB
- Read-only file system
