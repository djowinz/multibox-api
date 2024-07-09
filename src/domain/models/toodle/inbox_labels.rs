use axum::{http::StatusCode, response::IntoResponse, Json};
use diesel::{deserialize::Queryable, Selectable};
use serde::{Deserialize, Serialize};
use serde_json::json;
use uuid::Uuid;

use crate::infra::{db::schema::inbox_labels, errors::InfraError};

#[derive(Debug, Serialize, Deserialize, PartialEq, Queryable, Selectable)]
#[diesel(check_for_backend(diesel::pg::Pg))]
#[diesel(belongs_to(UserModel))]
#[diesel(table_name = inbox_labels)]
pub struct InboxLabelModel {
    pub id: Uuid,
    pub user_id: Uuid,
    pub name: String,
    pub label_id: String,
}

#[derive(Debug)]
pub enum InboxLabelError {
    InternalServerError,
    NotFound(Uuid),
    InfraError(InfraError),
}

pub fn handle_constraint_errors(error: diesel::result::Error, id: Option<Uuid>) -> InboxLabelError {
    match error {
        diesel::result::Error::NotFound => InboxLabelError::NotFound(id.expect("Id not found")),
        _ => InboxLabelError::InternalServerError,
    }
}

impl IntoResponse for InboxLabelError {
    fn into_response(self) -> axum::response::Response {
        let (status, err_msg) = match self {
            Self::NotFound(other_id) => (
                StatusCode::NOT_FOUND,
                format!("Inbox label with id {:?} not found", other_id),
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
                json!({"resource": "InboxLabelModel", "message": err_msg, "happened_at": chrono::Utc::now() }),
            ),
        )
            .into_response()
    }
}
