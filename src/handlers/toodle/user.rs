use axum::{
    extract::{Json, Path, State},
    http::StatusCode,
};
use uuid::Uuid;

use crate::domain::models::toodle::users::{UserError, UserModel};
use crate::infra::repositories::user_repository::{self, NewUser, UpdateUser};

use crate::AppState;

pub async fn fetch_user(
    state: State<AppState>,
    Path(user_id): Path<Uuid>,
) -> Result<Json<UserModel>, UserError> {
    let user = user_repository::fetch(&state.pool, user_id.clone()).await?;
    Ok(Json(user))
}

pub async fn create_user(
    state: State<AppState>,
    new_user: Json<NewUser>,
) -> Result<Json<UserModel>, UserError> {
    let new_user_rec = new_user.clone();
    let new_user_db = user_repository::insert(&state.pool, new_user_rec).await?;
    Ok(Json(new_user_db))
}

pub async fn update_user(
    state: State<AppState>,
    Path(user_id): Path<Uuid>,
    update_user: Json<UpdateUser>,
) -> Result<Json<UserModel>, UserError> {
    let update_user_rec = update_user.clone();
    let update_user_db =
        user_repository::update(&state.pool, user_id.clone(), update_user_rec).await?;
    Ok(Json(update_user_db))
}

pub async fn delete_user(
    state: State<AppState>,
    Path(user_id): Path<Uuid>,
) -> Result<StatusCode, UserError> {
    user_repository::delete(&state.pool, user_id.clone()).await?;
    Ok(StatusCode::NO_CONTENT)
}
