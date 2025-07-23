# Contributing to [NITHUB SPACE MANAGEMENT]

Thank you for considering contributing to Nithub Space Management! We welcome all kinds of contributions, including bug reports, feature requests, and code improvements.

## Table of Contents

- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Code Contributions](#code-contributions)
    - [Development Workflow](#development-workflow)
      - [Branch Naming Rules](#branch-naming-rules)
      - [Commit Message Rules](#commit-message-rules)
    - [Submitting Pull Requests](#submitting-pull-requests)

## Getting Started

2. Clone the repository:
   ```sh
   git clone https://github.com/nithubunilag/space-management-fe.git
   ```
3. Navigate to the project directory:
   ```sh
   cd space-management-fe
   ```
4. Install dependencies:
   ```sh
   npm install
   ```
5. Start the local server to preview and interact with the app:
   ```sh
   npm run dev
   ```

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue on [GitHub Issues](https://github.com/[username]/[project-name]/issues) and include as much detail as possible. Provide steps to reproduce, expected and actual behavior, and any relevant logs.

### Suggesting Features

If you have an idea for a new feature, please open an issue on [GitHub Issues](https://github.com/[username]/[project-name]/issues) and describe your proposal. Explain why the feature would be useful and how it should work.

#### Development Workflow

1. Create a new branch for your work:
   ```sh
   git checkout -b feat/Issue_num-your-feature-name
   ```
   ##### Branch Naming Rules
   - You will likely work on features, bug fixes, refactors (restructuring code without changing functionality), chores on the repo (routine tasks such as updating dependencies or changing configurations), or documentation. Each of the type of update should be used as a prefix your branch name as `feat/`, `refactor/`, `fix/`, `chore/`, or `docs/`
   - For any of these updates, you will likely use a ticket or an issue. The ticket number, e.g. FRO-2145 or issue number should also be included in your branch name
   - Finally, a short description for your update should follow suit. This is often taken from the ticket title
   - All of this (except the ticket number acronym, `FRO`) should be written in lowercase
     > Thus, a typical branch should look like `feat/FRO-002-create-login-page` or like `chore/remove-unused-variables` if your update has no corresponding ticket or issue (unlikely)
2. Make your changes, and commit them with descriptive messages:

   ```sh
   git commit -m "feat: your commit message"
   ```

   ##### Commit Message Rules

   Commit messages also follow a similar pattern. However, there is no need to add ticket number since they can be easily tracked given the branch name. Instead, use a colon, `:`, after the type of change (`feat`, `fix`, etc.), a whitespace, then your commit message. In cases where you are required to add the ticket number, you may use a the parenthesis after the type of change, like `feat(FRO-034): your commit message`

   > Another example: `refactor: use a single state for formData` or `refactor(FRO-1234): use a single state for formData`

> Please notice how both branch names an commit messages use the imperative tense. The imperative tense is a command or request, which makes it clear what the commit does. i.e., "fix login issue", NOT "I fixed login issue", and NOT "fixed login issue"

3. Push your branch to the repository:
   ```sh
   git push origin <your-branch>
   ```

#### Submitting Pull Requests

1. Pull the latest changes made to the repo
2. On github, You should see a banner suggesting that you recently pushed a branch and asking if you want to create a pull request.
3. Click "Compare & pull request".
4. Fill in the title and description for your pull request, also include the team name team starlight in the title.
5. Submit the pull request. request for review and wait. DO NOT MERGE YOUR OWN PR!!!!!
6. Run tests and ensure all tests pass:
   ```sh
   npm run test
   ```
   > Make it a habit to run tests before creating pull requests.
7. Submit a pull request from your branch to the upstream repository.
8. In your pull request description, explain what changes you made and why.
