create table user(
	id int auto_increment primary key,
	username varchar(50) not null,
	password varchar(255),
	name nvarchar(50) not null,
	phone varchar(12) not null,
	avatar varchar(255) not null,
	user_role enum("ROLE_USER", "ROLE_ADMIN", "ROLE_CHEF")
);

create table category(
	id int auto_increment primary key,
	name nvarchar(50) not null
);

create table restaurant_table(
	id int auto_increment primary key,
	capacity int default 2,
	table_number varchar(10) not null
);

create table reservation(
	id int auto_increment primary key,
	user_id int,
	table_id int,
	start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
	end_time DATETIME DEFAULT CURRENT_TIMESTAMP,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	number_people int not null,
	status enum("CONFIRMED", "CANCELED", "PENDING"),
	foreign key(table_id) references restaurant_table(id),
	foreign key(user_id) references user(id)
);

create table dish(
	id int auto_increment primary key,
	user_id int,
	category_id int,
	name nvarchar(100) not null,
	description text not null,
	image varchar(255) not null,
	price int default 0,
	time_prepate int not null,
	material text not null,
	foreign key(user_id) references user(id),
	foreign key(category_id) references category(id)
);

create table rating(
	id int auto_increment primary key,
	user_id int,
	dish_id int,
    content Text null,
	point int not null,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	foreign key(user_id) references user(id),
	foreign key(dish_id) references dish(id)
);

create table orders(
	id int auto_increment primary key,
	user_id int,
	reservation_id int UNIQUE NULL,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	payment_method enum("MOMO", "ZALO_PAY", "CASH"),
	total_price int default 0,
	status_pay enum("CANCELED", "PENDING", "COMPLETED"),
	status_order enum("PENDING", "COMPLETED"),
	foreign key(user_id) references user(id),
	foreign key(reservation_id) references reservation(id)
);

create table order_detail(
	id int auto_increment primary key,
	order_id int,
	dish_id int,
	quantity int default 1,
	unit_price int not null,
	foreign key(order_id) references orders(id),
	foreign key(dish_id) references dish(id)
);