use std::time::SystemTime;

use axum::{http::StatusCode, response::IntoResponse, Json};
use diesel::{
    associations::{Associations, Identifiable},
    Queryable, Selectable,
};
use serde::{Deserialize, Serialize};
use serde_json::json;
use uuid::Uuid;

use super::groups::GroupModel;
use super::users::UserModel;
use crate::infra::{db::schema::messages, errors::InfraError};

#[derive(
    Debug,
    Identifiable,
    Associations,
    Serialize,
    Deserialize,
    PartialEq,
    Queryable,
    Selectable,
    Clone,
)]
#[diesel(check_for_backend(diesel::pg::Pg))]
#[diesel(belongs_to(UserModel, foreign_key = user_id), belongs_to(GroupModel, foreign_key = group_id))]
#[diesel(table_name = messages)]
pub struct MessageModel {
    pub id: Uuid,
    pub user_id: Uuid,
    pub group_id: Uuid,
    pub external_id: String,
    pub subject_override: Option<String>,
    pub created_at: SystemTime,
    pub updated_at: SystemTime,
}

pub enum MessageError {
    InternalServerError,
    NotFound(Uuid),
    InfraError(InfraError),
}

pub fn handle_constraint_errors(error: diesel::result::Error, id: Option<Uuid>) -> MessageError {
    match error {
        diesel::result::Error::NotFound => MessageError::NotFound(id.expect("Id not found")),
        _ => MessageError::InternalServerError,
    }
}

impl IntoResponse for MessageError {
    fn into_response(self) -> axum::response::Response {
        let (status, err_msg) = match self {
            Self::NotFound(other_id) => (
                StatusCode::NOT_FOUND,
                format!("Message with id {:?} not found", other_id),
            ),
            Self::InfraError(db_error) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Internal server error: {}", db_error),
            ),
            _ => (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Internal server error".to_string(),
            ),
        };
        (
            status,
            Json(
                json!({"resource": "GroupModel", "message": err_msg, "happened_at": chrono::Utc::now() }),
            ),
        )
            .into_response()
    }
}
