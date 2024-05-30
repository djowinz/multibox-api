use std::time::SystemTime;

use crate::infra::{db::schema::groups, errors::InfraError};

use axum::{http::StatusCode, response::IntoResponse, Json};
use diesel::associations::Identifiable;
use diesel::{associations::Associations, deserialize::Queryable, Selectable};
use serde::{Deserialize, Serialize};
use serde_json::json;
use uuid::Uuid;

use super::messages::MessageModel;
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
#[diesel(table_name = groups)]
pub struct GroupModel {
    pub id: Uuid,
    pub user_id: Uuid,
    pub message_cursor: String,
    pub page_cursor: Option<String>,
    pub title: Option<String>,
    pub background_color: Option<String>,
    pub collapsed: bool,
    pub created_at: SystemTime,
    pub updated_at: SystemTime,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct GroupWithMessages {
    pub groups: Vec<(GroupModel, Vec<MessageModel>)>,
}

#[derive(Debug)]
pub enum GroupError {
    InternalServerError,
    NotFound(Uuid),
    BadRequest(String),
    InfraError(InfraError),
}

pub fn handle_constraint_errors(error: diesel::result::Error, id: Option<Uuid>) -> GroupError {
    match error {
        diesel::result::Error::NotFound => GroupError::NotFound(id.expect("Id not found")),
        _ => GroupError::InternalServerError,
    }
}

impl IntoResponse for GroupError {
    fn into_response(self) -> axum::response::Response {
        let (status, err_msg) = match self {
            Self::NotFound(other_id) => (
                StatusCode::NOT_FOUND,
                format!("Group with id {:?} not found", other_id),
            ),
            Self::InfraError(db_error) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Internal server error: {}", db_error),
            ),
            Self::BadRequest(message) => (
                StatusCode::BAD_REQUEST,
                format!("Unprocessable patch error: {}", message),
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
