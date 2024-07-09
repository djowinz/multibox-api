use axum::{
    extract::{Json, Path, State},
    http::StatusCode,
    Extension,
};
use serde::Deserialize;
use uuid::Uuid;

use crate::domain::models::toodle::users::{UserError, UserModel};
use crate::infra::repositories::user_repository::{self, NewUser, UpdateUser};

use crate::AppState;

#[derive(Deserialize, Clone)]
pub struct NewUserAuth {
    pub email: String,
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub hash: String,
}

pub async fn fetch_user(
    state: State<AppState>,
    Path(user_id): Path<Uuid>,
) -> Result<Json<UserModel>, UserError> {
    let user = user_repository::fetch(&state.pool, user_id.clone()).await?;
    Ok(Json(user))
}

pub async fn fetch_self(
    Extension(user): Extension<UserModel>,
) -> Result<Json<UserModel>, UserError> {
    Ok(Json(user))
}

pub async fn create_user(
    state: State<AppState>,
    new_user: Json<NewUserAuth>,
) -> Result<Json<UserModel>, UserError> {
    // decrypt the hash and validate authenticity
    let user_hash = new_user.hash.clone();
    if user_hash != state.config.authorization_key() {
        return Err(UserError::Unauthorized(
            "Invalid authorization key".to_string(),
        ));
    }

    let new_user_rec = NewUser {
        email: new_user.email.clone(),
        first_name: new_user.first_name.clone(),
        last_name: new_user.last_name.clone(),
    };
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
