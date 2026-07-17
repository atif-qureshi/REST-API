# REST API

Simple Express API for user management using `MOCK_DATA.json` as storage.

## Install

```bash
npm install
```

## Run

```bash
npm start
```

The server listens on `http://localhost:8000`.

## Endpoints

### GET /api/users
Return all users as JSON.

### GET /api/users/:id
Return a single user by `user_id`.

### POST /api/users
Create a new user.
- Request body must be JSON.
- The server assigns `user_id` automatically.

Example:
```json
{
  "username": "newuser",
  "email": "newuser@example.com"
}
```

### PATCH /api/users/:id
Update existing user fields.
- Request body may include partial data.
- Only provided fields are merged.

### PUT /api/users/:id
Replace an existing user record.
- Request body should contain the full user object.
- `user_id` is preserved.

### DELETE /api/users/:id
Delete a user by `user_id`.

## HTML View

### GET /users
Return a simple HTML list of usernames.

## Notes

- Routes use `express.json()` and `express.urlencoded()`.
- Changes are persisted to `MOCK_DATA.json`.
