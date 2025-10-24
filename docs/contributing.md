# Contributing Guide

Thank you for your interest in contributing to WTF Should I Eat?!

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Google Gemini API key

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env.local` file:
   ```bash
   GEMINI_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Development Workflow

### Code Style

- Use TypeScript for all new code
- Follow existing code patterns
- Use functional components with hooks
- Prefer named exports over default exports

### Component Structure

```typescript
import React from 'react';
import type { ComponentProps } from '../types';

interface ComponentProps {
  // Define props
}

export const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Component logic
  return (
    // JSX
  );
};
```

### File Naming

- Components: PascalCase (e.g., `RestaurantCard.tsx`)
- Utilities: camelCase (e.g., `sortUtils.ts`)
- Types: camelCase (e.g., `types.ts`)
- Constants: camelCase (e.g., `constants.ts`)

## Git Workflow

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `perf`: Performance improvement
- `refactor`: Code refactoring
- `docs`: Documentation changes
- `style`: Code style changes
- `test`: Test additions/changes
- `chore`: Maintenance tasks

**Examples:**
```
feat(search): add cuisine filter
fix(card): correct phone number display
perf(list): optimize rendering with React.memo
docs: update API documentation
```

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `perf/description` - Performance improvements
- `docs/description` - Documentation updates

## Testing

### Manual Testing

1. Test search functionality with various inputs
2. Verify error handling
3. Check responsive design on different screen sizes
4. Test with different API response scenarios

### Performance Testing

1. Use browser DevTools Performance tab
2. Monitor re-render counts
3. Check memory usage
4. Verify smooth streaming behavior

## Pull Request Process

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Update documentation if needed
5. Submit a pull request with:
   - Clear description of changes
   - Screenshots if UI changes
   - Reference to any related issues

### PR Checklist

- [ ] Code follows existing patterns
- [ ] TypeScript types are correct
- [ ] No console errors or warnings
- [ ] Documentation updated
- [ ] Performance considerations addressed
- [ ] Commit messages follow conventions

## Code Review Guidelines

### What We Look For

- **Correctness**: Does the code work as intended?
- **Performance**: Are there any performance regressions?
- **Maintainability**: Is the code easy to understand?
- **Consistency**: Does it follow project conventions?
- **Documentation**: Are complex parts documented?

### Review Process

1. Automated checks pass
2. At least one approval required
3. Address feedback promptly
4. Squash commits before merging

## Adding New Features

### Before Starting

1. Check existing issues/PRs
2. Discuss major changes in an issue first
3. Get approval before starting large features

### Implementation Steps

1. Create feature branch
2. Implement feature
3. Add tests if applicable
4. Update documentation
5. Submit PR

## Bug Reports

### Reporting Bugs

Include:
- Description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser/OS information
- Screenshots if applicable

### Bug Fix Process

1. Create issue describing the bug
2. Assign yourself if fixing
3. Create fix branch
4. Implement fix
5. Test thoroughly
6. Submit PR with fix

## Performance Guidelines

### Do's

- Use React.memo for expensive components
- Batch state updates when possible
- Use refs for non-reactive values
- Defer expensive operations
- Clean up timeouts/intervals

### Don'ts

- Don't cause unnecessary re-renders
- Don't sort on every state update
- Don't use index as key for lists
- Don't forget to clean up effects
- Don't ignore performance implications

## Documentation

### When to Update Docs

- Adding new features
- Changing API signatures
- Adding new utilities
- Performance optimizations
- Architecture changes

### Documentation Files

- `README.md` - Project overview
- `docs/architecture.md` - System architecture
- `docs/api.md` - API documentation
- `docs/performance.md` - Performance guide
- `docs/contributing.md` - This file

## Questions?

Feel free to:
- Open an issue for questions
- Start a discussion
- Reach out to maintainers

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.
