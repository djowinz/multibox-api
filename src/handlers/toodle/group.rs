use axum::extract::{Json, Path, Query, State};
use serde::Deserialize;
use uuid::Uuid;

use crate::domain::models::toodle::groups::{GroupError, GroupModel, GroupWithMessages};
use crate::infra::repositories::group_repository;
use crate::infra::repositories::group_repository::NewGroup;

use crate::AppState;

pub async fn create_group(
    state: State<AppState>,
    new_group: Json<NewGroup>,
) -> Result<Json<GroupModel>, GroupError> {
    let new_group_rec = new_group.clone();
    let new_group_db = group_repository::insert(&state.pool, new_group_rec).await?;
    Ok(Json(new_group_db))
}

#[derive(Deserialize)]
pub struct GroupCursorQuery {
    pub cursor: Option<String>,
}

impl Default for GroupCursorQuery {
    fn default() -> Self {
        Self { cursor: None }
    }
}

pub async fn fetch_groups(
    state: State<AppState>,
    query: Option<Query<GroupCursorQuery>>,
) -> Result<Json<GroupWithMessages>, GroupError> {
    let Query(query) = query.unwrap_or_default();
    let groups =
        group_repository::fetch_all_by_page_cursor(&state.pool, query.cursor.clone()).await?;
    Ok(Json(groups))
}

pub async fn fetch_by_id(
    state: State<AppState>,
    Path(group_id): Path<Uuid>,
) -> Result<Json<GroupModel>, GroupError> {
    let group = group_repository::fetch(&state.pool, group_id).await?;
    Ok(Json(group))
}
