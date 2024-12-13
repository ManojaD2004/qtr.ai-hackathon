create table if not exists ping (
   pong varchar(255)
);

delete from ping
 where true;
insert into ping values ( "Yes, DB is connected, and is Working!" );

create table if not exists users (
   id         serial primary key,
   email_id   varchar(255) not null,
   user_name  varchar(255) not null,
   user_img   varchar(255) not null,
   created_at timestamp DEFAULT NOW()
);

create table if not exists habits (
   id                 serial primary key,
   habit_name         varchar(255) not null,
   start_date         timestamp not null,
   end_date           timestamp not null,
   created_by_user_id integer not null,
   created_at         timestamp DEFAULT NOW()
);

create table if not exists habits_metadata (
   id           serial primary key,
   habit_id     integer not null,
   total_joined integer default 0
);

create table if not exists habits_checkpoints (
   id              serial primary key,
   habit_id        integer not null,
   checkpoint_name varchar(255) not null,
   deadline        timestamp not null
);

create table if not exists user_joined_habits (
   id       serial primary key,
   habit_id integer not null,
   user_id  integer not null
);

create table if not exists user_joined_habits_checkpoints (
   id                 serial primary key,
   joined_habit_id    integer not null,
   checkpoint_type    varchar(255) not null,
   main_checkpoint_id integer,
   message            text not null,
   finished_worked_at timestamp DEFAULT NOW()
);

alter table habits_checkpoints
   add foreign key ( habit_id )
      references habits ( id );

alter table habits_metadata
   add foreign key ( habit_id )
      references habits ( id );

alter table habits
   add foreign key ( created_by_user_id )
      references users ( id );

alter table user_joined_habits
   add foreign key ( user_id )
      references users ( id );

alter table user_joined_habits
   add foreign key ( habit_id )
      references habits ( id );

alter table user_joined_habits_checkpoints
   add foreign key ( joined_habit_id )
      references user_joined_habits ( id );

alter table user_joined_habits_checkpoints
   add foreign key ( main_checkpoint_id )
      references habits_checkpoints ( id );