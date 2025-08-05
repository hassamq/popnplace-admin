# API Services Documentation

This directory contains the API services for the PopnPlace Admin application. The services are designed to provide a clean and consistent interface for making API calls to the backend.

## Configuration

The API base URL is configured using the `VITE_SERVER_URL` environment variable. Make sure to set this in your `.env` file:

```env
VITE_SERVER_URL=https://dev-api.popnplace.nl
```

**Note:** If `VITE_SERVER_URL` is not set, the service will default to `https://dev-api.popnplace.nl`.

## Available Services

### Auth Service (`authService`)

Handles all authentication-related API calls.

#### Methods

- **`login(credentials)`** - Login user

  ```javascript
  import { authService } from 'src/services/api';

  const credentials = {
    email: 'user@example.com',
    password: 'password123',
  };

  try {
    const response = await authService.login(credentials);
    console.log('Login successful:', response);
  } catch (error) {
    console.error('Login failed:', error);
  }
  ```

- **`getProfile()`** - Get current user profile

  ```javascript
  try {
    const profile = await authService.getProfile();
    console.log('User profile:', profile);
  } catch (error) {
    console.error('Failed to get profile:', error);
  }
  ```

- **`logout()`** - Logout user

  ```javascript
  try {
    await authService.logout();
    console.log('Logout successful');
  } catch (error) {
    console.error('Logout failed:', error);
  }
  ```

- **`refreshToken()`** - Refresh access token
  ```javascript
  try {
    const newToken = await authService.refreshToken();
    console.log('Token refreshed:', newToken);
  } catch (error) {
    console.error('Token refresh failed:', error);
  }
  ```

### User Service (`userService`)

Handles user management API calls.

#### Methods

- **`getUsers(params)`** - Get all users with optional filtering

  ```javascript
  import { userService } from 'src/services/api';

  try {
    const users = await userService.getUsers({
      page: 1,
      limit: 10,
      search: 'john',
    });
    console.log('Users:', users);
  } catch (error) {
    console.error('Failed to get users:', error);
  }
  ```

- **`getUserById(userId)`** - Get user by ID

  ```javascript
  try {
    const user = await userService.getUserById('user-id-123');
    console.log('User:', user);
  } catch (error) {
    console.error('Failed to get user:', error);
  }
  ```

- **`updateUser(userId, userData)`** - Update user

  ```javascript
  try {
    const updatedUser = await userService.updateUser('user-id-123', {
      name: 'John Doe',
      email: 'john@example.com',
    });
    console.log('User updated:', updatedUser);
  } catch (error) {
    console.error('Failed to update user:', error);
  }
  ```

- **`deleteUser(userId)`** - Delete user
  ```javascript
  try {
    await userService.deleteUser('user-id-123');
    console.log('User deleted successfully');
  } catch (error) {
    console.error('Failed to delete user:', error);
  }
  ```

## Using with React Hooks

### useAuth Hook

The `useAuth` hook provides easy access to authentication state and functions:

```javascript
import { useAuth } from 'src/hooks/use-auth';

function MyComponent() {
  const { user, login, logout, authenticated, loading } = useAuth();

  const handleLogin = async () => {
    const result = await login('user@example.com', 'password123');
    if (result.success) {
      console.log('Login successful');
    } else {
      console.error('Login failed:', result.error);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (authenticated) {
    return (
      <div>
        <p>Welcome, {user?.displayName}!</p>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return <button onClick={handleLogin}>Login</button>;
}
```

### useAuthService Hook

For direct access to auth service functions:

```javascript
import { useAuthService } from 'src/hooks/use-auth';

function MyComponent() {
  const { login, logout } = useAuthService();

  // Use login and logout functions directly
}
```

## Error Handling

All service methods include proper error handling and will throw errors that can be caught and handled appropriately:

```javascript
try {
  const result = await authService.login(credentials);
  // Handle success
} catch (error) {
  // Handle error
  console.error('API Error:', error);

  // Error object structure:
  // {
  //   message: 'Error message',
  //   status: 400,
  //   data: { /* additional error data */ }
  // }
}
```

## Authentication Flow

1. **Login**: Call `authService.login()` with email and password
2. **Token Storage**: The service automatically stores the access token in sessionStorage
3. **Automatic Token Injection**: All subsequent API calls automatically include the token in the Authorization header
4. **Token Refresh**: Use `authService.refreshToken()` to get a new token when needed
5. **Logout**: Call `authService.logout()` to clear the token and user session

## API Endpoints

The services use the following API endpoints:

- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user profile
- `POST /api/v1/auth/logout` - Logout user
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

## Example Usage in Components

```javascript
import React, { useState, useEffect } from 'react';
import { authService, userService } from 'src/services/api';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getUsers();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      // Redirect to login page or update UI
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div>
      <h1>User Management</h1>
      <button onClick={handleLogout}>Logout</button>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
```
