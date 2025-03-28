exports.up = (pgm) => {
    pgm.createTable('thread_comment_likes', {
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
    });

    pgm.addConstraint('thread_comment_likes', 'unique_comment_owner', 'UNIQUE(comment_id, owner)');
};

exports.down = (pgm) => {
    pgm.dropTable('thread_comment_likes');
};