use axum::{
    extract::{Path, Query, State},
    Extension, Json,
};
use serde::Deserialize;
use uuid::Uuid;

use crate::{
    domain::models::{
        nylas::threads::{ThreadError, ThreadModel},
        toodle::users::UserModel,
    },
    handlers::nylas::threads::{get_threads, ThreadResponse},
    infra::repositories::inbox_grant_repository::fetch_inbox_by_id,
    AppState,
};

#[derive(Debug, Deserialize)]
pub struct ThreadsSortedResponse {
    pub messages: Vec<ThreadModel>,
    pub next_cursor: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct FetchThreadsByGrantQuery {
    pub limit: i32,
    pub cursor: Option<String>,
}

impl Default for FetchThreadsByGrantQuery {
    fn default() -> Self {
        Self {
            limit: 10,
            cursor: None,
        }
    }
}

pub async fn fetch_threads_by_grant(
    Extension(user): Extension<UserModel>,
    state: State<AppState>,
    Path(inbox_id): Path<Uuid>,
    query: Option<Query<FetchThreadsByGrantQuery>>,
) -> Result<Json<ThreadResponse>, ThreadError> {
    let Query(query) = query.unwrap_or_default();
    let inbox_grant = fetch_inbox_by_id(&state.pool, user.id.clone(), inbox_id).await;
    let inbox_grant = match inbox_grant {
        Ok(inbox_grant) => inbox_grant,
        Err(_e) => {
            return Err(ThreadError::InfraError(
                "Failed to fetch inbox grant".to_string(),
            ))
        }
    };
    let threads = get_threads(state, inbox_grant.grant_id, query.limit, query.cursor).await?;
    Ok(Json(threads))
}
