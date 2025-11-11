# User and Admin Testing Documentation

## Authentication Testing

### User Registration
- [ ] Test registration with valid data
- [ ] Test duplicate email registration
- [ ] Test invalid email format
- [ ] Test password requirements
- [ ] Test required fields validation
- [ ] Test user type assignment (default: "user")

### User Login
- [ ] Test login with valid credentials
- [ ] Test login with invalid password
- [ ] Test login with non-existent email
- [ ] Test JWT token generation
- [ ] Test token expiration (5 days)
- [ ] Test Firebase login integration

### Authentication Middleware
- [ ] Test protected routes with valid token
- [ ] Test expired token handling
- [ ] Test invalid token format
- [ ] Test missing token
- [ ] Test token payload contents

## User Management (Admin)

### User Listing
- [ ] Test fetching all users
- [ ] Test admin exclusion from list
- [ ] Test pagination
- [ ] Test user status filtering
- [ ] Test search functionality

### User Status Management
- [ ] Test activating user account
- [ ] Test deactivating user account
- [ ] Test invalid user ID handling
- [ ] Test admin privileges requirement

## Product Management

### Product Creation
- [ ] Test creating product with valid data
- [ ] Test required fields validation
- [ ] Test image upload functionality
- [ ] Test product type validation
- [ ] Test price format validation
- [ ] Test stock quantity validation

### Product Updates
- [ ] Test updating existing product
- [ ] Test partial updates
- [ ] Test image updates
- [ ] Test invalid product ID handling
- [ ] Test stock quantity updates

### Product Queries
- [ ] Test product search functionality
- [ ] Test category filtering
- [ ] Test type filtering
- [ ] Test pagination
- [ ] Test product details retrieval

## Order Management

### Order Creation
- [ ] Test creating order with valid items
- [ ] Test empty cart handling
- [ ] Test total amount calculation
- [ ] Test stock quantity updates
- [ ] Test cart clearing after order
- [ ] Test order status assignment

### Order Status
- [ ] Test order status updates
- [ ] Test invalid status transitions
- [ ] Test order history retrieval
- [ ] Test order details access

## Cart Management

### Cart Operations
- [ ] Test adding items to cart
- [ ] Test updating cart quantities
- [ ] Test removing items from cart
- [ ] Test cart total calculation
- [ ] Test cart item validation

## Notes Table Schema

| Field         | Type         | Description                                           |
|--------------|--------------|-------------------------------------------------------|
| id           | UUID         | Primary key                                           |
| title        | STRING       | Title of the note                                     |
| content      | TEXT         | Content of the note                                   |
| type         | ENUM         | Type of note (bug, feature, improvement)              |
| priority     | ENUM         | Priority level (low, medium, high)                    |
| status       | ENUM         | Status (open, in-progress, resolved, closed)          |
| assignedTo   | UUID         | Reference to user assigned to the note                |
| createdBy    | UUID         | Reference to user who created the note                |
| createdAt    | TIMESTAMP    | Creation timestamp                                    |
| updatedAt    | TIMESTAMP    | Last update timestamp                                 |
| relatedTo    | STRING       | Reference to related feature/component                |
| tags         | ARRAY        | Array of tags for categorization                      |

## Testing Environment Setup

### Prerequisites
```bash
# Required environment variables
JWT_SECRET=your_jwt_secret
DATABASE_URL=your_database_url
FIREBASE_CONFIG=your_firebase_config
```

### Test Database
- Use separate test database
- Run migrations before tests
- Clear data between test suites
- Use test-specific seeds

### Tools Required
- Jest for unit testing
- Supertest for API testing
- Postman for manual API testing
- Firebase Admin SDK test configuration

## Test Coverage Goals

- Unit Tests: 80% coverage
- Integration Tests: 70% coverage
- E2E Tests: Key user flows
- Performance Tests: Response times under 200ms

## Continuous Integration

- Run tests on every pull request
- Maintain test coverage thresholds
- Automated testing pipeline
- Performance benchmark tracking

## Bug Reporting Template

```markdown
### Bug Description
[Detailed description of the bug]

### Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step 3]

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Environment
- Node Version:
- Database Version:
- Browser (if applicable):

### Additional Notes
[Any additional information]
```