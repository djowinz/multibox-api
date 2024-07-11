// @generated automatically by Diesel CLI.

diesel::table! {
    audit_logs (id) {
        id -> Uuid,
        user_id -> Uuid,
        action -> Text,
        table_name -> Text,
        row_id -> Uuid,
        created_at -> Timestamp,
    }
}

diesel::table! {
    groups (id) {
        id -> Uuid,
        user_id -> Uuid,
        message_cursor -> Text,
        page_cursor -> Nullable<Text>,
        title -> Nullable<Text>,
        background_color -> Nullable<Text>,
        collapsed -> Bool,
        created_at -> Timestamp,
        updated_at -> Timestamp,
        sorting_order -> Nullable<Array<Nullable<Text>>>,
    }
}

diesel::table! {
    inbox_grants (id) {
        id -> Uuid,
        user_id -> Uuid,
        grant_token -> Text,
        refresh_token -> Text,
        email_provider -> Text,
        created_at -> Timestamp,
        updated_at -> Timestamp,
        grant_id -> Uuid,
        email -> Text,
    }
}

diesel::table! {
    inbox_labels (id) {
        id -> Uuid,
        user_id -> Uuid,
        name -> Text,
        label_id -> Text,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    messages (id) {
        id -> Uuid,
        group_id -> Uuid,
        user_id -> Uuid,
        external_id -> Text,
        subject_override -> Nullable<Text>,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    users (id) {
        id -> Uuid,
        email -> Text,
        first_name -> Nullable<Text>,
        last_name -> Nullable<Text>,
        created_at -> Timestamp,
        updated_at -> Timestamp,
        last_login -> Nullable<Timestamp>,
    }
}

diesel::joinable!(groups -> users (user_id));
diesel::joinable!(inbox_grants -> users (user_id));
diesel::joinable!(inbox_labels -> users (user_id));
diesel::joinable!(messages -> groups (group_id));
diesel::joinable!(messages -> users (user_id));

diesel::allow_tables_to_appear_in_same_query!(
    audit_logs,
    groups,
    inbox_grants,
    inbox_labels,
    messages,
    users,
);
