# Contributing to DepFlow

Thank you for considering contributing to DepFlow! This document provides guidelines and information for contributors.

## 🎯 How to Contribute

### **Reporting Issues**
- Use the GitHub issue tracker to report bugs
- Include detailed steps to reproduce the issue
- Provide information about your environment (OS, Node.js version, browser)
- Include screenshots if applicable

### **Suggesting Features**
- Open a feature request issue
- Clearly describe the feature and its benefits
- Provide use cases and examples
- Be open to discussion and feedback

### **Code Contributions**

#### **Getting Started**
1. Fork the repository
2. Clone your fork locally
3. Install dependencies: `cd backend && npm install`
4. Create a new branch: `git checkout -b feature/your-feature-name`
5. Make your changes
6. Test your changes thoroughly
7. Commit with a clear message
8. Push to your fork
9. Create a Pull Request

#### **Development Setup**
```bash
# Clone your fork
git clone https://github.com/your-username/depflow.git
cd depflow

# Install dependencies
cd backend
npm install

# Start development server
npm run dev

# Access at http://localhost:8000
```

## 📋 Code Standards

### **JavaScript Style Guide**
- Use modern ES6+ syntax
- Follow consistent indentation (2 spaces)
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### **Example:**
```javascript
// Good
function createDependency(name, description, team) {
  if (!name || !description) {
    throw new Error('Name and description are required');
  }
  
  return {
    id: generateId(),
    name,
    description,
    team,
    status: 'NOT STARTED',
    priority: 'MEDIUM',
    createdAt: new Date().toISOString()
  };
}

// Avoid
function createDep(n, d, t) {
  return {id: Math.random(), name: n, desc: d, team: t, status: 'NOT STARTED'};
}
```

### **CSS Guidelines**
- Use consistent naming conventions
- Group related properties together
- Use CSS variables for colors and spacing
- Write mobile-first responsive code

### **HTML Best Practices**
- Use semantic HTML elements
- Include proper accessibility attributes
- Ensure proper heading hierarchy
- Add alt text for images

## 🧪 Testing

### **Before Submitting**
- [ ] Manual testing with both admin and user accounts
- [ ] Test all CRUD operations
- [ ] Verify email functionality (if changed)
- [ ] Test responsive design on different screen sizes
- [ ] Check browser compatibility
- [ ] Ensure no console errors

### **Testing Checklist**
```bash
# Server health check
curl http://localhost:8000/api/v1/health

# Login test
# Use demo credentials: admin@demo.com / admin123456

# Feature testing
- Add new dependency
- Edit existing dependency
- Delete dependency (admin only)
- Filter dependencies
- Search functionality
- Email notifications
```

## 📝 Pull Request Guidelines

### **Before Creating a PR**
- Ensure your code follows the style guidelines
- Test your changes thoroughly
- Update documentation if needed
- Add/update comments for complex code
- Ensure no merge conflicts

### **PR Description Template**
```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Testing
- [ ] Manual testing completed
- [ ] All existing features still work
- [ ] New functionality tested

## Screenshots (if applicable)
Add screenshots for UI changes.

## Additional Notes
Any additional information or context.
```

## 🎨 Design Guidelines

### **Color Palette**
Use the established light color scheme:
- **Status Colors**: Soft greens, blues, corals, and slate
- **Priority Colors**: Light coral, amber, and mint green
- **UI Colors**: Professional grays and blues

### **Typography**
- Use system fonts for performance
- Maintain consistent font sizes and weights
- Ensure good contrast ratios for accessibility

### **Layout**
- Follow existing spacing patterns
- Maintain responsive design principles
- Keep interface clean and uncluttered

## 🔧 Architecture Guidelines

### **Backend Changes**
- Follow RESTful API conventions
- Use proper HTTP status codes
- Include error handling
- Validate all inputs
- Document new endpoints

### **Frontend Changes**
- Keep JavaScript modular
- Use consistent event handling patterns
- Maintain state management patterns
- Ensure proper error handling

### **Database Considerations**
- Current system uses in-memory storage
- Consider data persistence implications
- Plan for future database integration

## 📚 Documentation

### **Code Documentation**
- Add JSDoc comments for functions
- Document complex algorithms
- Explain business logic
- Include usage examples

### **User Documentation**
- Update README.md for new features
- Add setup instructions for new dependencies
- Include troubleshooting information
- Provide configuration examples

## 🚀 Release Process

### **Versioning**
We follow Semantic Versioning (SemVer):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### **Version Backups**
- Create version backup in `versions/` directory
- Include comprehensive documentation
- Test restore process

## ❓ Getting Help

### **Questions**
- Check existing issues and documentation first
- Use GitHub Discussions for general questions
- Create an issue for specific problems

### **Contact**
- Email: mahipal.appen@gmail.com
- GitHub Issues: For bugs and feature requests
- GitHub Discussions: For general questions

## 🎉 Recognition

Contributors will be acknowledged in:
- README.md contributors section
- Release notes
- Project documentation

## 📋 Checklist for Contributors

Before submitting your contribution:

- [ ] Read and understand this contributing guide
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Existing functionality not broken
- [ ] New functionality tested
- [ ] Documentation updated (if needed)
- [ ] Commit messages are clear
- [ ] PR template filled out completely

Thank you for contributing to DepFlow! 🎯✨
