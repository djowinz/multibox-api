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
        page_cursor -> Text,
        title -> Nullable<Text>,
        background_color -> Nullable<Text>,
        coallapsed -> Bool,
        created_at -> Timestamp,
        updated_at -> Timestamp,
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
    sorting_ranks (group_id, message_id) {
        group_id -> Uuid,
        message_id -> Text,
        rank -> Int4,
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
        grant_token -> Text,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::joinable!(groups -> users (user_id));
diesel::joinable!(inbox_labels -> users (user_id));
diesel::joinable!(messages -> groups (group_id));

diesel::allow_tables_to_appear_in_same_query!(
    audit_logs,
    groups,
    inbox_labels,
    messages,
    sorting_ranks,
    users,
);
