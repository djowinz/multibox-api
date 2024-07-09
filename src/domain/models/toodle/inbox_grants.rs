use crate::infra::{db::schema::inbox_grants, errors::InfraError};
use axum::{http::StatusCode, response::IntoResponse, Json};
use diesel::{
    associations::{Associations, Identifiable},
    deserialize::Queryable,
    Selectable,
};
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::time::SystemTime;
use uuid::Uuid;

use super::users::UserModel;

#[derive(
    Debug,
    Associations,
    Identifiable,
    Serialize,
    Deserialize,
    PartialEq,
    Queryable,
    Selectable,
    Clone,
)]
#[diesel(check_for_backend(diesel::pg::Pg))]
#[diesel(belongs_to(UserModel, foreign_key = user_id))]
#[diesel(table_name = inbox_grants)]
pub struct InboxGrantModel {
    pub id: Uuid,
    pub user_id: Uuid,
    pub grant_token: String,
    pub grant_id: Uuid,
    pub refresh_token: String,
    pub email_provider: String,
    pub created_at: SystemTime,
    pub updated_at: SystemTime,
}

#[derive(Debug)]
pub enum InboxGrantError {
    InternalServerError,
    NotFound(Uuid),
    InfraError(InfraError),
    NylasError(String),
}

pub fn handle_constraint_errors(error: diesel::result::Error, id: Option<Uuid>) -> InboxGrantError {
    match error {
        diesel::result::Error::NotFound => InboxGrantError::NotFound(id.expect("Id not found")),
        _ => InboxGrantError::InternalServerError,
    }
}

impl IntoResponse for InboxGrantError {
    fn into_response(self) -> axum::response::Response {
        let (status, err_msg) = match self {
            Self::NotFound(other_id) => (
                StatusCode::NOT_FOUND,
                format!("Inbox grant with id {:?} not found", other_id),
            ),
            Self::InfraError(db_error) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Internal server error: {}", db_error),
            ),
            Self::NylasError(message) => (
                StatusCode::FAILED_DEPENDENCY,
                format!("Nylas service error: {}", message),
            ),
            _ => (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Internal server error".to_string(),
            ),
        };
        (
            status,
            Json(
                json!({"resource": "InboxGrantModel", "message": err_msg, "happened_at": chrono::Utc::now() }),
            ),
        )
            .into_response()
    }
}
