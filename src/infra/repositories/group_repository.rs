use axum::http::StatusCode;
use axum::Json;
use diesel::associations::HasTable;
use diesel::{
    insert_into, BelongingToDsl, ExpressionMethods, GroupedBy, QueryDsl, RunQueryDsl,
    SelectableHelper,
};
use diesel::{prelude::Insertable, query_builder::AsChangeset};
use hex_color::HexColor;
use serde::Deserialize;
use uuid::Uuid;

use crate::domain::models::toodle::groups::GroupWithMessages;
use crate::domain::models::toodle::messages::MessageModel;
use crate::{
    domain::models::toodle::groups::{handle_constraint_errors, GroupError, GroupModel},
    infra::{db::schema::groups, errors::adapt_infra_error},
};

#[derive(Debug, Deserialize, Insertable, Clone)]
#[diesel(table_name = groups)]
pub struct NewGroup {
    pub user_id: Uuid,
    pub message_cursor: String,
    pub page_cursor: Option<String>,
    pub title: Option<String>,
    pub background_color: Option<String>,
    pub collapsed: Option<bool>,
    pub sorting_order: Option<Vec<Option<String>>>,
}

#[derive(Debug, Deserialize, AsChangeset)]
#[diesel(table_name = groups)]
pub struct UpdateGroup {
    pub message_cursor: String,
    pub page_cursor: String,
    pub title: String,
    pub background_color: String,
    pub collapsed: bool,
    pub sorting_order: Vec<Option<String>>,
}

pub async fn fetch_all_by_page_cursor(
    pool: &deadpool_diesel::postgres::Pool,
    cursor: Option<String>,
) -> Result<GroupWithMessages, GroupError> {
    let conn = pool
        .get()
        .await
        .map_err(|op_err| GroupError::InfraError(adapt_infra_error(op_err)))?;

    let groups: Vec<GroupModel> = conn
        .interact(move |conn| {
            let mut query = GroupModel::table().into_boxed();
            if let Some(cursor) = cursor {
                query = query.filter(groups::page_cursor.eq(cursor));
            } else {
                query = query.filter(groups::page_cursor.is_null());
            }
            query.load(conn)
        })
        .await
        .map_err(|conn_err| GroupError::InfraError(adapt_infra_error(conn_err)))? // connection pool error
        .map_err(|int_err| handle_constraint_errors(int_err, None))?;

    let groups_clone = groups.clone();
    let messages: Vec<MessageModel> = conn
        .interact(move |conn| MessageModel::belonging_to(&groups_clone).load::<MessageModel>(conn))
        .await
        .map_err(|conn_err| GroupError::InfraError(adapt_infra_error(conn_err)))? // connection pool error
        .map_err(|int_err| handle_constraint_errors(int_err, None))?;

    let grouped_messages = messages.grouped_by(&groups);

    let res = groups
        .into_iter()
        .zip(grouped_messages)
        .map(|(group, messages)| (group, messages.clone()))
        .collect();
    Ok(GroupWithMessages { groups: res })
}

pub async fn fetch(
    pool: &deadpool_diesel::postgres::Pool,
    id: Uuid,
) -> Result<GroupModel, GroupError> {
    let conn = pool
        .get()
        .await
        .map_err(|op_err| GroupError::InfraError(adapt_infra_error(op_err)))?;

    let res = conn
        .interact(move |conn| {
            groups::table
                .filter(groups::id.eq(id))
                .select(GroupModel::as_select())
                .get_result(conn)
        })
        .await
        .map_err(|conn_err| GroupError::InfraError(adapt_infra_error(conn_err)))? // connection pool error
        .map_err(|int_err| handle_constraint_errors(int_err, Some(id)))?;

    Ok(res)
}

pub async fn insert(
    pool: &deadpool_diesel::postgres::Pool,
    Json(new_group): Json<NewGroup>,
) -> Result<GroupModel, GroupError> {
    let conn = pool
        .get()
        .await
        .map_err(|op_err| GroupError::InfraError(adapt_infra_error(op_err)))?;

    // validate hex color if present
    if let Some(hex_color) = &new_group.background_color {
        if HexColor::parse(hex_color).is_err() {
            return Err(GroupError::BadRequest("Invalid hex color".to_string()));
        }
    }

    let res = conn
        .interact(move |conn| {
            insert_into(groups::table)
                .values(new_group)
                .returning(GroupModel::as_returning())
                .get_result(conn)
        })
        .await
        .map_err(|conn_err| GroupError::InfraError(adapt_infra_error(conn_err)))? // connection pool error
        .map_err(|int_err| handle_constraint_errors(int_err, None))?;

    Ok(res)
}

pub async fn update(
    pool: &deadpool_diesel::postgres::Pool,
    id: Uuid,
    Json(update_group): Json<UpdateGroup>,
) -> Result<GroupModel, GroupError> {
    let conn = pool
        .get()
        .await
        .map_err(|op_err| GroupError::InfraError(adapt_infra_error(op_err)))?;

    let res = conn
        .interact(move |conn| {
            diesel::update(groups::table.filter(groups::id.eq(id)))
                .set(update_group)
                .returning(GroupModel::as_returning())
                .get_result(conn)
        })
        .await
        .map_err(|conn_err| GroupError::InfraError(adapt_infra_error(conn_err)))? // connection pool error
        .map_err(|int_err| handle_constraint_errors(int_err, Some(id)))?;

    Ok(res)
}

pub async fn delete(
    pool: &deadpool_diesel::postgres::Pool,
    id: Uuid,
) -> Result<StatusCode, GroupError> {
    let conn = pool
        .get()
        .await
        .map_err(|op_err| GroupError::InfraError(adapt_infra_error(op_err)))?;

    conn.interact(move |conn| {
        diesel::delete(groups::table.filter(groups::id.eq(id))).execute(conn)
    })
    .await
    .map_err(|conn_err| GroupError::InfraError(adapt_infra_error(conn_err)))? // connection pool error
    .map_err(|int_err| handle_constraint_errors(int_err, Some(id)))?;

    Ok(StatusCode::NO_CONTENT.into())
}
