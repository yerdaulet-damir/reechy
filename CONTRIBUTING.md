# Contributing to Reechy

First off, thank you for considering contributing to Reechy! It's people like you that make Reechy such a great tool.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)

## Code of Conduct

This project and everyone participating in it is governed by the basic principle of **be respectful and constructive**. We're all here to build something great together.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the expected behavior**
- **Share your environment details** (OS, browser, Node.js version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List some examples of how this feature would be used**
- **Include mockups or screenshots if applicable**

### Pull Requests

Pull requests are the best way to propose changes to the codebase. We actively welcome your PRs.

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

## Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/reechy.git
   cd reechy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Copy environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Make your changes**
   - Create a branch for your work: `git checkout -b feature/your-feature-name`
   - Make your changes following our [Coding Standards](#coding-standards)
   - Test thoroughly

## Pull Request Process

1. **Ensure your PR description clearly describes the problem and solution**
2. **Include the relevant issue number** if applicable
3. **Update documentation** if you've changed functionality
4. **Add tests** for new features or bug fixes
5. **Ensure all tests pass** before submitting

### PR Review Process

1. Automated checks (linting, tests) must pass
2. Code review by maintainers
3. Address any feedback or requested changes
4. Once approved, your PR will be merged

## Coding Standards

### TypeScript
- Use TypeScript for all new files
- Avoid `any` types when possible
- Use proper type definitions for props and function returns

### Naming Conventions
- **Components:** PascalCase (e.g., `VideoRecorder.tsx`)
- **Functions:** camelCase (e.g., `handleRecordClick`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `MAX_RECORDING_TIME`)
- **Files:** kebab-case (e.g., `video-recorder.tsx`)

### Code Style
- Follow the existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused
- Use early returns to reduce nesting

### Component Structure
```tsx
// 1. Imports
import { useState } from 'react'

// 2. Types/Interfaces
interface Props {
  // ...
}

// 3. Component
export function MyComponent({ ...props }: Props) {
  // 3a. Hooks
  const [state, setState] = useState()

  // 3b. Event handlers
  const handleClick = () => {
    // ...
  }

  // 3c. Derived values
  const computedValue = useMemo(() => {
    // ...
  }, [dependencies])

  // 3d. Render
  return (
    <div>...</div>
  )
}
```

### Commit Messages

Follow conventional commits format:
- `feat:` - A new feature
- `fix:` - A bug fix
- `docs:` - Documentation only changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Example:
```
feat(recorder): add pause/resume functionality

- Add pause button to video recorder
- Implement pause state management
- Update UI to show recording status
```

## Questions?

Feel free to open an issue with the `question` label, and we'll do our best to help!

---

**Thank you for your contributions! 🎉**
