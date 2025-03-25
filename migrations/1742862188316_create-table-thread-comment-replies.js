exports.up = (pgm) => {
    pgm.createTable('thread_comment_replies', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        comment_id: {
            type: "VARCHAR(50)",
            notNull: true,
            references: "thread_comments(id)",
            onDelete: "CASCADE",
        },
        owner: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: 'users(id)',
            onDelete: 'CASCADE',
        },
        content: {
            type: "TEXT",
            notNull: true,
        },
        is_deleted: {
            type: "BOOLEAN",
            notNull: true,
            default: false,
        },
        created_at: {
            type: "TIMESTAMP",
            notNull: true,
            default: pgm.func("CURRENT_TIMESTAMP"),
        },
        updated_at: {
            type: "TIMESTAMP",
            notNull: true,
            default: pgm.func("CURRENT_TIMESTAMP"),
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('thread_comment_replies');
};