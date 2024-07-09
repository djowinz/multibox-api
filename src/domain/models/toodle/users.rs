use std::time::SystemTime;

use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::Json;
use diesel::{deserialize::Queryable, result::DatabaseErrorKind, Selectable};
use serde::{Deserialize, Serialize};
use serde_json::json;
use uuid::Uuid;

use crate::infra::{db::schema::users, errors::InfraError};

#[derive(Debug, Serialize, Deserialize, PartialEq, Queryable, Selectable, Clone)]
#[diesel(check_for_backend(diesel::pg::Pg))]
#[diesel(table_name = users)]
pub struct UserModel {
    pub id: Uuid,
    pub email: String,
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub created_at: SystemTime,
    pub updated_at: SystemTime,
}

#[derive(Debug)]
pub enum UserError {
    InternalServerError,
    Unauthorized(String),
    NotFound(Option<Uuid>),
    ConflictError(String),
    InfraError(InfraError),
}

pub fn handle_constraint_errors(error: diesel::result::Error, id: Option<Uuid>) -> UserError {
    match error {
        diesel::result::Error::DatabaseError(DatabaseErrorKind::UniqueViolation, error) => {
            UserError::ConflictError(error.message().to_string())
        }
        diesel::result::Error::NotFound => UserError::NotFound(id),
        _ => UserError::InternalServerError,
    }
}

impl IntoResponse for UserError {
    fn into_response(self) -> axum::response::Response {
        let (status, err_msg) = match self {
            Self::NotFound(other_id) => (
                StatusCode::NOT_FOUND,
                format!("User with id {:?} not found", other_id),
            ),
            Self::InfraError(db_error) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Internal server error: {}", db_error),
            ),
            Self::ConflictError(message) => (
                StatusCode::BAD_REQUEST,
                format!("Unprocessable patch error: {}", message),
            ),
            Self::Unauthorized(message) => (
                StatusCode::UNAUTHORIZED,
                format!("Unauthorized: {}", message),
            ),
            _ => (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Internal serve error".to_string(),
            ),
        };
        (
            status,
            Json(
                json!({"resource": "UserModel", "message": err_msg, "happened_at": chrono::Utc::now() }),
            ),
        )
            .into_response()
    }
}
